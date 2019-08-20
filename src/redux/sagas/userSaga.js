import { put, call, takeLatest, debounce } from "redux-saga/effects";
import { USER_LOADING, LOGIN_ERROR, LOGIN_SUCCESS, START_LOGIN, START_LOGOUT, LOGOUT_SUCCESS, SET_UP_RESTAURANT_DATA, SUCCESS_SETUP, SET_RESTAURANT_INFO, DONE_RESTAURANT_INFO, REGISTER_ERROR, REGISTER_SUCCESS, START_REGISTER, LOADING_UPLOAD, UPLOAD_ERROR, UPLOAD_SUCCESS, START_UPLOAD } from "../reducers/userReducer";
import { postLogin, postRegister, postImage } from "../services/userService";

function* doLogin(payload) {
  yield put({ type: USER_LOADING, isLoading: true });
  try {
    const response = yield call(postLogin, payload.user);
    yield put({ type: USER_LOADING, isLoading: false });
    if (response && response.data && response.data.token) {
      payload.onSuccess(response.data);
      yield put({ type: LOGIN_SUCCESS, user: response.data.user, token: response.data.token });
    } else {
      payload.onError(response.data);
      yield put({ type: LOGIN_ERROR, error: response.data });
    }
  } catch (err) {
    payload.onError(err);
    yield put({ type: USER_LOADING, isLoading: false });
    yield put({ type: LOGIN_ERROR, error: err })
  }
}

function* doRegister(payload) {
  console.log(payload);
  yield put({ type: USER_LOADING, isLoading: true });
  try {
    const response = yield call(postRegister, payload.data);
    yield put({ type: USER_LOADING, isLoading: false });
    if (response && response.data && response.data._id) {
      payload.onSuccess(response.data);
      yield put({ type: REGISTER_SUCCESS });
    } else {
      payload.onError(response.data);
      yield put({ type: REGISTER_ERROR });
    }
  } catch (err) {
    payload.onError(err);
    yield put({ type: USER_LOADING, isLoading: false });
    yield put({ type: REGISTER_ERROR, error: err });
  }
}

function* doImageUpload(payload) {
  yield put({ type: LOADING_UPLOAD, isLoading: true });
  try {
    const response = yield call(postImage, payload.body);
    yield put({ type: LOADING_UPLOAD, isLoading: false });
    payload.onSuccess(response.data);
    yield put({ type: UPLOAD_SUCCESS, image: response.data });
  } catch (err) {
    payload.onError(err);
    yield put({ type: LOADING_UPLOAD, isLoading: false });
    yield put({ type: UPLOAD_ERROR, error_upload: err });
  }
}

export function* watcherLogin() {
  yield takeLatest(START_LOGIN, doLogin);
}

export function* watcherLogout() {
  yield takeLatest(START_LOGOUT, function* (payload) {
    yield localStorage.removeItem('token_id');
    yield localStorage.removeItem('userData');
    payload.onSuccess(true);
    yield put({ type: LOGOUT_SUCCESS });
  });
}

export function* watcherSetupRestaurant() {
  yield takeLatest(SET_UP_RESTAURANT_DATA, function* (payload) {
    yield put({ type: SUCCESS_SETUP, data: payload.data });
  });
}

export function* watcherSetRestaurantInfo() {
  yield debounce(99, SET_RESTAURANT_INFO, function* (payload) {
    yield put({ type: DONE_RESTAURANT_INFO, info: payload.info });
  });
}

export function* watcherDoRegister() {
  yield takeLatest(START_REGISTER, doRegister);
}

export function* watcherDoImageUpload() {
  yield takeLatest(START_UPLOAD, doImageUpload);
}