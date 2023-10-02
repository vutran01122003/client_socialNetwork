import { GLOBALTYPES } from './globalTypes';
import { deleteDataApi, patchDataApi, postDataApi } from '../../utils/fetchData';
import { createNotification } from './notifyAction';

export const createComment =
    ({ post, user, content, originCommentId, socket }) =>
    async (dispatch) => {
        dispatch({
            type: GLOBALTYPES.ALERT,
            payload: {
                loading: true
            }
        });
        postDataApi('/comment', {
            commentData: {
                postId: post._id,
                originCommentId,
                user,
                content
            }
        })
            .then((res) => {
                socket.emit('comment', res.data.newPost);
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
                if (post.user._id !== user._id) {
                    dispatch(
                        createNotification({
                            authId: user._id,
                            socket,
                            notifyData: {
                                postId: post._id,
                                postOwnerId: post.user._id,
                                avatar: user.avatar,
                                url: `/post/${post._id}`,
                                receiver: [post.user._id],
                                type: 'notification_commentedPost',
                                content,
                                file: post.files[0]?.url,
                                title: `${user.username} commented on your post:`
                            }
                        })
                    );
                }
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
    ({ postId, commentId, socket }) =>
    async (dispatch) => {
        dispatch({
            type: GLOBALTYPES.ALERT,
            payload: {
                loading: true
            }
        });

        deleteDataApi('/comment', {
            commentData: { postId, commentId }
        })
            .then((res) => {
                socket.emit('delete_comment', res.data.newPost);
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
