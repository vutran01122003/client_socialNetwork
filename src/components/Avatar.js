import { useRef } from 'react';

function Avatar({ avatar, size }) {
    const imgRef = useRef();

    const handleImageDefault = () => {
        if (imgRef.current) {
            imgRef.current.src =
                'https://static2.yan.vn/YanNews/2167221/202102/facebook-cap-nhat-avatar-doi-voi-tai-khoan-khong-su-dung-anh-dai-dien-e4abd14d.jpg';
        }
    };

    return (
        <div
            className={`${size} border border-slate-500 rounded-full select-none`}
        >
            <img
                ref={imgRef}
                src={avatar}
                className={`object-cover overflow-hidden rounded-full ${size}`}
                alt='avatar'
                onError={handleImageDefault}
            />
        </div>
    );
}

export default Avatar;
