import { postDataApi } from '../../utils/fetchData';
import { GLOBALTYPES } from './globalTypes';

export const getSearchUser = (searchValue) => async (dispatch) => {
    try {
        dispatch({
            type: GLOBALTYPES.ALERT,
            payload: { pedding: true }
        });

        const res = await postDataApi('/user', { searchValue });

        dispatch({
            type: GLOBALTYPES.USERS,
            payload: res.data.users
        });

        dispatch({
            type: GLOBALTYPES.ALERT,
            payload: {}
        });
    } catch (err) {
        dispatch({
            type: GLOBALTYPES.ALERT,
            payload: { error: err.response?.data.msg || 'Error' }
        });
    }
};
