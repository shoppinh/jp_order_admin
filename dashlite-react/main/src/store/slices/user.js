import { loadState } from '../localStorage';
import { useInjectReducer, useInjectSaga } from '../../utils/@reduxjs/redux-injector';
import { createSlice } from '../../utils/@reduxjs/toolkit';
import { userSaga } from '../sagas/userSaga';

const userCache = loadState()?.user;

export const initialState = {
  data: {
    ...userCache?.data,
  },
  error: null,
  loading: false,
};

const slice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    loadUserList(state, action) {
      state.loading = true;
      state.error = null;
    },
    loadedUserList(state, action) {
      state.loading = false;
      state.data.userList = action.payload;
    },
    loadUserDetail(state, action) {},
    Error(state, action) {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const { name, actions: userActions, reducer } = slice;

export const useUserSlice = () => {
  useInjectReducer({ key: slice.name, reducer: slice.reducer });
  useInjectSaga({ key: slice.name, saga: userSaga });
  return {
    actions: userActions,
  };
};
