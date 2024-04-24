import axs from "axios";
import { Auth } from "../contexts/auth";

const axios = axs.create({
  baseURL: "/api",
});

axios.interceptors.request.use((config) => {
  let token;
  try {
    token = localStorage.getItem(Auth.TOKEN_KEY) || "";
  } catch (e) {
    console.log(e);
  }
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default axios;
