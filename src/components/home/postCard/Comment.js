import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import SendIcon from '@mui/icons-material/Send';
import Tippy from '@tippyjs/react/headless';
import { Link } from 'react-router-dom';

import Avatar from '../../Avatar';
import moment from 'moment';
import Content from '../../Content';
import { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import {
    deleteComment,
    updateComment,
    likeComment,
    unlikeComment
} from '../../../redux/actions/postAction';

function Comment({ post, auth }) {
    const dispatch = useDispatch();
    const [openMorePopup, setOpenMorePopup] = useState(false);
    const [commentId, setCommentId] = useState(null);
    const [editComment, setEditComment] = useState(false);
    const [editCommentValue, setEditCommentValue] = useState('');
    const textareaRef = useRef();

    const handleToggleMorePopup = () => {
        setOpenMorePopup((prev) => !prev);
    };

    const handleHideEditComment = () => {
        setEditComment(false);
    };

    const handleLikeComment = (commentId) => {
        dispatch(
            likeComment({ postId: post._id, commentId, userId: auth.user?._id })
        );
    };

    const handleUnlikeComment = (commentId) => {
        dispatch(
            unlikeComment({
                postId: post._id,
                commentId,
                userId: auth.user?._id
            })
        );
    };
    const handleDeleteComment = (commentId) => {
        dispatch(
            deleteComment({
                postId: post._id,
                commentId
            })
        );
    };

    const handleOpenEditComment = () => {
        setEditComment(true);
    };

    const handleChangeEditCommentValue = (e) => {
        textareaRef.current.focus();
        textareaRef.current.setAttribute(
            'style',
            'height:' + textareaRef.current.scrollHeight + 'px;'
        );
        setEditCommentValue(e.target.value);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Escape') handleHideEditComment();
    };

    const handleEditComment = async (commentId, originCommentValue) => {
        if (editCommentValue === originCommentValue) {
            handleHideEditComment();
            return;
        }

        if (editCommentValue !== '') {
            await dispatch(
                updateComment({
                    postId: post._id,
                    commentId,
                    content: editCommentValue
                })
            );
            handleHideEditComment();
        }
    };
    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.setAttribute(
                'style',
                'height:' + textareaRef.current.scrollHeight + 'px;'
            );
        }
    }, [editComment]);

    return (
        <div className='comment_wrapper'>
            {post.comments.map((comment) => (
                <div key={comment._id} className='comment_item'>
                    <Link to={`/profile/${comment.user?._id}`}>
                        <Avatar avatar={comment.user?.avatar} size='small' />
                    </Link>
                    {editComment && commentId === comment._id ? (
                        <div className='edit_comment_wrapper'>
                            <textarea
                                ref={textareaRef}
                                className='edit_comment_textarea'
                                value={editCommentValue}
                                autoFocus
                                onChange={handleChangeEditCommentValue}
                                onFocus={(e) => {
                                    e.currentTarget.setSelectionRange(
                                        e.currentTarget.value.length,
                                        e.currentTarget.value.length
                                    );
                                }}
                                onKeyDown={(e) => {
                                    handleKeyDown(e);
                                }}
                            ></textarea>
                            <div className='cancel_edit_notify'>
                                <span
                                    onClick={handleHideEditComment}
                                    className='text-blue-500 hover:underline cursor-pointer'
                                >
                                    Cancel
                                </span>
                            </div>

                            <div
                                onClick={() => {
                                    handleEditComment(
                                        comment._id,
                                        comment.content
                                    );
                                }}
                                className={`update_comment_btn cursor-pointer ${
                                    editCommentValue
                                        ? 'text-gray-700'
                                        : 'text-gray-300 cursor-not-allowed'
                                }`}
                            >
                                <SendIcon />
                            </div>
                        </div>
                    ) : (
                        <div className='comment_body_wrapper'>
                            <div className='comment_body'>
                                <div className='comment_content_wrapper'>
                                    <Link
                                        to={`/profile/${comment.user?._id}`}
                                        className='comment_username hover:underline decoration-1'
                                    >
                                        {comment.user?.username}
                                    </Link>
                                    <div className='comment_content'>
                                        <Content
                                            content={comment.content}
                                            limit={200}
                                        />
                                    </div>
                                </div>

                                <div className='comment_more_btn_wrapper'>
                                    <Tippy
                                        placement='bottom-end'
                                        interactive
                                        onClickOutside={handleToggleMorePopup}
                                        visible={
                                            commentId === comment._id &&
                                            openMorePopup
                                        }
                                        render={(attrs) => (
                                            <div
                                                className='comment_more_popup'
                                                tabIndex='-1'
                                                {...attrs}
                                            >
                                                {comment.user?._id ===
                                                auth.user?._id ? (
                                                    <>
                                                        <div
                                                            onClick={() => {
                                                                setEditCommentValue(
                                                                    comment.content
                                                                );
                                                                handleOpenEditComment();
                                                                setCommentId(
                                                                    comment._id
                                                                );
                                                                handleToggleMorePopup();
                                                            }}
                                                            className='comment_more_popup_item'
                                                        >
                                                            Edit
                                                        </div>
                                                        <div
                                                            onClick={() => {
                                                                handleDeleteComment(
                                                                    comment._id
                                                                );
                                                                handleToggleMorePopup();
                                                            }}
                                                            className='comment_more_popup_item'
                                                        >
                                                            Delete
                                                        </div>
                                                    </>
                                                ) : (
                                                    <div
                                                        onClick={() => {
                                                            handleToggleMorePopup();
                                                        }}
                                                        className='comment_more_popup_item'
                                                    >
                                                        Report
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    >
                                        <button
                                            onClick={() => {
                                                handleToggleMorePopup();
                                                handleHideEditComment();
                                                setCommentId(comment._id);
                                            }}
                                            className='comment_more_btn'
                                        >
                                            <MoreHorizIcon />
                                        </button>
                                    </Tippy>
                                </div>
                            </div>

                            <div className='comment_btn_wrapper'>
                                {comment.likes.find(
                                    (user) => user._id === auth.user?._id
                                ) ? (
                                    <button
                                        onClick={() => {
                                            handleUnlikeComment(comment._id);
                                        }}
                                        className='btn_like_active_comment'
                                    >
                                        Like
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => {
                                            handleLikeComment(comment._id);
                                        }}
                                        className='btn_like_default_comment'
                                    >
                                        Like
                                    </button>
                                )}

                                <button className='btn_reply_comment'>
                                    Reply
                                </button>
                                <span className='time_createdAt_comment'>
                                    {moment(comment.createdAt).fromNow()}
                                </span>
                            </div>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}

export default Comment;
