import axios from "axios";

const apiUrl = "http://localhost:3001";

const axiosInstance = axios.create({
  baseURL: apiUrl,
  headers: { "Content-Type": "application/json" },
  responseType: "json",
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accesstoken");

    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    if (config.data instanceof FormData) {
      config.headers["Content-Type"] = "multipart/form-data";
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// api.interceptors.response.use(
//   (response) => {
//     return response.data;
//   },
//   (error) => {
//     return Promise.reject(error);
//   },
// );

export default axiosInstance;
