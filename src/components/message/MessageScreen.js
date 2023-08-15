import BodyCard from '../home/postCard/BodyCard';

function MessageScreen({ auth, message }) {
    return (
        <div className='message_screen_wrapper'>
            {message.messages.map((message, index) => (
                <div key={message.sender + index} className='message_item'>
                    <BodyCard post={message} messagePage={true} />
                </div>
            ))}
        </div>
    );
}

export default MessageScreen;
