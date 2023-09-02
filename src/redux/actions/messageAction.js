import { deleteDataApi, getDataApi, patchDataApi, postDataApi } from '../../utils/fetchData';
import { uploadFile } from '../../utils/uploadFile';
import { GLOBALTYPES } from './globalTypes';

export const getMessages =
    ({ page = 1, conversation, currentMessages = 0 }) =>
    async (dispatch) => {
        try {
            dispatch({
                type: GLOBALTYPES.MESSAGE.MESSAGE_LOADING,
                payload: { loading: true }
            });

            const res = await getDataApi(
                `/messages/${conversation._id}?page=${page}&currentQuantity=${currentMessages}`
            );
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

export const updateReadedUsers =
    ({ conversationId }) =>
    async (dispatch) => {
        try {
            const res = await patchDataApi(`/conversation/${conversationId}`);
            dispatch({
                type: GLOBALTYPES.MESSAGE.UPDATE_READED_CONVERSATION,
                payload: res.data.updatedConversation
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

export const deleteConversations =
    ({ conversationId, auth, socket }) =>
    async (dispatch) => {
        try {
            const res = await deleteDataApi(`/conversation/${conversationId}`);
            socket.emit('deleted_conversation', {
                conversationId: res.data.deletedConversation._id,
                receiverId: res.data.deletedConversation.recipients.find(
                    (recipientId) => recipientId !== auth.user._id
                )
            });
            dispatch({
                type: GLOBALTYPES.MESSAGE.SET_CURRENT_CONVERSATION,
                payload: {}
            });

            dispatch({
                type: GLOBALTYPES.MESSAGE.SET_CURRENT_RECEIVER,
                payload: {}
            });
            dispatch(getConversations({ auth, page: 1 }));
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
            console.log(error);
            dispatch({
                type: GLOBALTYPES.ALERT,
                payload: {
                    error: error.response?.data.msg || 'Error'
                }
            });
        }
    };
