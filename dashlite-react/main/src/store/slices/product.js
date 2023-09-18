import { loadState } from '../localStorage';
import { useInjectReducer, useInjectSaga } from '../../utils/@reduxjs/redux-injector';
import { createSlice } from '../../utils/@reduxjs/toolkit';
import { productSaga } from '../sagas/productSaga';

const productCache = loadState()?.product;

export const initialState = {
  data: {
    ...productCache?.data,
  },
  error: null,
  loading: false,
};

const slice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    Error(state, action) {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const { name, actions: productActions, reducer } = slice;

export const useProductSlice = () => {
  useInjectReducer({ key: slice.name, reducer: slice.reducer });
  useInjectSaga({ key: slice.name, saga: productSaga });
  return {
    actions: productActions,
  };
};
