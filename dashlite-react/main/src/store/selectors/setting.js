import { initialState } from '../slices/setting';
import { createSelector } from '@reduxjs/toolkit';

const selectDomain = (state) => state?.setting || initialState;
export const getAppSettings = createSelector([selectDomain], (state) => state?.data);
