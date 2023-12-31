import PhoneEnabledIcon from '@mui/icons-material/PhoneEnabled';
import PhoneDisabledIcon from '@mui/icons-material/PhoneDisabled';
import VideocamIcon from '@mui/icons-material/Videocam';
import Avatar from '../Avatar';
import { useDispatch } from 'react-redux';
import { GLOBALTYPES } from '../../redux/actions/globalTypes';

function CallModal({ auth, call, socket, peer }) {
    const dispatch = useDispatch();

    const handleEndCall = () => {
        dispatch({
            type: GLOBALTYPES.CALL.CALL_USER,
            payload: {}
        });

        const restUserId =
            call?.sender._id === auth.user._id ? call?.receiver._id : call?.sender._id;
        socket.emit('end_call', { restUserId });
    };

    const handleAnswerCall = ({ receiverId, senderId, peerId, isVideo }) => {
        Promise.all([
            navigator.permissions.query({ name: 'camera' }),
            navigator.permissions.query({ name: 'microphone' })
        ]).then(function (permissionStatuses) {
            const cameraPermissionStatus = permissionStatuses[0].state;
            const microphonePermissionStatus = permissionStatuses[1].state;
            if (cameraPermissionStatus === 'denied') {
                alert('You must allow your browser to access the camera');
            } else if (microphonePermissionStatus === 'denied') {
                alert('You must allow your browser to access the microphone');
            } else {
                dispatch({
                    type: GLOBALTYPES.CALL.CALLING,
                    payload: true
                });
                socket.emit('answer_call', { receiverId, senderId, peerId, isVideo });
            }
        });
    };

    return (
        <>
            {call?.receiver && (
                <div className='call_modal_wrapper'>
                    <audio autoPlay loop hidden>
                        <source
                            src={
                                call.receiver?._id === auth.user?._id
                                    ? require('../../audio/messengerCall.mp3')
                                    : require('../../audio/messengerDialTone.mp3')
                            }
                            type='audio/mp3'
                        />
                    </audio>
                    <div className='call_modal'>
                        <div className='call_modal_header'>
                            <h1 className='call_modal_header_title uppercase text-base'>
                                Message call
                            </h1>
                        </div>
                        <div className='call_modal_body'>
                            <div className='call_modal_avatar'>
                                <Avatar
                                    avatar={
                                        auth?.user._id === call?.receiver._id
                                            ? call?.sender.avatar
                                            : call?.receiver.avatar
                                    }
                                    size='big'
                                />
                            </div>
                            <div className='call_modal_body_info'>
                                <div className='call_modal_user'>
                                    <h1 className='call_modal_username text-2xl font-semibold'>
                                        {auth?.user._id === call?.receiver._id
                                            ? call.sender.username
                                            : call.receiver.username}
                                    </h1>
                                </div>
                                <div className='call_modal_status text-xs font-light mt-2'>
                                    {auth?.user._id === call?.receiver._id
                                        ? 'Calling you...'
                                        : call.video
                                        ? 'Calling video...'
                                        : 'Calling audio...'}
                                </div>
                            </div>
                        </div>
                        <div className='call_modal_footer'>
                            <div className='call_icon_wrapper'>
                                <div
                                    onClick={() => {
                                        handleEndCall({ receiver: call.receiver });
                                    }}
                                    className='call_icon-item text-red-500'
                                >
                                    <PhoneDisabledIcon />
                                </div>
                                {auth.user._id === call?.receiver._id && (
                                    <>
                                        {!call.calling && (
                                            <div
                                                onClick={() => {
                                                    handleAnswerCall({
                                                        senderId: call.sender._id,
                                                        receiverId: call?.receiver._id,
                                                        peerId: peer._id,
                                                        isVideo: call?.video
                                                    });
                                                }}
                                                className='call_icon-item text-green-500'
                                            >
                                                {call.video ? (
                                                    <VideocamIcon />
                                                ) : (
                                                    <PhoneEnabledIcon />
                                                )}
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default CallModal;
