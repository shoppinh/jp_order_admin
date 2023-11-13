import { all, call, put, takeLatest } from 'redux-saga/effects';
import {
  apiCreateProduct,
  apiLoadProductDetail,
  apiLoadProductList,
  apiUpdateProduct,
  apiDeleteProduct,
  apiUploadImages,
  apiUploadImage,
} from '../../services/api/apiHelper';
import { productActions as actions } from '../slices/product';

export function* productSaga() {
  yield all([
    takeLatest(actions.loadProductList.type, doLoadProductList),
    takeLatest(actions.loadProductDetail.type, doLoadProductDetail),
    takeLatest(actions.createProduct.type, doCreateProduct),
    takeLatest(actions.updateProduct.type, doUpdateProduct),
    takeLatest(actions.deleteProduct.type, doDeleteProduct),
  ]);
}

const parseProduct = (data) => {
  return {
    _id: data._id,
    name: data.name,
    description: data.description,
    price: data.price,
    salePrice: data.salePrice,
    imageAttachments: data.imageAttachments,
    SKU: data.SKU,
    quantity: data.quantity,
    productSrcURL: data.productSrcURL,
    category: data.category,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
  };
};

const parseProductList = (data) => {
  return data?.map((item) => parseProduct(item));
};

export function* doLoadProductList({ payload }) {
  try {
    const response = yield call(apiLoadProductList, payload);
    if (response?.data?.status) {
      yield put(
        actions.loadedProductList({
          data: parseProductList(response.data.data.data),
          totalItem: response.data.data.totalItem,
        })
      );
    } else {
      yield put(actions.Error(response.data.error));
    }
  } catch (error) {
    console.log('🚀 ~ file: productSaga.js:19 ~ function*doLoadProductList ~ error:', error);
  }
}

export function* doLoadProductDetail({ payload }) {
  try {
    const response = yield call(apiLoadProductDetail, payload);
    if (response?.data?.status) {
      yield put(actions.loadedProductDetail(response.data.data));
    } else {
      yield put(actions.Error(response.data.error));
    }
  } catch (error) {
    console.log('🚀 ~ file: productSaga.js:19 ~ function*doLoadProductDetail ~ error:', error);
  }
}

export function* doCreateProduct({ payload }) {
  try {
    const { imageAttachments, productImageThumb, ...productPayload } = payload;
    // First upload image thumbnail and image attachments
    if (imageAttachments) {
      const uploadImageAttachmentsRes = yield call(apiUploadImages, {
        files: imageAttachments,
        token: payload.token,
      });
      if (uploadImageAttachmentsRes?.status === 201) {
        productPayload.imageAttachments = uploadImageAttachmentsRes.data.map((item) => item.path);
      }
    }

    if (productImageThumb) {
      const uploadImageThumbRes = yield call(apiUploadImage, {
        file: productImageThumb,
        token: payload.token,
      });
      if (uploadImageThumbRes?.status === 201) {
        productPayload.productSrcURL = uploadImageThumbRes.data.data.path;
      }
    }

    const response = yield call(apiCreateProduct, productPayload);
    if (response?.data?.status) {
      yield put(actions.finished());
    } else {
      yield put(actions.Error(response.data.error));
    }
    // Then create product
  } catch (error) {
    console.log('🚀 ~ file: productSaga.js:19 ~ function*doCreateProduct ~ error:', error);
  }
}

export function* doUpdateProduct({ payload }) {
  try {
    const { imageAttachments, productImageThumb, ...productPayload } = payload;
    // First upload image thumbnail and image attachments
    if (imageAttachments) {
      const uploadImageAttachmentsRes = yield call(apiUploadImages, {
        files: imageAttachments,
        token: payload.token,
      });
      if (uploadImageAttachmentsRes?.status === 201) {
        productPayload.imageAttachments = uploadImageAttachmentsRes.data.map((item) => item.path);
      }
    }

    if (productImageThumb) {
      const uploadImageThumbRes = yield call(apiUploadImage, {
        file: productImageThumb,
        token: payload.token,
      });
      if (uploadImageThumbRes?.status === 201) {
        productPayload.productSrcURL = uploadImageThumbRes.data.data.path;
      }
    }
    const updateProductPayload = {
      ...productPayload,
    };

    const response = yield call(apiUpdateProduct, updateProductPayload);
    if (response?.data?.status) {
      yield put(
        actions.updatedProduct({
          ...response.data.data,
          _id: payload._id,
        })
      );
    } else {
      yield put(actions.Error(response.data.error));
    }
    // Then create product
  } catch (error) {
    console.log('🚀 ~ file: productSaga.js:19 ~ function*doCreateProduct ~ error:', error);
  }
}

export function* doDeleteProduct({ payload }) {
  try {
    const response = yield call(apiDeleteProduct, payload);
    if (response?.data?.status) {
      yield put(actions.finished());
    } else {
      yield put(actions.Error(response.data.error));
    }
  } catch (error) {
    console.log('🚀 ~ file: productSaga.js:19 ~ function*doDeleteProduct ~ error:', error);
  }
}
