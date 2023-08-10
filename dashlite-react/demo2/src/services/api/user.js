import apiClient from '../base/apiClient';
import { APIs } from '../base/type';

export const getUserInfo = async (query) => {
  return new apiClient(query.token).get(APIs.user.getUserInfo, query);
};
