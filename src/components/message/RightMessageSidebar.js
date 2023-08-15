import UserCard from '../UserCard';

function RightMessageSidebar({ auth }) {
    return (
        <div className='app_right_message_sidebar'>
            <div className='right_message_sidebar'>
                <div className='right_message_sidebar_user_list'>
                    <h1 className='right_message_sidebar_contacts'>Contacts</h1>
                    {auth.user.following.map((user) => {
                        if (user.following && user.following.includes(auth.user._id))
                            return <UserCard key={user._id} user={user} messagePage={true} />;
                        return null;
                    })}
                </div>
            </div>
        </div>
    );
}

export default RightMessageSidebar;
