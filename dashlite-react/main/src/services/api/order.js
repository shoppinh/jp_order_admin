import apiClient from '../base/apiClient';
import { APIs } from '../base/type';

export const loadOrderList = (query) => {
  const { token, ...payload } = query;
  return new apiClient(token).post(APIs.order.loadOrderList, payload);
};

export const loadOrderDetail = (query) => {
  const { token, orderId } = query;
  const url = APIs.order.loadOrderDetail.replace('{id}', orderId);
  return new apiClient(token).get(url);
};

export const createOrder = (query) => {
  const { token, ...payload } = query;
  return new apiClient(token).post(APIs.order.createOrder, payload);
};

export const updateOrder = (query) => {
  const { token, orderId, ...payload } = query;
  const url = APIs.order.updateOrder.replace('{id}', orderId);
  return new apiClient(token).put(url, payload);
};

export const deleteOrder = (query) => {
  const { token, orderId } = query;
  return new apiClient(token).delete(APIs.order.deleteOrder.replace('{id}', orderId));
};
