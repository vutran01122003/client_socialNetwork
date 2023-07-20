function Avatar({ avatar, size }) {
    return (
        <div className={`${size} border border-gray rounded-full select-none`}>
            <img
                src={avatar}
                className='w-full h-full object-cover overflow-hidden rounded-full'
                alt='avatar'
            />
        </div>
    );
}

export default Avatar;
