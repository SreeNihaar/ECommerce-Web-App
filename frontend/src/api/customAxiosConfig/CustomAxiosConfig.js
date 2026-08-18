import axios from "axios";
import AuthenticationService from "../authentication/AuthenticationService";
const config = import.meta.env;

const axiosInstance = axios.create({
    baseURL: config.VITE_BACKEND_API
});

axiosInstance.interceptors.response.use(
    (response) => response,

    (error) => {
        const status = error.response?.status;
        const path = error.config?.url;

        console.error(`HTTP ${status || 'error'}: ${path}`, error.response?.data || error.message);

        const isAuthEndpoint = path?.includes('/auth/login') || path?.includes('/auth/signup');

        if (!isAuthEndpoint) {
            switch (status) {
                case 401:
                    // Handle authentication
                    console.warn('Unauthorized access - redirecting to login');
                    window.location.href = "/login";
                    break;

                case 403:
                    console.warn('Forbidden access:', path);
                    window.location.href = "/error/403";
                    break;

                case 404:
                    console.warn('Resource not found:', path);
                    window.location.href = "/error/404";
                    break;

                case 500:
                    console.error('Server error (500):', path);
                    window.location.href = "/error/500";
                    break;

                case 503:
                    console.error('Service unavailable (503):', path);
                    window.location.href = "/error/503";
                    break;

                default:
                    break;
            }
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;