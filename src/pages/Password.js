import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import FormEmail from '../components/password/FormEmail';
import FormSecurityCode from '../components/password/FormSecurityCode';
import FormResetPassword from '../components/password/FormResetPassword';
import { passwordSelector } from '../redux/selector';
import { GLOBALTYPES } from '../redux/actions/globalTypes';

function Password() {
    const dispatch = useDispatch();
    const [email, setEmail] = useState('');
    const password = useSelector(passwordSelector);

    const handleSendCodeAgain = () => {
        dispatch({
            type: GLOBALTYPES.PASSWORD.RESET,
            payload: {}
        });
    };

    return (
        <>
            {password?.validCode && password?.token ? (
                <FormResetPassword password={password} handleSendCodeAgain={handleSendCodeAgain} />
            ) : (
                <>
                    {!password?.validEmail ? (
                        <FormEmail email={email} setEmail={setEmail} />
                    ) : (
                        <FormSecurityCode
                            email={email}
                            password={password}
                            handleSendCodeAgain={handleSendCodeAgain}
                        />
                    )}
                </>
            )}
        </>
    );
}

export default Password;
