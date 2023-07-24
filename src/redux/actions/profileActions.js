import { getDataApi, patchDataApi } from '../../utils/fetchData';
import { GLOBALTYPES } from './globalTypes';
import { uploadImage } from '../../utils/uploadImage';
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
    ({ auth, fileInput, userData }) =>
    async (dispatch) => {
        dispatch({
            type: GLOBALTYPES.ALERT,
            payload: {
                loading: true
            }
        });

        const imgAvatar = await uploadImage([fileInput]);
        userData.avatar = imgAvatar[0]?.url || userData.avatar;
        patchDataApi(`/user/${auth.user?._id}`, {
            ...userData
        })
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

export const follow =
    ({ userInfo, auth }) =>
    async (dispatch) => {
        dispatch({
            type: GLOBALTYPES.ALERT,
            payload: {
                loading: true
            }
        });

        const followingList = auth.user?.following;

        if (
            !followingList.find((user) => {
                return user._id === userInfo?._id;
            })
        ) {
            patchDataApi(`/user/${userInfo._id}/follow`, {
                authId: auth.user?._id
            })
                .then((res) => {
                    dispatch({
                        type: GLOBALTYPES.PROFILE.SET_USER,
                        payload: res.data.user
                    });

                    dispatch({
                        type: GLOBALTYPES.AUTH,
                        payload: { ...auth, user: res.data.authUser }
                    });

                    dispatch({
                        type: GLOBALTYPES.ALERT,
                        payload: {
                            success: 'success followed'
                        }
                    });
                })
                .catch((e) => {
                    dispatch({
                        type: GLOBALTYPES.ALERT,
                        payload: {
                            error: e.response?.data.msg || 'Error'
                        }
                    });
                });
        }
    };

export const unFollow =
    ({ userInfo, auth }) =>
    async (dispatch) => {
        const followingList = auth.user?.following;
        if (
            followingList.find((user) => {
                return user._id === userInfo?._id;
            })
        ) {
            patchDataApi(`/user/${userInfo._id}/unfollow`, {
                authId: auth.user?._id
            })
                .then((res) => {
                    dispatch({
                        type: GLOBALTYPES.PROFILE.SET_USER,
                        payload: res.data.user
                    });

                    dispatch({
                        type: GLOBALTYPES.AUTH,
                        payload: { ...auth, user: res.data.authUser }
                    });

                    dispatch({
                        type: GLOBALTYPES.ALERT,
                        payload: {
                            success: 'success unfollow'
                        }
                    });
                })
                .catch((e) => {
                    dispatch({
                        type: GLOBALTYPES.ALERT,
                        payload: {
                            error: e.response?.data.msg || 'Error'
                        }
                    });
                });
        }
    };
