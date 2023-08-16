import ModalPost from '../home/ModalPost';
function MessageInput({ auth, currentReceiver, scrollToBottom }) {
    return (
        <ModalPost
            auth={auth}
            messageInput={true}
            currentReceiver={currentReceiver}
            scrollToBottom={scrollToBottom}
        />
    );
}

export default MessageInput;
