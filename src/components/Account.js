function Account({ avatar, fullname, username }) {
    return (
        <div className='avatar w-full flex gap-2 p-2 items-center bg-white hover:bg-gray-100'>
            <div className='img_wrapper h-full w-10 h-10'>
                <img
                    src={avatar}
                    className='h-full w-full rounded-full'
                    alt=''
                />
            </div>
            <div className='user_description text-black flex-1'>
                <h3 className='font-bold text-slate-700'>{username}</h3>
                <p className='font-light text-gray-500'>{fullname}</p>
            </div>
        </div>
    );
}

export default Account;
