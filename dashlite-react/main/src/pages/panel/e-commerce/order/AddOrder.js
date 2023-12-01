import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import { useFieldArray, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Modal, ModalBody, Spinner } from 'reactstrap';
import {
  Block,
  Col,
  DataTableHead,
  DataTableItem,
  DataTableRow,
  Icon,
  RSelect,
  Row,
} from '../../../../components/Component';

import ProductH from '../../../../images/product/h.png';
import { getOrderError, getOrderLoading } from '../../../../store/selectors/order';
import { getProductLoading, getQueriedProduct } from '../../../../store/selectors/product';
import { getAppSettings } from '../../../../store/selectors/setting';
import { useProductSlice } from '../../../../store/slices/product';
import { normalizePrice } from '../../../../utils/helper';
import { OrderStatus } from '../../../../utils/constants';
import { toast } from 'react-toastify';
import ErrorToastDialog from '../../../../components/toast/ErrorToastDialog';

const AddOrder = (props) => {
  const { onFormCancel, onFormSubmit, isOpen, setView } = props;
  const [productSrcURL, setProductSrcURL] = useState('');
  const dispatch = useDispatch();
  const { actions: productActions } = useProductSlice();
  const {
    reset,
    register,
    handleSubmit,
    setValue,
    getValues,
    control,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      purchasedItems: [],
      date: new Date(),
      status: OrderStatus.CONFIRMED,
      customer: '',
      totalPrice: 0,
      orderNote: '',
      totalWeight: 0,
      guestAddress: '',
    },
  });
  const queriedProduct = useSelector(getQueriedProduct);
  const productLoading = useSelector(getProductLoading);
  const orderLoading = useSelector(getOrderLoading);
  const orderError = useSelector(getOrderError);
  const [isProductFormSent, setIsProductFormSent] = useState(false);
  const [isAddFormSent, setIsAddFormSent] = useState(false);
  console.log('🚀 ~ file: AddOrder.js:59 ~ AddOrder ~ isAddFormSent:', isAddFormSent);
  const appSetting = useSelector(getAppSettings);
  const formValue = watch();

  const { fields, append, prepend, remove, swap, move, insert } = useFieldArray({
    control,
    name: 'purchasedItems',
  });
  const handleAppendProduct = useCallback(async () => {
    dispatch(
      productActions.queryProduct({
        productSrcURL,
      })
    );
    setIsProductFormSent(true);
  }, [dispatch, productActions, productSrcURL]);
  const purchasedItemss = watch('purchasedItems');
  let totalPrice = 0;
  if (purchasedItemss?.length > 0) {
    totalPrice = purchasedItemss?.reduce((acc, item) => {
      return acc + item?.price * item.quantity;
    }, 0);
  }

  useEffect(() => {
    if (!productLoading && isProductFormSent) {
      if (queriedProduct) {
        if (fields.find((item) => item?._id === queriedProduct?._id)) {
          setIsProductFormSent(false);
          return;
        }
        append({
          ...queriedProduct,
          tax: appSetting.taxRate,
        });
      } else
        append({
          _id: Math.random().toString(36).substring(2, 9),
          name: '',
          price: 0,
          quantity: 0,
          tax: appSetting.taxRate,
        });
      setIsProductFormSent(false);
    }
  }, [appSetting.taxRate, append, fields, isProductFormSent, productLoading, queriedProduct]);

  useEffect(() => {
    if (!isOpen) {
      reset();
    }
  }, [isOpen, reset]);

  const onAddOrder = useCallback(
    (form) => {
      setIsAddFormSent(true);
      onFormSubmit(form);
    },
    [onFormSubmit]
  );

  useEffect(() => {
    if (isAddFormSent && !orderLoading && !orderError) {
      setView({ add: false, details: false });
      setIsAddFormSent(false);
    } else if (isAddFormSent && !orderLoading && orderError) {
      toast.error(<ErrorToastDialog message={orderError?.message} />);
      setIsAddFormSent(false);
    }
  }, [isAddFormSent, orderLoading, orderError, setView]);

  useEffect(() => {}, []);
  return (
    <Modal
      isOpen={isOpen}
      toggle={() => onFormCancel()}
      className='modal-dialog-centered'
      fullscreen
    >
      <ModalBody>
        <a href='#cancel' className='close'>
          <Icon
            name='cross-sm'
            onClick={(ev) => {
              ev.preventDefault();
              onFormCancel();
            }}
          ></Icon>
        </a>
        <div className='p-2'>
          <h5 className='title'>Add Order</h5>
          <div className='mt-4'>
            <form onSubmit={handleSubmit(onAddOrder)}>
              <Row className='g-3'>
                <Col md='12'>
                  <div className='form-group'>
                    <label className='form-label' htmlFor='customer'>
                      Customer Name
                    </label>
                    <div className='form-control-wrap'>
                      <input
                        type='text'
                        className='form-control'
                        {...register('customer', {
                          required: 'This field is required',
                        })}
                        placeholder='Enter customer name'
                      />
                      {errors.customer && (
                        <span className='invalid'>{errors.customer.message}</span>
                      )}
                    </div>
                  </div>
                </Col>

                <Col md='12'>
                  <div className='form-group'>
                    <label className='form-label' htmlFor='purchasedItems'>
                      Product Source URL
                    </label>
                    <div className='form-control-wrap'>
                      <div className='input-group'>
                        <input
                          type='text'
                          className='form-control'
                          onChange={(e) => setProductSrcURL(e.target.value)}
                          placeholder='Enter product source URL'
                        />

                        <div className='input-group-append'>
                          <Button
                            outline
                            color='primary'
                            className='btn-dim'
                            onClick={handleAppendProduct}
                            disabled={!productSrcURL || productLoading}
                            lo
                          >
                            {productLoading ? (
                              <>
                                <Spinner size='sm' />
                                <span>Fetching product</span>
                              </>
                            ) : (
                              <span>Get product</span>
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </Col>
                <Col md='12'>
                  <div className='form-group'>
                    <label className='form-label' htmlFor='purchasedItems'>
                      Order address
                    </label>
                    <div className='form-control-wrap'>
                      <input
                        type='text'
                        className='form-control'
                        {...register('guestAddress', {
                          required: 'This field is required',
                        })}
                        placeholder='Enter order address'
                      />
                      {errors.guestAddress && (
                        <span className='invalid'>{errors.guestAddress.message}</span>
                      )}
                    </div>
                  </div>
                </Col>
                <Col md='6'>
                  <div className='form-group'>
                    <label className='form-label' htmlFor='date'>
                      Date of order
                    </label>
                    <div className='form-control-wrap'>
                      <DatePicker
                        selected={formValue.date}
                        className='form-control'
                        onChange={(date) => setValue('date', date)}
                      />
                      {errors.date && <span className='invalid'>{errors.date.message}</span>}
                    </div>
                  </div>
                </Col>
                <Col md='6'>
                  <div className='form-group'>
                    <label className='form-label' htmlFor='status'>
                      Status
                    </label>
                    <div className='form-control-wrap'>
                      <RSelect
                        name='status'
                        options={Object.values(OrderStatus).map((item) => {
                          return {
                            value: item,
                            label: item,
                          };
                        })}
                        onChange={(e) => setValue('status', e.value)}
                        value={{ value: formValue.status, label: formValue.status }}
                      />
                    </div>
                  </div>
                </Col>

                <Col md='12'>
                  <label className='form-label' htmlFor='status'>
                    Product List
                  </label>
                  <Block>
                    <div className='nk-tb-list is-separate is-medium mb-3'>
                      <DataTableHead className='nk-tb-item'>
                        <DataTableRow>
                          <span className='sub-text'>Name</span>
                        </DataTableRow>
                        <DataTableRow>
                          <span className='sub-text'>Image</span>
                        </DataTableRow>
                        <DataTableRow size='md'>
                          <span className='sub-text'>Price</span>
                        </DataTableRow>
                        <DataTableRow>
                          <span className='sub-text'>Quantity</span>
                        </DataTableRow>
                        <DataTableRow>
                          <span className='sub-text'>Tax</span>
                        </DataTableRow>

                        <DataTableRow size='sm'>
                          <span className='sub-text'>Action</span>
                        </DataTableRow>
                        {/* <DataTableRow size='md'>
                          <span className='sub-text'>PurchasedItems</span>
                        </DataTableRow>
                        <DataTableRow>
                          <span className='sub-text'>Total</span>
                        </DataTableRow> */}
                      </DataTableHead>

                      {fields?.map((item, index) => {
                        return (
                          <DataTableItem key={item._id}>
                            <DataTableRow className='nk-tb-col-check'>
                              <input
                                type='text'
                                className='form-control'
                                placeholder='Name'
                                {...register(`purchasedItems.${index}.name`)}
                              />
                            </DataTableRow>
                            <DataTableRow className='nk-tb-col-check'>
                              <span className='tb-product'>
                                <img
                                  src={
                                    item.productImageURL
                                      ? `${process.env.REACT_APP_API_URL}/${item.productImageURL}`
                                      : ProductH
                                  }
                                  alt='product'
                                  className='thumb'
                                />
                              </span>
                            </DataTableRow>
                            <DataTableRow className='nk-tb-col-check'>
                              <input
                                type='number'
                                className='form-control'
                                placeholder='Price'
                                min={0}
                                {...register(`purchasedItems.${index}.price`, {
                                  valueAsNumber: true,
                                })}
                              />
                            </DataTableRow>
                            <DataTableRow className='nk-tb-col-check'>
                              <input
                                type='number'
                                className='form-control'
                                placeholder='Quantity'
                                {...register(`purchasedItems.${index}.quantity`, {
                                  valueAsNumber: true,
                                })}
                                min={0}
                              />
                            </DataTableRow>
                            <DataTableRow className='nk-tb-col-check'>
                              <input
                                type='number'
                                className='form-control'
                                placeholder='Tax'
                                step={0.1}
                                min={0}
                                {...register(`purchasedItems.${index}.tax`, {
                                  valueAsNumber: true,
                                })}
                              />
                            </DataTableRow>
                            <DataTableRow className='nk-tb-col-check'>
                              <Button color='danger' onClick={() => remove(index)}>
                                Remove
                              </Button>
                            </DataTableRow>
                          </DataTableItem>
                        );
                      })}
                    </div>
                  </Block>
                </Col>
                <Col md='6'>
                  <div className='form-group'>
                    <label className='form-label' htmlFor='totalWeight'>
                      Total weight
                    </label>
                    <div className='form-control-wrap'>
                      <input
                        type='text'
                        className='form-control'
                        {...register('totalWeight', {
                          valueAsNumber: true,
                        })}
                        placeholder='Enter order total weight in KG'
                      />
                      {errors.totalWeight && (
                        <span className='invalid'>{errors.totalWeight.message}</span>
                      )}
                    </div>
                  </div>
                </Col>

                <Col md='6'>
                  <div className='form-group'>
                    <label className='form-label' htmlFor='orderNote'>
                      Order note
                    </label>
                    <div className='form-control-wrap'>
                      <textarea
                        type='text'
                        className='form-control'
                        {...register('orderNote')}
                        placeholder='Enter order note'
                      />
                      {errors.orderNote && (
                        <span className='invalid'>{errors.orderNote.message}</span>
                      )}
                    </div>
                  </div>
                </Col>
                <Col size='12'>
                  <label className='form-label' htmlFor='status'>
                    Total price before tax
                  </label>
                  <div>{normalizePrice(totalPrice)}</div>
                </Col>
                <Col size='12'>
                  <label className='form-label' htmlFor='status'>
                    Total Price with tax
                  </label>
                  <div>{normalizePrice(totalPrice * (1 + appSetting.taxRate), 2)}</div>
                </Col>

                <Col size='12'>
                  <Button color='primary' type='submit'>
                    <Icon className='plus'></Icon>
                    <span>Add Order</span>
                  </Button>
                </Col>
              </Row>
            </form>
          </div>
        </div>
      </ModalBody>
    </Modal>
  );
};

AddOrder.propTypes = {
  isOpen: PropTypes.bool,
  onFormCancel: PropTypes.func,
  onFormSubmit: PropTypes.func,
  setView: PropTypes.func,
};
export default AddOrder;
