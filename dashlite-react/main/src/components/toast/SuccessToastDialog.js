import React from 'react';
import styled from 'styled-components/macro';
import { capitalizeFirstLetter } from '../../utils/helper';
import PropTypes from 'prop-types';

const Wrapper = styled.div`
  display: flex;
  align-items: center;
`;

const SuccessToastDialog = ({ message = '' }) => {
  return (
    <Wrapper>
      <i className='umni-solid-success me-2' />
      <span>{capitalizeFirstLetter(message)}</span>
    </Wrapper>
  );
};

SuccessToastDialog.propTypes = {
  message: PropTypes.string,
};

export default React.memo(SuccessToastDialog);
