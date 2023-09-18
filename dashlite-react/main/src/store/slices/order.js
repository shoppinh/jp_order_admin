import { loadState } from '../localStorage';
import { useInjectReducer, useInjectSaga } from '../../utils/@reduxjs/redux-injector';
import { createSlice } from '../../utils/@reduxjs/toolkit';
import { orderSaga } from '../sagas/orderSaga';

const orderCache = loadState()?.order;

export const initialState = {
  data: {
    ...orderCache?.data,
  },
  error: null,
  loading: false,
};

const slice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    Error(state, action) {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const { name, actions: orderActions, reducer } = slice;

export const useOrderSlice = () => {
  useInjectReducer({ key: slice.name, reducer: slice.reducer });
  useInjectSaga({ key: slice.name, saga: orderSaga });
  return {
    actions: orderActions,
  };
};
