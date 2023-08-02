import instance from '../config/axiosConfig';

export const postDataApi = (uri, data) => {
    const res = instance.post(uri, data);
    return res;
};

export const getDataApi = (uri) => {
    const res = instance.get(uri);
    return res;
};

export const patchDataApi = (uri, data) => {
    const res = instance.patch(uri, data);
    return res;
};

export const deleteDataApi = (uri, data) => {
    const res = instance.delete(uri, data);
    return res;
};
