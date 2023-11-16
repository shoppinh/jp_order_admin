import React, { useCallback, useEffect, useRef, useState } from 'react';
import Dropzone from 'react-dropzone';
import { useForm } from 'react-hook-form';
import {
  Badge,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Modal,
  ModalBody,
  UncontrolledDropdown,
  Spinner,
} from 'reactstrap';
import SimpleBar from 'simplebar-react';
import {
  Block,
  BlockBetween,
  BlockDes,
  BlockHead,
  BlockHeadContent,
  BlockTitle,
  Button,
  Col,
  DataTableHead,
  DataTableItem,
  DataTableRow,
  Icon,
  PaginationComponent,
  PreviewAltCard,
  RSelect,
  Row,
} from '../../../../components/Component';
import ProductH from '../../../../images/product/h.png';
import Content from '../../../../layout/content/Content';
import Head from '../../../../layout/head/Head';
import {
  getProductListData,
  getProductListTotalItem,
  getProductError,
  getProductLoading,
} from '../../../../store/selectors/product';
import { useDispatch, useSelector } from 'react-redux';
import { useProductSlice } from '../../../../store/slices/product';
import { getAccessToken } from '../../../../store/selectors/session';
import { ITEM_PER_PAGE } from '../../../../utils/constants';
import debounce from 'lodash.debounce';
import { getCategoryListData } from '../../../../store/selectors/category';
import styled from 'styled-components';
// import { categoryOptions } from './ProductData';

const SpinnerWrapper = styled.div`
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translate(-50%, 50%);
`;

const ProductList = () => {
  const { actions: productActions } = useProductSlice();
  const dispatch = useDispatch();
  const accessToken = useSelector(getAccessToken);
  const [sm, updateSm] = useState(false);
  // Get data from storage
  const categoryOptions = useSelector(getCategoryListData);
  const productList = useSelector(getProductListData);
  const totalItems = useSelector(getProductListTotalItem);
  const productLoading = useSelector(getProductLoading);
  const productError = useSelector(getProductError);
  // Form state
  const [isFormSent, setIsFormSent] = useState(false);
  const [currentItems, setCurrentItems] = useState(productList);
  // Get current list, pagination
  const [searchText, setSearchText] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const indexOfLastItem = currentPage * ITEM_PER_PAGE;
  const indexOfFirstItem = indexOfLastItem - ITEM_PER_PAGE;
  // const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);

  const [formData, setFormData] = useState({
    name: '',
    productSrcURL: '',
    imageAttachments: [],
    SKU: '',
    price: 0,
    salePrice: 0,
    quantity: 0,
    category: [],
    fav: false,
    check: false,
  });
  const [editId, setEditedId] = useState();
  const [view, setView] = useState({
    edit: false,
    add: false,
    details: false,
  });

  const [files, setFiles] = useState([]);
  const [productThumbImg, setProductThumbImg] = useState(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  // function to close the form modal
  const onFormCancel = () => {
    setView({ edit: false, add: false, details: false });
    resetForm();
  };

  const resetForm = useCallback(() => {
    setFormData({
      name: '',
      productSrcURL: '',
      imageAttachments: [],
      SKU: '',
      price: 0,
      salePrice: 0,
      quantity: 0,
      category: [],
      fav: false,
      check: false,
    });
    reset({});
  }, [reset]);

  const onFormSubmit = useCallback(
    (form) => {
      const { name, price, salePrice, SKU, quantity, category } = form;
      let imageAttachmentsFormData = new FormData();
      let productImageThumbFormData = new FormData();
      if (productThumbImg) {
        productImageThumbFormData.append('file', productThumbImg);
      } else productImageThumbFormData = null;
      if (files.length > 0) {
        files.forEach((file) => {
          imageAttachmentsFormData.append('files', file);
        });
      } else imageAttachmentsFormData = null;

      let submittedData = {
        name: name,
        productImageThumb: productImageThumbFormData,
        imageAttachments: imageAttachmentsFormData,
        SKU: SKU,
        price: price,
        salePrice: salePrice,
        quantity: quantity,
        category: category?.map((item) => item._id),
        fav: false,
        check: false,
      };
      if (accessToken) {
        dispatch(
          productActions.createProduct({
            token: accessToken,
            ...submittedData,
          })
        );
        setView({ open: false });
        setFiles([]);
        setProductThumbImg(null);
        resetForm();
        setIsFormSent(true);
      }
    },
    [accessToken, dispatch, files, productActions, productThumbImg, resetForm]
  );

  const onEditSubmit = useCallback(
    (formData) => {
      let imageAttachmentsFormData = new FormData();
      let productImageThumbFormData = new FormData();
      if (productThumbImg) {
        productImageThumbFormData.append('file', productThumbImg);
      } else productImageThumbFormData = null;
      if (files.length > 0) {
        files.forEach((file) => {
          imageAttachmentsFormData.append('files', file);
        });
      } else imageAttachmentsFormData = null;
      const submittedData = {
        _id: editId,
        name: formData.name,
        productImageThumb: productImageThumbFormData,
        imageAttachments: imageAttachmentsFormData,
        SKU: formData.SKU,
        price: formData.price,
        salePrice: formData.salePrice,
        quantity: formData.quantity,
        category: formData.category?.map((item) => item._id),
        fav: false,
        check: false,
      };
      if (accessToken) {
        dispatch(
          productActions.updateProduct({ token: accessToken, productId: editId, ...submittedData })
        );
        setFiles([]);
        setProductThumbImg(null);
        resetForm();
      }

      setView({ edit: false, add: false });
    },
    [accessToken, dispatch, editId, files, productActions, productThumbImg, resetForm]
  );

  // function that loads the want to editted data
  const onEditClick = (id) => {
    const foundItem = currentItems.find((item) => item._id === id);
    if (!foundItem) return;
    setFormData({
      name: foundItem.name,
      productSrcURL: foundItem.productSrcURL,
      imageAttachments: foundItem.imageAttachments,
      SKU: foundItem.SKU,
      price: foundItem.price,
      quantity: foundItem.quantity,
      category: foundItem.category,
      fav: false,
      check: false,
    });

    setEditedId(id);
    setFiles([]);
    setProductThumbImg(null);
    setView({ add: false, edit: true });
  };

  useEffect(() => {
    reset(formData);
  }, [formData, reset]);

  // selects all the products
  const selectorCheck = useCallback(
    (e) => {
      let newData;
      newData = currentItems.map((item) => {
        return { ...item, check: e.currentTarget.checked };
      });
      setCurrentItems([...newData]);
    },
    [currentItems]
  );

  // selects one product
  const onSelectChange = useCallback(
    (e, _id) => {
      let newData = [...currentItems];
      let index = newData.findIndex((item) => item._id === _id);
      newData[index] = { ...newData[index], check: e.currentTarget.checked };
      setCurrentItems([...newData]);
    },
    [currentItems]
  );

  // onChange function for searching name

  const onFilterChange = useCallback((value) => {
    setSearchText(value);
  }, []);

  const handleChangeSearchOutlet = debounce(onFilterChange, 1000);

  // function to delete a product
  const deleteProduct = useCallback(
    (id) => {
      if (accessToken) {
        setIsFormSent(true);
        dispatch(productActions.deleteProduct({ token: accessToken, productId: id }));
      }
    },
    [accessToken, dispatch, productActions]
  );

  // function to delete the seletected item
  const selectorDeleteProduct = () => {
    if (accessToken) {
      setIsFormSent(true);
      dispatch(
        productActions.deleteProducts({
          token: accessToken,
          productIds: currentItems.filter((item) => item.check === true).map((item) => item._id),
        })
      );
    }
  };

  // toggle function to view product details
  const toggle = (type) => {
    setView({
      edit: type === 'edit',
      add: type === 'add',
      details: type === 'details',
    });
  };

  // handles ondrop function of dropzone
  const handleDropChange = (acceptedFiles) => {
    setFiles(
      acceptedFiles.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        })
      )
    );
  };

  const handleDropChangeProductThumb = (acceptedFiles) => {
    if (acceptedFiles?.[0]) {
      setProductThumbImg(
        Object.assign(acceptedFiles?.[0], {
          preview: URL.createObjectURL(acceptedFiles?.[0]),
        })
      );
    }
  };

  // Change Page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Re-Fetch product list
  useEffect(() => {
    if (accessToken && isFormSent && !productError && !productLoading) {
      dispatch(
        productActions.loadProductList({
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
    productActions,
    productError,
    productLoading,
    searchText,
  ]);

  // Fetch on first load or search text change, or page change
  useEffect(() => {
    if (accessToken) {
      dispatch(
        productActions.loadProductList({
          token: accessToken,
          skip: indexOfFirstItem,
          limit: ITEM_PER_PAGE,
          search: searchText,
        })
      );
    }
  }, [accessToken, dispatch, indexOfFirstItem, productActions, searchText]);

  // Update current items

  useEffect(() => {
    setCurrentItems(productList);
  }, [productList]);

  return (
    <React.Fragment>
      <Head title='Products'></Head>
      <Content>
        <BlockHead size='sm'>
          <BlockBetween>
            <BlockHeadContent>
              <BlockTitle>Products</BlockTitle>
            </BlockHeadContent>
            <BlockHeadContent>
              <div className='toggle-wrap nk-block-tools-toggle'>
                <a
                  href='#more'
                  className='btn btn-icon btn-trigger toggle-expand me-n1'
                  onClick={(ev) => {
                    ev.preventDefault();
                    updateSm(!sm);
                  }}
                >
                  <Icon name='more-v'></Icon>
                </a>
                <div className='toggle-expand-content' style={{ display: sm ? 'block' : 'none' }}>
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
                          placeholder='Quick search by SKU'
                          onChange={(e) => handleChangeSearchOutlet(e.target.value)}
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
                        <span>Add Product</span>
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
                    id='uid_1'
                    onChange={(e) => selectorCheck(e)}
                  />
                  <label className='custom-control-label' htmlFor='uid_1'></label>
                </div>
              </DataTableRow>
              <DataTableRow size='sm'>
                <span>Name</span>
              </DataTableRow>
              <DataTableRow>
                <span>SKU</span>
              </DataTableRow>
              <DataTableRow>
                <span>Price</span>
              </DataTableRow>
              <DataTableRow>
                <span>Stock quantity</span>
              </DataTableRow>
              <DataTableRow size='md'>
                <span>Category</span>
              </DataTableRow>
              <DataTableRow size='md'>
                <Icon name='star-round' className='tb-asterisk'></Icon>
              </DataTableRow>
              <DataTableRow className='nk-tb-col-tools'>
                <ul className='nk-tb-actions gx-1 my-n1'>
                  <li className='me-n1'>
                    <UncontrolledDropdown>
                      <DropdownToggle
                        tag='a'
                        href='#toggle'
                        onClick={(ev) => ev.preventDefault()}
                        className='dropdown-toggle btn btn-icon btn-trigger'
                      >
                        <Icon name='more-h'></Icon>
                      </DropdownToggle>
                      <DropdownMenu end>
                        <ul className='link-list-opt no-bdr'>
                          <li>
                            <DropdownItem
                              tag='a'
                              href='#remove'
                              onClick={(ev) => {
                                ev.preventDefault();
                                selectorDeleteProduct();
                              }}
                            >
                              <Icon name='trash'></Icon>
                              <span>Remove Selected</span>
                            </DropdownItem>
                          </li>
                          <li>
                            <DropdownItem
                              tag='a'
                              href='#quantity'
                              onClick={(ev) => ev.preventDefault()}
                            >
                              <Icon name='bar-c'></Icon>
                              <span>Update Quantity</span>
                            </DropdownItem>
                          </li>
                          <li>
                            <DropdownItem
                              tag='a'
                              href='#price'
                              onClick={(ev) => ev.preventDefault()}
                            >
                              <Icon name='invest'></Icon>
                              <span>Update Price</span>
                            </DropdownItem>
                          </li>
                        </ul>
                      </DropdownMenu>
                    </UncontrolledDropdown>
                  </li>
                </ul>
              </DataTableRow>
            </DataTableHead>
            {!productLoading && currentItems?.length > 0 ? (
              currentItems?.map((item) => {
                const categoryList = [];
                item?.category?.forEach((currentElement) => {
                  categoryList.push(currentElement.label);
                });

                return (
                  <DataTableItem key={item._id}>
                    <DataTableRow className='nk-tb-col-check'>
                      <div className='custom-control custom-control-sm custom-checkbox notext'>
                        <input
                          type='checkbox'
                          className='custom-control-input'
                          defaultChecked={item.check}
                          id={item._id + 'uid1'}
                          key={Math.random()}
                          onChange={(e) => onSelectChange(e, item._id)}
                        />
                        <label className='custom-control-label' htmlFor={item._id + 'uid1'}></label>
                      </div>
                    </DataTableRow>
                    <DataTableRow size='sm'>
                      <span className='tb-product'>
                        <img
                          src={
                            item.productSrcURL
                              ? `${process.env.REACT_APP_API_URL}/${item.productSrcURL}`
                              : ProductH
                          }
                          alt='product'
                          className='thumb'
                        />
                        <span className='title'>{item.name}</span>
                      </span>
                    </DataTableRow>
                    <DataTableRow>
                      <span className='tb-sub'>{item.SKU}</span>
                    </DataTableRow>
                    <DataTableRow>
                      <span className='tb-sub'>$ {item.price}</span>
                    </DataTableRow>
                    <DataTableRow>
                      <span className='tb-sub'>{item.quantity}</span>
                    </DataTableRow>
                    <DataTableRow size='md'>
                      <span className='tb-sub'>{categoryList.join(', ')}</span>
                    </DataTableRow>
                    <DataTableRow size='md'>
                      <div className='asterisk tb-asterisk'>
                        <a
                          href='#asterisk'
                          className={item.fav ? 'active' : ''}
                          onClick={(ev) => ev.preventDefault()}
                        >
                          <Icon name='star' className='asterisk-off'></Icon>
                          <Icon name='star-fill' className='asterisk-on'></Icon>
                        </a>
                      </div>
                    </DataTableRow>
                    <DataTableRow className='nk-tb-col-tools'>
                      <ul className='nk-tb-actions gx-1 my-n1'>
                        <li className='me-n1'>
                          <UncontrolledDropdown>
                            <DropdownToggle
                              tag='a'
                              href='#more'
                              onClick={(ev) => ev.preventDefault()}
                              className='dropdown-toggle btn btn-icon btn-trigger'
                            >
                              <Icon name='more-h'></Icon>
                            </DropdownToggle>
                            <DropdownMenu end>
                              <ul className='link-list-opt no-bdr'>
                                <li>
                                  <DropdownItem
                                    tag='a'
                                    href='#edit'
                                    onClick={(ev) => {
                                      ev.preventDefault();
                                      onEditClick(item._id);
                                      toggle('edit');
                                    }}
                                  >
                                    <Icon name='edit'></Icon>
                                    <span>Edit Product</span>
                                  </DropdownItem>
                                </li>
                                <li>
                                  <DropdownItem
                                    tag='a'
                                    href='#view'
                                    onClick={(ev) => {
                                      ev.preventDefault();
                                      onEditClick(item._id);
                                      toggle('details');
                                    }}
                                  >
                                    <Icon name='eye'></Icon>
                                    <span>View Product</span>
                                  </DropdownItem>
                                </li>
                                <li>
                                  <DropdownItem
                                    tag='a'
                                    href='#remove'
                                    onClick={(ev) => {
                                      ev.preventDefault();
                                      deleteProduct(item._id);
                                    }}
                                  >
                                    <Icon name='trash'></Icon>
                                    <span>Remove Product</span>
                                  </DropdownItem>
                                </li>
                              </ul>
                            </DropdownMenu>
                          </UncontrolledDropdown>
                        </li>
                      </ul>
                    </DataTableRow>
                  </DataTableItem>
                );
              })
            ) : productLoading ? (
              <SpinnerWrapper>
                <Spinner size='md' color='dark' />
              </SpinnerWrapper>
            ) : null}
          </div>

          <PreviewAltCard>
            {!productLoading && totalItems > 0 ? (
              <PaginationComponent
                itemPerPage={ITEM_PER_PAGE}
                totalItems={totalItems}
                paginate={paginate}
                currentPage={currentPage}
              />
            ) : productLoading ? null : (
              <div className='text-center'>
                <span className='text-silent'>No products found</span>
              </div>
            )}
          </PreviewAltCard>
        </Block>

        <Modal
          isOpen={view.edit}
          toggle={() => onFormCancel()}
          className='modal-dialog-centered'
          size='lg'
        >
          <ModalBody>
            <a href='#cancel' className='close'>
              {' '}
              <Icon
                name='cross-sm'
                onClick={(ev) => {
                  ev.preventDefault();
                  onFormCancel();
                }}
              ></Icon>
            </a>
            <div className='p-2'>
              <h5 className='title'>Update Product</h5>
              <div className='mt-4'>
                <form onSubmit={handleSubmit(onEditSubmit)}>
                  <Row className='g-3'>
                    <Col size='12'>
                      <div className='form-group'>
                        <label className='form-label' htmlFor='product-title'>
                          Product Title
                        </label>
                        <div className='form-control-wrap'>
                          <input
                            type='text'
                            className='form-control'
                            {...register('name', {
                              required: 'This field is required',
                            })}
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          />
                          {errors.name && <span className='invalid'>{errors.name.message}</span>}
                        </div>
                      </div>
                    </Col>
                    <Col md='6'>
                      <div className='form-group'>
                        <label className='form-label' htmlFor='regular-price'>
                          Regular Price
                        </label>
                        <div className='form-control-wrap'>
                          <input
                            type='number'
                            {...register('price', {
                              required: 'This is required',
                              valueAsNumber: true,
                            })}
                            className='form-control'
                            value={formData.price}
                            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                          />
                          {errors.price && <span className='invalid'>{errors.price.message}</span>}
                        </div>
                      </div>
                    </Col>
                    <Col md='6'>
                      <div className='form-group'>
                        <label className='form-label' htmlFor='sale-price'>
                          Sale Price
                        </label>
                        <div className='form-control-wrap'>
                          <input
                            type='number'
                            className='form-control'
                            {...register('salePrice', {
                              valueAsNumber: true,
                            })}
                            value={formData.salePrice}
                            onChange={(e) =>
                              setFormData({ ...formData, salePrice: e.target.value })
                            }
                          />
                          {errors.salePrice && (
                            <span className='invalid'>{errors.salePrice.message}</span>
                          )}
                        </div>
                      </div>
                    </Col>
                    <Col md='6'>
                      <div className='form-group'>
                        <label className='form-label' htmlFor='quantity'>
                          Quantity
                        </label>
                        <div className='form-control-wrap'>
                          <input
                            type='number'
                            className='form-control'
                            {...register('quantity', {
                              required: 'This is required',
                              valueAsNumber: true,
                            })}
                            value={formData.quantity}
                            onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                          />
                          {errors.quantity && (
                            <span className='invalid'>{errors.quantity.message}</span>
                          )}
                        </div>
                      </div>
                    </Col>
                    <Col md='6'>
                      <div className='form-group'>
                        <label className='form-label' htmlFor='SKU'>
                          SKU
                        </label>
                        <div className='form-control-wrap'>
                          <input
                            type='text'
                            className='form-control'
                            {...register('SKU', { required: 'This is required' })}
                            value={formData.SKU}
                            onChange={(e) => setFormData({ ...formData, SKU: e.target.value })}
                          />
                          {errors.SKU && <span className='invalid'>{errors.SKU.message}</span>}
                        </div>
                      </div>
                    </Col>
                    <Col size='12'>
                      <div className='form-group'>
                        <label className='form-label' htmlFor='category'>
                          Category
                        </label>
                        <div className='form-control-wrap'>
                          <RSelect
                            isMulti
                            options={categoryOptions}
                            value={formData.category}
                            onChange={(value) => setFormData({ ...formData, category: value })}
                            getOptionValue={(option) => option._id}
                            getOptionLabel={(option) => option.label}
                            //ref={register({ required: "This is required" })}
                          />
                          {errors.category && (
                            <span className='invalid'>{errors.category.message}</span>
                          )}
                        </div>
                      </div>
                    </Col>
                    <Col size='6'>
                      <div className='form-group'>
                        <label className='form-label' htmlFor='category'>
                          Product Image
                        </label>
                        <div className='form-control-wrap'>
                          <img
                            src={`${process.env.REACT_APP_API_URL}/${formData.productSrcURL}`}
                            alt=''
                          ></img>
                        </div>
                      </div>
                    </Col>

                    <Col size='6'>
                      <Dropzone
                        onDrop={(acceptedFile) => handleDropChangeProductThumb(acceptedFile)}
                      >
                        {({ getRootProps, getInputProps }) => (
                          <section>
                            <div
                              {...getRootProps()}
                              className='dropzone upload-zone small bg-lighter my-2 dz-clickable'
                            >
                              <input {...getInputProps()} />
                              {!productThumbImg ? (
                                <p>Drag 'n' drop one file here, or click to select files</p>
                              ) : (
                                <div
                                  key={productThumbImg.name}
                                  className='dz-preview dz-processing dz-image-preview dz-error dz-complete'
                                >
                                  <div className='dz-image'>
                                    <img
                                      src={productThumbImg.preview}
                                      alt='preview'
                                      width={120}
                                      height={120}
                                      style={{ objectFit: 'cover' }}
                                    />
                                  </div>
                                </div>
                              )}
                            </div>
                          </section>
                        )}
                      </Dropzone>
                    </Col>
                    <Col size='6'>
                      <div className='form-group'>
                        <label className='form-label' htmlFor='category'>
                          Product Image Attachments
                        </label>
                        {formData.imageAttachments?.map((item, index) => (
                          <div className='form-control-wrap'>
                            <img
                              src={`${process.env.REACT_APP_API_URL}/${item}`}
                              alt=''
                              key={item._id}
                            ></img>
                          </div>
                        ))}
                      </div>
                    </Col>
                    <Col size='6'>
                      <Dropzone onDrop={(acceptedFiles) => handleDropChange(acceptedFiles)}>
                        {({ getRootProps, getInputProps }) => (
                          <section>
                            <div
                              {...getRootProps()}
                              className='dropzone upload-zone small bg-lighter my-2 dz-clickable'
                            >
                              <input {...getInputProps()} />
                              {files.length === 0 && (
                                <p>Drag 'n' drop some files here, or click to select files</p>
                              )}
                              {files.map((file) => (
                                <div
                                  key={file.name}
                                  className='dz-preview dz-processing dz-image-preview dz-error dz-complete'
                                >
                                  <div className='dz-image'>
                                    <img
                                      src={file.preview}
                                      alt='preview'
                                      width={120}
                                      height={120}
                                      style={{ objectFit: 'cover' }}
                                    />
                                  </div>
                                </div>
                              ))}
                            </div>
                          </section>
                        )}
                      </Dropzone>
                    </Col>
                    <Col size='12'>
                      <Button color='primary' type='submit'>
                        <Icon className='plus'></Icon>
                        <span>Update Product</span>
                      </Button>
                    </Col>
                  </Row>
                </form>
              </div>
            </div>
          </ModalBody>
        </Modal>

        <Modal
          isOpen={view.details}
          toggle={() => onFormCancel()}
          className='modal-dialog-centered'
          size='lg'
        >
          <ModalBody>
            <a href='#cancel' className='close'>
              {' '}
              <Icon
                name='cross-sm'
                onClick={(ev) => {
                  ev.preventDefault();
                  onFormCancel();
                }}
              ></Icon>
            </a>
            <div className='nk-modal-head'>
              <h4 className='nk-modal-title title'>
                Product <small className='text-primary'>#{formData.SKU}</small>
              </h4>
              <img src={`${process.env.REACT_APP_API_URL}/${formData.productSrcURL}`} alt='' />
            </div>
            <div className='nk-tnx-details mt-sm-3'>
              <Row className='gy-3'>
                <Col lg={6}>
                  <span className='sub-text'>Product Name</span>
                  <span className='caption-text'>{formData.name}</span>
                </Col>
                <Col lg={6}>
                  <span className='sub-text'>Product Price</span>
                  <span className='caption-text'>$ {formData.price}</span>
                </Col>
                <Col lg={6}>
                  <span className='sub-text'>Product Category</span>
                  <span className='caption-text'>
                    {formData.category.map((item, index) => (
                      <Badge key={index} className='me-1' color='secondary'>
                        {item.name}
                      </Badge>
                    ))}
                  </span>
                </Col>
                <Col lg={6}>
                  <span className='sub-text'>Stock quantity</span>
                  <span className='caption-text'> {formData.quantity}</span>
                </Col>
              </Row>
            </div>
          </ModalBody>
        </Modal>

        <SimpleBar
          className={`nk-add-product toggle-slide toggle-slide-right toggle-screen-any ${
            view.add ? 'content-active' : ''
          }`}
        >
          <BlockHead>
            <BlockHeadContent>
              <BlockTitle tag='h5'>Add Product</BlockTitle>
              <BlockDes>
                <p>Add information or update product.</p>
              </BlockDes>
            </BlockHeadContent>
          </BlockHead>
          <Block>
            <form onSubmit={handleSubmit(onFormSubmit)}>
              <Row className='g-3'>
                <Col size='12'>
                  <div className='form-group'>
                    <label className='form-label' htmlFor='product-title'>
                      Product Title
                    </label>
                    <div className='form-control-wrap'>
                      <input
                        type='text'
                        className='form-control'
                        {...register('name', {
                          required: 'This field is required',
                        })}
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      />
                      {errors.name && <span className='invalid'>{errors.name.message}</span>}
                    </div>
                  </div>
                </Col>
                <Col md='6'>
                  <div className='form-group'>
                    <label className='form-label' htmlFor='regular-price'>
                      Regular Price
                    </label>
                    <div className='form-control-wrap'>
                      <input
                        type='number'
                        {...register('price', {
                          required: 'This is required',
                          valueAsNumber: true,
                        })}
                        className='form-control'
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      />
                      {errors.price && <span className='invalid'>{errors.price.message}</span>}
                    </div>
                  </div>
                </Col>
                <Col md='6'>
                  <div className='form-group'>
                    <label className='form-label' htmlFor='sale-price'>
                      Sale Price
                    </label>
                    <div className='form-control-wrap'>
                      <input
                        type='number'
                        className='form-control'
                        {...register('salePrice', {
                          valueAsNumber: true,
                        })}
                        value={formData.salePrice}
                        onChange={(e) => setFormData({ ...formData, salePrice: e.target.value })}
                      />
                      {errors.salePrice && (
                        <span className='invalid'>{errors.salePrice.message}</span>
                      )}
                    </div>
                  </div>
                </Col>
                <Col md='6'>
                  <div className='form-group'>
                    <label className='form-label' htmlFor='quantity'>
                      Quantity
                    </label>
                    <div className='form-control-wrap'>
                      <input
                        type='number'
                        className='form-control'
                        {...register('quantity', {
                          required: 'This is required',
                          valueAsNumber: true,
                        })}
                        value={formData.quantity}
                        onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                      />
                      {errors.quantity && (
                        <span className='invalid'>{errors.quantity.message}</span>
                      )}
                    </div>
                  </div>
                </Col>
                <Col md='6'>
                  <div className='form-group'>
                    <label className='form-label' htmlFor='SKU'>
                      SKU
                    </label>
                    <div className='form-control-wrap'>
                      <input
                        type='text'
                        className='form-control'
                        {...register('SKU', { required: 'This is required' })}
                        value={formData.SKU}
                        onChange={(e) => setFormData({ ...formData, SKU: e.target.value })}
                      />
                      {errors.SKU && <span className='invalid'>{errors.SKU.message}</span>}
                    </div>
                  </div>
                </Col>
                <Col size='12'>
                  <div className='form-group'>
                    <label className='form-label' htmlFor='category'>
                      Category
                    </label>
                    <div className='form-control-wrap'>
                      <RSelect
                        name='category'
                        isMulti
                        options={categoryOptions}
                        onChange={(value) => setFormData({ ...formData, category: value })}
                        value={formData.category}
                        getOptionValue={(option) => option._id}
                        getOptionLabel={(option) => option.label}
                        //ref={register({ required: "This is required" })}
                      />
                      {errors.category && (
                        <span className='invalid'>{errors.category.message}</span>
                      )}
                    </div>
                  </div>
                </Col>
                <Col size='12'>
                  <label className='form-label' htmlFor='productSrcURL'>
                    Product Image
                  </label>
                  <Dropzone onDrop={(acceptedFile) => handleDropChangeProductThumb(acceptedFile)}>
                    {({ getRootProps, getInputProps }) => (
                      <section>
                        <div
                          {...getRootProps()}
                          className='dropzone upload-zone small bg-lighter my-2 dz-clickable'
                        >
                          <input {...getInputProps()} />
                          {!productThumbImg ? (
                            <p>Drag 'n' drop one file here, or click to select files</p>
                          ) : (
                            <div
                              key={productThumbImg?.name}
                              className='dz-preview dz-processing dz-image-preview dz-error dz-complete'
                            >
                              <div className='dz-image'>
                                <img
                                  src={productThumbImg?.preview}
                                  alt='preview'
                                  width={120}
                                  height={120}
                                  style={{ objectFit: 'cover' }}
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      </section>
                    )}
                  </Dropzone>
                </Col>
                <Col size='12'>
                  <label className='form-label' htmlFor='imgAttachments'>
                    Image Attachments
                  </label>
                  <Dropzone onDrop={(acceptedFiles) => handleDropChange(acceptedFiles)}>
                    {({ getRootProps, getInputProps }) => (
                      <section>
                        <div
                          {...getRootProps()}
                          className='dropzone upload-zone small bg-lighter my-2 dz-clickable'
                        >
                          <input {...getInputProps()} />
                          {files.length === 0 && (
                            <p>Drag 'n' drop some files here, or click to select files</p>
                          )}
                          {files.map((file) => (
                            <div
                              key={file.name}
                              className='dz-preview dz-processing dz-image-preview dz-error dz-complete'
                            >
                              <div className='dz-image'>
                                <img
                                  src={file.preview}
                                  alt='preview'
                                  width={120}
                                  height={120}
                                  style={{ objectFit: 'cover' }}
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </section>
                    )}
                  </Dropzone>
                </Col>

                <Col size='12'>
                  <Button color='primary' type='submit'>
                    <Icon className='plus'></Icon>
                    <span>Add Product</span>
                  </Button>
                </Col>
              </Row>
            </form>
          </Block>
        </SimpleBar>

        {view.add && <div className='toggle-overlay' onClick={toggle}></div>}
      </Content>
    </React.Fragment>
  );
};

export default ProductList;
