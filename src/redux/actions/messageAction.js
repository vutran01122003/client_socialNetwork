import { deleteDataApi, getDataApi, postDataApi } from '../../utils/fetchData';
import { uploadFile } from '../../utils/uploadFile';
import { GLOBALTYPES } from './globalTypes';

export const getMessages =
    ({ page = 1, conversation }) =>
    async (dispatch) => {
        try {
            dispatch({
                type: GLOBALTYPES.MESSAGE.MESSAGE_LOADING,
                payload: { loading: true }
            });

            const res = await getDataApi(`/messages/${conversation._id}?page=${page}`);
            if (res.data.messages.length === 0 && page > 1) {
                dispatch({
                    type: GLOBALTYPES.MESSAGE.UPDATE_MESSAGE,
                    payload: {
                        conversationId: conversation._id,
                        updatedMessage: { maxPage: true }
                    }
                });
            } else {
                if (page === 1) {
                    dispatch({
                        type: GLOBALTYPES.MESSAGE.GET_MESSAGES,
                        payload: {
                            [conversation._id]: {
                                data: res.data.messages,
                                page: 1,
                                maxPage: false,
                                result: res.data.messages.length
                            }
                        }
                    });
                } else {
                    dispatch({
                        type: GLOBALTYPES.MESSAGE.GET_MESSAGES,
                        payload: {
                            conversationId: conversation._id,
                            messages: res.data.messages,
                            page
                        }
                    });
                }
            }
        } catch (error) {
            dispatch({
                type: GLOBALTYPES.ALERT,
                payload: {
                    error: error.response?.data.msg || 'Error'
                }
            });
        } finally {
            dispatch({
                type: GLOBALTYPES.MESSAGE.MESSAGE_LOADING,
                payload: { loading: false }
            });
        }
    };

export const getConversation =
    ({ userData, message }) =>
    async (dispatch) => {
        try {
            dispatch({
                type: GLOBALTYPES.MESSAGE.SET_CURRENT_RECEIVER,
                payload: userData
            });

            const res = await getDataApi(`/conversation/${userData?._id}`);

            dispatch({
                type: GLOBALTYPES.MESSAGE.SET_CURRENT_CONVERSATION,
                payload: res.data.conversation || {}
            });

            if (res.data.conversation?._id && !message.messages[res.data.conversation._id]) {
                dispatch(getMessages({ conversation: res.data.conversation }));
            }
        } catch (error) {
            dispatch({
                type: GLOBALTYPES.ALERT,
                payload: {
                    error: error.response?.data.msg || 'Error'
                }
            });
        }
    };

export const getConversations =
    ({ auth, page }) =>
    async (dispatch) => {
        try {
            const res = await getDataApi(`/conversations/${auth?.user._id}?page=${page}`);
            dispatch({
                type: GLOBALTYPES.MESSAGE.GET_CONVERSATIONS,
                payload: {
                    conversations: res.data.conversations,
                    page,
                    maxPage: res.data.conversations.length === 0 ? true : false
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

export const deleteConversations =
    ({ conversationId, auth }) =>
    async (dispatch) => {
        try {
            await deleteDataApi(`/conversation/${conversationId}`);
            dispatch({
                type: GLOBALTYPES.MESSAGE.SET_CURRENT_CONVERSATION,
                payload: {}
            });
            dispatch({
                type: GLOBALTYPES.MESSAGE.SET_CURRENT_CONVERSATION,
                payload: {}
            });
            dispatch(getConversations({ auth, page: 1 }));
        } catch (error) {
            dispatch({
                type: GLOBALTYPES.ALERT,
                payload: {
                    error: error.response?.data.msg || 'Error'
                }
            });
        }
    };

export const createMessage =
    ({ auth, socket, message, scrollToBottom, receiver, sender, content, files }) =>
    async (dispatch) => {
        dispatch({
            type: GLOBALTYPES.MESSAGE.MESSAGE_LOADING,
            payload: {
                loading: true
            }
        });

        let fileUrlArr = [];
        if (files.length > 0) {
            fileUrlArr = await uploadFile(files);
        }

        postDataApi(`/message`, {
            postData: {
                receiver,
                sender,
                content,
                files: fileUrlArr
            }
        })
            .then((res) => {
                socket.emit('created_message', res.data);

                if (
                    !message.conversations?.data.find(
                        (conversation) => conversation._id === res.data.conversation._id
                    )
                ) {
                    dispatch({
                        type: GLOBALTYPES.MESSAGE.SET_CURRENT_CONVERSATION,
                        payload: res.data.conversation
                    });
                    console.log('ok');
                    dispatch(getConversations({ auth, page: 1 }));
                }

                dispatch({
                    type: GLOBALTYPES.MESSAGE.ADD_MESSAGE,
                    payload: res.data.createdMessage
                });

                setTimeout(() => {
                    scrollToBottom();
                }, 100);
            })
            .catch((err) => {
                console.log(err);

                dispatch({
                    type: GLOBALTYPES.ALERT,
                    payload: {
                        error: err.response?.data.msg || 'Error'
                    }
                });
            })
            .finally(() => {
                dispatch({
                    type: GLOBALTYPES.MESSAGE.MESSAGE_LOADING,
                    payload: { loading: false }
                });
            });
    };

export const deleteMessage =
    ({ messageId }) =>
    async (dispatch) => {
        try {
            const res = await deleteDataApi(`/message/${messageId}`);
            dispatch({
                type: GLOBALTYPES.MESSAGE.UPDATE_MESSAGE,
                payload: {
                    deletedMessage: res.data.deletedMessage
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
