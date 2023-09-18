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
    addMenuInfo(state, action) {
      state.data.menuGUID = action.payload.menuGUID;
      state.data.outletId = action.payload.outletId;
    },
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
    updateUserInfo(state, action) {
      state.error = null;
      state.data.auth = {
        ...state.data.auth,
        user: {
          ...state.data.auth?.user,
          data: action.payload.user,
        },
      };
      state.loading = true;
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
    updateSellerId(state, action) {
      state.data.sellerId = action.payload.sellerId;
      state.data.siteType = action.payload.siteType;
    },
    updateTableId(state, action) {
      state.data.tableId = action.payload.tableId;
    },
    doRegisterDeviceToken(state, action) {},
    updateRegisterDeviceToken(state, action) {
      state.data.auth = {
        ...state.data.auth,
        fcmToken: action.payload.fcmToken,
      };
    },
    getCountUnreadRoom(state, action) {
      state.error = null;
      state.loading = true;
    },
    updateCountUnreadRoom(state, action) {
      if (action?.payload.menuGUID) {
        state.error = null;
        state.data.auth = {
          ...state.data.auth,
          user: {
            ...state.data.auth?.user,
            notifications: {
              ...state.data.auth?.user?.notifications,
              [action.payload.menuGUID]: {
                messageCountUnread: Number(action.payload.countUnread || '0'),
              },
            },
          },
        };
      }
      state.loading = false;
    },
    doSocialRegister(state, action) {
      state.error = null;
      state.loading = true;
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
