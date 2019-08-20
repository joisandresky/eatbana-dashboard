export const RESERVATION_LOADING = "RESERVATION_LOADING";
export const GET_RESERVATION = "GET_RESERVATION";
export const RESERVATION_FETCHED = "RESERVATION_FETCHED";
export const RESERVATION_ERROR = "RESERVATION_ERROR";
export const RESERVATION_UPDATING = "RESERVATION_UPDATING";
export const RESERVATION_UPDATED = "RESERVATION_UPDATED";
export const RESERVATION_ERR_UPDATE = "RESERVATION_ERR_UPDATE";

const initialState = {
  reservations: [],
  error: null,
  onLoading: false,
  reservation: null
};

export const doGetReservation = (query, onSuccess, onError) => {
  return {
    type: GET_RESERVATION,
    query,
    onSuccess,
    onError
  }
}

export const doUpdateReservation = (id, body, onSuccess, onError) => {
  return {
    type: RESERVATION_UPDATING,
    id,
    body,
    onSuccess,
    onError
  }
}

export const reservationReducer = (state = initialState, action) => {
  switch (action.type) {
    case RESERVATION_LOADING:
      return { ...state, onLoading: action.onLoading };
    case RESERVATION_FETCHED:
      return { ...state, reservations: action.reservations, error: null };
    case RESERVATION_ERROR:
      return { ...state, error: action.error };
    case RESERVATION_UPDATED:
      return { ...state, reservation: action.reservation, error: null }
    case RESERVATION_ERR_UPDATE:
      return { ...state, error: action.error }
    default:
      return state;
  }
}