import Tippy from '@tippyjs/react/headless';
import { Link } from 'react-router-dom';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import CancelPresentationIcon from '@mui/icons-material/CancelPresentation';
import DoneIcon from '@mui/icons-material/Done';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import moment from 'moment';
import Avatar from '../Avatar';
import { useCallback, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import {
    deleteNotification,
    deleteNotifications,
    readedNotification,
    readedNotifications,
    unreadedNotification
} from '../../redux/actions/notifyAction';

function Notification({
    auth,
    notifications,
    handleActivePage,
    handleToggleNotify,
    setNextPageNotification
}) {
    const dispatch = useDispatch();
    const [showMoreBtn, setShowMoreBtn] = useState(false);
    const [showMoreNotificationsBtn, setShowMoreNotificationsBtn] = useState(false);
    const [noticationId, setNotificationId] = useState(null);
    const observer = useRef();

    const lastPostElementRef = useCallback(
        (elem) => {
            if (observer.current) observer.current.disconnect();
            observer.current = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting) {
                    setNextPageNotification((prev) => prev + 1);
                }
            });
            if (elem) observer.current.observe(elem);
        },
        [setNextPageNotification]
    );

    const handleReadNotification = (notificationId, readedUserList) => {
        if (!readedUserList.includes(auth.user._id)) {
            dispatch(
                readedNotification({
                    notificationId,
                    userId: auth.user._id
                })
            );
        }
    };

    const handleUnreadNotification = (notificationId, readedUserList) => {
        if (readedUserList.includes(auth.user._id)) {
            dispatch(
                unreadedNotification({
                    notificationId,
                    userId: auth.user._id
                })
            );
        }
    };

    const handleToggleShowMoreBtn = () => {
        setShowMoreBtn((prev) => !prev);
    };

    const handleToggleShowMoreNotificationsBtn = () => {
        setShowMoreNotificationsBtn((prev) => !prev);
    };

    const handleDeleteNotification = (notificationId) => {
        dispatch(deleteNotification({ userId: auth.user._id, id: notificationId }));
    };

    const handleDeleteAllNotifications = () => {
        dispatch(deleteNotifications({ userId: auth.user._id, notifications }));
    };

    const handleReadedAllNotifications = () => {
        dispatch(readedNotifications({ userId: auth.user._id, notifications }));
    };

    return (
        <div className='notify_wrapper'>
            <div className='notify_title_wrapper'>
                <h1 className='notify_title'>Notifications</h1>
                <Tippy
                    interactive
                    visible={showMoreNotificationsBtn}
                    placement='bottom-start'
                    onClickOutside={handleToggleShowMoreNotificationsBtn}
                    render={(attrs) => (
                        <div className='more_wrapper' tabIndex='-1' {...attrs}>
                            <div
                                onClick={() => {
                                    handleToggleShowMoreNotificationsBtn();
                                    handleReadedAllNotifications();
                                }}
                                className='more_item'
                            >
                                <DoneIcon />
                                <span>Mark all as read</span>
                            </div>
                            <div
                                onClick={() => {
                                    handleToggleShowMoreNotificationsBtn();
                                    handleDeleteAllNotifications();
                                }}
                                className='more_item'
                            >
                                <CancelPresentationIcon /> <span>Remove all notifications</span>
                            </div>
                        </div>
                    )}
                >
                    <div
                        onClick={handleToggleShowMoreNotificationsBtn}
                        className='more_icon_notications_wrapper'
                    >
                        <MoreHorizIcon />
                    </div>
                </Tippy>
            </div>
            {notifications.length === 0 ? (
                <div className='w-full p-5 flex justify-center font-semibold'>No Notification</div>
            ) : (
                <>
                    {notifications.map((notifyItem, index) => (
                        <div
                            ref={notifications.length === index + 1 ? lastPostElementRef : null}
                            key={notifyItem._id}
                            className={` notify_item_wrapper`}
                        >
                            <Link
                                to={notifyItem.url}
                                className='notify_item'
                                onClick={() => {
                                    handleActivePage('');
                                    handleToggleNotify();
                                    handleReadNotification(notifyItem._id, notifyItem.readedUser);
                                }}
                            >
                                <span>
                                    <Avatar avatar={notifyItem.avatar} size='notify_size' />
                                </span>
                                <div className='notify_content_wrapper'>
                                    <div className='notify_content'>
                                        <span className='notify_content_title'>
                                            {notifyItem.title}
                                        </span>{' '}
                                        {notifyItem.content}
                                    </div>
                                    <div className='notify_createdAt'>
                                        {moment(notifyItem.createdAt).fromNow()}
                                    </div>
                                </div>
                                {notifyItem.file && (
                                    <>
                                        {notifyItem.file?.includes('/video/upload/') ? (
                                            <video preload='metadata'>
                                                <source src={notifyItem.file + '#t=0.1'} />
                                            </video>
                                        ) : (
                                            <div className='notify_image_wrapper'>
                                                <img
                                                    className='h-full'
                                                    src={notifyItem.file}
                                                    alt='image_post'
                                                />
                                            </div>
                                        )}
                                    </>
                                )}
                            </Link>
                            <div className='notify_control_wrapper'>
                                <div>
                                    <Tippy
                                        interactive
                                        visible={showMoreBtn && noticationId === notifyItem._id}
                                        onClickOutside={handleToggleShowMoreBtn}
                                        placement='bottom-start'
                                        render={(attrs) => (
                                            <div className='box' tabIndex='-1' {...attrs}>
                                                <div className='more_wrapper'>
                                                    {!notifyItem.readedUser.includes(
                                                        auth.user._id
                                                    ) ? (
                                                        <div
                                                            onClick={() => {
                                                                handleToggleShowMoreBtn();
                                                                handleReadNotification(
                                                                    notifyItem._id,
                                                                    notifyItem.readedUser
                                                                );
                                                            }}
                                                            className='more_item'
                                                        >
                                                            <DoneIcon /> <span>Mark as read</span>
                                                        </div>
                                                    ) : (
                                                        <div
                                                            onClick={() => {
                                                                handleToggleShowMoreBtn();
                                                                handleUnreadNotification(
                                                                    notifyItem._id,
                                                                    notifyItem.readedUser
                                                                );
                                                            }}
                                                            className='more_item'
                                                        >
                                                            <DoneIcon /> <span>Mark as unread</span>
                                                        </div>
                                                    )}

                                                    <div
                                                        onClick={() => {
                                                            handleToggleShowMoreBtn();
                                                            handleDeleteNotification(
                                                                notifyItem._id
                                                            );
                                                        }}
                                                        className='more_item'
                                                    >
                                                        <CancelPresentationIcon />{' '}
                                                        <span>Remove this notification</span>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    >
                                        <div
                                            onClick={() => {
                                                handleToggleShowMoreBtn();
                                                setNotificationId(notifyItem._id);
                                            }}
                                            className='notify_more_btn'
                                        >
                                            <MoreVertIcon fontSize='small' />
                                        </div>
                                    </Tippy>
                                </div>
                                {!notifyItem.readedUser.includes(auth.user._id) && (
                                    <div className='unread_symbol'>
                                        <FiberManualRecordIcon fontSize='inherit' />
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </>
            )}
        </div>
    );
}

export default Notification;
