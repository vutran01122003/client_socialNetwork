import CircularProgress from '@mui/material/CircularProgress';
import PostCard from './postCard/PostCard';

function Post({ auth, posts }) {
    return (
        <div className='post_wrapper wrapper'>
            {posts.loading ? (
                <CircularProgress />
            ) : posts.result === 0 ? (
                <h3 className='font-semibold mt-2'>NO POSTS</h3>
            ) : (
                posts.posts.map((post) => (
                    <div key={post._id} className='post_item'>
                        <PostCard auth={auth} post={post} />
                    </div>
                ))
            )}
        </div>
    );
}

export default Post;
