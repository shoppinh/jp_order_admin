import apiClient from '../base/apiClient';
import { APIs } from '../base/type';
export const getUserSettings = (query) => {
  return new apiClient(query.token).get(APIs.setting.getSetting);
};

export const updateUserSettings = (query) => {
  const { token, ...payload } = query;
  return new apiClient(token).put(APIs.setting.updateSetting, payload);
};
