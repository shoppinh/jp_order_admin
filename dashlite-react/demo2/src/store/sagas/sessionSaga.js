import {all, call, put, takeLatest} from 'redux-saga/effects';
import {
    apiGetUserInfo,
    apiLogin,
    apiLogout,
    apiRefreshToken,
    apiRegisterDeviceToken,
} from '../../services/api/apiHelper';
import {sessionActions as actions} from '../slices/session';
import {_FORCE_REFRESH_KEY, PREVIOUS_STORAGE_KEY} from '../../utils/constants';
import i18next from 'i18next';

export function* sessionSaga() {
    yield all([
        takeLatest(actions.doLogin, doLogin),
        takeLatest(actions.doLogout, doLogout),
        takeLatest(actions.doRegisterDeviceToken, doRegisterDeviceToken),
        takeLatest(actions.doRefreshToken, doRefreshToken),
        takeLatest(actions.doGetUserInfo, getUserInfo),
    ]);
}

const ParseLogin = (username, rememberMe, response) => ({
    username: username,
    accessToken: response.accessToken,
    refreshToken: response.refreshToken,
    rememberMe: rememberMe,
    tokenType: response.tokenType,
    expiresIn: response.expiresIn,
    expiresDate: response.expiresDate,
    user: {
        lastLoggedIn: response.lastLoggedIn,
        mobilePhone: response.mobilePhone,
        email: response.email,
        id: response.userId,
        isActive: response.isActive,
        avatar: response.avatar,
        role: response.role,
        username: response.username,
        firstName: response.firstName,
        lastName: response.lastName,
        fullName: response.fullName,
    },
});

export function* doLogin({payload}) {
    try {
        const response = yield call(apiLogin, payload);
        if (response?.data?.status) {
            const authData = ParseLogin(payload.username, payload.rememberMe, response.data.data);
            const userData = authData?.user;
            if (userData?.data?.userSettings && userData?.data?.userSettings.lang) {
                i18next.changeLanguage(userData?.data?.userSettings.lang);
            }
            yield put(actions.updateAuth(authData));
            localStorage.setItem(PREVIOUS_STORAGE_KEY, JSON.stringify(authData));
            setTimeout(() => {
                localStorage.setItem(_FORCE_REFRESH_KEY, 'true');
            }, 1500);
        } else {
            yield put(actions.Error(response.data.error));
        }
    } catch (err) {
        console.log(err);
    }
}

export function* doLogout({payload}) {
    try {
        const response = yield call(apiLogout, payload);
        if (response?.data?.status) {
            yield put(actions.updateAuth({}));
            localStorage.removeItem(PREVIOUS_STORAGE_KEY);
            setTimeout(() => {
                localStorage.setItem(_FORCE_REFRESH_KEY, 'true');
            }, 1500);
        } else {
            yield put(actions.Error(response.data.error));
        }
    } catch (err) {
        console.log(err);
    }
}

const ParseUserData = (data) => {
    return {
        lastLoggedIn: data.lastLoggedIn,
        mobilePhone: data.mobilePhone,
        email: data.email,
        id: data.userId,
        isActive: data.isActive,
        avatar: data.avatar,
        userName: data.username,
        firstName: data.firstName,
        lastName: data.lastName,
        fullName: data.fullName,
        role: data.role,
        conversionRate: data.conversionRate,
        balance: data.balance,
    };
};

export function* getUserInfo({payload}) {
    try {
        const response = yield call(apiGetUserInfo, payload);
        if (response?.data?.status) {
            yield put(
                actions.updateUserInfo({
                    user: ParseUserData(response.data.data),
                })
            );
        } else {
            yield put(actions.Error(response.data.error));
        }
    } catch (err) {
        console.log(err);
    }
}

export function* doRefreshToken({payload}) {
    try {
        const response = yield call(apiRefreshToken, payload);
        if (response?.data?.status) {
            yield put(
                actions.updateAuth({
                    accessToken: response.data.data.token,
                    refreshToken: response.data.data.refreshToken,
                })
            );
        } else {
            yield put(actions.Error(response.data.error));
        }
    } catch (err) {
        console.log(err);
    }
}

export function* doRegisterDeviceToken({payload}) {
    try {
        const response = yield call(apiRegisterDeviceToken, payload);
        if (response.data && response.data.status) {
            yield put(actions.updateRegisterDeviceToken(payload));
        }
    } catch (err) {
        console.log(err);
    }
}

//
// export function* getCountUnreadRoom({ payload }) {
//   try {
//     const response = yield call(apiGetCountUnreadRoom, payload);
//     if (response.data && response.data.status) {
//       yield put(actions.updateCountUnreadRoom({
//         menuGUID: payload.menuGUID,
//         roomId: response.data?.data?.roomId,
//         countUnread: response.data?.data?.countUnread,
//         userId: response.data?.data?.userId,
//         roleId: response.data?.data?.roleId
//       }));
//     } else {
//       yield put(actions.Error(response.data.error));
//     }
//   } catch (err) {
//     console.log(err);
//   }
// }
//
