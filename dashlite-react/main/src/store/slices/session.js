import { loadState } from '../localStorage';
import { loadDocumentCookieState } from '../cookieHandle';
import { useInjectReducer, useInjectSaga } from '../../utils/@reduxjs/redux-injector';
import { createSlice } from '../../utils/@reduxjs/toolkit';
import { sessionSaga } from '../sagas/sessionSaga';

const sessionCache = loadState()?.session;
const authCache =
  sessionCache?.data?.auth && sessionCache?.data?.auth.rememberMe
    ? sessionCache?.data?.auth
    : loadDocumentCookieState();

export const initialState = {
  data: {
    ...sessionCache?.data,
    auth: authCache,
  },
  error: null,
  loading: false,
};

const slice = createSlice({
  name: 'session',
  initialState,
  reducers: {
    updateAuth(state, action) {
      state.data = {
        ...state.data,
        auth: {
          ...state.data.auth,
          ...action.payload,
        },
      };
      state.loading = false;
    },
    doLogin(state, action) {
      state.error = null;
      state.data.auth = { isLogout: false };
      state.loading = true;
    },
    doRefreshToken(state, action) {
      state.error = null;
      // state.data.auth = initialState.data.auth || {};
      state.loading = true;
    },
    doLogout(state, action) {
      state.error = null;
      state.data.auth = {
        isLogout: true,
      };
      state.loading = false;
    },
    doGetUserInfo(state, action) {
      state.error = null;
      state.loading = true;
    },
    doUpdateUserProfile(state, action) {
      state.error = null;
      state.loading = true;
    },
    doUpdatedUserProfile(state, action) {
      state.data.auth = {
        ...state.data.auth,
        user: {
          ...state.data.auth?.user,
          data: action.payload.user,
        },
      };
      state.loading = false;
    },
    updateSessionCheckout(state, action) {
      const { menuGUID, deliveryOption, addedToCartFirstTime } = action.payload;
      if (menuGUID && typeof menuGUID === 'string' && menuGUID !== '') {
        const dataCheckout = state.data.checkout;
        const dataCheckoutMenuGUID = dataCheckout ? dataCheckout[menuGUID] : {};
        state.data.checkout = {
          ...dataCheckout,
          ...{
            [menuGUID]: {
              ...dataCheckoutMenuGUID,
              deliveryOption,
              ...(addedToCartFirstTime ? { addedToCartFirstTime } : {}),
            },
          },
        };
      }
    },

    doRegisterDeviceToken(state, action) {},
    updateRegisterDeviceToken(state, action) {
      state.data.auth = {
        ...state.data.auth,
        fcmToken: action.payload.fcmToken,
      };
    },
    Error(state, action) {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const { name, actions: sessionActions, reducer } = slice;

export const useSessionSlice = () => {
  useInjectReducer({ key: slice.name, reducer: slice.reducer });
  useInjectSaga({ key: slice.name, saga: sessionSaga });
  return {
    actions: sessionActions,
  };
};
