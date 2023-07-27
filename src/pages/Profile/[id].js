import { useParams } from 'react-router-dom';
import Info from '../../components/profile/Info';
import Post from '../../components/profile/Post';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { authSelector, profileSelector } from '../../redux/selector';
import { getUser } from '../../redux/actions/profileActions';
import { CircularProgress } from '@mui/material';

function Profile() {
    const { id } = useParams();
    const profile = useSelector(profileSelector);
    const auth = useSelector(authSelector);
    const [userInfo, setUserInfo] = useState(null);
    const dispatch = useDispatch();

    useEffect(() => {
        if (auth.user?._id === id) {
            setUserInfo(auth.user);
        } else {
            dispatch(getUser({ users: profile.users, id }));
            const currentUser = profile.users.find((user) => user._id === id);
            setUserInfo(currentUser);
        }
    }, [id, dispatch, profile.users, auth.user]);

    if (!userInfo && !profile.loading)
        return <span className='font-semibold'>Not Found</span>;

    return (
        <div className='profile_container flex flex-col'>
            {profile.loading ? (
                <div className='flex justify-center w-full'>
                    <CircularProgress size={50} />
                </div>
            ) : (
                <Info userInfo={userInfo} id={id} auth={auth} />
            )}
            <Post />
        </div>
    );
}

export default Profile;
