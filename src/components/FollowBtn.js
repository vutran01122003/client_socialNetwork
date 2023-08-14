import { useDispatch, useSelector } from 'react-redux';
import { follow, unFollow } from '../redux/actions/profileActions';
import { socketSelector } from '../redux/selector';
import { CircularProgress } from '@mui/material';
import { getNewPosts } from '../redux/actions/postAction';

function Follow({ userInfo, auth, size }) {
    const socket = useSelector(socketSelector);
    const dispatch = useDispatch();

    const handleFollow = async () => {
        dispatch(follow({ userInfo, auth, socket }));
        dispatch(getNewPosts({ userId: userInfo._id }));
    };

    const handleUnFollow = () => {
        dispatch(unFollow({ userInfo, auth, socket }));
    };

    return (
        <>
            {auth?.user ? (
                auth.user?.following.find((user) => {
                    return user._id === userInfo?._id;
                }) ? (
                    <div onClick={handleUnFollow} className='unfollow_btn whitespace-nowrap'>
                        <button
                            className={`${
                                size === 'small' ? 'py-1 px-4  w-28' : 'py-2 px-16'
                            } rounded-md text-red-400 text-semibold border-2 border-red-400 hover:bg-red-300 hover:text-white`}
                        >
                            Unfollow
                        </button>
                    </div>
                ) : (
                    <div onClick={handleFollow} className='follow_btn whitespace-nowrap'>
                        <button
                            className={`${
                                size === 'small' ? 'py-1 px-2  w-28' : 'py-2 px-16'
                            } rounded-md text-teal-400 text-semibold border-2 border-teal-400 hover:bg-teal-300 hover:text-white`}
                        >
                            Follow
                        </button>
                    </div>
                )
            ) : (
                <CircularProgress />
            )}
        </>
    );
}

export default Follow;
