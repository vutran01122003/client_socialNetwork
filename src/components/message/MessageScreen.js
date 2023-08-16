import { useEffect } from 'react';
import BodyCard from '../home/postCard/BodyCard';

function MessageScreen({ auth, message, scrollToBottom }) {
    useEffect(() => {
        if (message.messages[message.currentConversation._id]) {
            setTimeout(() => {
                scrollToBottom();
            }, 0);
        }
        // eslint-disable-next-line
    }, [message.messages]);

    return (
        <div className='message_screen_wrapper'>
            {message.messages[message.currentConversation._id] &&
                message.messages[message.currentConversation._id].map((message, index) => (
                    <div key={message._id + index}>
                        <div
                            key={message._id}
                            className={`${
                                message.sender === auth?.user._id
                                    ? 'message_sender'
                                    : 'message_receiver'
                            } message_item`}
                        >
                            <BodyCard post={message} messagePage={true} />
                        </div>
                    </div>
                ))}
        </div>
    );
}

export default MessageScreen;
