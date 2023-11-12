import { takeLatest, all, call, put } from 'redux-saga/effects';
import { categoryActions as actions } from '../slices/category';
import { apiLoadCategoryList } from '../../services/api/apiHelper';

export function* categorySaga() {
  yield all([takeLatest(actions.loadCategoryList.type, doLoadCategoryList)]);
}

export function* doLoadCategoryList({ payload }) {
  try {
    const response = yield call(apiLoadCategoryList, payload);
    if (response?.data?.status) {
      yield put(actions.loadedCategoryList(response.data.data));
    } else {
      yield put(actions.Error(response.data.error));
    }
  } catch (error) {
    console.log('🚀 ~ file: categorySaga.js:19 ~ function*doLoadCategoryList ~ error:', error);
  }
}
