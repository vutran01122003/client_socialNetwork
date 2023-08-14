import { useEffect, useState } from 'react';

function ShowMoreComment({ comments, setCommentData }) {
    const [showMore, setShowMore] = useState(2);
    const limit = 5;

    const handleShowMoreComments = () => {
        setShowMore((prev) => prev + limit);
    };

    const handleHideComments = () => {
        setShowMore(2);
    };

    useEffect(() => {
        setCommentData(comments.slice(0, showMore));
    }, [setCommentData, comments, showMore]);

    return (
        <div>
            {comments?.length > 2 && (
                <div className='show_more_btn'>
                    {comments?.length - showMore > 0 ? (
                        <span onClick={handleShowMoreComments}>{`View ${
                            comments.length - showMore > limit ? limit : comments?.length - showMore
                        } more ${
                            comments?.length - showMore === 1 ? 'comment' : 'comments'
                        }`}</span>
                    ) : (
                        <span onClick={handleHideComments}>{`Hide comments`}</span>
                    )}
                </div>
            )}
        </div>
    );
}

export default ShowMoreComment;
