import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getUserPost } from '../../redux/actions/profileActions';
import { profileSelector } from '../../redux/selector';
import { CircularProgress } from '@mui/material';
import CameraAltOutlinedIcon from '@mui/icons-material/CameraAltOutlined';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import AppsOutlinedIcon from '@mui/icons-material/AppsOutlined';
import PostsThumb from './PostsThumb';

function Post({ id, auth }) {
    const dispatch = useDispatch();
    const profile = useSelector(profileSelector);
    const [userPosts, setUserPosts] = useState({});
    const [saved, setSaved] = useState(false);

    const handleOpenSaved = () => {
        setSaved(true);
    };

    const handleHiddenSaved = () => {
        setSaved(false);
    };

    useEffect(() => {
        if (!profile.posts.some((post) => post.userId === id)) {
            dispatch(getUserPost({ id }));
        }

        const postsData = profile.posts.find((posts) => posts.userId === id);
        if (postsData) setUserPosts(postsData);
    }, [id, profile.posts, userPosts, dispatch]);

    if (profile.loading && !userPosts)
        return (
            <div className='user_posts_wrapper flex items-center justify-center'>
                <CircularProgress className='mt-10' />
            </div>
        );
    if (userPosts?.posts)
        return (
            <div className='user_posts_wrapper'>
                <div className='user_posts_type'>
                    <div
                        onClick={handleHiddenSaved}
                        className={`${
                            saved ? '' : 'active'
                        } user_posts_type_item`}
                    >
                        <AppsOutlinedIcon /> <h3>POSTS</h3>
                    </div>
                    {id === auth?.user._id && (
                        <div
                            onClick={handleOpenSaved}
                            className={`${
                                saved ? 'active' : ''
                            } user_posts_type_item`}
                        >
                            <BookmarkBorderIcon /> <h3>SAVED</h3>
                        </div>
                    )}
                </div>
                {saved ? (
                    <>
                        {auth?.user.saved.length > 0 ? (
                            <PostsThumb posts={auth.user.saved} />
                        ) : (
                            <div className='user_posts_status'>
                                <div className='user_posts_status_icon_wrapper'>
                                    <CameraAltOutlinedIcon />
                                </div>
                                <h3 className='user_posts_status_title'>
                                    No posts available
                                </h3>
                            </div>
                        )}
                    </>
                ) : (
                    <>
                        {userPosts?.posts.length > 0 ? (
                            <PostsThumb posts={userPosts.posts} />
                        ) : (
                            <div className='user_posts_status'>
                                <div className='user_posts_status_icon_wrapper'>
                                    <CameraAltOutlinedIcon />
                                </div>
                                <h3 className='user_posts_status_title'>
                                    No posts available
                                </h3>
                            </div>
                        )}
                    </>
                )}
            </div>
        );
}

export default Post;
