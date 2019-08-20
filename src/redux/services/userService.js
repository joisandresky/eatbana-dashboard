import axios from "axios";

export function postLogin(user) {
  return axios.post("https://eatbana.herokuapp.com/api/users/login", user);
}

export function postRegister(restaurant) {
  return axios.post("https://eatbana.herokuapp.com/api/restaurants", restaurant);
}

export function postImage(body) {
  return axios({
    // url: "https://eatbana.herokuapp.com/api/restaurants/upload",
    url: "https://api.cloudinary.com/v1_1/jois7/image/upload",
    method: 'POST',
    data: body,
    headers: { 'Content-Type': 'multipart/form-data' }
  })
}