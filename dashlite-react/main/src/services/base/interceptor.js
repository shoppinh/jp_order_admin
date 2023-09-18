import axios from 'axios';
import store from '../../store';
import { STORAGE_KEY } from '../../utils/constants';
import { toast } from 'react-toastify';
import i18next from 'i18next';
import { sessionActions } from '../../store/slices/session';
import { refreshToken as doRefreshToken } from '../../services/api/authentication';

let isRefreshing = false;
let isLogout = false;
let requestArray = [];

const processQueue = (token) => {
  requestArray.forEach((prom) => {
    prom.resolve(token);
  });
  requestArray = [];
};

let timeRefesh = 0;

const handleRefreshToken = async (accessToken, refreshToken, roleId) => {
  let tokenReturn;
  let refreshTokenReturn;
  await doRefreshToken({
    token: accessToken,
    refreshToken: refreshToken,
    roleId: roleId,
  })
    .then(async (responseHandle) => {
      if (responseHandle.data?.status) {
        timeRefesh = 0;
        processQueue(responseHandle.data?.data?.token);
        tokenReturn = responseHandle.data?.data?.token;
        refreshTokenReturn = responseHandle.data?.data?.refreshToken;
      } else {
        timeRefesh = timeRefesh + 1;
        if (timeRefesh >= 3) return {};
        else {
          await handleRefreshToken(accessToken, refreshToken, roleId);
        }
      }
    })
    .catch(async (error) => {
      timeRefesh = timeRefesh + 1;
      if (timeRefesh >= 3) return;
      else {
        await handleRefreshToken(accessToken, refreshToken, roleId);
      }
    });
  isRefreshing = false;
  return {
    accessToken: tokenReturn,
    refreshToken: refreshTokenReturn,
  };
};

export const responseInterceptor = async (response) => {
  if (response.status === 406) {
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        requestArray.push({ resolve, reject });
      }).then((token) => {
        return axios.request({
          ...response.config,
          headers: {
            ...response.config.headers,
            Authorization: `Bearer ${token}`,
          },
        });
      });
    } else {
      isRefreshing = true;
      const stateData = store.getState();
      const sessionAuth = stateData?.session?.data?.auth;
      const currentUser = sessionAuth?.user?.data;
      const handleRefreshCall = await handleRefreshToken(
        sessionAuth?.accessToken,
        sessionAuth?.refreshToken,
        currentUser?.roleId
      );
      if (handleRefreshCall.accessToken && currentUser) {
        store.dispatch(
          sessionActions.updateAuth({
            accessToken: handleRefreshCall.accessToken,
            refreshToken: handleRefreshCall.refreshToken,
          })
        );
        const newConfig = {
          ...response.config,
          headers: {
            ...response.config.headers,
            Authorization: `Bearer ${handleRefreshCall.accessToken}`,
          },
        };
        return axios.request(newConfig);
      } else {
        store.dispatch(
          sessionActions.doLogout({
            token: sessionAuth?.accessToken || '',
            fcmToken: sessionAuth?.fcmToken || '',
            consumerId: sessionAuth?.user?.data?.id || 0,
          })
        );
      }
    }
  } else if (response.status === 401 || response.status === 203) {
    if (!isLogout) {
      const sessionAuth = JSON.parse((await localStorage.getItem(STORAGE_KEY)) || '').session?.data
        ?.auth;
      if (response.status === 203) {
        toast.error(i18next.t('login.accountHasBeenDeactivated'));
      }
      store.dispatch(
        sessionActions.doLogout({
          token: sessionAuth?.accessToken || '',
          fcmToken: sessionAuth?.fcmToken || '',
          consumerId: sessionAuth?.user?.data?.id || 0,
        })
      );
      isLogout = true;
    }
  } else {
    isLogout = false;
    return Promise.resolve(response);
  }
  return Promise.resolve(response);
};

export const errorInterceptor = (error) => {
  return Promise.reject(error);
};

export const requestInterceptor = (config) => {
  return config;
};
