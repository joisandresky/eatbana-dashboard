import axios from "axios";

export function getReservationService(page, limit, restaurant) {
  return axios.get(`https://eatbana.herokuapp.com/api/reservations?page=${page}&limit=${limit}&id=${restaurant}`);
}

export function updateStatusReservation(id, body) {
  return axios.put(`https://eatbana.herokuapp.com/api/reservations/status/${id}`, body);
}