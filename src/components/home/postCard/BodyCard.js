import { useState } from 'react';
import Carousel from './Carousel';

function BodyCard({ post }) {
    const [readMore, setReadMore] = useState(false);
    return (
        <div className='body_card'>
            <div className='body_content'>
                {post.content.length > 200 && !readMore ? (
                    <span>
                        {post.content.slice(0, 200)}...{' '}
                        <span
                            onClick={() => {
                                setReadMore(true);
                            }}
                            className='font-medium cursor-pointer hover:underline decoration-1'
                        >
                            See more
                        </span>
                    </span>
                ) : (
                    post.content
                )}
            </div>
            {post.images.length > 0 && (
                <div className='carousel_wrapper'>
                    <Carousel post={post} />
                </div>
            )}
        </div>
    );
}

export default BodyCard;
