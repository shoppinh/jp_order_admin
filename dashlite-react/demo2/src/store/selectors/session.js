import { initialState } from '../slices/session';
import { createSelector } from '@reduxjs/toolkit';

const selectDomain = (state) => state?.session || initialState;
export const getAccessToken = createSelector(
  [selectDomain],
  (state) => state?.data?.auth?.accessToken
);

export const getUserInfo = createSelector([selectDomain], (state) => state?.data?.auth?.user);

export const getAuthLoading = createSelector([selectDomain], (state) => state.loading);
export const getAuthError = createSelector([selectDomain], (state) => state.error);
