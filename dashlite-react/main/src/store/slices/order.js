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
    loadOrderList(state, _action) {
      state.loading = true;
      state.error = null;
    },
    loadedOrderList(state, action) {
      state.data = {
        ...state.data,
        ...action.payload,
      };
      state.loading = false;
    },
    loadOrderDetail(state, _action) {
      state.loading = true;
      state.error = null;
    },
    loadedOrderDetail(state, action) {
      state.data = {
        ...state.data,
        currentItem: action.payload,
      };
      state.loading = false;
    },
    createOrder(state, _action) {
      state.loading = true;
      state.error = null;
    },
    updateOrder(state, _action) {
      state.loading = true;
      state.error = null;
    },
    updatedOrder(state, action) {
      const foundIndex = state.data?.data?.findIndex((item) => item._id === action.payload._id);
      if (foundIndex !== -1) {
        state.data.data[foundIndex] = action.payload;
      }
      state.loading = false;
    },
    deleteOrder(state, _action) {
      state.loading = true;
      state.error = null;
    },
    Error(state, action) {
      state.error = action.payload;
      state.loading = false;
    },
    finished(state) {
      state.loading = false;
      state.error = null;
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
