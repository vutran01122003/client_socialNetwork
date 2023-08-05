import { useState } from 'react';

function Content({ content, limit }) {
    const [readMore, setReadMore] = useState(false);
    return (
        <span className='see_more'>
            {content?.length > limit && !readMore ? (
                <span>
                    {content.slice(0, limit)}...
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
                content
            )}
        </span>
    );
}

export default Content;
