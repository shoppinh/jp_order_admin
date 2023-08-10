import apiClient from '../base/apiClient';
import { APIs } from '../base/type';

export const login = async (query) => {
  const params = {
    username: query.username,
    password: query.password,
  };

  return new apiClient('').post(APIs.auth.login, params);
};

export const logout = async (query) => {
  const params = {
    token: query.token,
    fcmToken: query.fcmToken,
    consumerId: query.consumerId,
  };

  return new apiClient(query.token).post(APIs.auth.logout, params);
};

export const refreshToken = async (query) => {
  const params = {
    token: query.token,
    refreshToken: query.refreshToken,
  };
  return new apiClient('').post(APIs.auth.refreshToken, params);
};

export const registerDeviceToken = async (query) => {
  return new apiClient(query.token).post(APIs.auth.registerDeviceToken, query);
};
