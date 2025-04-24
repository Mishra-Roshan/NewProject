import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:8000/', // Django backend
});

export const registerOrg = (data) => API.post('org/auth/register/', data);
export const registerUser = (data) => API.post('user/user-register/', data);
export const loginUser = (data) => API.post('user/user-login/', data);
