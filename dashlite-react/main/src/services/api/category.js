import apiClient from '../base/apiClient';
import { APIs } from '../base/type';

export const loadCategoryList = async (query) => {
  const params = {
    sort: query.sort,
    search: query.search,
    skip: query.skip,
    limit: query.limit,
  };

  return new apiClient(query.token).post(APIs.category.loadCategoryList, params);
};

export const loadCategoryDetail = async (query) => {
  const url = APIs.category.loadCategoryDetail.replace('{id}', query.categoryId);
  return new apiClient(query.token).get(url);
};

export const createCategory = async (payload) => {
  const { token, ...rest } = payload;
  return new apiClient(token).post(APIs.category.createCategory, rest);
};

export const updateCategory = async (payload) => {
  const { token, categoryId, ...rest } = payload;
  const url = APIs.category.updateCategory.replace('{id}', categoryId);
  return new apiClient(token).put(url, rest);
};

export const deleteCategory = async (query) => {
  const url = APIs.category.deleteCategory.replace('{id}', query.categoryId);
  return new apiClient(query.token).delete(url);
};
