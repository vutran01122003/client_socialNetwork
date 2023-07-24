import axios from 'axios';

export const postDataApi = (uri, data, token) => {
    const res = axios.post(`/api${uri}`, data, {
        headers: { Authorization: token }
    });
    return res;
};

export const getDataApi = (uri) => {
    const res = axios.get(`/api${uri}`);
    return res;
};

export const patchDataApi = (uri, data) => {
    const res = axios.patch(`/api${uri}`, data);
    return res;
};

export const deleteDataApi = (uri, data) => {
    const res = axios.delete(`/api${uri}`, data);
    return res;
};
