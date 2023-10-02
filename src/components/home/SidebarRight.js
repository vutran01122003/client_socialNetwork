import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { messageSelector } from '../../redux/selector';
import UserCard from '../UserCard';
import { getConversation, getConversations } from '../../redux/actions/messageAction';

function SidebarRight({ auth }) {
    const dispatch = useDispatch();
    const message = useSelector(messageSelector);
    const conversations = message.conversations?.data;
    const handleMessage = async (user) => {
        dispatch(
            getConversation({
                userData: user,
                message
            })
        );
    };

    useEffect(() => {
        dispatch(getConversations({ auth, page: 1 }));
        // eslint-disable-next-line
    }, [dispatch]);

    return (
        <div className='app_sidebar_right'>
            <div className='sidebar_right'>
                <div className='contact_wrapper'>
                    <h1 className='contact_title'>Contacts</h1>
                    <div className='contact_users_wrapper'>
                        {Object.keys(message.conversations).length > 0 && (
                            <>
                                {conversations.length !== 0 ? (
                                    <>
                                        {conversations.map((conversation) => {
                                            return (
                                                <div key={conversation._id}>
                                                    <UserCard
                                                        user={conversation.recipients.find(
                                                            (recipient) =>
                                                                recipient._id !== auth?.user._id
                                                        )}
                                                        auth={auth}
                                                        onClick={handleMessage}
                                                        conversation={conversation}
                                                        homeSidebar={true}
                                                        contactSidebar={true}
                                                    />
                                                </div>
                                            );
                                        })}
                                    </>
                                ) : (
                                    <span className='w-full flex items-center justify-center text-gray-500 font-semibold'>
                                        No contact
                                    </span>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SidebarRight;
