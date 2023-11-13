import apiClient from '../base/apiClient';
import { APIs } from '../base/type';
export const uploadImage = async (payload) => {
  const { token, ...formData } = payload;
  return new apiClient(token).postForm(APIs.file.uploadImage, formData);
};

export const uploadImages = async (payload) => {
  const { token, ...formData } = payload;
  return new apiClient(token).postForm(APIs.file.uploadImages, formData);
};

export const deleteFile = async (payload) => {
  const { token, ...formData } = payload;
  return new apiClient(token).delete(APIs.file.deleteFile, formData);
};
