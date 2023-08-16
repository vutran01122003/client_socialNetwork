import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Avatar from './Avatar';
import Follow from './FollowBtn';
import React from 'react';
import { useDispatch } from 'react-redux';
import { getMessages } from '../redux/actions/messageAction';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import { GLOBALTYPES } from '../redux/actions/globalTypes';
import { messageSelector } from '../redux/selector';

function UserCard({ user, onClick, auth, conversation }) {
    const dispatch = useDispatch();
    let message = useSelector(messageSelector);
    const Elem = conversation ? 'div' : Link;

    const handleGetMessages = (e) => {
        e.preventDefault();

        dispatch({
            type: GLOBALTYPES.MESSAGE.SET_CURRENT_RECEIVER,
            payload: user
        });

        if (conversation) {
            dispatch({
                type: GLOBALTYPES.MESSAGE.SET_CURRENT_CONVERSATION,
                payload: conversation
            });

            dispatch(getMessages({ conversation }));
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
            {auth && <Follow userInfo={user} auth={auth} size={'small'} />}
        </div>
    );
}

export default UserCard;
