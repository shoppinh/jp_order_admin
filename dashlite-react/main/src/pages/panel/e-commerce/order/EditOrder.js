import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Modal, ModalBody, Badge } from 'reactstrap';
import { Col, Icon, Row } from '../../../../components/Component';
const EditOrder = (props) => {
  const { onFormCancel, onFormSubmit, isOpen, value, setView } = props;
  const {
    reset,
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
  } = useForm({
    defaultValues: {
      id: null,
      orderId: '',
      date: new Date(),
      status: 'Delivered',
      customer: '',
      purchased: '',
      total: '',
      check: false,
    },
  });

  const formValue = getValues();

  useEffect(() => {
    reset(value);
  }, [reset, value]);
  return (
    <Modal
      isOpen={isOpen}
      toggle={() => onFormCancel()}
      className='modal-dialog-centered'
      size='lg'
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
        <div className='nk-tnx-details mt-sm-3'>
          <div className='nk-modal-head mb-3'>
            <h5 className='title'>Order Details</h5>
          </div>
          <Row className='gy-3'>
            <Col lg={6}>
              <span className='sub-text'>Order Id</span>
              <span className='caption-text'>{formValue._id}</span>
            </Col>
            <Col lg={6}>
              <span className='sub-text'>Status</span>
              <span
                className={`dot bg-${
                  formValue.status === 'Delivered' ? 'success' : 'warning'
                } d-sm-none`}
              ></span>
              <Badge
                className='badge-sm badge-dot has-bg d-none d-sm-inline-flex'
                color={formValue.status === 'Delivered' ? 'success' : 'warning'}
              >
                {formValue.status}
              </Badge>
            </Col>
            <Col lg={6}>
              <span className='sub-text'>Customer</span>
              <span className='caption-text'>{formValue.customer}</span>
            </Col>
            <Col lg={6}>
              <span className='sub-text'>Purchased Product</span>
              <span className='caption-text'>{formValue.purchased}</span>
            </Col>
            <Col lg={6}>
              <span className='sub-text'>Total Price</span>
              <span className='caption-text'>{formValue.total}</span>
            </Col>
          </Row>
        </div>
      </ModalBody>
    </Modal>
  );
};
EditOrder.propTypes = {
  isOpen: PropTypes.bool,
  onFormCancel: PropTypes.func,
  onFormSubmit: PropTypes.func,
  value: PropTypes.object,
  setView: PropTypes.func,
};
export default EditOrder;
