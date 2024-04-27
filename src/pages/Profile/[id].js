import { useParams } from 'react-router-dom';
import Info from '../../components/profile/Info';
import Post from '../../components/profile/Post';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { alertSelector, authSelector, profileSelector } from '../../redux/selector';
import { getUser } from '../../redux/actions/profileActions';

function Profile() {
    const { id } = useParams();
    const profile = useSelector(profileSelector);
    const auth = useSelector(authSelector);
    const alert = useSelector(alertSelector);
    const [userInfo, setUserInfo] = useState(null);
    const dispatch = useDispatch();

    useEffect(() => {
        if (auth.user) {
            if (auth.user?._id === id) {
                setUserInfo(auth.user);
            } else {
                if (!profile.users.some((user) => user._id === id)) {
                    dispatch(getUser({ users: profile.users, id }));
                } else {
                    const currentUser = profile.users.find((user) => user._id === id);
                    if (currentUser) setUserInfo(currentUser);
                }
            }
        }
    }, [profile.users, auth.user, id, dispatch]);

    return (
        <>
            {auth.user && userInfo ? (
                <div className='profile_container flex flex-col'>
                    <Info userInfo={userInfo} auth={auth} />
                    <Post id={id} auth={auth} profile={profile} />
                </div>
            ) : (
                alert.error === 'user not found' && (
                    <div className='font-semibold w-full h-full text-center mt-10'>
                        User Not Found
                    </div>
                )
            )}
        </>
    );
}

export default Profile;
