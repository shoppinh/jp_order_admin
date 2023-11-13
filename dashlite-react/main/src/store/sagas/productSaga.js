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
  yield all([takeLatest(actions.loadProductList.type, doLoadProductList)]);
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
    category: data.category?.map((item) => {
      return {
        label: item.label,
        value: item.name,
      };
    }),
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
    console.log('🚀 ~ file: productSaga.js:19 ~ function*doLoadProductList ~ error:', error);
  }
}

export function* doCreateProduct({ payload }) {
  try {
    const { imageAttachments, productImageThumb, ...rest } = payload;
    // First upload image thumbnail and image attachments
    const [uploadImageAttachmentsRes, uploadImageThumbRes] = yield all([
      call(apiUploadImages, imageAttachments),
      call(apiUploadImage, productImageThumb),
    ]);
    if (uploadImageAttachmentsRes?.data?.status && uploadImageThumbRes?.data?.status) {
      const createProductPayload = {
        ...rest,
        imageAttachments: uploadImageAttachmentsRes.data.data,
        productImageThumb: uploadImageThumbRes.data.data,
      };
      const response = yield call(apiCreateProduct, createProductPayload);
      if (response?.data?.status) {
        yield put(actions.finished());
      } else {
        yield put(actions.Error(response.data.error));
      }
    }
    // Then create product
  } catch (error) {
    console.log('🚀 ~ file: productSaga.js:19 ~ function*doLoadProductList ~ error:', error);
  }
}

export function* doUpdateProduct({ payload }) {
  try {
    const response = yield call(apiUpdateProduct, payload);
    if (response?.data?.status) {
      yield put(actions.updatedProductDetail(response.data.data));
    } else {
      yield put(actions.Error(response.data.error));
    }
  } catch (error) {
    console.log('🚀 ~ file: productSaga.js:19 ~ function*doLoadProductList ~ error:', error);
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
    console.log('🚀 ~ file: productSaga.js:19 ~ function*doLoadProductList ~ error:', error);
  }
}
