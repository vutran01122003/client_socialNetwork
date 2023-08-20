import { useEffect } from 'react';
import UserCard from '../UserCard';
import { useDispatch, useSelector } from 'react-redux';
import { getConversations } from '../../redux/actions/messageAction';
import { messageSelector } from '../../redux/selector';

function RightMessageSidebar({ auth }) {
    const dispatch = useDispatch();
    const message = useSelector(messageSelector);
    const conversations = message.conversations;

    useEffect(() => {
        if (message.conversations.length === 0) {
            dispatch(getConversations({ auth }));
        }
        // eslint-disable-next-line
    }, []);

    return (
        <>
            {conversations && (
                <div className='left_message_sidebar'>
                    <div className='left_message_sidebar_user_list'>
                        <h1 className='left_message_sidebar_contacts'>Contacts</h1>
                        {conversations.map((conversation) => (
                            <UserCard
                                key={conversation._id}
                                user={conversation.recipients.find(
                                    (recipient) => recipient._id !== auth?.user._id
                                )}
                                messagePage={true}
                                conversation={conversation}
                            />
                        ))}
                    </div>
                </div>
            )}
        </>
    );
}

export default RightMessageSidebar;
