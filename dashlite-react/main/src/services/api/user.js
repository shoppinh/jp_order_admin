import apiClient from '../base/apiClient';
import { APIs } from '../base/type';

export const getUserInfo = async (query) => {
  return new apiClient(query.token).get(APIs.user.getUserInfo, query);
};

export const getUserList = async (query) => {
  return new apiClient(query.token).get(APIs.user.getUserList, query);
};

export const addNewAddress = async (query) => {
  const { token, payload } = query;
  return new apiClient(token).post(APIs.user.addNewAddress, payload);
};

export const updateAddress = async (query) => {
  const { token, addressId, ...payload } = query;
  const endPoint = APIs.user.address.getAddressDetail.replace('{addressId}', addressId);
  return new apiClient(token).put(endPoint, payload);
};

export const deleteAddress = async (query) => {
  const { token, addressId, ...payload } = query;
  const endPoint = APIs.user.address.getAddressDetail.replace('{addressId}', addressId);
  return new apiClient(token).delete(endPoint, payload);
};

export const getAddressList = async (query) => {
  return new apiClient(query.token).get(APIs.user.getAddressList, query);
};

export const getAddressInfo = async (query) => {
  const { token, addressId } = query;
  const endPoint = APIs.user.address.getAddressDetail.replace('{addressId}', addressId);
  return new apiClient(token).get(endPoint);
};
