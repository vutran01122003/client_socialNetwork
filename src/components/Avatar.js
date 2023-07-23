function Avatar({ avatar, size }) {
    return (
        <div className={`${size} border border-gray rounded-full select-none`}>
            <img
                src={avatar}
                className={`object-cover overflow-hidden rounded-full ${size}`}
                alt='avatar'
            />
        </div>
    );
}

export default Avatar;
