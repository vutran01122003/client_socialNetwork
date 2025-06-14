import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { getPost } from '../../redux/actions/postAction';
import { authSelector, detailPostListSelector, statusSelector } from '../../redux/selector';
import PostCard from '../../components/home/PostCard';
import ModalPost from '../../components/modal/ModalPost';

function DetailPost() {
    const { id } = useParams();
    const dispatch = useDispatch();
    const detailPostList = useSelector(detailPostListSelector);
    const auth = useSelector(authSelector);
    const { openModalDetailPost } = useSelector(statusSelector);
    const [post, setPost] = useState({});

    useEffect(() => {
        if (
            !detailPostList.some((detailPost) => {
                return detailPost._id === id;
            })
        ) {
            dispatch(getPost({ postId: id }));
        }

        const detailPost = detailPostList.find((detailPost) => {
            return detailPost._id === id;
        });

        if (detailPost) setPost(detailPost);
    }, [detailPostList, dispatch, id]);

    return (
        <>
            {auth.user && (
                <>
                    {Object.keys(post).length > 0 ? (
                        <div key={post._id} className='post_item detail_post_item'>
                            <PostCard post={post} auth={auth} detailPost={true} />
                            {openModalDetailPost && <ModalPost currentPost={post} auth={auth} detailPost={true} />}
                        </div>
                    ) : (
                        <div
                            key={post._id}
                            className='w-full h-full flex flex-col justify-center items-center font-bold'
                        >
                            NOT FOUND
                            <span className='text-gray-400 uppercase text-xs'>(maybe the post has been deleted)</span>
                        </div>
                    )}
                </>
            )}
        </>
    );
}

export default DetailPost;
