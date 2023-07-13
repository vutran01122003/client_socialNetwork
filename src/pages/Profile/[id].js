import { useParams } from 'react-router-dom';
import Info from '../../components/profile/Info';
import Post from '../../components/profile/Post';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { authSelector, profileSelector } from '../../redux/selector';
import { getUser } from '../../redux/actions/profileActions';
import { CircularProgress } from '@mui/material';
import { GLOBALTYPES } from '../../redux/actions/globalTypes';

function Profile() {
    const { id } = useParams();
    const auth = useSelector(authSelector);
    const [userInfo, setUserInfo] = useState({});
    const profile = useSelector(profileSelector);
    const dispatch = useDispatch();

    useEffect(() => {
        if (auth.user?._id === id) {
            setUserInfo(auth.user);
            dispatch({
                type: GLOBALTYPES.PROFILE.LOADING,
                payload: false
            });
        } else {
            dispatch(getUser({ users: profile.users, id }));
            const userCurrent = profile.users.find((user) => user._id === id);
            setUserInfo(userCurrent);
        }
    }, [id, auth, dispatch, profile.users]);

    if (profile.users.length === 0 && auth.user?._id !== id)
        return <span className='font-semibold'>Not Found</span>;

    return (
        <div className='profile_container flex flex-col mx-10 mt-2 bg-white p-5 rounded-md'>
            {profile.loading ? (
                <div className='flex justify-center w-full'>
                    <CircularProgress size={50} />
                </div>
            ) : (
                <Info
                    userInfo={
                        userInfo ||
                        profile.users.find((user) => user._id === id)
                    }
                />
            )}
            <Post />
        </div>
    );
}

export default Profile;
