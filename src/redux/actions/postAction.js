import { uploadImage } from '../../utils/uploadImage';
import { GLOBALTYPES } from './globalTypes';
import {
    deleteDataApi,
    getDataApi,
    patchDataApi,
    postDataApi
} from '../../utils/fetchData';

export const createPost =
    ({ user, content, images }) =>
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
                `/posts?page=${nextPage}&currentPostCount=${currentPostCount}`
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
                payload: res.data
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

export const likePost = (postId, user) => async (dispatch) => {
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
            dispatch({
                type: GLOBALTYPES.ALERT,
                payload: {
                    error: e.response?.data.msg
                }
            });
        });
};

export const unlikePost = (postId, user) => async (dispatch) => {
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
