import { useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { GLOBALTYPES } from './redux/actions/globalTypes';
import { useDispatch, useSelector } from 'react-redux';
import { getConversations } from './redux/actions/messageAction';
import { callSelector, peerSelector, socketSelector } from './redux/selector';
import PhoneDisabledIcon from '@mui/icons-material/PhoneDisabled';
import getStream from './utils/getStream';

function SocketClient({ auth }) {
    const dispatch = useDispatch();
    const peer = useSelector(peerSelector);
    const call = useSelector(callSelector);
    const socket = useSelector(socketSelector);
    const localVideo = useRef();
    const remoteVideo = useRef();

    console.log(localVideo);
    const handleEndCall = () => {
        dispatch({
            type: GLOBALTYPES.CALL.CALL_USER,
            payload: {}
        });

        const restUserId =
            call?.sender._id === auth.user._id ? call?.receiver._id : call?.sender._id;
        socket.emit('end_call', { restUserId });
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
            });

            socket.on('answer_call', (data) => {
                dispatch({
                    type: GLOBALTYPES.CALL.CALLING,
                    payload: true
                });
                getStream({ audio: true, video: true })
                    .then((stream) => {
                        localVideo.current.srcObject = stream;
                        const call = peer.call(data.peerId, stream);
                        call.on('stream', function (stream) {
                            remoteVideo.current.srcObject = stream;
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
        }
    }, [peer, dispatch]);

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

        // Message
        socket.on('created_message', (data) => {
            dispatch(getConversations({ auth }));
            dispatch({
                type: GLOBALTYPES.MESSAGE.ADD_MESSAGE,
                payload: data.createdMessage
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
                        <div className='call_modal_video'>
                            <video className='local_video' ref={localVideo} autoPlay muted />
                            <video className='remote_video' ref={remoteVideo} autoPlay />
                        </div>
                        <div className='call_modal_video_footer'>
                            <div
                                onClick={() => {
                                    handleEndCall({ receiver: call.receiver });
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
