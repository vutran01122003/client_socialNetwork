import { GLOBALTYPES } from './globalTypes';
import { getDataApi } from '../../utils/fetchData';

export const getPostsDiscover = () => async (dispatch) => {
    try {
        dispatch({
            type: GLOBALTYPES.ALERT,
            payload: { loading: true }
        });

        const res = await getDataApi('/posts_discover');

        dispatch({
            type: GLOBALTYPES.DISCOVER.GET_POSTS_DISCOVER,
            payload: res.data.posts
        });

        dispatch({
            type: GLOBALTYPES.ALERT,
            payload: { loading: false }
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
