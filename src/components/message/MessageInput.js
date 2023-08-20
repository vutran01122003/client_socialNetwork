import ModalPost from '../home/ModalPost';
function MessageInput({ message, auth, scrollToBottom }) {
    return (
        <ModalPost
            auth={auth}
            messageInput={true}
            message={message}
            scrollToBottom={scrollToBottom}
        />
    );
}

export default MessageInput;
