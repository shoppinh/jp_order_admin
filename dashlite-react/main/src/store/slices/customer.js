import { loadState } from '../localStorage';
import { useInjectReducer, useInjectSaga } from '../../utils/@reduxjs/redux-injector';
import { createSlice } from '../../utils/@reduxjs/toolkit';
import { customerSaga } from '../sagas/customerSaga';

const customerCache = loadState()?.customer;

export const initialState = {
  data: {
    ...customerCache?.data,
  },
  error: null,
  loading: false,
};

const slice = createSlice({
  name: 'customer',
  initialState,
  reducers: {
    loadCustomerList(state, action) {
      state.loading = true;
      state.error = null;
    },
    loadedCustomerList(state, action) {
      state.loading = false;
      state.data.customerList = action.payload;
    },
    Error(state, action) {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const { name, actions: customerActions, reducer } = slice;

export const useCustomerSlice = () => {
  useInjectReducer({ key: slice.name, reducer: slice.reducer });
  useInjectSaga({ key: slice.name, saga: customerSaga });
  return {
    actions: customerActions,
  };
};
