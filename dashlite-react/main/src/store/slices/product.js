import { loadState } from '../localStorage';
import { useInjectReducer, useInjectSaga } from '../../utils/@reduxjs/redux-injector';
import { createSlice } from '../../utils/@reduxjs/toolkit';
import { productSaga } from '../sagas/productSaga';

const productCache = loadState()?.product;

export const initialState = {
  data: {
    ...productCache?.data,
  },
  loading: false,
  error: null,
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
        currentItem: action.payload,
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
      const foundIndex = state.data?.data?.findIndex((item) => item._id === action.payload._id);
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
    deleteProducts(state) {
      state.loading = true;
      state.error = null;
    },
    queryProduct(state) {
      state.error = null;
      state.data = {
        ...state.data,
        queriedProduct: null,
      };
      state.loading = true;
    },
    queriedProduct(state, action) {
      state.data = {
        ...state.data,
        ...action.payload,
      };
      state.loading = false;
      state.error = null;
    },
    queriedProductFailed(state, action) {
      state.data = {
        ...state.data,
        queriedProduct: null,
      };
      state.loading = false;
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
