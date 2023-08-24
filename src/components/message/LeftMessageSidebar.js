import { useEffect, useRef } from 'react';
import UserCard from '../UserCard';
import { useDispatch, useSelector } from 'react-redux';
import { getConversations } from '../../redux/actions/messageAction';
import { messageSelector } from '../../redux/selector';

function RightMessageSidebar({ auth }) {
    const dispatch = useDispatch();
    const observer = useRef();
    const message = useSelector(messageSelector);
    const conversations = message.conversations?.data;

    const getLastAccount = (elem) => {
        if (observer.current) observer.current.disconnect();
        observer.current = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && !message.conversations.maxPage) {
                dispatch(getConversations({ auth, page: message.conversations.page + 1 }));
            }
        });

        if (elem) observer.current.observe(elem);
    };

    useEffect(() => {
        if (Object.keys(message.conversations).length === 0) {
            dispatch(getConversations({ auth, page: 1 }));
        }
        // eslint-disable-next-line
    }, []);

    return (
        <>
            {Object.keys(message.conversations).length > 0 && (
                <div className='left_message_sidebar'>
                    <div className='left_message_sidebar_user_list'>
                        <h1 className='left_message_sidebar_contacts'>Contacts</h1>
                        {conversations.map((conversation, index) => {
                            if (conversations.length === index + 1) {
                                return (
                                    <div ref={getLastAccount} key={conversation._id}>
                                        <UserCard
                                            user={conversation.recipients.find(
                                                (recipient) => recipient._id !== auth?.user._id
                                            )}
                                            messagePage={true}
                                            conversation={conversation}
                                        />
                                    </div>
                                );
                            }
                            return (
                                <div key={conversation._id}>
                                    <UserCard
                                        user={conversation.recipients.find(
                                            (recipient) => recipient._id !== auth?.user._id
                                        )}
                                        messagePage={true}
                                        conversation={conversation}
                                    />
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </>
    );
}

export default RightMessageSidebar;
