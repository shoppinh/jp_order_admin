import { takeLatest, all, call, put } from 'redux-saga/effects';
import { orderActions as actions } from '../slices/order';
import {
  apiCreateOrder,
  apiDeleteOrder,
  apiLoadOrderDetail,
  apiLoadOrderList,
  apiUpdateOrder,
} from '../../services/api/apiHelper';
export function* orderSaga() {
  yield all([
    takeLatest(actions.loadOrderList.type, doLoadOrderList),
    takeLatest(actions.loadOrderDetail.type, doLoadOrderDetail),
    takeLatest(actions.createOrder.type, doCreateOrder),
    takeLatest(actions.updateOrder.type, doUpdateOrder),
    takeLatest(actions.deleteOrder.type, doDeleteOrder),
  ]);
}

export function parseOrder(item) {
  return {
    _id: item._id,
    address: item.address,
    guestAddress: item.guestAddress,
    user: item.user,
    totalWeight: item.totalWeight,
    totalPrice: item.totalPrice,
    status: item.status,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
    purchasedItems: item.items,
    fullName: item.fullName,
  };
}

export function parseOrderList(data) {
  return data?.map((item) => parseOrder(item));
}

export function* doLoadOrderList({ payload }) {
  try {
    const response = yield call(apiLoadOrderList, payload);
    if (response?.data?.status) {
      yield put(
        actions.loadedOrderList({
          data: parseOrderList(response.data.data.data),
          totalItem: response.data.data.totalItem,
        })
      );
    } else yield put(actions.Error(response.data.error));
  } catch (error) {
    console.log('🚀 ~ file: orderSaga.js:17 ~ function*doLoadOrderList ~ error:', error);
  }
}

export function* doLoadOrderDetail({ payload }) {
  try {
    const response = yield call(apiLoadOrderDetail, payload);
    if (response?.data?.status) {
      yield put(actions.loadedOrderDetail(parseOrder(response.data.data)));
    } else yield put(actions.Error(response.data.error));
  } catch (error) {
    console.log('🚀 ~ file: orderSaga.js:28 ~ function*doLoadOrderDetail ~ error:', error);
  }
}

export function* doCreateOrder({ payload }) {
  try {
    const response = yield call(apiCreateOrder, payload);
    if (response?.data?.status) {
      yield put(actions.finished());
    } else yield put(actions.Error(response.data.error));
  } catch (error) {
    console.log('🚀 ~ file: orderSaga.js:53 ~ function*doCreateOrder ~ error:', error);
  }
}

export function* doUpdateOrder({ payload }) {
  try {
    const response = yield call(apiUpdateOrder, payload);
    if (response?.data?.status) {
      yield put(actions.updatedOrder(response.data.data));
    } else yield put(actions.Error(response.data.error));
  } catch (error) {
    console.log('🚀 ~ file: orderSaga.js:64 ~ function*doUpdateOrder ~ error:', error);
  }
}

export function* doDeleteOrder({ payload }) {
  try {
    const response = yield call(apiDeleteOrder, payload);
    if (response?.data?.status) {
      yield put(actions.finished());
    } else yield put(actions.Error(response.data.error));
  } catch (error) {
    console.log('🚀 ~ file: orderSaga.js:75 ~ function*doDeleteOrder ~ error:', error);
  }
}
