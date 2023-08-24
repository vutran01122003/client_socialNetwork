import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { getUserPost } from '../../redux/actions/profileActions';
import CameraAltOutlinedIcon from '@mui/icons-material/CameraAltOutlined';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import AppsOutlinedIcon from '@mui/icons-material/AppsOutlined';
import PostsThumb from './PostsThumb';

function Post({ id, auth, profile }) {
    const dispatch = useDispatch();
    const [saved, setSaved] = useState(false);

    const handleOpenSaved = () => {
        setSaved(true);
    };

    const handleHiddenSaved = () => {
        setSaved(false);
    };

    useEffect(() => {
        if (!profile.posts[id]) {
            dispatch(getUserPost({ id, page: 1 }));
        }
    }, [id, profile.posts, dispatch]);

    return (
        <>
            {profile.posts && (
                <div className='user_posts_wrapper'>
                    <div className='user_posts_type'>
                        <div
                            onClick={handleHiddenSaved}
                            className={`${saved ? '' : 'active'} user_posts_type_item`}
                        >
                            <AppsOutlinedIcon /> <h3>POSTS</h3>
                        </div>
                        {id === auth?.user._id && (
                            <div
                                onClick={handleOpenSaved}
                                className={`${saved ? 'active' : ''} user_posts_type_item`}
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
                                    <h3 className='user_posts_status_title'>No posts available</h3>
                                </div>
                            )}
                        </>
                    ) : (
                        <>
                            {profile.posts[id]?.data.length > 0 ? (
                                <PostsThumb
                                    posts={profile.posts[id]?.data}
                                    userProfileId={id}
                                    profile={profile}
                                />
                            ) : (
                                <div className='user_posts_status'>
                                    <div className='user_posts_status_icon_wrapper'>
                                        <CameraAltOutlinedIcon />
                                    </div>
                                    <h3 className='user_posts_status_title'>No posts available</h3>
                                </div>
                            )}
                        </>
                    )}
                </div>
            )}
        </>
    );
}

export default Post;
