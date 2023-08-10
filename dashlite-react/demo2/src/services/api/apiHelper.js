import * as api from './index';
import { call } from 'redux-saga/effects';

export function* apiLogin(query) {
  return yield call(api.login, query);
}

export function* apiLogout(query) {
  return yield call(api.logout, query);
}

export function* apiRefreshToken(query) {
  return yield call(api.refreshToken, query);
}

export function* apiRegisterDeviceToken(query) {
  return yield call(api.registerDeviceToken, query);
}

export function* apiGetUserInfo(query) {
  return yield call(api.getUserInfo, query);
}
