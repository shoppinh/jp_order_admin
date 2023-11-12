import { initialState } from '../slices/category';
import { createSelector } from '@reduxjs/toolkit';

const selectDomain = (state) => state?.category || initialState;

export const getCategoryListData = createSelector(
  [selectDomain],
  (state) => state?.data?.data || []
);
export const getCategoryListTotalItem = createSelector(
  [selectDomain],
  (state) => state?.data?.totalItem || 0
);
export const getCategoryDetail = createSelector(
  [selectDomain],
  (state) => state?.data?.data?.currentCategory || {}
);
