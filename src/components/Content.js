import { useState } from 'react';
import { useSelector } from 'react-redux';
import { authSelector } from '../redux/selector';

function Content({ originalCommenter, content, limit }) {
    const [readMore, setReadMore] = useState(false);
    const auth = useSelector(authSelector);

    return (
        <span className='see_more'>
            {originalCommenter && auth?.user._id !== originalCommenter._id && (
                <span className='ref_original_commenter'>{`${originalCommenter.username}`}</span>
            )}
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
