import apiClient from '../base/apiClient';
import { APIs } from '../base/type';
export const uploadImage = async (payload) => {
  const { token, ...rest } = payload;
  console.log('🚀 ~ file: file.js:5 ~ uploadImage ~ payload:', payload);
  return new apiClient(token).postForm(APIs.file.uploadImage, rest.file);
};

export const uploadImages = async (payload) => {
  const { token, ...rest } = payload;
  return new apiClient(token).postForm(APIs.file.uploadImages, rest.files);
};

export const deleteFile = async (payload) => {
  const { token, ...formData } = payload;
  return new apiClient(token).delete(APIs.file.deleteFile, formData);
};
