import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import Avatar from '../Avatar';
import { confirmCode } from '../../redux/actions/passwordAction';
import { GLOBALTYPES } from '../../redux/actions/globalTypes';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';

function FormSecurityCode({ email, password, handleSendCodeAgain }) {
    const dispatch = useDispatch();
    const [code, setCode] = useState('');

    const [second, setSecond] = useState(60);

    const handleConfirmCode = () => {
        if (code) {
            dispatch(confirmCode({ code, email, userId: password.user._id }));
        } else {
            dispatch({
                type: GLOBALTYPES.ALERT,
                payload: {
                    error: 'wrong code'
                }
            });
        }
    };

    const handleChangeCode = (e) => {
        setCode(e.target.value);
    };

    useEffect(() => {
        const timeId = setInterval(() => {
            setSecond((prev) => --prev);
        }, 1000);

        if (second === 0) clearInterval(timeId);
        return () => {
            clearInterval(timeId);
        };
    }, [second]);

    return (
        <div className='w-screen h-screen flex items-center justify-center'>
            <div className='wrapper flex flex-col justify-between max-w-full max-h-full gap-2 w-[500px]'>
                <div className='flex items-center justify-center relative'>
                    <KeyboardBackspaceIcon
                        fontSize='large'
                        className='absolute top-0 left-0 text-gray-600 hover:text-gray-500 cursor-pointer'
                        onClick={handleSendCodeAgain}
                    />
                    <h1 className='font-bold text-center text-2xl'>Enter security code</h1>
                </div>
                <div className='flex gap-2 justify-between items-center px-2 py-5'>
                    <div className='flex basis-3/5 flex-col'>
                        <h3 className='font-semibold'>We sent a login code to:</h3>
                        <h4 className='text-sm mt-2'>{email}</h4>

                        <div className='relative mt-4'>
                            {second > 0 && (
                                <h3 className='countdown font-bold absolute top-1/2 right-3 -translate-y-1/2'>
                                    {second}s
                                </h3>
                            )}

                            <input
                                className='email_enterCode px-3 py-4 pr-12 border border-gray-500 outline-none rounded-lg w-full'
                                onChange={handleChangeCode}
                                placeholder='Enter code'
                                value={code}
                            />
                        </div>

                        {second === 0 && (
                            <h4 className='ml-1 mt-1 text-red-500 text-xs'>Expired code!</h4>
                        )}
                    </div>
                    <div className='flex flex-1 flex-col gap-2 items-center'>
                        <Avatar avatar={password.user.avatar} size='forgot_password_size' />
                        <div>
                            <h3 className='font-semibold text-center'>{password.user.username}</h3>
                            <h4 className='text-xs text-gray-500 text-center'>
                                {password.user.fullname}
                            </h4>
                        </div>
                    </div>
                </div>

                <div className='flex justify-between items-center'>
                    <h4
                        className='text-blue-500 text-sm cursor-pointer text-base hover:underline'
                        onClick={handleSendCodeAgain}
                    >
                        Didn't get a code?
                    </h4>
                    <div className='flex gap-2'>
                        <button
                            className='bg-gray-300 font-semibold rounded-lg text-gray-800 px-4 py-1.5 transition-all active:scale-95'
                            onClick={handleSendCodeAgain}
                        >
                            Cancel
                        </button>

                        <button
                            className='bg-blue-500 font-semibold rounded-lg text-white px-4 py-1.5 transition-all active:scale-95'
                            onClick={handleConfirmCode}
                        >
                            Continue
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default FormSecurityCode;
