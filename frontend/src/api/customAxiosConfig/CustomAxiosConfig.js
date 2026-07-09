import axios from "axios";

const config = import.meta.env;

const axiosInstance = axios.create({
    baseURL: config.VITE_BACKEND_URL
});

export default axiosInstance;