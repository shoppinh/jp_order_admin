import React from 'react';
import { ToastContainer } from 'react-toastify';
import PropTypes from 'prop-types';
import { TOAST_DEFAULT_TIME } from '../../utils/constants';
const JToast = (props) => {
  const { newestOnTop, limit } = props;
  return (
    <ToastContainer
      enableMultiContainer
      position='top-center'
      icon={false}
      autoClose={TOAST_DEFAULT_TIME}
      hideProgressBar
      closeOnClick
      rtl={false}
      newestOnTop={newestOnTop}
      pauseOnFocusLoss
      closeButton={false}
      limit={limit}
    />
  );
};

JToast.defaultProps = {
  newestOnTop: true,
  limit: 5,
};
JToast.propTypes = {
  newestOnTop: PropTypes.bool,
  limit: PropTypes.number,
};
export default JToast;
