import Tippy from '@tippyjs/react/headless';
import { Link } from 'react-router-dom';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import CancelPresentationIcon from '@mui/icons-material/CancelPresentation';
import DoneIcon from '@mui/icons-material/Done';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import moment from 'moment';
import Avatar from '../Avatar';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import {
    deleteNotification,
    readedNotification,
    unreadedNotification
} from '../../redux/actions/notifyAction';

function Notification({
    auth,
    notifications,
    handleActivePage,
    handleToggleNotify
}) {
    const dispatch = useDispatch();
    const [showMoreBtn, setShowMoreBtn] = useState(false);
    const [noticationId, setNotificationId] = useState(null);

    const handleReadNotification = (notificationId) => {
        dispatch(
            readedNotification({
                notificationId,
                userId: auth.user._id
            })
        );
    };

    const handleUnreadNotification = (notificationId) => {
        dispatch(
            unreadedNotification({
                notificationId,
                userId: auth.user._id
            })
        );
    };

    const handleToggleShowMoreBtn = () => {
        setShowMoreBtn((prev) => !prev);
    };

    const handleDeleteNotification = (notificationId) => {
        dispatch(
            deleteNotification({ userId: auth.user._id, id: notificationId })
        );
    };

    return (
        <div className='notify_wrapper'>
            <h1 className='notify_title'>Notifications</h1>
            {notifications.length === 0 ? (
                <div className='w-full p-5 flex justify-center font-semibold'>
                    No Notification
                </div>
            ) : (
                <>
                    {notifications.map((notifyItem) => (
                        <div
                            key={notifyItem._id}
                            className={` notify_item_wrapper`}
                        >
                            <Link
                                to={notifyItem.url}
                                className='notify_item'
                                onClick={() => {
                                    handleActivePage('');
                                    handleToggleNotify();
                                }}
                            >
                                <span>
                                    <Avatar
                                        avatar={notifyItem.avatar}
                                        size='notify_size'
                                    />
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
                                {notifyItem.image && (
                                    <div className='notify_image_wrapper'>
                                        <img
                                            className='h-full'
                                            src={notifyItem.image}
                                            alt='image_post'
                                        />
                                    </div>
                                )}
                            </Link>
                            <div className='notify_control_wrapper'>
                                <Tippy
                                    interactive
                                    visible={
                                        showMoreBtn &&
                                        noticationId === notifyItem._id
                                    }
                                    onClickOutside={handleToggleShowMoreBtn}
                                    placement='bottom-start'
                                    render={(attrs) => (
                                        <div
                                            className='box'
                                            tabIndex='-1'
                                            {...attrs}
                                        >
                                            <div className='more_wrapper opacity-unset'>
                                                {!notifyItem.readedUser.includes(
                                                    auth.user._id
                                                ) ? (
                                                    <div
                                                        onClick={() => {
                                                            handleToggleShowMoreBtn();
                                                            handleReadNotification(
                                                                notifyItem._id
                                                            );
                                                        }}
                                                        className='more_item'
                                                    >
                                                        <DoneIcon />{' '}
                                                        <span>
                                                            Mark as read
                                                        </span>
                                                    </div>
                                                ) : (
                                                    <div
                                                        onClick={() => {
                                                            handleToggleShowMoreBtn();
                                                            handleUnreadNotification(
                                                                notifyItem._id
                                                            );
                                                        }}
                                                        className='more_item'
                                                    >
                                                        <DoneIcon />{' '}
                                                        <span>
                                                            Mark as unread
                                                        </span>
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
                                                    <span>
                                                        Remove this notification
                                                    </span>
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
                                {!notifyItem.readedUser.includes(
                                    auth.user._id
                                ) && (
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
