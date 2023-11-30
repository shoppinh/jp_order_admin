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

// Settings

export function* apiGetUserSettings(query) {
  return yield call(api.getUserSettings, query);
}

export function* apiUpdateUserSettings(query) {
  return yield call(api.updateUserSettings, query);
}

// Product

export function* apiLoadProductList(query) {
  return yield call(api.loadProductList, query);
}

export function* apiLoadProductDetail(query) {
  return yield call(api.loadProductDetail, query);
}

export function* apiCreateProduct(query) {
  return yield call(api.createProduct, query);
}

export function* apiUpdateProduct(query) {
  return yield call(api.updateProduct, query);
}

export function* apiDeleteProduct(query) {
  return yield call(api.deleteProduct, query);
}

export function* apiDeleteProducts(query) {
  return yield call(api.deleteProducts, query);
}

export function* apiQueryProduct(query) {
  return yield call(api.queryProduct, query);
}

// Category

export function* apiLoadCategoryList(query) {
  return yield call(api.loadCategoryList, query);
}

export function* apiLoaCategoryDetail(query) {
  return yield call(api.loadCategoryDetail, query);
}

export function* apiCreateCategory(query) {
  return yield call(api.createCategory, query);
}

export function* apiUpdateCategory(query) {
  return yield call(api.updateCategory, query);
}

export function* apiDeleteCategory(query) {
  return yield call(api.deleteCategory, query);
}

// Order

export function* apiLoadOrderList(query) {
  return yield call(api.loadOrderList, query);
}

export function* apiLoadOrderDetail(query) {
  return yield call(api.loadOrderDetail, query);
}

export function* apiCreateOrder(query) {
  return yield call(api.createOrder, query);
}

export function* apiUpdateOrder(query) {
  return yield call(api.updateOrder, query);
}

export function* apiDeleteOrder(query) {
  return yield call(api.deleteOrder, query);
}

// File

export function* apiUploadImage(query) {
  return yield call(api.uploadImage, query);
}

export function* apiUploadImages(query) {
  return yield call(api.uploadImages, query);
}

export function* apiDeleteFile(query) {
  return yield call(api.deleteFile, query);
}
