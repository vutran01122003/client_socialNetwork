import { useRef } from 'react';
import { useSelector } from 'react-redux';
import MessageIcon from '@mui/icons-material/Message';
import MessageInput from '../components/message/MessageInput';
import MessageScreen from '../components/message/MessageScreen';
import LeftMessageSidebar from '../components/message/LeftMessageSidebar';
import { authSelector, messageSelector } from '../redux/selector';
import UserCard from '../components/UserCard';

function Message() {
    const auth = useSelector(authSelector);
    const message = useSelector(messageSelector);
    const messageScreenRef = useRef();

    const scrollToBottom = () => {
        const messageScreenElem = messageScreenRef.current;
        messageScreenElem.scrollTop = messageScreenElem.scrollHeight;
    };

    return (
        <>
            {auth.user && (
                <>
                    <LeftMessageSidebar auth={auth} />
                    {Object.keys(message.currentReceiver).length > 0 ? (
                        <div className='message_wrapper'>
                            <div className='message_user_header'>
                                <UserCard user={message.currentReceiver} header={true} />
                            </div>
                            <div ref={messageScreenRef} className='message_screen'>
                                <MessageScreen
                                    auth={auth}
                                    message={message}
                                    scrollToBottom={scrollToBottom}
                                />
                            </div>
                            <div className='message_input'>
                                <MessageInput
                                    auth={auth}
                                    currentReceiver={message.currentReceiver}
                                    scrollToBottom={scrollToBottom}
                                />
                            </div>
                        </div>
                    ) : (
                        <div className='message_notify'>
                            <MessageIcon fontSize='large' />
                            <span>Select user to message </span>
                        </div>
                    )}
                </>
            )}
        </>
    );
}

export default Message;
