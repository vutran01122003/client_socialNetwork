import { Peer } from 'peerjs';
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { GLOBALTYPES } from './redux/actions/globalTypes';
import { callSelector, peerSelector, socketSelector } from './redux/selector';
import getStream from './utils/getStream';
import CallUserModal from './components/modal/CallUserModal';

function PeerClient({ auth }) {
    const dispatch = useDispatch();
    const call = useSelector(callSelector);
    const peer = useSelector(peerSelector);
    const socket = useSelector(socketSelector);
    const [stream, setStream] = useState(null);
    const remoteVideo = useRef();
    const localVideo = useRef();
    const remoteAudio = useRef();

    const handleEndCall = () => {
        dispatch({
            type: GLOBALTYPES.CALL.CALL_USER,
            payload: {}
        });

        const restUserId = call?.sender._id === auth.user._id ? call?.receiver._id : call?.sender._id;
        socket.emit('end_call', { restUserId });

        if (stream) {
            stream.getTracks().forEach(function (track) {
                track.stop();
            });
        } else {
            window.location.reload();
        }
    };

    useEffect(() => {
        if (socket && Object.keys(call).length > 0) {
            socket.on('disconnected_user', ({ userId }) => {
                if (call.receiver._id === userId || call.sender._id === userId) {
                    if (stream) {
                        stream.getTracks().forEach(function (track) {
                            track.stop();
                        });
                    } else {
                        window.location.reload();
                    }

                    dispatch({
                        type: GLOBALTYPES.CALL.CALL_USER,
                        payload: {}
                    });
                }
            });

            return () => {
                socket.off('disconnected_user');
            };
        }
    }, [socket, call, dispatch, stream]);

    useEffect(() => {
        if (socket && Object.keys(peer).length > 0) {
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
                } else {
                    window.location.reload();
                }
            });

            socket.on('answer_call', (data) => {
                dispatch({
                    type: GLOBALTYPES.CALL.CALLING,
                    payload: true
                });
                getStream({ audio: true, video: data.isVideo ? {} : data.isVideo })
                    .then((stream) => {
                        setStream(stream);
                        if (data.isVideo) {
                            localVideo.current.srcObject = stream;
                            localVideo.current.play();
                        }

                        const call = peer.call(data.peerId, stream);
                        call.on('stream', function (stream) {
                            data.isVideo
                                ? (remoteVideo.current.srcObject = stream)
                                : (remoteAudio.current.srcObject = stream);
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
    }, [socket, peer, dispatch]);

    useEffect(() => {
        if (Object.keys(peer).length > 0 && socket) {
            const callVideo = call.video;
            peer.on('call', function (call) {
                getStream({ audio: true, video: callVideo })
                    .then((stream) => {
                        setStream(stream);
                        call.on('stream', function (stream) {
                            callVideo
                                ? (remoteVideo.current.srcObject = stream)
                                : (remoteAudio.current.srcObject = stream);
                        });

                        if (callVideo) {
                            localVideo.current.srcObject = stream;
                            localVideo.current.play();
                        }

                        call.answer(stream);
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
                peer.off('call');
            };
        }
        // eslint-disable-next-lin
    }, [socket, peer, dispatch, call?.video]);

    // Initial peer client
    useEffect(() => {
        const peer = new Peer(undefined, {
            path: '/',
            secure: true
        });

        peer.on('open', () => {
            dispatch({
                type: GLOBALTYPES.PEER,
                payload: peer
            });
        });

        return () => peer.destroy();
    }, [dispatch]);

    return (
        <>
            {call.calling && (
                <CallUserModal
                    call={call}
                    localVideo={localVideo}
                    remoteVideo={remoteVideo}
                    remoteAudio={remoteAudio}
                    handleEndCall={handleEndCall}
                />
            )}
        </>
    );
}

export default PeerClient;
