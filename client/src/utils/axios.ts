import axios from "axios";

const _API_INSTANCE = axios.create({
  baseURL: "http://localhost:3000/api",
  timeout: 8 * 60 * 1000,
  withCredentials: true,
});

export default _API_INSTANCE;
