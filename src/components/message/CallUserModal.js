import PhoneDisabledIcon from '@mui/icons-material/PhoneDisabled';
import Avatar from '../Avatar';
import { useEffect, useState } from 'react';

function CallUserModal({ call, localVideo, remoteVideo, remoteAudio, handleEndCall }) {
    const [second, setSecond] = useState(0);
    useEffect(() => {
        let timeId = null;

        timeId = setInterval(() => {
            setSecond((prev) => ++prev);
        }, 1000);

        return () => {
            clearInterval(timeId);
        };
    }, []);

    return (
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
                        <audio ref={remoteAudio} hidden autoPlay></audio>
                    </div>
                ) : (
                    <div className='call_modal_video'>
                        <video className='local_video' ref={localVideo} muted />
                        <video className='remote_video' ref={remoteVideo} autoPlay />
                    </div>
                )}
                <h4 className='text-center mt-4'>
                    {`${
                        Math.floor(second / 60) < 10
                            ? '0' + Math.floor(second / 60)
                            : Math.floor(second / 60)
                    }:${second % 60 < 10 ? '0' + (second % 60) : second % 60}`}
                </h4>
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
    );
}

export default CallUserModal;
