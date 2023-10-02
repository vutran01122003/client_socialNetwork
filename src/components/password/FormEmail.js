import { useDispatch } from 'react-redux';
import { GLOBALTYPES } from '../../redux/actions/globalTypes';
import { sendCode } from '../../redux/actions/passwordAction';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import { Link } from 'react-router-dom';

function FormEmail({ email, setEmail }) {
    const dispatch = useDispatch();

    const handleChangeEmail = (e) => {
        setEmail(e.target.value);
    };

    const handleSendEmail = (e) => {
        const pattern = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
        const checkValidEmail = pattern.test(email);
        if (checkValidEmail) {
            dispatch(sendCode({ email }));
        } else {
            dispatch({
                type: GLOBALTYPES.ALERT,
                payload: {
                    error: 'Invalid email'
                }
            });
        }
    };

    return (
        <div className='w-screen h-screen flex items-center justify-center'>
            <div className='wrapper flex flex-col justify-between max-w-full max-h-full gap-6 w-[500px]'>
                <div className='flex items-center justify-center relative'>
                    <Link
                        to='/'
                        className='absolute top-0 left-0 text-gray-600 hover:text-gray-500 cursor-pointer'
                    >
                        <KeyboardBackspaceIcon fontSize='large' />
                    </Link>
                    <h1 className='font-bold text-center text-2xl'>Forgot Password</h1>
                </div>
                <div className='flex flex-col gap-2'>
                    <h3 className='font-semibold'>We'll send you a code to your email address:</h3>
                    <input
                        className='email_sendCode px-5 py-2 border border-gray-500 outline-none rounded-lg'
                        onChange={handleChangeEmail}
                        value={email}
                        placeholder='example@gmail.com'
                    />
                </div>

                <button
                    onClick={handleSendEmail}
                    className='bg-blue-500 rounded-lg text-white px-5 py-2 transition-all active:scale-95'
                >
                    Send
                </button>
            </div>
        </div>
    );
}

export default FormEmail;
