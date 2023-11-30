import apiClient from '../base/apiClient';
import { APIs } from '../base/type';

export const loadProductList = async (query) => {
  const params = {
    sort: query.sort,
    search: query.search,
    skip: query.skip,
    limit: query.limit,
  };

  return new apiClient(query.token).post(APIs.product.loadProductList, params);
};

export const loadProductDetail = async (query) => {
  const url = APIs.product.loadProductDetail.replace('{id}', query.productId);
  return new apiClient(query.token).get(url);
};

export const createProduct = async (payload) => {
  const { token, ...rest } = payload;
  return new apiClient(token).post(APIs.product.createProduct, rest);
};

export const updateProduct = async (payload) => {
  const { token, productId, ...rest } = payload;
  const url = APIs.product.updateProduct.replace('{id}', productId);
  return new apiClient(token).put(url, rest);
};

export const deleteProduct = async (query) => {
  const url = APIs.product.deleteProduct.replace('{id}', query.productId);
  return new apiClient(query.token).delete(url);
};

export const deleteProducts = async (payload) => {
  const { token, ...rest } = payload;
  return new apiClient(token).delete(APIs.product.deleteProducts, rest);
};

export const queryProduct = async (query) => {
  const params = {
    productSrcURL: query.productSrcURL,
  };

  return new apiClient().post(APIs.product.queryProduct, params);
};
