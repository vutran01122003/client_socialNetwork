import { useRef, useCallback, useState } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import PostCard from './PostCard';
import { useDispatch, useSelector } from 'react-redux';
import { getPosts } from '../../redux/actions/postAction';
import { statusSelector } from '../../redux/selector';
import { postSelector } from '../../redux/selector';
import { useEffect } from 'react';
import ModalPost from '../modal/ModalPost';

function Post({ auth }) {
    const observer = useRef();
    const dispatch = useDispatch();
    const [nextPage, setNextPage] = useState(1);
    const homePosts = useSelector(postSelector);
    const { openModalHomePost, currentPost } = useSelector(statusSelector);

    useEffect(() => {
        if (homePosts.page < nextPage && !homePosts.maxPage)
            dispatch(getPosts({ nextPage, currentPostCount: homePosts.result }));
    }, [dispatch, nextPage, homePosts.maxPage, homePosts.page, homePosts.result]);

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
        <div className='post_wrapper'>
            {Object.keys(homePosts.posts).length === 0 ? (
                <div className='font-semibold mt-2 text-gray-500 flex flex-col items-center uppercase select-none'>
                    <h3 className=''>There are no posts</h3>
                </div>
            ) : (
                Object.values(homePosts.posts).map((post, index) => {
                    if (Object.keys(homePosts.posts).length === index + 1) {
                        return (
                            <div ref={lastPostElementRef} key={post._id} className='post_item'>
                                <PostCard auth={auth} post={post} />
                            </div>
                        );
                    }
                    return (
                        <div key={post._id} className='post_item'>
                            <PostCard auth={auth} post={post} />
                        </div>
                    );
                })
            )}
            {openModalHomePost && <ModalPost auth={auth} currentPost={currentPost} />}
            {homePosts.loading && <CircularProgress />}
        </div>
    );
}

export default Post;
