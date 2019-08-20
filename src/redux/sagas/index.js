import { all } from "redux-saga/effects";
import { watcherLogin, watcherLogout, watcherSetRestaurantInfo, watcherDoRegister, watcherDoImageUpload } from "./userSaga";
import { watcherGetReservations, watcherUpdateReservationStatus } from "./reservationSaga";

export default function* rootSaga() {
  yield all([
    watcherLogin(),
    watcherLogout(),
    watcherSetRestaurantInfo(),
    watcherDoRegister(),
    watcherDoImageUpload(),
    watcherGetReservations(),
    watcherUpdateReservationStatus()
  ]);
}