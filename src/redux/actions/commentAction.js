import { GLOBALTYPES } from './globalTypes';
import {
    deleteDataApi,
    patchDataApi,
    postDataApi
} from '../../utils/fetchData';

export const createComment =
    ({ postId, user, content, commentId, socket }) =>
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
                commentId,
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
            })
            .catch((error) => {
                console.log(error);
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
            data: { postId, commentId }
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
                console.log(error);
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
