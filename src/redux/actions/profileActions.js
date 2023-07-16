import { getDataApi, patchDataApi } from '../../utils/fetchData';
import { readFileAsDataURL } from '../../utils/readFile';
import { GLOBALTYPES } from './globalTypes';

export const getUser =
    ({ users, id }) =>
    async (dispatch) => {
        try {
            if (users.every((user) => user._id !== id)) {
                dispatch({
                    type: GLOBALTYPES.PROFILE.LOADING,
                    payload: true
                });

                const res = await getDataApi(`/user/${id}`);

                dispatch({
                    type: GLOBALTYPES.PROFILE.GET_USER,
                    payload: res.data.user
                });

                dispatch({
                    type: GLOBALTYPES.PROFILE.LOADING,
                    payload: false
                });
            }
        } catch (error) {
            dispatch({
                type: GLOBALTYPES.ALERT,
                payload: { error: error.response?.data.msg || 'Not Found' }
            });
        }
    };

export const updateUser =
    ({ auth, fileInput, formData, userData }) =>
    async (dispatch) => {
        dispatch({
            type: GLOBALTYPES.ALERT,
            payload: {
                loading: true
            }
        });

        // const fileData = await readFileAsDataURL(fileInput);
        if (fileInput) formData.set('cover', fileInput);

        Object.keys(userData).forEach((key) => {
            formData.set(key, userData[key]);
        });

        patchDataApi(`/user/${auth.user._id}`, formData)
            .then((res) => {
                dispatch({
                    type: GLOBALTYPES.AUTH,
                    payload: {
                        ...auth,
                        user: {
                            ...auth.user,
                            ...userData
                        }
                    }
                });
                dispatch({
                    type: GLOBALTYPES.ALERT,
                    payload: {
                        success: res.data.status
                    }
                });
                dispatch({
                    type: GLOBALTYPES.AUTH,
                    payload: {
                        ...auth,
                        user: {
                            ...auth.user,
                            ...userData,
                            avatar: res.data.user.avatar
                        }
                    }
                });
                // setTimeout(() => {
                //     window.location.reload();
                // }, 2000);
            })
            .catch((e) => {
                dispatch({
                    type: GLOBALTYPES.ALERT,
                    payload: {
                        error: e.response?.data.msg || 'Error'
                    }
                });
            });
    };
