import { all, call, takeLatest, put } from 'redux-saga/effects';
import { settingActions as actions } from '../slices/setting';
import { apiGetUserSettings, apiUpdateUserSettings } from '../../services/api/apiHelper';

export function* settingSaga() {
  yield all([
    takeLatest(actions.loadSetting.type, loadSettingSaga),
    takeLatest(actions.updateSetting.type, updateSettingSaga),
  ]);
}

export function* loadSettingSaga({ payload }) {
  try {
    const response = yield call(apiGetUserSettings, payload);
    if (response.data && response.data.status) {
      yield put(actions.loadedSetting(response.data.data));
    } else {
      yield put(actions.Error(response.data.message));
    }
  } catch (e) {
    console.log('🚀 ~ file: settingSaga.js:12 ~ function*loadSettingSaga ~ e:', e);
  }
}

export function* updateSettingSaga({ payload }) {
  try {
    const response = yield call(apiUpdateUserSettings, payload);
    if (response.data && response.data.status) {
      yield put(actions.updatedSetting(response.data.data));
    } else {
      yield put(actions.Error(response.data.message));
    }
  } catch (e) {
    console.log('🚀 ~ file: settingSaga.js:12 ~ function*updateSettingSaga ~ e:', e);
  }
}
