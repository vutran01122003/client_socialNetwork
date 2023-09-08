import { Peer } from 'peerjs';
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { GLOBALTYPES } from './redux/actions/globalTypes';
import PhoneDisabledIcon from '@mui/icons-material/PhoneDisabled';
import { callSelector, peerSelector, socketSelector } from './redux/selector';
import getStream from './utils/getStream';
import Avatar from './components/Avatar';

function PeerClient({ auth }) {
    const dispatch = useDispatch();
    const call = useSelector(callSelector);
    const peer = useSelector(peerSelector);
    const socket = useSelector(socketSelector);
    const [stream, setStream] = useState(null);
    const remoteVideo = useRef();
    const localVideo = useRef();
    const remoteAudio = useRef();

    const playVideo = async () => {
        socket.emit('play_video', {
            userId: call?.sender._id === auth.user._id ? call?.receiver._id : call?.sender._id
        });
        try {
            const newStream = await navigator.mediaDevices.getUserMedia({ video: true });
            localVideo.current.srcObject = newStream;
            setStream(newStream);
            localVideo.current.play();
        } catch (error) {
            console.error('Không thể mở camera:', error);
        }
    };

    // Hàm để tắt camera
    const stopVideo = () => {
        if (stream) {
            const tracks = stream.getTracks();
            tracks.forEach((track) => {
                if (track.readyState === 'live' && track.kind === 'video') {
                    track.stop();
                }
            });
        }
    };

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
            const callVideo = call.video;

            peer.on('call', function (call) {
                getStream({ audio: true, video: callVideo })
                    .then((stream) => {
                        console.log('peer');
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
    }, [peer, dispatch, call?.video, stream]);

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
            {call.calling && call?.receiver._id === auth?.user._id && (
                <div className='call_model_overlap peer'>
                    <div className='call_modal_video_wrapper'>
                        <div className='call_model_title'>
                            {`Calling ${call.video ? 'video' : 'audio'}`}
                        </div>
                        {!call?.video ? (
                            <div className='call_model_avatar'>
                                <Avatar avatar={call.sender.avatar} size='big' />
                                <h3 className='text-center text-xl font-semibold mt-4'>
                                    {call.sender.username}
                                </h3>
                                <h4 className='text-center mt-4'>00:00</h4>
                                <audio ref={remoteAudio} hidden autoPlay></audio>
                            </div>
                        ) : (
                            <div className='call_modal_video'>
                                <video className='local_video' ref={localVideo} muted />
                                <video className='remote_video' ref={remoteVideo} autoPlay />
                            </div>
                        )}
                        <button onClick={stopVideo}>Stop video</button>
                        <button onClick={playVideo}>Play video</button>

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

export default PeerClient;
