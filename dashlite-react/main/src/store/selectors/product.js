import { initialState } from '../slices/product';
import { createSelector } from '@reduxjs/toolkit';

const selectDomain = (state) => state?.product || initialState;

export const getProductListData = createSelector(
  [selectDomain],
  (productState) => productState?.data?.data || []
);
export const getProductListTotalItem = createSelector(
  [selectDomain],
  (productState) => productState?.data?.totalItem || 0
);
export const getProductDetail = createSelector(
  [selectDomain],
  (productState) => productState?.data?.data?.currentProduct || {}
);
