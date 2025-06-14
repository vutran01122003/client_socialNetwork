import axios from "axios";
import { getDataApi } from "../utils/fetchData";

const instance = axios.create({
    baseURL: process.env.REACT_APP_API_URI,
    headers: { "Content-Type": "application/json" },
    withCredentials: true
});

instance.interceptors.request.use(async (config) => {
    const accessToken = localStorage.getItem("accessToken");
    config.headers["WWW-Authenticate"] = accessToken;
    return config;
});

instance.interceptors.response.use(
    async (response) => {
        const config = response.config;
        if (response.data.code === 401) {
            const {
                token: { accessToken }
            } = (await getDataApi("/refresh_token")).data;
            config.headers["X-Token"] = accessToken;
            return instance(config);
        }
        return response;
    },
    (error) => {
        if (localStorage.getItem("logged") && error.response.data.status === 403) {
            window.location.reload();
        }
        return Promise.reject(error);
    }
);

export default instance;
