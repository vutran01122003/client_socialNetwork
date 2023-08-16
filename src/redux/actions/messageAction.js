import { getDataApi, postDataApi } from '../../utils/fetchData';
import { uploadFile } from '../../utils/uploadFile';
import { GLOBALTYPES } from './globalTypes';

export const getMessages =
    ({ conversation }) =>
    async (dispatch) => {
        try {
            const res = await getDataApi(`/messages/${conversation._id}`);
            dispatch({
                type: GLOBALTYPES.MESSAGE.GET_MESSAGE,
                payload: {
                    [conversation._id]: res.data.messages
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

export const getConversations =
    ({ auth }) =>
    async (dispatch) => {
        try {
            const res = await getDataApi(`/conversations/${auth?.user._id}`);
            dispatch({
                type: GLOBALTYPES.MESSAGE.GET_CONVERSATIONS,
                payload: res.data.conversations
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

export const createMessage =
    ({ scrollToBottom, receiver, sender, content, files }) =>
    async (dispatch) => {
        dispatch({
            type: GLOBALTYPES.ALERT,
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
                dispatch({
                    type: GLOBALTYPES.MESSAGE.ADD_MESSAGE,
                    payload: res.data.createdMessage
                });

                setTimeout(() => {
                    scrollToBottom();
                }, 100);
                dispatch({
                    type: GLOBALTYPES.ALERT,
                    payload: {}
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
    };
