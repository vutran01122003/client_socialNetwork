import ModalPost from '../home/ModalPost';
function MessageInput({ auth, currentReceiver }) {
    return <ModalPost auth={auth} messageInput={true} currentReceiver={currentReceiver} />;
}

export default MessageInput;
