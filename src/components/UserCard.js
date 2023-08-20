import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import Avatar from './Avatar';
import Follow from './FollowBtn';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined';
import VideocamOutlinedIcon from '@mui/icons-material/VideocamOutlined';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { getMessages } from '../redux/actions/messageAction';
import { GLOBALTYPES } from '../redux/actions/globalTypes';
import { messageSelector } from '../redux/selector';

function UserCard({ user, onClick, auth, conversation, conversationHeader, peer, socket }) {
    const dispatch = useDispatch();
    let message = useSelector(messageSelector);
    const Elem = conversation ? 'div' : Link;

    const handleCallUser = async ({ video }) => {
        const data = {
            peerId: peer._id,
            sender: {
                _id: auth.user._id,
                username: auth.user.username,
                fullname: auth.user.fullname,
                avatar: auth.user.avatar
            },
            receiver: user,
            video
        };

        dispatch({
            type: GLOBALTYPES.CALL.CALL_USER,
            payload: data
        });

        socket.emit('call_user', data);
    };

    const handleCallAudioUser = async () => {
        handleCallUser({ video: false });
    };

    const handleCallVideoUser = async () => {
        handleCallUser({ video: true });
    };

    const handleGetMessages = (e) => {
        e.preventDefault();

        if (message.currentReceiver._id !== user._id) {
            dispatch({
                type: GLOBALTYPES.MESSAGE.SET_CURRENT_RECEIVER,
                payload: user
            });
        }

        if (conversation && conversation._id !== message.currentConversation._id) {
            dispatch({
                type: GLOBALTYPES.MESSAGE.SET_CURRENT_CONVERSATION,
                payload: conversation
            });

            if (!message.messages[conversation._id]) dispatch(getMessages({ conversation }));
        }
    };

    return (
        <div
            className={`account_wrapper hover:bg-gray-100 ${
                conversation && message.currentReceiver?._id === user._id
                    ? 'border-l-4 border-gray-500'
                    : ''
            }`}
        >
            <Elem
                to={`/profile/${user?._id}`}
                className={`account`}
                onClick={conversation ? handleGetMessages : onClick}
            >
                <div className='avatar_wrapper w-10 h-10'>
                    <Avatar avatar={user?.avatar} size='small' />
                    {conversation && (
                        <div
                            className={`${
                                message.onlineUserList[user?._id]
                                    ? 'text-green-500'
                                    : 'text-gray-500'
                            } user_active_status`}
                        >
                            <FiberManualRecordIcon fontSize='inherit' />
                        </div>
                    )}
                </div>
                <div
                    className={`${
                        conversation ? 'message_user_description' : 'user_description'
                    } text-black flex-1`}
                >
                    <h3
                        className={`${
                            conversation
                                ? 'message_user_description_username'
                                : 'user_description_username'
                        } font-bold text-slate-700`}
                    >
                        {user?.username}
                    </h3>
                    <p
                        className={`${
                            conversation
                                ? 'message_user_description_fullname'
                                : 'user_description_fullname'
                        } font-light text-gray-500`}
                    >
                        {user?.fullname}
                    </p>
                </div>
            </Elem>
            {auth && !conversationHeader && <Follow userInfo={user} auth={auth} size={'small'} />}
            {conversationHeader && (
                <div className='conversation_icon_wrapper text-gray-500'>
                    <div
                        onClick={handleCallAudioUser}
                        className='conversation_icon conversation_call_icon'
                    >
                        <PhoneOutlinedIcon />
                    </div>
                    <div
                        onClick={handleCallVideoUser}
                        className='conversation_icon conversation_video_icon'
                    >
                        <VideocamOutlinedIcon />
                    </div>
                    <div className='conversation_icon conversation_more_icon'>
                        <MoreHorizIcon />
                    </div>
                </div>
            )}
        </div>
    );
}

export default UserCard;
