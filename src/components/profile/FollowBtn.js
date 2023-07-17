import { useDispatch } from 'react-redux';
import { follow, unFollow } from '../../redux/actions/profileActions';

function Follow({ userInfo, auth, setUserInfo }) {
    const dispatch = useDispatch();

    const handleFollow = () => {
        dispatch(follow({ userInfo, auth, setUserInfo }));
    };

    const handleUnFollow = () => {
        dispatch(unFollow({ userInfo, auth }));
    };

    return auth.user?.following.includes(userInfo?._id) ? (
        <div
            onClick={handleUnFollow}
            className='follow_btn whitespace-nowrap ml-40'
        >
            <button className='rounded-md text-red-400 text-semibold border-2 border-red-400 py-2 px-16 hover:bg-red-300 hover:text-white'>
                Unfollow
            </button>
        </div>
    ) : (
        <div
            onClick={handleFollow}
            className='follow_btn whitespace-nowrap ml-40'
        >
            <button className='rounded-md text-teal-400 text-semibold border-2 border-teal-400 py-2 px-16 hover:bg-teal-300 hover:text-white'>
                Follow
            </button>
        </div>
    );
}

export default Follow;
