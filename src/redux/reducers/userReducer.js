export const USER_LOADING = "USER_LOADING";
export const START_LOGIN = "START_LOGIN";
export const LOGIN_SUCCESS = "LOGIN_SUCCESS";
export const LOGIN_ERROR = "LOGIN_ERROR";
export const START_LOGOUT = "START_LOGOUT";
export const LOGOUT_SUCCESS = "LOGOUT_SUCCESS";
export const SET_UP_RESTAURANT_DATA = "SET_UP_RESTAURANT_DATA";
export const SUCCESS_SETUP = "SUCCESS_SETUP";
export const SET_RESTAURANT_INFO = "SET_RESTAURANT_INFO";
export const DONE_RESTAURANT_INFO = "DONE_RESTAURANT_INFO";
export const REGISTER_ERROR = "REGISTER_ERROR";
export const REGISTER_SUCCESS = "REGISTER_SUCCESS";
export const START_REGISTER = "START_REGISTER";
export const START_UPLOAD = "START_UPLOAD";
export const LOADING_UPLOAD = "LOADING_UPLOAD";
export const UPLOAD_SUCCESS = "UPLOAD_SUCCESS";
export const UPLOAD_ERROR = "UPLOAD_ERROR";

const initialState = {
  isLoading: false,
  loading_image: false,
  user: null,
  token: null,
  error: null,
  error_upload: null,
  users: [],
  image: null,
  restaurant: {
    name: '',
    cuisines: '',
    establishment: '',
    phone: '',
    address: '',
    coordinates: [],
    menuImage: null,
    facilities: [],
    openingHours: []
  }
};

export const doLogin = (user, onSuccess, onError) => {
  return {
    type: START_LOGIN,
    user,
    onSuccess,
    onError
  };
};

export const doLogout = (onSuccess) => {
  return {
    type: START_LOGOUT,
    onSuccess
  }
};

export const setRestaurantRegister = (data) => {
  return {
    type: SET_UP_RESTAURANT_DATA,
    data
  }
}

export const doRegister = (data, onSuccess, onError) => {
  return {
    type: START_REGISTER,
    data,
    onSuccess,
    onError
  }
}

export const setRestaurantInfo = (info) => {
  return {
    type: SET_RESTAURANT_INFO,
    info
  };
}

export const doImageUpload = (body, onSuccess, onError) => {
  return {
    type: START_UPLOAD,
    body,
    onSuccess,
    onError
  }
}

export const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case USER_LOADING:
      return { ...state, isLoading: action.isLoading };
    case LOADING_UPLOAD:
      return { ...state, loading_image: action.isLoading };
    case LOGIN_SUCCESS:
      return { ...state, user: action.user, token: action.token, error: null };
    case LOGIN_ERROR:
      return { ...state, error: action.error, user: null, token: null };
    case LOGOUT_SUCCESS:
      return { ...state, error: null, isLoading: false, user: null, token: null }
    case SUCCESS_SETUP:
      return { ...state, restaurant: { ...action.data } };
    case DONE_RESTAURANT_INFO:
      return { ...state, restaurant: { ...action.info } };
    case UPLOAD_ERROR:
      return { ...state, error_upload: action.error, image: null };
    case UPLOAD_SUCCESS:
      return { ...state, image: action.image };
    default:
      return state;
  }
}