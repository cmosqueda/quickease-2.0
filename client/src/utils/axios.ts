import axios from "axios";

const _API_INSTANCE = axios.create({
  baseURL: import.meta.env.VITE_SERVER_API_URL,
  timeout: 8 * 60 * 1000,
  withCredentials: true,
});

export default _API_INSTANCE;
