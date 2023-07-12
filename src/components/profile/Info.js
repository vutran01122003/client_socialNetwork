import { Box } from '@mui/material';

function Info({ userInfo }) {
    const { avatar, username, fullname, followers, following } = userInfo || {};

    return (
        <Box>
            <div className='info_wrapper flex w-full justify-between'>
                <div className='avatar_wrapper'>
                    <img
                        src={avatar}
                        alt='avatar'
                        className='avatar big rounded-full'
                    />
                </div>
                <div className='user_wrapper'>
                    <h3 className='username font-semibold text-3xl mb-2'>
                        {username}
                    </h3>
                    <div className='follow_info flex gap-8 text-teal-400'>
                        <span className='hover:text-teal-500 cursor-pointer'>{`${followers?.length} Followers`}</span>
                        <span className='hover:text-teal-500 cursor-pointer'>{`${following?.length} Following`}</span>
                    </div>
                    <p className='fullname text-gray-500 font-bold'>
                        {fullname}
                    </p>
                </div>
                <div className='edit_btn'>
                    <button className='rounded-md text-teal-400 text-semibold border-2 border-teal-400 py-2 px-10 hover:bg-teal-300 hover:text-white'>
                        Edit Profile
                    </button>
                </div>
            </div>
        </Box>
    );
}

export default Info;
