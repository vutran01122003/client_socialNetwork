import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { getSuggestUser } from '../../redux/actions/suggestUser';
import { suggestedUsersSelector } from '../../redux/selector';
import { CircularProgress } from '@mui/material';
import UserCard from '../UserCard';
import SidebarItem from './SidebarItem';
import AccountBoxOutlinedIcon from '@mui/icons-material/AccountBoxOutlined';
import MessageOutlinedIcon from '@mui/icons-material/MessageOutlined';
import ImageSearchIcon from '@mui/icons-material/ImageSearch';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import StorefrontIcon from '@mui/icons-material/Storefront';

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
                    <SidebarItem
                        name={'My Profile'}
                        Icon={AccountBoxOutlinedIcon}
                        url={`/profile/${auth.user?._id}`}
                    />
                    <SidebarItem name={'Marketplace'} Icon={StorefrontIcon} url={'/marketplace'} />
                    <SidebarItem name={'Message'} Icon={MessageOutlinedIcon} url={'/message'} />
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
                                    <h3 className='text-center font-semibold mt-10 text-gray-500'>
                                        No User
                                    </h3>
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
