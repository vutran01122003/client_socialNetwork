import { Peer } from 'peerjs';
import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { GLOBALTYPES } from './redux/actions/globalTypes';
import PhoneDisabledIcon from '@mui/icons-material/PhoneDisabled';
import { authSelector, callSelector, peerSelector, socketSelector } from './redux/selector';
import getStream from './utils/getStream';

function PeerClient() {
    const dispatch = useDispatch();
    const call = useSelector(callSelector);
    const peer = useSelector(peerSelector);
    const auth = useSelector(authSelector);
    const socket = useSelector(socketSelector);
    const remoteVideo = useRef();
    const localVideo = useRef();

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
            peer.on('call', function (call) {
                getStream({ audio: true, video: true })
                    .then((stream) => {
                        call.on('stream', function (stream) {
                            remoteVideo.current.srcObject = stream;
                        });
                        localVideo.current.srcObject = stream;
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
        }
    }, [peer, call]);

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

export default PeerClient;
