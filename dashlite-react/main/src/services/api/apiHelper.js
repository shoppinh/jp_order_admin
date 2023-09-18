import * as api from './index';
import { call } from 'redux-saga/effects';

// Auth
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

export function* apiGetProfile(query) {
  return yield call(api.getUserProfile, query);
}

export function* apiUpdateProfile(query) {
  return yield call(api.updateUserProfile, query);
}
// User

export function* apiGetUserInfo(query) {
  return yield call(api.getUserInfo, query);
}

export function* apiGetUserList(query) {
  return yield call(api.getUserList, query);
}

export function* apiAddNewUser(query) {
  return yield call(api.addNewUser, query);
}
export function* apiUpdateUser(query) {
  return yield call(api.updateUserInfo, query);
}

export function* apiDeleteUser(query) {
  return yield call(api.deleteUser, query);
}

export function* apiUpdateUserAddress(query) {
  return yield call(api.updateAddress, query);
}

export function* apiGetUserAddress(query) {
  return yield call(api.getAddressInfo, query);
}

export function* apiGetUserAddressList(query) {
  return yield call(api.getAddressList, query);
}

export function* apiDeleteUserAddress(query) {
  return yield call(api.deleteAddress, query);
}
