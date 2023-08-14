import { useState } from 'react';
import CommentItem from '../CommentItem';
import ShowMoreComment from '../ShowMoreComment';

function Comment({ post, auth, socket }) {
    const [commentData, setCommentData] = useState([]);

    return (
        <div className='comment_wrapper'>
            {commentData.map((comment) => (
                <div key={comment._id} className='comment_item'>
                    <CommentItem comment={comment} auth={auth} post={post} socket={socket} />
                </div>
            ))}
            <ShowMoreComment comments={post.comments} setCommentData={setCommentData} />
        </div>
    );
}

export default Comment;
