import { GLOBALTYPES } from './globalTypes';
import { deleteDataApi, getDataApi, patchDataApi, postDataApi } from '../../utils/fetchData';
import { createNotification } from './notifyAction';

export const getComments =
    ({ postId, commentQuantity, limit }) =>
    async (dispatch) => {
        try {
            const res = await getDataApi(`/post/${postId}/comments`, {
                commentQuantity,
                limit
            });

            dispatch({
                type: GLOBALTYPES.COMMENT.GET_COMMENTS,
                payload: {
                    comments: res.data.data,
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
    ({ postId, commentId, replyQuantity, limit }) =>
    async (dispatch) => {
        try {
            const res = await getDataApi(`/post/${postId}/comments/${commentId}`, {
                replyQuantity,
                limit
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
    ({ post, user, content, parentCommentId, socket }) =>
    async (dispatch) => {
        try {
            const postId = post._id;
            const postOwnerId = post.user._id;
            const authId = user._id;

            const res = await postDataApi('/comment', {
                commentData: {
                    postId,
                    parentCommentId,
                    user,
                    content
                }
            });

            const newComment = res.data.newComment;

            if (parentCommentId) {
                dispatch({
                    type: GLOBALTYPES.COMMENT.ADD_REPLY_COMMENT,
                    payload: {
                        postId,
                        parentCommentId,
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

            // if (postOwnerId !== authId) {
            //     socket.emit('comment', {
            //         postId,
            //         newComment,
            //         postOwnerId,
            //         parentCommentId
            //     });

            //     dispatch(
            //         createNotification({
            //             authId,
            //             socket,
            //             notifyData: {
            //                 postId,
            //                 postOwnerId,
            //                 avatar: user.avatar,
            //                 url: `/post/${post._id}`,
            //                 receiver: [post.user._id],
            //                 type: 'notification_commentedPost',
            //                 content,
            //                 file: post.files[0]?.url,
            //                 title: `${user.username} commented on your post:`
            //             }
            //         })
            //     );
            // }
        } catch (error) {
            console.log(error);
            dispatch({
                type: GLOBALTYPES.ALERT,
                payload: {
                    error: error.response?.data.msg || 'Error'
                }
            });
        }
    };

export const deleteComment =
    ({ post, user, comment, socket }) =>
    async (dispatch) => {
        try {
            const postId = post._id;
            const { _id: commentId, parentCommentId } = comment;
            const res = await deleteDataApi('/comment', {
                commentData: { postId, commentId }
            });

            if (post.user._id !== user._id) socket.emit('delete_comment', res.data.newPost);

            dispatch({
                type: GLOBALTYPES.COMMENT.DELETE_COMMENT,
                payload: {
                    postId,
                    commentId,
                    parentCommentId
                }
            });
        } catch (error) {
            dispatch({
                type: GLOBALTYPES.ALERT,
                payload: {
                    error: error.response?.data.msg || 'Delete Comment Error'
                }
            });
        }
    };

export const updateComment =
    ({ postId, commentId, parentCommentId, content }) =>
    async (dispatch) => {
        try {
            const res = await patchDataApi('/comment', {
                commentData: {
                    postId,
                    commentId,
                    parentCommentId,
                    content
                }
            });

            dispatch({
                type: GLOBALTYPES.COMMENT.UPDATE_COMMENT,
                payload: {
                    postId,
                    commentId,
                    parentCommentId,
                    comment: res.data.data
                }
            });

            dispatch({
                type: GLOBALTYPES.ALERT,
                payload: {
                    success: res.data.status
                }
            });
        } catch (error) {
            console.log(error);
            dispatch({
                type: GLOBALTYPES.ALERT,
                payload: {
                    error: error.response?.data.msg || 'Error'
                }
            });
        }
    };

export const likeComment =
    ({ postId, commentId, user }) =>
    async (dispatch) => {
        try {
            const res = await patchDataApi(`/comment/${commentId}/like`, {
                data: {
                    postId,
                    userId: user._id
                }
            });

            dispatch({
                type: GLOBALTYPES.COMMENT.LIKE_COMMENT,
                payload: {
                    postId,
                    commentId,
                    userData: {
                        _id: user._id,
                        username: user.username,
                        fullname: user.fullname,
                        avatar: user.avatar
                    }
                }
            });

            dispatch({
                type: GLOBALTYPES.ALERT,
                payload: {
                    success: res.data.status
                }
            });
        } catch (error) {
            dispatch({
                type: GLOBALTYPES.ALERT,
                payload: {
                    error: error.response?.data.msg || 'Like Comment Error'
                }
            });
        }
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
                    type: GLOBALTYPES.COMMENT.UNLIKE_COMMENT,
                    payload: {
                        postId,
                        commentId,
                        userId
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
                console.log(e);
                dispatch({
                    type: GLOBALTYPES.ALERT,
                    payload: {
                        error: e.response?.data.msg || 'Unlike Comment Error'
                    }
                });
            });
    };
