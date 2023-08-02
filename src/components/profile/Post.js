import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getUserPost } from '../../redux/actions/profileActions';
import { profileSelector } from '../../redux/selector';
import { CircularProgress } from '@mui/material';
import CameraAltOutlinedIcon from '@mui/icons-material/CameraAltOutlined';
import PostsThumb from './PostsThumb';

function Post({ userInfo, auth, id }) {
    const dispatch = useDispatch();
    const profile = useSelector(profileSelector);
    const [userPosts, setUserPosts] = useState({});

    useEffect(() => {
        if (
            !profile.posts.some(
                (post) => post.userId === id && JSON.stringify(userPosts)
            )
        ) {
            dispatch(getUserPost({ id }));
        }

        if (profile.posts.length > 0) {
            const postsData = profile.posts.find(
                (posts) => posts.userId === id
            );

            if (postsData) setUserPosts(postsData);
        }
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
            </div>
        );
}

export default Post;
