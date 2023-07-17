import { Box } from '@mui/material';
import { useState } from 'react';
import Edit from './EditProfile';
import { useSelector } from 'react-redux';
import { authSelector } from '../../redux/selector';
import Follow from './FollowBtn';

function Info({ userInfo, id }) {
    const auth = useSelector(authSelector);

    const { avatar, username, fullname, followers, following, story, website } =
        userInfo || {};
    const [edit, setEdit] = useState(false);
    const handleEdit = () => {
        setEdit((prev) => !prev);
    };

    return (
        <Box>
            <div className='info_wrapper flex w-full gap-20'>
                <div className='avatar_wrapper'>
                    <img
                        src={avatar}
                        alt='avatar'
                        className='avatar big rounded-full select-none'
                    />
                </div>
                <div className='user_wrapper flex-1'>
                    <div className='user_avatar_edit_wrapper flex pt-2'>
                        <h3 className='username font-semibold text-3xl'>
                            {username}
                        </h3>
                        {auth.user?._id === id ? (
                            <div className='edit_btn whitespace-nowrap ml-40'>
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
                        <span className='hover:text-teal-300 cursor-pointer'>{`${followers?.length} Followers`}</span>
                        <span className='hover:text-teal-300 cursor-pointer'>{`${following?.length} Following`}</span>
                    </div>
                    <h4 className='fullname text-gray-500 font-bold'>
                        {fullname}
                    </h4>
                    <a
                        href={website}
                        className='website_link text-blue-600 text-semibold hover:text-blue-700'
                        target='_blank'
                        rel='noreferrer'
                    >
                        {website}
                    </a>
                    <h5 className='story'>{story}</h5>
                </div>
            </div>
            {edit && <Edit setEdit={setEdit} />}
        </Box>
    );
}

export default Info;
