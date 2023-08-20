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

    const handleAnswerCall = ({ receiverId, senderId, peerId }) => {
        dispatch({
            type: GLOBALTYPES.CALL.CALLING,
            payload: true
        });
        socket.emit('answer_call', { receiverId, senderId, peerId });
    };

    return (
        <>
            {call?.receiver && (
                <div className='call_modal_wrapper'>
                    <div className='call_modal'>
                        <div className='call_modal_header'>
                            <h1 className='call_modal_header_title'>Message call</h1>
                        </div>
                        <div className='call_modal_body'>
                            <div className='call_modal_avatar'>
                                <Avatar
                                    avatar={
                                        auth?.user._id === call?.receiver._id
                                            ? call?.sender.avatar
                                            : call?.receiver.avatar
                                    }
                                    size='medium'
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
                                                        peerId: peer._id
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
