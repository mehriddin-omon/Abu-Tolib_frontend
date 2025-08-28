import axios from "axios";

export const request = axios.create({
    //Malumotlarni backenddan olish uchun baseurl >>>
    baseURL: import.meta.env.VITE_BASE_URL,
    timeout: 1000,
});

request.interceptors.response.use(
    (response) => {
        return response.data;
    },
    (error) => {
        if(error.response.status === 401) {
            // Handle token expiration
            localStorage.removeItem("token");
            window.location.href = "/login";
        }
        return Promise.reject(error);
    }
)