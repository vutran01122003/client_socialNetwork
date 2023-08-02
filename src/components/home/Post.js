import { useRef, useCallback, useState } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import PostCard from './postCard/PostCard';
import { useDispatch, useSelector } from 'react-redux';
import { getPosts } from '../../redux/actions/postAction';
import { statusSelector } from '../../redux/selector';
import { postSelector } from '../../redux/selector';
import { useEffect } from 'react';
import ModalPost from '../../components/home/ModalPost';

function Post({ auth }) {
    const observer = useRef();
    const dispatch = useDispatch();
    const [nextPage, setNextPage] = useState(1);
    const homePosts = useSelector(postSelector);
    const { openModalHomePost, currentPost } = useSelector(statusSelector);

    useEffect(() => {
        if (homePosts.page < nextPage && !homePosts.maxPage)
            dispatch(
                getPosts({ nextPage, currentPostCount: homePosts.result })
            );
    }, [
        dispatch,
        nextPage,
        homePosts.maxPage,
        homePosts.page,
        homePosts.result
    ]);

    const lastPostElementRef = useCallback(
        (elem) => {
            if (homePosts.loading) return;
            if (observer.current) observer.current.disconnect();
            observer.current = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting) {
                    setNextPage((prev) => prev + 1);
                }
            });
            if (elem) observer.current.observe(elem);
        },
        [homePosts.loading]
    );

    return (
        <div className='post_wrapper wrapper'>
            {homePosts.loading === 0 ? (
                <CircularProgress />
            ) : homePosts.result === 0 ? (
                <h3 className='font-semibold mt-2'>NO POSTS</h3>
            ) : (
                homePosts.posts.map((post, index) => {
                    if (homePosts.posts.length === index + 1) {
                        return (
                            <div
                                ref={lastPostElementRef}
                                key={post._id}
                                className='post_item'
                            >
                                <PostCard auth={auth} post={post} />
                            </div>
                        );
                    }
                    return (
                        <div key={post._id} className='post_item'>
                            <PostCard auth={auth} post={post} />
                            {openModalHomePost && (
                                <ModalPost
                                    auth={auth}
                                    currentPost={currentPost}
                                />
                            )}
                        </div>
                    );
                })
            )}
        </div>
    );
}

export default Post;
