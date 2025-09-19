import useAuth from "@/hooks/useAuth";
import axios from "axios";

/**
 * Checks the user's authentication status and redirects if necessary.
 *
 * Sends a request to verify if the user is authenticated and an admin.
 * If authenticated, fetches the user data and updates the auth state.
 * Returns `true` if the user is authenticated and data is updated,
 * otherwise returns `null`.
 *
 * @returns {Promise<true | null>} Resolves to `true` if authenticated, otherwise `null`.
 */
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

/**
 * Axios instance configured for QuickEase API requests.
 *
 * @remarks
 * - `baseURL` is set to the QuickEase API endpoint.
 * - `timeout` is set to 8 minutes (480,000 ms).
 * - `withCredentials` is enabled to allow sending cookies with requests.
 *
 * @see {@link https://axios-http.com/docs/instance}
 */
const _API_INSTANCE = axios.create({
  baseURL: "https://quickease-2-0.onrender.com/api/",
  timeout: 8 * 60 * 1000,
  withCredentials: true,
});

export default _API_INSTANCE;
