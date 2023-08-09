import { Link } from 'react-router-dom';
import Avatar from './Avatar';
import Follow from './FollowBtn';

function UserCard({ user, onClick, auth }) {
    return (
        <div className='account_wrapper'>
            <Link
                to={`/profile/${user?._id}`}
                className='account'
                onClick={onClick}
            >
                <div className='w-10 h-10'>
                    <Avatar avatar={user?.avatar} size='small' />
                </div>
                <div className='user_description text-black flex-1'>
                    <h3 className='user_description_username font-bold text-slate-700'>
                        {user?.username}
                    </h3>
                    <p className='user_description_fullname font-light text-gray-500'>
                        {user?.fullname}
                    </p>
                </div>
            </Link>
            {auth && <Follow userInfo={user} auth={auth} size={'small'} />}
        </div>
    );
}

export default UserCard;
