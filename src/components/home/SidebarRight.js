import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { getSuggestUser } from '../../redux/actions/suggestUser';
import { suggestedUsersSelector } from '../../redux/selector';
import { CircularProgress } from '@mui/material';
import UserCard from '../UserCard';

function SidebarLeft({ auth }) {
    const dispatch = useDispatch();
    const suggestedUsers = useSelector(suggestedUsersSelector);

    useEffect(() => {
        dispatch(getSuggestUser());
    }, [dispatch]);

    return (
        <div className='app_sidebar_right'>
            <div className='sidebar_right'>
                <div className='suggestion_wrapper'>
                    <h1 className='suggestion_title'>Suggestions</h1>
                    <div className='suggestion_users_wrapper'>
                        {suggestedUsers?.loading ? (
                            <CircularProgress className='absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2' />
                        ) : (
                            <>
                                {suggestedUsers?.users.length === 0 ? (
                                    <h3 className='text-center font-semibold mt-10'>No User</h3>
                                ) : (
                                    <>
                                        {suggestedUsers.users.map((user) => (
                                            <UserCard key={user._id} user={user} auth={auth} />
                                        ))}
                                    </>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SidebarLeft;
