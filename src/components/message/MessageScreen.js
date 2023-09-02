import { useCallback, useEffect, useRef, useState } from 'react';
import Tippy from '@tippyjs/react/headless';
import BodyCard from '../home/postCard/BodyCard';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useDispatch } from 'react-redux';
import { deleteMessage, getMessages } from '../../redux/actions/messageAction';
import Avatar from '../Avatar';

function MessageScreen({ auth, message, scrollToBottom, messageScreenRef }) {
    const dispatch = useDispatch();
    const observer = useRef();
    const [prevScrollHeight, setPrevScrollHeight] = useState(0);
    const [messageId, setMessageId] = useState(null);
    const [openMoreMessage, setOpenMoreMessage] = useState(false);
    const [currentConverstion, setCurrentConversation] = useState(message.currentConversation);

    const handleToggleOpenMoreMessage = () => {
        setOpenMoreMessage((prev) => !prev);
    };

    const handleDeleteMessage = (messageId) => {
        dispatch(deleteMessage({ messageId }));
    };

    const firstMessageElementRef = useCallback(
        (elem) => {
            if (message.loading) return;
            if (observer.current) observer.current.disconnect();
            observer.current = new IntersectionObserver((entries) => {
                if (
                    entries[0].isIntersecting &&
                    !message.messages[message.currentConversation._id].maxPage
                ) {
                    setPrevScrollHeight(messageScreenRef.current.scrollHeight);
                    dispatch(
                        getMessages({
                            page: message.messages[message.currentConversation._id].page + 1,
                            currentMessages:
                                message.messages[message.currentConversation._id].result,
                            conversation: message.currentConversation
                        })
                    );
                }
            });

            if (elem) observer.current.observe(elem);
        },
        // eslint-disable-next-line
        [message.loading, message.messages]
    );

    useEffect(() => {
        if (
            message.messages[message.currentConversation._id]?.data.length >=
            message.messages[message.currentConversation._id]?.result
        ) {
            if (currentConverstion._id === message.currentConversation?._id) {
                scrollToBottom(prevScrollHeight);
            } else {
                setCurrentConversation(message.currentConversation);
                setPrevScrollHeight(0);
                scrollToBottom(0);
            }
        }

        // eslint-disable-next-line
    }, [message.messages, message.currentConversation?._id, scrollToBottom]);

    useEffect(() => {
        const currentMessageScreenRef = messageScreenRef.current;
        const handleScroll = () => {
            setOpenMoreMessage(false);
        };

        if (openMoreMessage) {
            currentMessageScreenRef.addEventListener('scroll', handleScroll);
        } else {
            currentMessageScreenRef.removeEventListener('scroll', handleScroll);
        }

        return () => {
            currentMessageScreenRef.removeEventListener('scroll', handleScroll);
        };
    }, [openMoreMessage, messageScreenRef]);

    return (
        <>
            {message.messages[message.currentConversation?._id] && (
                <div className='message_screen_wrapper'>
                    {message.messages[message.currentConversation?._id] &&
                        message.messages[message.currentConversation?._id].data.map(
                            (messageItem, index) => (
                                <div key={messageItem._id}>
                                    <div
                                        ref={index === 0 ? firstMessageElementRef : null}
                                        key={messageItem._id}
                                        className={`${
                                            messageItem.sender === auth?.user._id
                                                ? 'message_sender'
                                                : 'message_receiver'
                                        } message_item`}
                                    >
                                        {messageItem.sender !== auth?.user._id && (
                                            <Avatar
                                                avatar={message.currentReceiver.avatar}
                                                size='small'
                                            />
                                        )}

                                        <div className='flex items-center gap-1'>
                                            <div
                                                className={`${
                                                    messageItem.sender === auth?.user._id
                                                        ? 'order-2'
                                                        : 'order-1'
                                                } cursor-pointer`}
                                            >
                                                <BodyCard post={messageItem} messagePage={true} />
                                            </div>

                                            <Tippy
                                                interactive
                                                visible={
                                                    openMoreMessage && messageId === messageItem._id
                                                }
                                                onClickOutside={handleToggleOpenMoreMessage}
                                                placement='top-start'
                                                render={(attrs) => (
                                                    <div
                                                        className='more_wrapper'
                                                        tabIndex='-1'
                                                        {...attrs}
                                                    >
                                                        <>
                                                            {messageItem.sender ===
                                                            auth?.user._id ? (
                                                                <div
                                                                    onClick={() => {
                                                                        handleDeleteMessage(
                                                                            messageItem._id
                                                                        );
                                                                    }}
                                                                    className='more_item'
                                                                >
                                                                    Remove
                                                                </div>
                                                            ) : (
                                                                <div className='more_item'>
                                                                    Report
                                                                </div>
                                                            )}
                                                        </>
                                                    </div>
                                                )}
                                            >
                                                <div
                                                    onClick={() => {
                                                        handleToggleOpenMoreMessage();
                                                        setMessageId(messageItem._id);
                                                    }}
                                                    className={`${
                                                        messageItem.sender === auth?.user._id
                                                            ? 'order-1'
                                                            : 'order-2'
                                                    } cursor-pointer more_message_btn text-gray-500 icon-item active:text-gray-600`}
                                                >
                                                    <MoreVertIcon />
                                                </div>
                                            </Tippy>
                                        </div>
                                    </div>
                                </div>
                            )
                        )}
                </div>
            )}
        </>
    );
}

export default MessageScreen;
