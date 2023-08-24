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
        if (auth.user) {
            if (auth.user?._id === id) {
                setUserInfo(auth.user);
            } else {
                if (!profile.users.some((user) => user._id === id)) {
                    dispatch(getUser({ users: profile.users, id }));
                }

                const currentUser = profile.users.find((user) => user._id === id);

                if (currentUser) setUserInfo(currentUser);
            }
        }
    }, [profile.users, auth.user, id, dispatch]);

    if (!userInfo && !profile.loading)
        return <div className='font-semibold w-full h-full text-center mt-10'>User Not Found</div>;

    return (
        <>
            {auth.user && (
                <div className='profile_container flex flex-col'>
                    <Info userInfo={userInfo} id={id} auth={auth} />
                    <Post userInfo={userInfo} id={id} auth={auth} profile={profile} />
                </div>
            )}
        </>
    );
}

export default Profile;
