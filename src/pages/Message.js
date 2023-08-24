import { useCallback, useRef } from 'react';
import { useSelector } from 'react-redux';
import MessageIcon from '@mui/icons-material/Message';
import MessageInput from '../components/message/MessageInput';
import MessageScreen from '../components/message/MessageScreen';
import LeftMessageSidebar from '../components/message/LeftMessageSidebar';
import {
    authSelector,
    callSelector,
    messageSelector,
    peerSelector,
    socketSelector
} from '../redux/selector';
import UserCard from '../components/UserCard';
import CallModal from '../components/message/CallModal';

function Message() {
    const auth = useSelector(authSelector);
    const message = useSelector(messageSelector);
    const call = useSelector(callSelector);
    const peer = useSelector(peerSelector);
    const socket = useSelector(socketSelector);
    const messageScreenRef = useRef();

    const scrollToBottom = useCallback((prevScrollHeight) => {
        const messageScreenElem = messageScreenRef.current;
        messageScreenElem.scrollTop =
            messageScreenElem.scrollHeight - (prevScrollHeight > 0 ? prevScrollHeight : 0);
    }, []);

    return (
        <>
            {auth.user && (
                <>
                    <LeftMessageSidebar auth={auth} />
                    {Object.keys(message.currentReceiver).length > 0 ? (
                        <div className='message_wrapper'>
                            <div className='message_user_header'>
                                <UserCard
                                    user={message.currentReceiver}
                                    conversationHeader={message.currentConversation}
                                    call={call}
                                    peer={peer}
                                    auth={auth}
                                    socket={socket}
                                />
                            </div>
                            <div ref={messageScreenRef} className='message_screen'>
                                <MessageScreen
                                    auth={auth}
                                    message={message}
                                    scrollToBottom={scrollToBottom}
                                    messageScreenRef={messageScreenRef}
                                />
                            </div>
                            <div className='message_input'>
                                <MessageInput
                                    auth={auth}
                                    message={message}
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
                    {Object.keys(call).length > 0 && !call.calling && (
                        <CallModal auth={auth} call={call} socket={socket} peer={peer} />
                    )}
                </>
            )}
        </>
    );
}

export default Message;
