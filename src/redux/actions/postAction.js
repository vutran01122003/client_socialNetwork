import { uploadImage } from '../../utils/uploadImage';
import { GLOBALTYPES } from './globalTypes';
import {
    deleteDataApi,
    getDataApi,
    patchDataApi,
    postDataApi
} from '../../utils/fetchData';
import { createNotification } from './notifyAction';

export const createPost =
    ({ user, content, images, socket }) =>
    async (dispatch) => {
        if (!content) {
            dispatch({
                type: GLOBALTYPES.ALERT,
                payload: {
                    error: 'empty content'
                }
            });
        } else {
            dispatch({
                type: GLOBALTYPES.ALERT,
                payload: {
                    loading: true
                }
            });

            let imgUrlArr = [];
            if (images.length > 0) {
                imgUrlArr = await uploadImage(images);
            }
            postDataApi(`/post`, {
                postData: {
                    user,
                    content,
                    images: imgUrlArr
                }
            })
                .then((res) => {
                    dispatch({
                        type: GLOBALTYPES.POST.CREATE_POST,
                        payload: res.data.postData
                    });

                    dispatch({
                        type: GLOBALTYPES.PROFILE.RESET_USER_POSTS,
                        payload: {
                            userId: user._id
                        }
                    });

                    dispatch({
                        type: GLOBALTYPES.ALERT,
                        payload: {
                            success: res.data.status
                        }
                    });

                    dispatch(
                        createNotification({
                            authId: user._id,
                            socket,
                            notifyData: {
                                id: res.data.postData._id,
                                user: res.data.postData.user._id,
                                avatar: res.data.postData.user.avatar,
                                url: `/post/${res.data.postData._id}`,
                                receiver: res.data.postData.user.followers,
                                type: 'notification_createdPost',
                                content: res.data.postData.content,
                                image: res.data.postData.images[0]?.url,
                                title: `${res.data.postData.user.username} posted:`
                            }
                        })
                    );
                })
                .catch((err) => {
                    console.log(err);
                    dispatch({
                        type: GLOBALTYPES.ALERT,
                        payload: {
                            error: err.response?.data.msg || 'Error'
                        }
                    });
                });
        }
    };

export const getPosts =
    ({ nextPage, currentPostCount }) =>
    async (dispatch) => {
        try {
            dispatch({
                type: GLOBALTYPES.POST.LOADING_POST,
                payload: {
                    loading: true
                }
            });

            const res = await getDataApi(
                `/posts?page=${nextPage}&currentQuantity=${currentPostCount}`
            );

            dispatch({
                type: GLOBALTYPES.POST.GET_POSTS,
                payload: {
                    posts: res.data.posts,
                    page: nextPage,
                    maxPage: res.data.result === 0 ? true : false
                }
            });

            dispatch({
                type: GLOBALTYPES.POST.LOADING_POST,
                payload: {
                    loading: false
                }
            });
        } catch (error) {
            dispatch({
                type: GLOBALTYPES.POST.LOADING_POST,
                payload: {
                    loading: false
                }
            });
            dispatch({
                type: GLOBALTYPES.ALERT,
                payload: {
                    error: error.response?.data.msg
                }
            });
        }
    };

export const getNewPosts =
    ({ userId }) =>
    async (dispatch) => {
        try {
            const res = await getDataApi(`/posts/${userId}`);
            dispatch({
                type: GLOBALTYPES.POST.GET_NEW_POSTS,
                payload: {
                    posts: res.data.posts,
                    userId
                }
            });
        } catch (error) {
            dispatch({
                type: GLOBALTYPES.ALERT,
                payload: {
                    error: error.response?.data.msg
                }
            });
        }
    };

export const updatePost =
    ({ postId, content, images, currentPost }) =>
    async (dispatch) => {
        if (!content) {
            dispatch({
                type: GLOBALTYPES.ALERT,
                payload: {
                    error: 'empty content'
                }
            });
        } else {
            if (
                currentPost.content === content &&
                JSON.stringify(currentPost.images) === JSON.stringify(images)
            ) {
                dispatch({
                    type: GLOBALTYPES.ALERT,
                    payload: {
                        success: 'nothing updated'
                    }
                });
                return;
            }

            dispatch({
                type: GLOBALTYPES.ALERT,
                payload: {
                    loading: true
                }
            });

            let imgUrlArr = [];
            if (images.length > 0) {
                imgUrlArr = await uploadImage(images);
            }

            patchDataApi(`/post`, {
                data: {
                    postId,
                    updatedData: {
                        content,
                        images: imgUrlArr
                    }
                }
            })
                .then((res) => {
                    dispatch({
                        type: GLOBALTYPES.POST.UPDATE_POST,
                        payload: res.data.postData
                    });

                    dispatch({
                        type: GLOBALTYPES.ALERT,
                        payload: {
                            success: res.data.status
                        }
                    });
                })
                .catch((err) => {
                    dispatch({
                        type: GLOBALTYPES.ALERT,
                        payload: {
                            error: err.response?.data.msg || 'Error'
                        }
                    });
                });
        }
    };

export const deletePost =
    ({ postId }) =>
    async (dispatch) => {
        dispatch({
            type: GLOBALTYPES.ALERT,
            payload: {
                loading: true
            }
        });
        deleteDataApi(`/post/${postId}`)
            .then((res) => {
                dispatch({
                    type: GLOBALTYPES.POST.DELETE_POST,
                    payload: {
                        postId: res.data.postData._id
                    }
                });

                dispatch({
                    type: GLOBALTYPES.PROFILE.RESET_USER_POSTS,
                    payload: {
                        userId: res.data.postData.user
                    }
                });

                dispatch({
                    type: GLOBALTYPES.ALERT,
                    payload: {
                        success: res.data.status
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

export const likePost = (postId, user, socket) => async (dispatch) => {
    dispatch({
        type: GLOBALTYPES.ALERT,
        payload: {
            loading: true
        }
    });

    patchDataApi(`/post/${postId}/like`, {
        userData: user
    })
        .then((res) => {
            socket.emit('like_post', res.data.newPost);
            dispatch({
                type: GLOBALTYPES.POST.UPDATE_POST,
                payload: res.data.newPost
            });

            dispatch({
                type: GLOBALTYPES.ALERT,
                payload: {
                    success: res.data.status
                }
            });

            dispatch(
                createNotification({
                    authId: user._id,
                    socket,
                    notifyData: {
                        id: res.data.newPost._id,
                        user: res.data.newPost.user._id,
                        avatar: user.avatar,
                        url: `/post/${res.data.newPost._id}`,
                        type: 'notification_liked',
                        receiver: [res.data.newPost.user._id],
                        image: res.data.newPost.images[0]?.url,
                        title: `${
                            user._id === res.data.newPost.user._id
                                ? 'You'
                                : user.username
                        } liked your post`
                    }
                })
            );
        })
        .catch((e) => {
            console.log(e);

            dispatch({
                type: GLOBALTYPES.ALERT,
                payload: {
                    error: e.response?.data.msg
                }
            });
        });
};

export const unlikePost = (postId, user, socket) => async (dispatch) => {
    dispatch({
        type: GLOBALTYPES.ALERT,
        payload: {
            loading: true
        }
    });

    patchDataApi(`/post/${postId}/unlike`, {
        userData: user
    })
        .then((res) => {
            socket.emit('unlike_post', res.data.newPost);
            dispatch({
                type: GLOBALTYPES.POST.UPDATE_POST,
                payload: res.data.newPost
            });

            dispatch({
                type: GLOBALTYPES.ALERT,
                payload: {
                    success: res.data.status
                }
            });
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
};

export const getPost =
    ({ postId }) =>
    async (dispatch) => {
        dispatch({
            type: GLOBALTYPES.ALERT,
            payload: {
                loading: true
            }
        });
        getDataApi(`/post/${postId}`)
            .then((res) => {
                dispatch({
                    type: GLOBALTYPES.DETAILPOST.GET_DETAILPOST,
                    payload: res.data.post
                });
                dispatch({
                    type: GLOBALTYPES.ALERT,
                    payload: {
                        loading: false
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

export const savedPost =
    ({ auth, post, user, socket }) =>
    async (dispatch) => {
        try {
            const res = await patchDataApi(`/saved_post/${post._id}`);

            dispatch({
                type: GLOBALTYPES.AUTH,
                payload: {
                    ...auth,
                    user: res.data.user
                }
            });

            dispatch({
                type: GLOBALTYPES.ALERT,
                payload: {
                    success: res.data.status
                }
            });

            dispatch(
                createNotification({
                    authId: user._id,
                    socket,
                    notifyData: {
                        id: post._id,
                        user: user._id,
                        avatar: auth?.user.avatar,
                        url: `/post/${post._id}`,
                        receiver: [user._id],
                        type: 'notification_saved',
                        image: post.images[0]?.url || '',
                        title: `${
                            auth?.user._id === user._id
                                ? 'You'
                                : auth?.user.username
                        } saved your post`
                    }
                })
            );
        } catch (e) {
            console.log(e);
            dispatch({
                type: GLOBALTYPES.ALERT,
                payload: {
                    error: e.response?.data.msg || 'Error'
                }
            });
        }
    };

export const unSavedPost =
    ({ auth, post }) =>
    async (dispatch) => {
        try {
            const res = await patchDataApi(`/unsaved_post/${post._id}`);

            dispatch({
                type: GLOBALTYPES.AUTH,
                payload: {
                    ...auth,
                    user: res.data.user
                }
            });

            dispatch({
                type: GLOBALTYPES.ALERT,
                payload: {
                    success: res.data.status
                }
            });
        } catch (e) {
            dispatch({
                type: GLOBALTYPES.ALERT,
                payload: {
                    error: e.response?.data.msg || 'Error'
                }
            });
        }
    };
