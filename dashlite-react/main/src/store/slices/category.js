import { loadState } from '../localStorage';
import { useInjectReducer, useInjectSaga } from '../../utils/@reduxjs/redux-injector';
import { createSlice } from '../../utils/@reduxjs/toolkit';
import { categorySaga } from '../sagas/categorySaga';

const categoryCache = loadState()?.category;

export const initialState = {
  data: {
    ...categoryCache?.data,
  },
  error: null,
  loading: false,
};

const slice = createSlice({
  name: 'category',
  initialState,
  reducers: {
    loadCategoryList(state, action) {
      state.loading = true;
      state.error = null;
    },
    loadedCategoryList(state, action) {
      state.data = {
        ...state.data,
        ...action.payload,
      };
      state.loading = false;
      state.error = null;
    },
    Error(state, action) {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const { name, actions: categoryActions, reducer } = slice;

export const useCategorySlice = () => {
  useInjectReducer({ key: slice.name, reducer: slice.reducer });
  useInjectSaga({ key: slice.name, saga: categorySaga });
  return {
    actions: categoryActions,
  };
};
