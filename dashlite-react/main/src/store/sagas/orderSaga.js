import { takeLatest, all, call, put } from 'redux-saga/effects';
import { orderActions as actions } from '../slices/order';
import { apiLoadOrderList } from '../../services/api/apiHelper';
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
    user: item.user,
    totalWeight: item.totalWeight,
    totalPrice: item.totalPrice,
    status: item.status,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
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
    }
  } catch (error) {
    console.log('🚀 ~ file: orderSaga.js:17 ~ function*doLoadOrderList ~ error:', error);
  }
}

export function* doLoadOrderDetail({ payload }) {}

export function* doCreateOrder({ payload }) {}

export function* doUpdateOrder({ payload }) {}

export function* doDeleteOrder({ payload }) {}
