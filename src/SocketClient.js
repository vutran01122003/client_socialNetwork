import { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import { GLOBALTYPES } from './redux/actions/globalTypes';
import { useDispatch, useSelector } from 'react-redux';
import { getConversations, getMessages, updateReadedUsers } from './redux/actions/messageAction';
import { callSelector, messageSelector, peerSelector, socketSelector } from './redux/selector';
import PhoneDisabledIcon from '@mui/icons-material/PhoneDisabled';
import getStream from './utils/getStream';
import Avatar from './components/Avatar';
import { getDataApi } from './utils/fetchData';

function SocketClient({ auth }) {
    const dispatch = useDispatch();
    const peer = useSelector(peerSelector);
    const call = useSelector(callSelector);
    const socket = useSelector(socketSelector);
    const message = useSelector(messageSelector);
    const [stream, setStream] = useState(null);
    const localVideo = useRef();
    const remoteVideo = useRef();
    const remoteAudio = useRef();

    const handleEndCall = () => {
        dispatch({
            type: GLOBALTYPES.CALL.CALL_USER,
            payload: {}
        });

        const restUserId =
            call?.sender._id === auth.user._id ? call?.receiver._id : call?.sender._id;
        socket.emit('end_call', { restUserId });

        if (stream) {
            stream.getTracks().forEach(function (track) {
                track.stop();
            });
        }
    };

    useEffect(() => {
        if (Object.keys(peer).length > 0) {
            socket.on('answer_user', (data) => {
                dispatch({
                    type: GLOBALTYPES.CALL.CALL_USER,
                    payload: data
                });
            });

            socket.on('end_call', () => {
                dispatch({
                    type: GLOBALTYPES.CALL.CALLING,
                    payload: false
                });

                dispatch({
                    type: GLOBALTYPES.CALL.CALL_USER,
                    payload: {}
                });

                if (stream) {
                    stream.getTracks().forEach(function (track) {
                        track.stop();
                    });
                }
            });

            socket.on('answer_call', (data) => {
                dispatch({
                    type: GLOBALTYPES.CALL.CALLING,
                    payload: true
                });
                getStream({ audio: true, video: data.isVideo })
                    .then((stream) => {
                        setStream(stream);
                        if (data.isVideo) localVideo.current.srcObject = stream;
                        const call = peer.call(data.peerId, stream);
                        call.on('stream', function (stream) {
                            data.isVideo
                                ? (remoteVideo.current.srcObject = stream)
                                : (remoteAudio.current.srcObject = stream);
                        });

                        // enable camera from remote
                        socket.on('play_remote_video', () => {
                            socket.off('stream');
                            const call = peer.call(data.peerId, stream);
                            call.on('stream', function (stream) {
                                data.isVideo
                                    ? (remoteVideo.current.srcObject = stream)
                                    : (remoteAudio.current.srcObject = stream);
                            });
                        });
                    })
                    .catch(() => {
                        dispatch({
                            type: GLOBALTYPES.ALERT,
                            payload: {
                                error: 'Error'
                            }
                        });
                    });
            });

            return () => {
                socket.off('answer_user');
                socket.off('end_call');
                socket.off('answer_call');
            };
        }
        // eslint-disable-next-line
    }, [peer, dispatch, stream]);

    useEffect(() => {
        if (socket && Object.keys(call).length > 0) {
            socket.on('disconnected_user', (data) => {
                if (data?.userId === call?.receiver?._id || data?.userId === call?.sender?._id) {
                    handleEndCall();
                }
            });
            return () => {
                socket.off('disconnected_user');
            };
        }
    }, [socket, call]);

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

                if (
                    !message.conversations?.data.find(
                        (conversation) => conversation._id === data.conversation._id
                    )
                ) {
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
        socket.on('created_comment', (data) => {
            dispatch({
                type: GLOBALTYPES.POST.UPDATE_POST,
                payload: data
            });
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

    return (
        <>
            {call.calling && call?.sender._id === auth?.user._id && (
                <div className='call_model_overlap socket'>
                    <div className='call_modal_video_wrapper'>
                        <div className='call_model_title'>
                            {`Calling ${call.video ? 'video' : 'audio'}`}
                        </div>
                        {!call.video ? (
                            <div className='call_model_avatar'>
                                <Avatar avatar={call.sender.avatar} size='big' />
                                <h3 className='text-center text-xl font-semibold mt-4'>
                                    {call.sender.username}
                                </h3>
                                <audio ref={remoteAudio} hidden autoPlay></audio>
                            </div>
                        ) : (
                            <div className='call_modal_video'>
                                <video className='local_video' ref={localVideo} autoPlay muted />
                                <video className='remote_video' ref={remoteVideo} autoPlay />
                            </div>
                        )}

                        <div className='call_modal_video_footer'>
                            <div
                                onClick={() => {
                                    handleEndCall();
                                }}
                                className='call_icon-item text-red-500'
                            >
                                <PhoneDisabledIcon />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default SocketClient;
