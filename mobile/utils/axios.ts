import useAuth from "@/hooks/useAuth";
import axios from "axios";

export const checkAuthAndRedirect = async () => {
  try {
    const { status, data } = await _API_INSTANCE.get("/users/check", {
      withCredentials: true,
    });

    if (status === 200 && typeof data.is_admin === "boolean") {
      const { data } = await _API_INSTANCE.get("/users/", {
        withCredentials: true,
      });

      useAuth.setState((state) => {
        state.user = data;
      });

      return true;
    }

    console.warn("Unexpected response format", data);
    return null;
  } catch (err: any) {
    return err?.response?.status === 401 ? null : null;
  }
};

const _API_INSTANCE = axios.create({
  baseURL: "https://quickease-server.onrender.com/api/",
  timeout: 8 * 60 * 1000,
  withCredentials: true,
});

export default _API_INSTANCE;
