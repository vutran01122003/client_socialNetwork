import { useSelector } from 'react-redux';
import MessageIcon from '@mui/icons-material/Message';
import MessageInput from '../components/message/MessageInput';
import MessageScreen from '../components/message/MessageScreen';
import { authSelector, messageSelector } from '../redux/selector';

function Message() {
    const auth = useSelector(authSelector);
    const message = useSelector(messageSelector);

    return (
        <div className='message_wrapper'>
            {Object.keys(message.currentReceiver).length > 0 ? (
                <div className='message'>
                    <div className='message_screen'>
                        <MessageScreen auth={auth} message={message} />
                    </div>
                    <div className='message_input'>
                        <MessageInput auth={auth} currentReceiver={message.currentReceiver} />
                    </div>
                </div>
            ) : (
                <div className='message_notify'>
                    <MessageIcon fontSize='large' />
                    <span>Select user to message </span>
                </div>
            )}
        </div>
    );
}

export default Message;
