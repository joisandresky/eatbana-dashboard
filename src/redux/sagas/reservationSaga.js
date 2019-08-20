import { put, call, takeLatest } from "redux-saga/effects";
import { RESERVATION_LOADING, RESERVATION_ERROR, RESERVATION_FETCHED, GET_RESERVATION, RESERVATION_ERR_UPDATE, RESERVATION_UPDATED, RESERVATION_UPDATING } from "../reducers/reservationReducer";
import { getReservationService, updateStatusReservation } from "../services/reservationService";

function* getReservations(payload) {
  yield put({ type: RESERVATION_LOADING, onLoading: true });
  try {
    const response = yield call(getReservationService, payload.query.page, payload.query.limit, payload.query.id);
    if (response && response.data) {
      yield put({ type: RESERVATION_FETCHED, reservations: response.data });
      payload.onSuccess(response.data);
    } else {
      yield put({ type: RESERVATION_ERROR, error: response.data });
      payload.onError(response.data);
    }
    yield put({ type: RESERVATION_LOADING, onLoading: false });
  } catch (err) {
    payload.onError(err);
    yield put({ type: RESERVATION_LOADING, onLoading: false });
    yield put({ type: RESERVATION_ERROR, error: err });
  }
}

function* updateReservationStatus(payload) {
  yield put({ type: RESERVATION_LOADING, onLoading: true });
  try {
    const response = yield call(updateStatusReservation, payload.id, payload.body);
    if (response && response.data._id) {
      yield put({ type: RESERVATION_UPDATED, reservation: response.data });
      payload.onSuccess(response.data);
    } else {
      yield put({ type: RESERVATION_ERR_UPDATE, error: response.data });
      payload.onError(response.data);
    }
    yield put({ type: RESERVATION_LOADING, onLoading: false });
  } catch (err) {
    payload.onError(err);
    yield put({ type: RESERVATION_LOADING, onLoading: false });
    yield put({ type: RESERVATION_ERR_UPDATE, error: err });
  }
}

export function* watcherGetReservations() {
  yield takeLatest(GET_RESERVATION, getReservations);
}

export function* watcherUpdateReservationStatus() {
  yield takeLatest(RESERVATION_UPDATING, updateReservationStatus);
}