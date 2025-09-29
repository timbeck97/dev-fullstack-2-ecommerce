import axios, { AxiosInstance } from "axios";

const axiosApi: AxiosInstance = axios.create({
  baseURL: "http://localhost:5000",
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor de request para adicionar token
axiosApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);


axiosApi.interceptors.response.use(
  (response) => response, 
  (error) => {
    if (error.response && error.response.data) {
      console.log(error.response.data)
     alert(error.response.data.message || error.message);
    } else {
      console.error("Erro Axios:", error.message);
    }
    return Promise.reject(error);
  }
);

export default axiosApi;
