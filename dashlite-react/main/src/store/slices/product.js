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
    loadProductList(state) {
      state.loading = true;
      state.error = null;
    },
    loadedProductList(state, action) {
      state.data = {
        ...state.data,
        ...action.payload,
      };
      state.loading = false;
      state.error = null;
    },
    loadProductDetail(state) {
      state.loading = true;
      state.error = null;
    },
    loadedProductDetail(state, action) {
      state.data = {
        ...state.data,
        ...action.payload,
      };
      state.loading = false;
      state.error = null;
    },
    createProduct(state) {
      state.loading = true;
      state.error = null;
    },
    updateProduct(state) {
      state.loading = true;
      state.error = null;
    },
    updatedProduct(state, action) {
      const foundIndex = state.data?.data?.findIndex((item) => item.id === action.payload.id);
      if (foundIndex !== -1) {
        state.data.data[foundIndex] = action.payload;
      }
      state.loading = false;
      state.error = null;
    },
    deleteProduct(state) {
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

export const { name, actions: productActions, reducer } = slice;

export const useProductSlice = () => {
  useInjectReducer({ key: slice.name, reducer: slice.reducer });
  useInjectSaga({ key: slice.name, saga: productSaga });
  return {
    actions: productActions,
  };
};
