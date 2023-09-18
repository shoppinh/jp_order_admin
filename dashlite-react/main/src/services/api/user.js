import apiClient from '../base/apiClient';
import { APIs } from '../base/type';

export const getUserInfo = async (query) => {
  return new apiClient(query.token).get(APIs.user.getUserDetail, query);
};

export const addNewUser = async (query) => {
  const { token, payload } = query;
  return new apiClient(token).post(APIs.user.addNewUser, payload);
};

export const updateUserInfo = async (query) => {
  const { token, payload } = query;
  return new apiClient(token).put(APIs.user.updateUser, payload);
};

export const deleteUser = async (query) => {
  const { token, payload } = query;
  return new apiClient(token).delete(APIs.user.deleteUser, payload);
};

export const getUserList = async (query) => {
  return new apiClient(query.token).get(APIs.user.getUserList, query);
};

export const addNewAddress = async (query) => {
  const { token, payload } = query;
  return new apiClient(token).post(APIs.user.address.addNewAddress, payload);
};

export const getAddressList = async (query) => {
  return new apiClient(query.token).get(APIs.user.address.getAddressList, query);
};

export const getAddressInfo = async (query) => {
  const { token, addressId } = query;
  const endPoint = APIs.user.address.getAddressDetail.replace('{addressId}', addressId);
  return new apiClient(token).get(endPoint);
};
export const updateAddress = async (query) => {
  const { token, addressId, ...payload } = query;
  const endPoint = APIs.user.address.updateAddress.replace('{addressId}', addressId);
  return new apiClient(token).put(endPoint, payload);
};

export const deleteAddress = async (query) => {
  const { token, addressId, ...payload } = query;
  const endPoint = APIs.user.address.deleteAddress.replace('{addressId}', addressId);
  return new apiClient(token).delete(endPoint, payload);
};
