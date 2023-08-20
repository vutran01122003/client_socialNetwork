import { Box } from '@mui/material';
import { useState } from 'react';
import Edit from './EditProfile';
import Follow from '../FollowBtn';
import Avatar from '../Avatar';
import Content from '../Content';
import UserModal from '../UserModal';
import MessageIcon from '@mui/icons-material/Message';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { getConversation } from '../../redux/actions/messageAction';
import { messageSelector } from '../../redux/selector';

function Info({ userInfo, id, auth }) {
    const dispatch = useDispatch();
    const message = useSelector(messageSelector);
    const [onEdit, setOnEdit] = useState(false);
    const [audience, setAudience] = useState(false);
    const { avatar, username, fullname, followers, following, story, website, _id } =
        userInfo || {};

    const handleEdit = () => {
        setOnEdit((prev) => !prev);
    };

    const handleAudience = (title, users) => {
        setAudience({
            title,
            users
        });
    };

    const handleMessage = async () => {
        dispatch(
            getConversation({
                userData: {
                    _id,
                    avatar,
                    username,
                    fullname
                },
                message
            })
        );
    };

    return (
        <Box>
            <div className='info_wrapper wrapper flex w-full gap-20'>
                <div className='avatar_wrapper'>
                    <Avatar avatar={avatar} size='big' />
                </div>
                <div className='user_wrapper flex-1'>
                    <div className='user_avatar_edit_wrapper'>
                        <div className='name_wrapper'>
                            <h3 className='username font-semibold text-3xl'>{username}</h3>

                            <h5 className='sub_fullname text-center text-gray-500 font-bold text-sm my-2'>
                                {fullname}
                            </h5>
                        </div>
                        {auth.user?._id === id ? (
                            <div className='edit_btn whitespace-nowrap'>
                                <button
                                    onClick={handleEdit}
                                    className='rounded-md text-teal-400 text-semibold border-2 border-teal-400 py-2 px-14 hover:bg-teal-300 hover:text-white'
                                >
                                    Edit Profile
                                </button>
                            </div>
                        ) : (
                            <Follow userInfo={userInfo} auth={auth} />
                        )}
                    </div>
                    <div className='follow_info flex gap-8 text-teal-400'>
                        <span
                            onClick={() => {
                                handleAudience('Followers', followers);
                            }}
                            className='hover:text-teal-300 cursor-pointer'
                        >{`${followers?.length} Followers`}</span>
                        <span
                            onClick={() => {
                                handleAudience('Following', following);
                            }}
                            className='hover:text-teal-300 cursor-pointer'
                        >{`${following?.length} Following`}</span>
                    </div>
                    <div className='fullname_message_wrapper'>
                        <h4 className='fullname text-gray-500 font-bold'>{fullname}</h4>
                        {userInfo._id !== auth?.user._id && (
                            <button
                                onClick={handleMessage}
                                className='message_btn px-2.5 py-1 rounded-md text-gray-600 bg-gray-200 hover:bg-gray-300 hover:text-gray-700'
                            >
                                <Link to='/message'>
                                    <MessageIcon fontSize='small' /> <span>Message</span>
                                </Link>
                            </button>
                        )}
                    </div>
                    <a
                        href={website}
                        className='website_link text-blue-600 text-semibold hover:text-blue-700'
                        target='_blank'
                        rel='noreferrer'
                    >
                        {website}
                    </a>
                    <h5 className='story'>
                        <Content content={story} limit={100} />
                    </h5>
                </div>
            </div>
            {onEdit && <Edit setOnEdit={setOnEdit} />}
            {audience && <UserModal modalInfo={audience} setPopup={setAudience} auth={auth} />}
        </Box>
    );
}

export default Info;
