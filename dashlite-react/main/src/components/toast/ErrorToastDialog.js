import React from 'react';
import styled from 'styled-components/macro';
import { capitalizeFirstLetter } from '../../utils/helper';
import PropTypes from 'prop-types';

const Wrapper = styled.div`
  display: flex;
  align-items: center;
`;

const ErrorToastDialog = ({ message = '' }) => {
  return (
    <Wrapper>
      <i className='umni-solid-warning me-2' />
      {typeof message === 'string' ? (
        <span>{capitalizeFirstLetter(message)}</span>
      ) : (
        <div>{message}</div>
      )}
    </Wrapper>
  );
};

ErrorToastDialog.propTypes = {
  message: PropTypes.string || PropTypes.element,
};

export default React.memo(ErrorToastDialog);
