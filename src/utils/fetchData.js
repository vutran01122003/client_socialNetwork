import instance from '../config/axiosConfig';

export const postDataApi = (uri, data) => {
    const res = instance.post(`/api${uri}`, data);
    return res;
};

export const getDataApi = (uri, data = null) => {
    const res = instance.get(`/api${uri}`, {
        params: data
    });
    return res;
};

export const patchDataApi = (uri, data) => {
    const res = instance.patch(`/api${uri}`, data);
    return res;
};

export const deleteDataApi = (uri, data) => {
    const res = instance.delete(`/api${uri}`, { data: { data } });
    return res;
};
