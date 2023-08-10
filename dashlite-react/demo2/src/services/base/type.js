export const AcceptType = {
  json: 'application/json',
  formData: 'multipart/form-data',
  urlEncode: 'application/x-www-form-urlencoded',
};

export const GrantType = {
  REFRESH_TOKEN: 'refresh_token',
  PASSWORD: 'password',
};

export const APIs = {
  auth: {
    login: '/api/auth/login',
    register: '/api/auth/register',
    refreshToken: '/api/auth/refresh-token',
    logout: '/api/auth/logout',
    registerDeviceToken: '/api/auth/device-token',
  },
  user: {
    address: {
      getAddressList: '/api/user/address/list',
      addNewAddress: '/api/user/address',
      updateAddress: '/api/user/address/:id',
      deleteAddress: '/api/user/address/:id',
      getAddressDetail: '/api/user/address/:id',
    },
    getUserList: '/api/user/list',
    getUserInfo: '/api/user/profile',
  },
};
