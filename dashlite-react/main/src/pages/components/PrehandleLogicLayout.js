import React, { useEffect } from 'react';
import { useSettingSlice } from '../../store/slices/setting';
import { useDispatch } from 'react-redux';

const PrehandleLogicLayout = ({ children }) => {
  useEffect(() => {}, []);
  return <>{children}</>;
};

export default PrehandleLogicLayout;
