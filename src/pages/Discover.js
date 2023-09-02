import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getPostsDiscover } from '../redux/actions/discoverAction';
import { postsDiscoverSelector } from '../redux/selector';
import PostsThumb from '../components/profile/PostsThumb';

function Discover() {
    const dispatch = useDispatch();
    const postsDiscover = useSelector(postsDiscoverSelector);
    useEffect(() => {
        if (postsDiscover.data.length === 0) dispatch(getPostsDiscover({ page: 1 }));
        // eslint-disable-next-line
    }, []);

    return (
        <div className='discover_wrapper'>
            {postsDiscover.data.length > 0 ? (
                <PostsThumb
                    posts={postsDiscover.data}
                    discoveredPosts={true}
                    postsDiscover={postsDiscover}
                />
            ) : (
                <h3 className='font-semibold text-sm absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center text-gray-600 uppercase'>
                    There are no posts to recommend
                </h3>
            )}
        </div>
    );
}

export default Discover;
