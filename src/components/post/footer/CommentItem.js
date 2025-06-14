import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import FavoriteIcon from '@mui/icons-material/Favorite';
import SendIcon from '@mui/icons-material/Send';
import Tippy from '@tippyjs/react/headless';
import millify from 'millify';
import { Link } from 'react-router-dom';

import Avatar from '../../Avatar';
import moment from 'moment';
import Content from '../../Content';
import InputComment from './InputComment';
import { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { deleteComment, updateComment, likeComment, unlikeComment } from '../../../redux/actions/commentAction';
import ShowMoreComment from './ShowMoreComment';
import UserModal from '../../modal/UserModal';

function CommentItem({ activeCommentId, setActiveCommentId, comment, auth, post, socket }) {
    const dispatch = useDispatch();
    const [likesPopup, setLikesPopup] = useState(false);
    const [openMorePopup, setOpenMorePopup] = useState(false);
    const [editComment, setEditComment] = useState(false);
    const [editCommentValue, setEditCommentValue] = useState('');
    const [replyComment, setReplyComment] = useState(false);
    const [currentOwnerComment, setCurrentOwnerComment] = useState(null);
    const inputCommentRef = useRef();
    const textareaRef = useRef();

    const handleOpenLikesPopup = () => {
        setLikesPopup((prev) => !prev);
    };

    const handleToggleReplyComment = ({ commentId, user }) => {
        setActiveCommentId(commentId);
        setCurrentOwnerComment(user);
        setReplyComment((prev) => !prev);
    };

    const handleToggleMorePopup = () => {
        setOpenMorePopup((prev) => !prev);
    };

    const handleHideEditComment = () => {
        setEditComment(false);
    };

    const handleLikeComment = (commentId) => {
        dispatch(likeComment({ postId: post._id, commentId, user: auth.user }));
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

    const handleDeleteComment = () => {
        dispatch(
            deleteComment({
                post,
                comment,
                socket,
                user: auth.user
            })
        );
    };

    const handleOpenEditComment = () => {
        setEditComment(true);
    };

    const handleChangeEditCommentValue = (e) => {
        textareaRef.current.focus();
        textareaRef.current.setAttribute('style', 'height:' + textareaRef.current.scrollHeight + 'px;');
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
            dispatch(
                updateComment({
                    postId: post._id,
                    commentId: comment?._id,
                    parentCommentId: comment?.parentCommentId,
                    content: editCommentValue
                })
            );
            handleHideEditComment();
        }
    };

    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.setAttribute('style', 'height:' + textareaRef.current.scrollHeight + 'px;');
        }

        if (replyComment) {
            inputCommentRef.current?.scrollIntoView({
                behavior: 'smooth',
                block: 'end'
            });
        }
    }, [editComment, replyComment]);

    return (
        <>
            <Link to={`/profile/${comment.user?._id}`}>
                <Avatar avatar={comment.user?.avatar} size='small' />
            </Link>
            {editComment && activeCommentId === comment._id ? (
                <div className='edit_comment_wrapper'>
                    <textarea
                        ref={textareaRef}
                        className='edit_comment_textarea'
                        value={editCommentValue}
                        autoFocus
                        onChange={handleChangeEditCommentValue}
                        onFocus={(e) => {
                            e.currentTarget.setSelectionRange(
                                e.currentTarget.value?.length,
                                e.currentTarget.value?.length
                            );
                        }}
                        onKeyDown={(e) => {
                            handleKeyDown(e);
                        }}
                    ></textarea>
                    <div className='cancel_edit_notify'>
                        <span onClick={handleHideEditComment} className='text-blue-500 hover:underline cursor-pointer'>
                            Cancel
                        </span>
                    </div>

                    <div
                        onClick={() => {
                            handleEditComment(comment._id, comment.content);
                        }}
                        className={`update_comment_btn cursor-pointer ${
                            editCommentValue ? 'text-gray-700' : 'text-gray-300 cursor-not-allowed'
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
                                className='comment_username text-black hover:underline decoration-1'
                            >
                                {comment.user?.username}
                            </Link>
                            <div className='comment_content'>
                                <Content content={comment.content} limit={200} />
                            </div>
                            {likesPopup && (
                                <UserModal
                                    modalInfo={{
                                        title: 'Likes',
                                        users: comment.likes
                                    }}
                                    setPopup={setLikesPopup}
                                    auth={auth}
                                />
                            )}
                            {comment.likes?.length !== 0 && (
                                <div
                                    onClick={() => {
                                        handleOpenLikesPopup(comment._id);
                                    }}
                                    className={`like_wrapper ${
                                        comment.likes?.length === 1 ? 'count_one_like_wrapper' : 'count_like_wrapper'
                                    }`}
                                >
                                    <FavoriteIcon fontSize='small' className='like_comment_icon' />
                                    {comment.likes?.length > 1 && (
                                        <span className='count_like'>{millify(comment.likes?.length)}</span>
                                    )}
                                </div>
                            )}
                        </div>

                        <div className='comment_more_btn_wrapper'>
                            <Tippy
                                placement='bottom-end'
                                interactive
                                onClickOutside={handleToggleMorePopup}
                                visible={activeCommentId === comment._id && openMorePopup}
                                render={(attrs) => (
                                    <div className='comment_more_popup' tabIndex='-1' {...attrs}>
                                        {comment.user?._id === auth.user?._id ? (
                                            <>
                                                <div
                                                    onClick={() => {
                                                        setEditCommentValue(comment.content);
                                                        handleOpenEditComment();
                                                        setActiveCommentId(comment._id);
                                                        handleToggleMorePopup();
                                                    }}
                                                    className='comment_more_popup_item'
                                                >
                                                    Edit
                                                </div>
                                                <div
                                                    onClick={() => {
                                                        handleDeleteComment();
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
                                        setActiveCommentId(comment._id);
                                    }}
                                    className='comment_more_btn'
                                >
                                    <MoreHorizIcon />
                                </button>
                            </Tippy>
                        </div>
                    </div>

                    <div className='comment_btn_wrapper'>
                        {comment.likes.find((user) => user._id === auth.user?._id) ? (
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

                        <button
                            onClick={() => {
                                handleToggleReplyComment({
                                    user: comment.user,
                                    commentId: comment._id
                                });
                            }}
                            className='btn_reply_comment'
                        >
                            Reply
                        </button>
                        <span className='time_createdAt_comment'>{moment(comment.createdAt).fromNow()}</span>
                    </div>
                    {comment?.replies &&
                        Object.keys(comment.replies).length > 0 &&
                        Object.values(comment.replies).map((reply) => (
                            <div key={reply._id} className='reply_item_wrapper'>
                                <CommentItem
                                    activeCommentId={activeCommentId}
                                    setActiveCommentId={setActiveCommentId}
                                    auth={auth}
                                    post={post}
                                    comment={reply}
                                    socket={socket}
                                />
                            </div>
                        ))}
                    {comment.numberOfChildComment > 0 && !comment?.isMaxReply && (
                        <div className='reply_comment_wrapper'>
                            <ShowMoreComment
                                isReply={true}
                                commentId={comment._id}
                                postId={post._id}
                                replyQuantity={Object.keys(comment.replies).length}
                            />
                        </div>
                    )}
                    {replyComment && activeCommentId === comment._id && (
                        <InputComment
                            inputCommentRef={inputCommentRef}
                            currentOwnerComment={currentOwnerComment}
                            socket={socket}
                            comment={comment}
                            post={post}
                            auth={auth}
                            setReplyComment={setReplyComment}
                        />
                    )}
                </div>
            )}
        </>
    );
}

export default CommentItem;
