import { Box } from '@mui/material';
import { useState } from 'react';
import Edit from './EditProfile';
import Follow from '../FollowBtn';
import Avatar from '../Avatar';
import Content from '../Content';
import UserModal from '../UserModal';

function Info({ userInfo, id, auth }) {
    const { avatar, username, fullname, followers, following, story, website } = userInfo || {};
    const [onEdit, setOnEdit] = useState(false);
    const [audience, setAudience] = useState(false);

    const handleEdit = () => {
        setOnEdit((prev) => !prev);
    };

    const handleAudience = (title, users) => {
        setAudience({
            title,
            users
        });
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
                    <h4 className='fullname text-gray-500 font-bold'>{fullname}</h4>
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
