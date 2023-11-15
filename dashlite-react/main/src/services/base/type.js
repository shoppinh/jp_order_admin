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
      updateAddress: '/api/user/address/{id}',
      deleteAddress: '/api/user/address/{id}',
      getAddressDetail: '/api/user/address/{id}',
    },
    getUserList: '/api/user/list',
    userProfile: '/api/user/profile',
    updateUser: '/api/user/{id}',
    deleteUser: '/api/user/{id}',
    getUserDetail: '/api/user/{id}',
    addNewUser: '/api/user',
  },
  setting: {
    getSetting: '/api/setting',
    updateSetting: '/api/setting',
  },
  product: {
    loadProductList: '/api/product/list',
    loadProductDetail: '/api/product/{id}',
    createProduct: '/api/product',
    updateProduct: '/api/product/{id}',
    deleteProduct: '/api/product/delete/{id}',
    deleteProducts: '/api/product/delete-list',
  },
  order: {
    loadOrderList: '/api/order/list',
    loadOrderDetail: '/api/order/{id}',
    createOrder: '/api/order',
    updateOrder: '/api/order/{id}',
    deleteOrder: '/api/order/{id}',
  },
  category: {
    loadCategoryList: '/api/category/list',
    loadCategoryDetail: '/api/category/{id}',
    createCategory: '/api/category',
    updateCategory: '/api/category/{id}',
    deleteCategory: '/api/category/{id}',
  },
  file: {
    uploadImage: '/api/files/upload/image',
    uploadImages: '/api/files/upload/images',
    deleteFile: '/api/files',
  },
};
