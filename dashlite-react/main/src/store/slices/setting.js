import { loadState } from '../localStorage';
import { useInjectReducer, useInjectSaga } from '../../utils/@reduxjs/redux-injector';
import { createSlice } from '../../utils/@reduxjs/toolkit';
import { settingSaga } from '../sagas/settingSaga';

const settingCache = loadState()?.setting;

export const initialState = {
  data: {
    ...settingCache?.data,
  },
  error: null,
  loading: false,
};

const slice = createSlice({
  name: 'setting',
  initialState,
  reducers: {
    loadSetting(state, action) {
      state.error = null;
      state.loading = true;
    },
    loadedSetting(state, action) {
      state.loading = false;
      state.data = action.payload;
    },
    updateSetting(state, action) {
      state.error = null;
      state.loading = true;
    },
    updatedSetting(state, action) {
      state.loading = false;
      state.data = {
        ...state.data,
        ...action.payload,
      };
    },
    Error(state, action) {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const { name, actions: settingActions, reducer } = slice;

export const useSettingSlice = () => {
  useInjectReducer({ key: slice.name, reducer: slice.reducer });
  useInjectSaga({ key: slice.name, saga: settingSaga });
  return {
    actions: settingActions,
  };
};
