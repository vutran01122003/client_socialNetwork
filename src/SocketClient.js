import { useEffect } from 'react';
import { io } from 'socket.io-client';
import { GLOBALTYPES } from './redux/actions/globalTypes';
import { useDispatch, useSelector } from 'react-redux';
import { getConversations, getMessages, updateReadedUsers } from './redux/actions/messageAction';
import { messageSelector, socketSelector } from './redux/selector';
import { getDataApi } from './utils/fetchData';

function SocketClient({ auth }) {
    const dispatch = useDispatch();
    const socket = useSelector(socketSelector);
    const message = useSelector(messageSelector);

    useEffect(() => {
        // Message
        if (socket && Object.keys(message).length > 1) {
            socket.on('created_message', async (data) => {
                const userId = data.createdMessage.sender;
                if (message.currentReceiver._id === data.createdMessage.sender) {
                    // If you and other user are chatting, conversation will not notify unreaded conversation notication
                    dispatch(updateReadedUsers({ conversationId: data.conversation._id }));
                } else {
                    // Create unreaded conversation notication
                    const res = await getDataApi(`/conversation/${userId}`);
                    dispatch({
                        type: GLOBALTYPES.MESSAGE.UPDATE_READED_CONVERSATION,
                        payload: res.data.conversation
                    });
                }

                if (!message.conversations?.data.find((conversation) => conversation._id === data.conversation._id)) {
                    dispatch(getConversations({ auth, page: 1 }));
                }

                if (!message.messages[data.conversation._id]) {
                    dispatch(getMessages({ conversation: data.conversation }));
                } else
                    dispatch({
                        type: GLOBALTYPES.MESSAGE.ADD_MESSAGE,
                        payload: data.createdMessage
                    });
            });

            return () => socket.off('created_message');
        }
        // eslint-disable-next-line
    }, [socket, message, dispatch]);

    useEffect(() => {
        const socket = io(process.env.REACT_APP_API_URI);
        socket.on('connect', () => {
            dispatch({
                type: GLOBALTYPES.SOCKET,
                payload: socket
            });
            socket.emit('connected_user', auth?.user._id);
        });

        // user online
        socket.on('user_online_list', (data) => {
            dispatch({
                type: GLOBALTYPES.MESSAGE.GET_USER_ONLINE_LIST,
                payload: data
            });
        });
        // create post
        socket.on('notification_createdPost', (createdNotification) => {
            dispatch({
                type: GLOBALTYPES.NOTIFICATION.CREATE_NOTIFICATION,
                payload: {
                    createdNotification,
                    authId: auth?.user._id
                }
            });
        });

        // like post
        socket.on('liked_post', (data) => {
            dispatch({
                type: GLOBALTYPES.POST.UPDATE_POST,
                payload: data
            });
        });

        socket.on('unliked_post', (data) => {
            dispatch({
                type: GLOBALTYPES.POST.UPDATE_POST,
                payload: data
            });
        });

        socket.on('notification_liked', (createdNotification) => {
            dispatch({
                type: GLOBALTYPES.NOTIFICATION.CREATE_NOTIFICATION,
                payload: {
                    createdNotification,
                    authId: auth?.user._id
                }
            });
        });

        // comment post
        socket.on('created_comment', ({ postId, newComment, originCommentId }) => {
            if (originCommentId) {
                dispatch({
                    type: GLOBALTYPES.COMMENT.ADD_REPLY_COMMENT,
                    payload: {
                        postId,
                        newComment,
                        originCommentId
                    }
                });
            } else {
                dispatch({
                    type: GLOBALTYPES.COMMENT.ADD_COMMENT,
                    payload: {
                        postId,
                        newComment
                    }
                });
            }
        });

        socket.on('deleted_comment', (data) => {
            dispatch({
                type: GLOBALTYPES.POST.UPDATE_POST,
                payload: data
            });
        });

        socket.on('notification_commentedPost', (createdNotification) => {
            dispatch({
                type: GLOBALTYPES.NOTIFICATION.CREATE_NOTIFICATION,
                payload: {
                    createdNotification,
                    authId: auth?.user._id
                }
            });
        });

        // Follow
        socket.on('followed_user', (newUser) => {
            dispatch({
                type: GLOBALTYPES.AUTH,
                payload: { ...auth, user: newUser }
            });
        });

        socket.on('unfollowed_user', (newUser) => {
            dispatch({
                type: GLOBALTYPES.AUTH,
                payload: { ...auth, user: newUser }
            });
        });

        // Save
        socket.on('notification_saved', (createdNotification) => {
            dispatch({
                type: GLOBALTYPES.NOTIFICATION.CREATE_NOTIFICATION,
                payload: { createdNotification, authId: auth?.user._id }
            });
        });

        // Follow
        socket.on('notification_followedUser', (createdNotification) => {
            dispatch({
                type: GLOBALTYPES.NOTIFICATION.CREATE_NOTIFICATION,
                payload: {
                    createdNotification,
                    authId: auth?.user._id
                }
            });
        });

        socket.on('deleted_conversation', () => {
            dispatch(getConversations({ auth, page: 1 }));
            dispatch({
                type: GLOBALTYPES.MESSAGE.SET_CURRENT_CONVERSATION,
                payload: {}
            });
            dispatch({
                type: GLOBALTYPES.MESSAGE.SET_CURRENT_RECEIVER,
                payload: {}
            });
        });

        // Remember to disconnect the socket when the app unmounts
        return () => {
            socket.disconnect();
        };

        // eslint-disable-next-line
    }, [dispatch]);

    return <></>;
}

export default SocketClient;
