import { useRef } from 'react';

function Avatar({ avatar, size }) {
    const imgRef = useRef();

    const handleImageDefault = () => {
        if (imgRef.current) {
            imgRef.current.src = require('../images/avatar_default.png');
        }
    };

    return (
        <div className={`${size} border border-slate-200 rounded-full select-none`}>
            <img
                ref={imgRef}
                src={avatar}
                className={`object-cover overflow-hidden rounded-full w-full h-full ${size}`}
                alt='avatar'
                onError={handleImageDefault}
            />
        </div>
    );
}

export default Avatar;
