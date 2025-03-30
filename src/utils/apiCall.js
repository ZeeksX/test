import axios from "axios";
import { SERVER_URL } from "./constants";
import { logoutAndRedirect } from "./authHelper";

const apiCall = axios.create({
  baseURL: SERVER_URL,
  timeout: 60000,
});

apiCall.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiCall.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      logoutAndRedirect();
    }
    return Promise.reject(error);
  }
);

export default apiCall;
