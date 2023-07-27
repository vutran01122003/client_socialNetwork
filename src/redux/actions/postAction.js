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
            postDataApi(`/post/${user._id}`, {
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

export const getPost =
    ({ id }) =>
    async (dispatch) => {
        try {
            dispatch({
                type: GLOBALTYPES.POST.LOADING_POST,
                payload: {
                    loading: true
                }
            });

            const res = await getDataApi(`/post/${id}`);

            dispatch({
                type: GLOBALTYPES.POST.GET_POST,
                payload: res.data
            });

            dispatch({
                type: GLOBALTYPES.POST.LOADING_POST,
                payload: {
                    loading: false
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
                    payload: res.data.user
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
                type: GLOBALTYPES.POST.LIKE_POST,
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
                type: GLOBALTYPES.POST.UNLIKE_POST,
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

export const createComment =
    ({ postId, user, content }) =>
    async (dispatch) => {
        dispatch({
            type: GLOBALTYPES.ALERT,
            payload: {
                loading: true
            }
        });
        postDataApi('/comment', {
            commentData: {
                postId,
                user,
                content
            }
        })
            .then((res) => {
                dispatch({
                    type: GLOBALTYPES.POST.CREATE_COMMENT,
                    payload: res.data.newPost
                });
                dispatch({
                    type: GLOBALTYPES.ALERT,
                    payload: {
                        success: res.data.status
                    }
                });
            })
            .catch((error) => {
                dispatch({
                    type: GLOBALTYPES.ALERT,
                    payload: {
                        error: error.response?.data.msg || 'Error'
                    }
                });
            });
    };

export const deleteComment =
    ({ postId, commentId }) =>
    async (dispatch) => {
        dispatch({
            type: GLOBALTYPES.ALERT,
            payload: {
                loading: true
            }
        });

        deleteDataApi('/comment', {
            data: { postId, commentId }
        })
            .then((res) => {
                dispatch({
                    type: GLOBALTYPES.POST.DELETE_COMMENT,
                    payload: res.data.newPost
                });
                dispatch({
                    type: GLOBALTYPES.ALERT,
                    payload: {
                        success: res.data.status
                    }
                });
            })
            .catch((error) => {
                dispatch({
                    type: GLOBALTYPES.ALERT,
                    payload: {
                        error: error.response?.data.msg || 'Error'
                    }
                });
            });
    };

export const updateComment =
    ({ postId, commentId, content }) =>
    async (dispatch) => {
        dispatch({
            type: GLOBALTYPES.ALERT,
            payload: {
                loading: true
            }
        });
        patchDataApi('/comment', {
            commentData: {
                postId,
                commentId,
                content
            }
        })
            .then((res) => {
                dispatch({
                    type: GLOBALTYPES.POST.UPDATE_COMMENT,
                    payload: res.data.newPost
                });
                dispatch({
                    type: GLOBALTYPES.ALERT,
                    payload: {
                        success: res.data.status
                    }
                });
            })
            .catch((error) => {
                dispatch({
                    type: GLOBALTYPES.ALERT,
                    payload: {
                        error: error.response?.data.msg || 'Error'
                    }
                });
            });
    };

export const likeComment =
    ({ postId, commentId, userId }) =>
    async (dispatch) => {
        dispatch({
            type: GLOBALTYPES.ALERT,
            payload: {
                loading: true
            }
        });

        patchDataApi(`/comment/${commentId}/like`, {
            data: {
                postId,
                userId
            }
        })
            .then((res) => {
                dispatch({
                    type: GLOBALTYPES.POST.LIKE_COMMENT,
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

export const unlikeComment =
    ({ postId, commentId, userId }) =>
    async (dispatch) => {
        dispatch({
            type: GLOBALTYPES.ALERT,
            payload: {
                loading: true
            }
        });

        patchDataApi(`/comment/${commentId}/unlike`, {
            data: {
                postId,
                userId
            }
        })
            .then((res) => {
                dispatch({
                    type: GLOBALTYPES.POST.UNLIKE_COMMENT,
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
