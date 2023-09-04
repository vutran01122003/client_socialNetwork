import { postDataApi } from '../../utils/fetchData';
import { GLOBALTYPES } from './globalTypes';

export const sendCode =
    ({ email }) =>
    async (dispatch) => {
        try {
            dispatch({
                type: GLOBALTYPES.ALERT,
                payload: { loading: true }
            });

            const res = await postDataApi('/password/code', {
                email
            });

            dispatch({
                type: GLOBALTYPES.PASSWORD.SEND_CODE,
                payload: {
                    validEmail: true,
                    user: res.data.user
                }
            });

            dispatch({
                type: GLOBALTYPES.ALERT,
                payload: { success: res.data.status }
            });
        } catch (err) {
            dispatch({
                type: GLOBALTYPES.PASSWORD.RESET,
                payload: {}
            });

            dispatch({
                type: GLOBALTYPES.ALERT,
                payload: { error: err.response?.data.msg }
            });
        }
    };

export const confirmCode =
    ({ code, email, userId }) =>
    async (dispatch) => {
        try {
            dispatch({
                type: GLOBALTYPES.ALERT,
                payload: {
                    loading: true
                }
            });

            const res = await postDataApi('/password/confirm_code', {
                code,
                email,
                userId
            });

            dispatch({
                type: GLOBALTYPES.PASSWORD.CONFIRM_CODE,
                payload: {
                    validCode: true,
                    token: res.data.token
                }
            });

            dispatch({
                type: GLOBALTYPES.ALERT,
                payload: {
                    success: res.data.status
                }
            });
        } catch (err) {
            dispatch({
                type: GLOBALTYPES.ALERT,
                payload: {
                    error: err.response?.data.msg || 'Error'
                }
            });
        }
    };

export const resetPassword =
    ({ token, newPassword, setIsSuccessResetPassword }) =>
    async (dispatch) => {
        try {
            dispatch({
                type: GLOBALTYPES.ALERT,
                payload: {
                    loading: true
                }
            });

            const res = await postDataApi('/password/reset', {
                token,
                newPassword
            });

            setIsSuccessResetPassword(true);

            dispatch({
                type: GLOBALTYPES.ALERT,
                payload: {
                    success: res.data.status
                }
            });
        } catch (error) {
            dispatch({
                type: GLOBALTYPES.ALERT,
                payload: {
                    error: error.response?.data.msg || 'Error'
                }
            });
        }
    };
