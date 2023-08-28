import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { getSuggestUser } from '../../redux/actions/suggestUser';
import { suggestedUsersSelector } from '../../redux/selector';
import { CircularProgress } from '@mui/material';
import UserCard from '../UserCard';
import SidebarItem from './SidebarItem';
import SwitchAccountIcon from '@mui/icons-material/SwitchAccount';
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';
import MessageIcon from '@mui/icons-material/Message';
import ImageSearchIcon from '@mui/icons-material/ImageSearch';
import AutorenewIcon from '@mui/icons-material/Autorenew';

function SidebarLeft({ auth }) {
    const dispatch = useDispatch();
    const suggestedUsers = useSelector(suggestedUsersSelector);
    const handleResetSuggestedUsers = () => {
        dispatch(getSuggestUser());
    };
    useEffect(() => {
        if (suggestedUsers.users.length === 0) dispatch(getSuggestUser());
    }, [dispatch, suggestedUsers.users.length]);

    return (
        <div className='app_sidebar_left'>
            <div className='sidebar_left'>
                <div className='suggestion_wrapper'>
                    <div className='auth_user_wrapper'>
                        <UserCard user={auth.user} homeSidebar={true} />
                    </div>
                    <SidebarItem name={'Saved'} Icon={SwitchAccountIcon} />
                    <SidebarItem name={'Videos'} Icon={VideoLibraryIcon} />
                    <SidebarItem name={'Message'} Icon={MessageIcon} url={'/message'} />
                    <SidebarItem name={'Discover'} Icon={ImageSearchIcon} url={'/discover'} />
                    <div className='flex gap-2 items-center suggestion_title_wrapper'>
                        <h1 className='suggestion_title'>Suggestions</h1>
                        <div onClick={handleResetSuggestedUsers} className='new_suggested_user_btn'>
                            <AutorenewIcon />
                        </div>
                    </div>

                    <div className='suggestion_users_wrapper'>
                        {suggestedUsers?.loading ? (
                            <div className='w-full flex justify-center mt-6'>
                                <CircularProgress />
                            </div>
                        ) : (
                            <>
                                {suggestedUsers?.users.length === 0 ? (
                                    <h3 className='text-center font-semibold mt-10'>No User</h3>
                                ) : (
                                    <>
                                        {suggestedUsers.users.map((user) => (
                                            <UserCard
                                                key={user._id}
                                                user={user}
                                                auth={auth}
                                                homeSidebar={true}
                                            />
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
