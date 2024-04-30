import { GLOBALTYPES } from './globalTypes';
import { deleteDataApi, getDataApi, patchDataApi, postDataApi } from '../../utils/fetchData';
import { createNotification } from './notifyAction';

export const getComments =
    ({ postId, commentQuantity }) =>
    async (dispatch) => {
        try {
            const res = await getDataApi(`/post/${postId}/comments`, {
                commentQuantity
            });
            dispatch({
                type: GLOBALTYPES.COMMENT.GET_COMMENTS,
                payload: {
                    commentsData: res.data.commentsData,
                    postId
                }
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

export const getReplies =
    ({ postId, commentId, replyQuantity }) =>
    async (dispatch) => {
        try {
            const res = await getDataApi(`/post/${postId}/comments/${commentId}`, {
                replyQuantity
            });
            dispatch({
                type: GLOBALTYPES.COMMENT.GET_REPLIES,
                payload: {
                    replyData: res.data.replyData,
                    postId,
                    commentId
                }
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

export const createComment =
    ({ post, user, content, originComment, socket }) =>
    async (dispatch) => {
        const postId = post._id;
        const postOwnerId = post.user._id;
        const authId = user._id;
        const originCommentId = originComment?._id;
        const originalCommenter = originComment?.user?._id;

        postDataApi('/comment', {
            commentData: {
                postId,
                originCommentId,
                originalCommenter,
                user,
                content
            }
        })
            .then((res) => {
                const newComment = res.data.newComment;

                if (originCommentId) {
                    dispatch({
                        type: GLOBALTYPES.COMMENT.ADD_REPLY_COMMENT,
                        payload: {
                            postId,
                            originCommentId,
                            newComment: newComment
                        }
                    });
                } else {
                    dispatch({
                        type: GLOBALTYPES.COMMENT.ADD_COMMENT,
                        payload: {
                            postId,
                            newComment: newComment
                        }
                    });
                }

                if (postOwnerId !== authId) {
                    socket.emit('comment', {
                        postId,
                        newComment,
                        postOwnerId,
                        originCommentId
                    });

                    dispatch(
                        createNotification({
                            authId,
                            socket,
                            notifyData: {
                                postId,
                                postOwnerId,
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
