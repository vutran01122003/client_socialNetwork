import { getDataApi } from '../../utils/fetchData';
import { GLOBALTYPES } from './globalTypes';

export const getSuggestUser = () => async (dispatch) => {
    try {
        dispatch({
            type: GLOBALTYPES.SUGGESTION.LOADING,
            payload: true
        });

        const res = await getDataApi('/suggested_users');

        dispatch({
            type: GLOBALTYPES.SUGGESTION.SUGGEST_USER,
            payload: res.data.suggestedUsers
        });

        dispatch({
            type: GLOBALTYPES.SUGGESTION.LOADING,
            payload: false
        });
    } catch (error) {
        dispatch({
            type: GLOBALTYPES.SUGGESTION.LOADING,
            payload: false
        });

        dispatch({
            type: GLOBALTYPES.ALERT,
            payload: {
                error: error.response?.data.msg || 'Error'
            }
        });
    }
};
