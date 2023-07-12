import { getDataApi } from '../../utils/fetchData';
import { GLOBALTYPES } from './globalTypes';

export const getUser =
    ({ users, id }) =>
    async (dispatch) => {
        try {
            if (users.every((user) => user._id !== id)) {
                dispatch({
                    type: GLOBALTYPES.PROFILE.LOADING,
                    payload: true
                });

                const res = await getDataApi(`/user/${id}`);

                dispatch({
                    type: GLOBALTYPES.PROFILE.GET_USER,
                    payload: res.data.user
                });

                dispatch({
                    type: GLOBALTYPES.PROFILE.LOADING,
                    payload: false
                });
            }
        } catch (error) {
            dispatch({
                type: GLOBALTYPES.ALERT,
                payload: { error: error.response?.data.msg || 'Error' }
            });
        }
    };
