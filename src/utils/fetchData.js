import axios from 'axios';

export const postDataApi = (uri, data, token) => {
    const res = axios.post(`/api/${uri}`, data, {
        headers: { Authorization: token }
    });

    return res;
};

export const getDataApi = (uri, token) => {
    const res = axios.get(`/api/${uri}`, {
        headers: { Authorization: token }
    });

    return res;
};
