import { useParams } from 'react-router-dom';
import Info from '../../components/profile/Info';
import Post from '../../components/profile/Post';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { profileSelector } from '../../redux/selector';
import { getUser } from '../../redux/actions/profileActions';
import { CircularProgress } from '@mui/material';

function Profile() {
    const { id } = useParams();
    const profile = useSelector(profileSelector);
    const [userInfo, setUserInfo] = useState(null);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getUser({ users: profile.users, id }));
        if (profile.users.length > 0) {
            const currentUser = profile.users.find((user) => user._id === id);
            setUserInfo(currentUser);
        }
    }, [id, dispatch, profile.users]);

    if (!userInfo) return <span className='font-semibold'>Not Found</span>;

    return (
        <div className='profile_container flex flex-col mx-10 mt-2 bg-white p-5 rounded-md'>
            {profile.loading ? (
                <div className='flex justify-center w-full'>
                    <CircularProgress size={50} />
                </div>
            ) : (
                <Info userInfo={userInfo} id={id} />
            )}
            <Post />
        </div>
    );
}

export default Profile;
