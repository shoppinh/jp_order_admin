import { all, call, put, takeLatest } from 'redux-saga/effects';
import { userActions as actions } from '../slices/user';
import { apiGetUserList } from '../../services/api/apiHelper';
export function* userSaga() {
  yield all([takeLatest(actions.loadUserList.type, loadUserListSaga)]);
}

export function* loadUserProfile() {}

export function* updateUserProfile() {}
export function* loadUserListSaga({ payload }) {
  try {
    const response = yield call(apiGetUserList, payload);
    if (response.data && response.data.status) {
      yield put(actions.loadedUserList(response.data));
    } else yield put(actions.Error(response.data.error));
  } catch (err) {
    console.log(err);
  }
}

export function* addNewUser() {}
export function* updateUser() {}
export function* deleteUser() {}
export function* getUserDetail() {}
export function* addNewAddress() {}
export function* updateAddress() {}
export function* deleteAddress() {}
export function* getAddressList() {}
export function* getAddressDetail() {}
