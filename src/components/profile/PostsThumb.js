import { Link } from 'react-router-dom';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ModeCommentIcon from '@mui/icons-material/ModeComment';
import MultipleImageIcon from '../icon/MultipleImageIcon';
import { useCallback, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { getUserPost } from '../../redux/actions/profileActions';
import { CircularProgress } from '@mui/material';

function PostsThumb({ posts, userProfileId, profile }) {
    const observer = useRef();
    const dispatch = useDispatch();

    const getLastPostThumb = useCallback(
        (elem) => {
            if (observer.current) observer.current.disconnect();
            observer.current = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting) {
                    if (userProfileId && !profile.posts[userProfileId].maxPage) {
                        dispatch(
                            getUserPost({
                                id: userProfileId,
                                page: profile.posts[userProfileId].page + 1
                            })
                        );
                    }
                }
            });

            if (elem) observer.current.observe(elem);
        },
        // eslint-disable-next-line
        [dispatch, profile?.posts]
    );

    return (
        <div className='user_posts'>
            {posts.map((post, index) => (
                <div
                    ref={posts.length === index + 1 && userProfileId ? getLastPostThumb : null}
                    key={post._id}
                    className='post_thumb_item'
                >
                    <div className='post_thumb_item_height'></div>
                    <Link to={`/post/${post._id}`} className='post_thumb_item_img'>
                        {post.files[0]?.url.includes('/video/upload/') ? (
                            <video preload='metadata'>
                                <source src={post.files[0]?.url + '#t=0.1'} />
                            </video>
                        ) : (
                            <img
                                src={
                                    post.files[0]?.url ??
                                    'https://t4.ftcdn.net/jpg/04/99/93/31/360_F_499933117_ZAUBfv3P1HEOsZDrnkbNCt4jc3AodArl.jpg'
                                }
                                alt='image_thumb'
                            />
                        )}

                        <div className='post_thumb_item_info flex'>
                            <div className='post_thumb_item_info_icon'>
                                <FavoriteIcon />
                                <span className='post_thumb_item_info_num'>
                                    {post.likes?.length}
                                </span>
                            </div>
                            <div className='post_thumb_item_info_icon'>
                                <ModeCommentIcon />
                                <span className='post_thumb_item_info_num'>
                                    {post.comments?.length}
                                </span>
                            </div>
                            {post.files.length > 1 && (
                                <div className='mul_img_wrapper'>
                                    <MultipleImageIcon />
                                </div>
                            )}
                        </div>
                    </Link>
                </div>
            ))}
            {profile.loading && (
                <div className='w-full p-2 flex items-center justify-center'>
                    <CircularProgress />
                </div>
            )}
        </div>
    );
}

export default PostsThumb;
