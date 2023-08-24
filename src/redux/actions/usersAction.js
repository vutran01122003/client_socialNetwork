import { postDataApi } from '../../utils/fetchData';
import { GLOBALTYPES } from './globalTypes';

export const getSearchUser =
    ({ searchValue, page, loadMore }) =>
    async (dispatch) => {
        try {
            dispatch({
                type: GLOBALTYPES.USERS.SEARCH_LOADING,
                payload: true
            });

            const res = await postDataApi(`/user?page=${page}`, { searchValue });
            dispatch({
                type: GLOBALTYPES.USERS.SEARCH_USERS,
                payload: {
                    users: res.data.users,
                    page,
                    maxPage: res.data.users.length === 0 ? true : false,
                    loadMore
                }
            });
        } catch (err) {
            dispatch({
                type: GLOBALTYPES.ALERT,
                payload: { error: err.response?.data.msg || 'Error' }
            });
        } finally {
            dispatch({
                type: GLOBALTYPES.USERS.SEARCH_LOADING,
                payload: false
            });
        }
    };
