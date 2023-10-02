import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { GLOBALTYPES } from '../../redux/actions/globalTypes';
import { resetPassword } from '../../redux/actions/passwordAction';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import { useNavigate } from 'react-router-dom';

function FormResetPassword({ password, handleSendCodeAgain }) {
    const dispatch = useDispatch();
    let navigate = useNavigate();

    const [newPassword, setNewPassword] = useState('');
    const [newConfirmPassword, setNewConfirmPassword] = useState('');
    const [isSuccessResetPassword, setIsSuccessResetPassword] = useState(false);

    const handleChangeNewPassword = (e) => {
        setNewPassword(e.target.value);
    };

    const handleChangeNewConfirmPassword = (e) => {
        setNewConfirmPassword(e.target.value);
    };

    const handleResetPassword = () => {
        if (newPassword === newConfirmPassword && newPassword && newConfirmPassword) {
            dispatch(
                resetPassword({ token: password.token, newPassword, setIsSuccessResetPassword })
            );
        } else {
            dispatch({
                type: GLOBALTYPES.ALERT,
                payload: {
                    error: 'Wrong new password'
                }
            });
        }
    };

    useEffect(() => {
        if (isSuccessResetPassword) {
            dispatch({
                type: GLOBALTYPES.PASSWORD.RESET,
                payload: {}
            });
            return navigate('/');
        }
    }, [isSuccessResetPassword, navigate, dispatch]);

    return (
        <div className='w-screen h-screen flex items-center justify-center'>
            <div className='wrapper flex flex-col justify-between max-w-full max-h-full gap-6 w-[500px]'>
                <div className='flex items-center justify-center relative'>
                    <KeyboardBackspaceIcon
                        fontSize='large'
                        className='absolute top-0 left-0 text-gray-600 hover:text-gray-500 cursor-pointer'
                        onClick={handleSendCodeAgain}
                    />
                    <h1 className='font-bold text-center text-2xl'>New password</h1>
                </div>
                <form className='flex flex-col gap-3'>
                    <input
                        type='password'
                        className='new_password_input outline-none border rounded-md border-gray-500 px-2 py-3.5'
                        placeholder='New password'
                        autoComplete=''
                        value={newPassword}
                        onChange={handleChangeNewPassword}
                    />
                    <input
                        type='password'
                        className='confirm_new_password_input outline-none border rounded-md border-gray-500 px-2 py-3.5'
                        placeholder='Confirm new password'
                        autoComplete=''
                        value={newConfirmPassword}
                        onChange={handleChangeNewConfirmPassword}
                    />
                </form>
                <button
                    className='bg-blue-500 font-semibold rounded-lg text-white px-5 py-2 transition-all active:scale-95'
                    onClick={handleResetPassword}
                >
                    Confirm
                </button>
            </div>
        </div>
    );
}

export default FormResetPassword;
