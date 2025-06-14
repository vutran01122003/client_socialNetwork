import { getDataApi, patchDataApi } from '../../utils/fetchData';
import { GLOBALTYPES } from './globalTypes';
import { uploadFile } from '../../utils/uploadFile';
import { createNotification } from './notifyAction';

export const getUser =
    ({ id }) =>
    async (dispatch) => {
        try {
            dispatch({
                type: GLOBALTYPES.ALERT,
                payload: {
                    loading: true
                }
            });

            const res = await getDataApi(`/user/${id}`);
            dispatch({
                type: GLOBALTYPES.PROFILE.GET_USER,
                payload: res.data.user
            });

            dispatch({
                type: GLOBALTYPES.ALERT,
                payload: {
                    loading: false
                }
            });
        } catch (error) {
            dispatch({
                type: GLOBALTYPES.ALERT,
                payload: { error: error.response?.data.msg || 'Not Found' }
            });
        }
    };

export const getUserPosts =
    ({ id, page = 1 }) =>
    async (dispatch) => {
        try {
            dispatch({
                type: GLOBALTYPES.PROFILE.LOADING,
                payload: true
            });

            const res = await getDataApi(`/posts/${id}?page=${page}`);

            dispatch({
                type: GLOBALTYPES.PROFILE.GET_USER_POST,
                payload: {
                    userId: id,
                    posts: res.data.posts,
                    page,
                    maxPage: res.data.posts.length === 0 ? true : false
                }
            });

            dispatch({
                type: GLOBALTYPES.PROFILE.LOADING,
                payload: false
            });
        } catch (error) {
            dispatch({
                type: GLOBALTYPES.PROFILE.LOADING,
                payload: false
            });

            dispatch({
                type: GLOBALTYPES.ALERT,
                payload: {
                    error: error.response?.data.msg
                }
            });
        }
    };

export const getUserSavedPosts =
    ({ id, page }) =>
    async (dispatch) => {
        try {
            dispatch({
                type: GLOBALTYPES.PROFILE.LOADING,
                payload: true
            });

            const res = await getDataApi(`/posts/${id}/saved?page=${page}`);

            dispatch({
                type: GLOBALTYPES.PROFILE.GET_USER_SAVED_POSTS,
                payload: {
                    savedPosts: res.data.savedPosts,
                    page,
                    maxPage: res.data.savedPosts.length === 0 ? true : false
                }
            });

            dispatch({
                type: GLOBALTYPES.PROFILE.LOADING,
                payload: false
            });
        } catch (error) {
            dispatch({
                type: GLOBALTYPES.ALERT,
                payload: {
                    error: error.response?.data.msg || 'Error'
                }
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

        if (fileInput) {
            const imgAvatar = await uploadFile([fileInput]);
            userData.avatar = imgAvatar[0]?.url;
        }
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
    ({ userInfo, auth, socket }) =>
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
                    socket.emit('follow_user', res.data.user);
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
                            success: 'Follow successful'
                        }
                    });

                    dispatch(
                        createNotification({
                            authId: auth?.user._id,
                            socket,
                            notifyData: {
                                avatar: auth?.user.avatar,
                                url: `/profile/${auth?.user._id}`,
                                receiver: [userInfo._id],
                                type: 'notification_followedUser',
                                title: `${auth?.user.username} followed you`
                            }
                        })
                    );
                })
                .catch((e) => {
                    console.log(e);
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
    ({ userInfo, auth, socket }) =>
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
                    socket.emit('unfollow_user', res.data.user);
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
                            success: 'Unfollow successful'
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
