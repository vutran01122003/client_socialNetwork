import UserCard from './UserCard';

function UserModal({ modalInfo, setPopup, auth }) {
    return (
        <div
            className='modal_wrapper'
            onMouseDown={(e) => {
                if (e.target === e.currentTarget) {
                    setPopup(false);
                }
            }}
        >
            <div className='modal_container'>
                <div>
                    <h1 className='model_title flex w-full justify-center font-bold'>
                        {modalInfo.title}
                    </h1>
                    <button
                        onClick={() => {
                            setPopup(false);
                        }}
                        className='absolute top-0 right-2 text-gray-400 text-3xl hover:text-red-500 font-semibold transition linear'
                    >
                        &times;
                    </button>
                </div>

                <div className='user_wrapper flex-1 relative'>
                    {modalInfo.users.length === 0 && (
                        <div className='font-semibold text-base w-full h-full flex justify-center items-center'>
                            <span>{`0 ${modalInfo.title}`}</span>
                        </div>
                    )}
                    {modalInfo.users.map((user) => (
                        <UserCard
                            className='follow_user'
                            user={user}
                            auth={auth}
                            key={user._id}
                            onClick={() => {
                                setPopup(false);
                            }}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}

export default UserModal;
