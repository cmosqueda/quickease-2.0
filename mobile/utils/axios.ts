import axios from "axios";

const _API_INSTANCE = axios.create({
  baseURL: process.env.EXPO_PUBLIC_SERVER_API_URL,
  timeout: 8 * 60 * 1000,
  withCredentials: true,
});

export default _API_INSTANCE;
