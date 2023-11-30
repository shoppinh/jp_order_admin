import React, { useEffect, useState } from 'react';
import {
  Badge,
  Button,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  UncontrolledDropdown,
} from 'reactstrap';
import {
  Block,
  BlockBetween,
  BlockHead,
  BlockHeadContent,
  BlockTitle,
  DataTableHead,
  DataTableItem,
  DataTableRow,
  Icon,
  PaginationComponent,
  PreviewAltCard,
  TooltipComponent,
} from '../../../../components/Component';
import Content from '../../../../layout/content/Content';
import Head from '../../../../layout/head/Head';
import { getDateStructured } from '../../../../utils/helper';
import AddOrder from './AddOrder';
import EditOrder from './EditOrder';
// import { orderData } from './OrderData';
import { useOrderSlice } from '../../../../store/slices/order';
import { useDispatch, useSelector } from 'react-redux';
import { OrderStatus } from '../../../../utils/constants';
import {
  getOrderError,
  getOrderListData,
  getOrderLoading,
} from '../../../../store/selectors/order';
import { getAccessToken } from '../../../../store/selectors/session';
import { ITEM_PER_PAGE } from '../../../../utils/constants';

const OrderDefault = () => {
  const dispatch = useDispatch();
  const { actions: orderActions } = useOrderSlice();
  const orderData = useSelector(getOrderListData);
  const accessToken = useSelector(getAccessToken);
  const orderLoading = useSelector(getOrderLoading);
  const orderError = useSelector(getOrderError);

  const [data, setData] = useState(orderData);
  const [smOption, setSmOption] = useState(false);
  const [formData, setFormData] = useState({
    _id: '',
    date: new Date(),
    status: OrderStatus.CONFIRMED,
    customer: '',
    purchasedItems: [],
    totalPrice: 0,
    totalWeight: 0,
    check: false,
    orderNote: '',
  });
  const [view, setView] = useState({
    add: false,
    details: false,
  });
  const [searchText, setSearchText] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isFormSent, setIsFormSent] = useState(false);

  // Changing state value when searching name
  useEffect(() => {
    if (searchText !== '') {
      const filteredObject = orderData.filter((item) => {
        return item.orderId.includes(searchText);
      });
      setData([...filteredObject]);
    } else {
      setData([...orderData]);
    }
  }, [searchText, orderData]);

  // toggle function to view order details
  const toggle = (type) => {
    setView({
      add: type === 'add',
      details: type === 'details',
    });
  };

  // selects all the order
  const selectorCheck = (e) => {
    let newData;
    newData = data.map((item) => {
      item.check = e.currentTarget.checked;
      return item;
    });
    setData([...newData]);
  };

  // selects one order
  const onSelectChange = (e, id) => {
    let newData = data;
    let index = newData.findIndex((item) => item._id === id);
    newData[index].check = e.currentTarget.checked;
    setData([...newData]);
  };

  // resets forms
  const resetForm = () => {
    setFormData((prev) => ({
      ...prev,
      date: new Date(),
      status: OrderStatus.CONFIRMED,
      customer: '',
      purchasedItems: [],
      totalPrice: 0,
      check: false,
    }));
  };

  const onFormSubmit = (form) => {
    const { customer, purchasedItems, totalWeight } = form;
    const mappedPurchasedItems = purchasedItems.map((item) => {
      return {
        ...item,
        preTaxTotal: item.price,
        taxTotal: item.price * item.quantity * item.tax,
      };
    });
    const totalPrice = mappedPurchasedItems.reduce((acc, item) => {
      return acc + item.taxTotal;
    }, 0);
    let submittedData = {
      date: getDateStructured(formData.date),
      status: formData.status,
      customer: customer,
      items: mappedPurchasedItems,
      totalPrice,
      totalWeight,
    };
    console.log('🚀 ~ file: OrderDefault.js:141 ~ onFormSubmit ~ submittedData:', submittedData);
    // dispatch(orderActions.createOrder(submittedData));
  };

  const onEditSubmit = (form) => {
    const { customer, purchasedItems } = form;
    const mappedPurchasedItems = purchasedItems.map((item) => {
      return {
        ...item,
        preTaxTotal: item.price,
        taxTotal: item.price * item.quantity * item.tax,
      };
    });
    const totalPrice = mappedPurchasedItems.reduce((acc, item) => {
      return acc + item.taxTotal;
    }, 0);
    let submittedData = {
      date: getDateStructured(formData.date),
      status: formData.status,
      customer: customer,
      purchasedItems: mappedPurchasedItems,
      total: totalPrice,
      check: false,
    };
    dispatch(orderActions.updateOrder(submittedData));
    setView({ add: false, details: false });
    resetForm();
  };

  // function to load detail data
  const loadDetail = (id) => {
    let index = data.findIndex((item) => item._id === id);
    setFormData({
      _id: data[index]._id,
      customer: data[index].user.fullName,
      date: data[index].createdAt,
      purchasedItems: data[index].items,
      totalPrice: data[index].totalPrice,
      status: data[index].status,
      totalWeight: data[index].totalWeight,
    });
  };

  // OnChange function to get the input data
  const onInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // onChange function for searching name
  const onFilterChange = (e) => {
    setSearchText(e.target.value);
  };

  // function to close the form modal
  const onFormCancel = () => {
    setView({ add: false, details: false });
    resetForm();
  };

  // function to change to approve property for an item
  const markAsDelivered = (id) => {
    let newData = data;
    let index = newData.findIndex((item) => item._id === id);
    newData[index].status = OrderStatus.DELIVERED;
    setData([...newData]);
  };

  // function to delete a Order
  const deleteOrder = (id) => {
    let defaultData = data;
    defaultData = defaultData.filter((item) => item._id !== id);
    setData([...defaultData]);
  };

  // function to delete the seletected item
  const selectorDeleteOrder = () => {
    let newData;
    newData = data.filter((item) => item.check !== true);
    setData([...newData]);
  };

  // function to change the complete property of an item
  const selectorMarkAsDelivered = () => {
    let newData;
    newData = data.map((item) => {
      if (item.check === true) item.status = OrderStatus.DELIVERED;
      return item;
    });
    setData([...newData]);
  };

  // Get current list, pagination
  const indexOfLastItem = currentPage * ITEM_PER_PAGE;
  const indexOfFirstItem = indexOfLastItem - ITEM_PER_PAGE;
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);

  // Change Page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Re-Fetch product list
  useEffect(() => {
    if (accessToken && isFormSent && !orderError && !orderLoading) {
      dispatch(
        orderActions.loadOrderList({
          token: accessToken,
          skip: indexOfFirstItem,
          limit: ITEM_PER_PAGE,
          search: searchText,
        })
      );
      setIsFormSent(false);
    }
  }, [
    accessToken,
    dispatch,
    indexOfFirstItem,
    isFormSent,
    orderActions,
    orderError,
    orderLoading,
    searchText,
  ]);

  // Fetch on first load or search text change, or page change
  useEffect(() => {
    if (accessToken) {
      dispatch(
        orderActions.loadOrderList({
          token: accessToken,
          skip: indexOfFirstItem,
          limit: ITEM_PER_PAGE,
          search: searchText,
        })
      );
    }
  }, [accessToken, dispatch, indexOfFirstItem, orderActions, searchText]);

  // Update current items

  useEffect(() => {
    setData(orderData);
  }, [orderData]);

  return (
    <React.Fragment>
      <Head title='Order Default'></Head>
      <Content>
        <BlockHead size='sm'>
          <BlockBetween>
            <BlockHeadContent>
              <BlockTitle>Orders</BlockTitle>
            </BlockHeadContent>
            <BlockHeadContent>
              <div className='toggle-wrap nk-block-tools-toggle'>
                <a
                  href='#more'
                  className='btn btn-icon btn-trigger toggle-expand me-n1'
                  onClick={(ev) => {
                    ev.preventDefault();
                    setSmOption(!smOption);
                  }}
                >
                  <Icon name='more-v'></Icon>
                </a>
                <div
                  className='toggle-expand-content'
                  style={{ display: smOption ? 'block' : 'none' }}
                >
                  <ul className='nk-block-tools g-3'>
                    <li>
                      <div className='form-control-wrap'>
                        <div className='form-icon form-icon-right'>
                          <Icon name='search'></Icon>
                        </div>
                        <input
                          type='text'
                          className='form-control'
                          id='default-04'
                          placeholder='Search by orderId'
                          onChange={(e) => onFilterChange(e)}
                        />
                      </div>
                    </li>
                    <li>
                      <UncontrolledDropdown>
                        <DropdownToggle
                          color='transparent'
                          className='dropdown-toggle dropdown-indicator btn btn-outline-light btn-white'
                        >
                          Status
                        </DropdownToggle>
                        <DropdownMenu end>
                          <ul className='link-list-opt no-bdr'>
                            <li>
                              <DropdownItem
                                tag='a'
                                href='#dropdownitem'
                                onClick={(ev) => ev.preventDefault()}
                              >
                                <span>New Items</span>
                              </DropdownItem>
                            </li>
                            <li>
                              <DropdownItem
                                tag='a'
                                href='#dropdownitem'
                                onClick={(ev) => ev.preventDefault()}
                              >
                                <span>Featured</span>
                              </DropdownItem>
                            </li>
                            <li>
                              <DropdownItem
                                tag='a'
                                href='#dropdownitem'
                                onClick={(ev) => ev.preventDefault()}
                              >
                                <span>Out of Stock</span>
                              </DropdownItem>
                            </li>
                          </ul>
                        </DropdownMenu>
                      </UncontrolledDropdown>
                    </li>
                    <li className='nk-block-tools-opt'>
                      <Button
                        className='toggle btn-icon d-md-none'
                        color='primary'
                        onClick={() => {
                          toggle('add');
                        }}
                      >
                        <Icon name='plus'></Icon>
                      </Button>
                      <Button
                        className='toggle d-none d-md-inline-flex'
                        color='primary'
                        onClick={() => {
                          toggle('add');
                        }}
                      >
                        <Icon name='plus'></Icon>
                        <span>Add Order</span>
                      </Button>
                    </li>
                  </ul>
                </div>
              </div>
            </BlockHeadContent>
          </BlockBetween>
        </BlockHead>

        <Block>
          <div className='nk-tb-list is-separate is-medium mb-3'>
            <DataTableHead className='nk-tb-item'>
              <DataTableRow className='nk-tb-col-check'>
                <div className='custom-control custom-control-sm custom-checkbox notext'>
                  <input
                    type='checkbox'
                    className='custom-control-input'
                    id='pid-all'
                    onChange={(e) => selectorCheck(e)}
                  />
                  <label className='custom-control-label' htmlFor='pid-all'></label>
                </div>
              </DataTableRow>
              <DataTableRow>
                <span className='sub-text'>Order</span>
              </DataTableRow>
              <DataTableRow size='md'>
                <span className='sub-text'>Date</span>
              </DataTableRow>
              <DataTableRow>
                <span className='sub-text'>Status</span>
              </DataTableRow>
              <DataTableRow size='sm'>
                <span className='sub-text'>Customer</span>
              </DataTableRow>
              <DataTableRow size='md'>
                <span className='sub-text'>PurchasedItems</span>
              </DataTableRow>
              <DataTableRow>
                <span className='sub-text'>Total</span>
              </DataTableRow>
              <DataTableRow>
                <span className='sub-text'>Weight</span>
              </DataTableRow>

              <DataTableRow className='nk-tb-col-tools'>
                <ul className='nk-tb-actions gx-1 my-n1'>
                  <li>
                    <UncontrolledDropdown>
                      <DropdownToggle
                        tag='a'
                        className='btn btn-trigger dropdown-toggle btn-icon me-n1'
                      >
                        <Icon name='more-h'></Icon>
                      </DropdownToggle>
                      <DropdownMenu end>
                        <ul className='link-list-opt no-bdr'>
                          <li>
                            <DropdownItem
                              tag='a'
                              href='#markasdone'
                              onClick={(ev) => {
                                ev.preventDefault();
                                selectorMarkAsDelivered();
                              }}
                            >
                              <Icon name='truck'></Icon>
                              <span>Mark As Delivered</span>
                            </DropdownItem>
                          </li>
                          <li>
                            <DropdownItem
                              tag='a'
                              href='#remove'
                              onClick={(ev) => {
                                ev.preventDefault();
                                selectorDeleteOrder();
                              }}
                            >
                              <Icon name='trash'></Icon>
                              <span>Remove Orders</span>
                            </DropdownItem>
                          </li>
                        </ul>
                      </DropdownMenu>
                    </UncontrolledDropdown>
                  </li>
                </ul>
              </DataTableRow>
            </DataTableHead>

            {currentItems.length > 0
              ? currentItems.map((item) => (
                  <DataTableItem key={item._id}>
                    <DataTableRow className='nk-tb-col-check'>
                      <div className='custom-control custom-control-sm custom-checkbox notext'>
                        <input
                          type='checkbox'
                          className='custom-control-input'
                          defaultChecked={item.check}
                          id={item._id + 'oId-all'}
                          key={Math.random()}
                          onChange={(e) => onSelectChange(e, item._id)}
                        />
                        <label
                          className='custom-control-label'
                          htmlFor={item._id + 'oId-all'}
                        ></label>
                      </div>
                    </DataTableRow>
                    <DataTableRow>
                      <a href='#id' onClick={(ev) => ev.preventDefault()}>
                        {item._id}
                      </a>
                    </DataTableRow>
                    <DataTableRow size='md'>
                      <span>{item.createdAt}</span>
                    </DataTableRow>
                    <DataTableRow>
                      <span
                        className={`dot bg-${
                          item.status === OrderStatus.DELIVERED ? 'success' : 'warning'
                        } d-sm-none`}
                      ></span>
                      <Badge
                        className='badge-sm badge-dot has-bg d-none d-sm-inline-flex'
                        color={item.status === OrderStatus.DELIVERED ? 'success' : 'warning'}
                      >
                        {item.status}
                      </Badge>
                    </DataTableRow>
                    <DataTableRow size='sm'>
                      <span className='tb-sub'>{item.user.fullName}</span>
                    </DataTableRow>
                    <DataTableRow size='md'>
                      <span className='tb-sub text-primary'>{item.items?.length}</span>
                    </DataTableRow>
                    <DataTableRow>
                      <span className='tb-lead'>$ {item.totalPrice}</span>
                    </DataTableRow>
                    <DataTableRow>
                      <span className='tb-lead'>KG {item.totalWeight}</span>
                    </DataTableRow>
                    <DataTableRow className='nk-tb-col-tools'>
                      <ul className='nk-tb-actions gx-1'>
                        {item.status !== OrderStatus.DELIVERED && (
                          <li
                            className='nk-tb-action-hidden'
                            onClick={() => markAsDelivered(item._id)}
                          >
                            <TooltipComponent
                              tag='a'
                              containerClassName='btn btn-trigger btn-icon'
                              id={'delivery' + item._id}
                              icon='truck'
                              direction='top'
                              text='Mark as Delivered'
                            />
                          </li>
                        )}
                        <li
                          className='nk-tb-action-hidden'
                          onClick={() => {
                            loadDetail(item._id);
                            toggle('details');
                          }}
                        >
                          <TooltipComponent
                            tag='a'
                            containerClassName='btn btn-trigger btn-icon'
                            id={'view' + item._id}
                            icon='eye'
                            direction='top'
                            text='View Details'
                          />
                        </li>
                        <li>
                          <UncontrolledDropdown>
                            <DropdownToggle
                              tag='a'
                              className='btn btn-icon dropdown-toggle btn-trigger'
                            >
                              <Icon name='more-h'></Icon>
                            </DropdownToggle>
                            <DropdownMenu end>
                              <ul className='link-list-opt no-bdr'>
                                <li>
                                  <DropdownItem
                                    tag='a'
                                    href='#dropdown'
                                    onClick={(ev) => {
                                      ev.preventDefault();
                                      loadDetail(item._id);
                                      toggle('details');
                                    }}
                                  >
                                    <Icon name='eye'></Icon>
                                    <span>Order Details</span>
                                  </DropdownItem>
                                </li>
                                {item.status !== OrderStatus.DELIVERED && (
                                  <li>
                                    <DropdownItem
                                      tag='a'
                                      href='#dropdown'
                                      onClick={(ev) => {
                                        ev.preventDefault();
                                        markAsDelivered(item._id);
                                      }}
                                    >
                                      <Icon name='truck'></Icon>
                                      <span>Mark as Delivered</span>
                                    </DropdownItem>
                                  </li>
                                )}
                                <li>
                                  <DropdownItem
                                    tag='a'
                                    href='#dropdown'
                                    onClick={(ev) => {
                                      ev.preventDefault();
                                      deleteOrder(item._id);
                                    }}
                                  >
                                    <Icon name='trash'></Icon>
                                    <span>Remove Order</span>
                                  </DropdownItem>
                                </li>
                              </ul>
                            </DropdownMenu>
                          </UncontrolledDropdown>
                        </li>
                      </ul>
                    </DataTableRow>
                  </DataTableItem>
                ))
              : null}
          </div>
          <PreviewAltCard>
            {data.length > 0 ? (
              <PaginationComponent
                ITEM_PER_PAGE={ITEM_PER_PAGE}
                totalItems={data.length}
                paginate={paginate}
                currentPage={currentPage}
              />
            ) : (
              <div className='text-center'>
                <span className='text-silent'>No orders found</span>
              </div>
            )}
          </PreviewAltCard>
        </Block>

        <AddOrder
          isOpen={view.add}
          onFormCancel={onFormCancel}
          onFormSubmit={onFormSubmit}
          setView={setView}
        />

        <EditOrder
          isOpen={view.details}
          value={formData}
          onFormCancel={onFormCancel}
          onFormSubmit={onEditSubmit}
        />
      </Content>
    </React.Fragment>
  );
};

export default OrderDefault;
