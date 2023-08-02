import axios from 'axios';
import { getDataApi } from '../utils/fetchData';

const instance = axios.create({
    baseURL: process.env.REACT_APP_API_URI,
    headers: { 'Content-Type': 'application/json' },
    withCredentials: true
});

instance.interceptors.response.use(
    async (response) => {
        const config = response.config;
        if (response.data.code === 401) {
            const {
                token: { accessToken }
            } = (await getDataApi('/refresh_token')).data;
            config.headers['X-Token'] = accessToken;
            return instance(config);
        }
        return response;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default instance;
