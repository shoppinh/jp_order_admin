import { initialState } from '../slices/order';
import { createSelector } from '@reduxjs/toolkit';

const selectDomain = (state) => state?.order || initialState;

export const getOrderListData = createSelector(
  [selectDomain],
  (orderState) => orderState?.data?.data || []
);
export const getOrderListTotalItem = createSelector(
  [selectDomain],
  (orderState) => orderState?.data?.totalItem || 0
);
export const getOrderDetail = createSelector(
  [selectDomain],
  (orderState) => orderState?.data?.currentOrder
);
export const getOrderLoading = createSelector(
  [selectDomain],
  (orderState) => orderState?.loading || false
);
export const getOrderError = createSelector(
  [selectDomain],
  (orderState) => orderState?.error || null
);
