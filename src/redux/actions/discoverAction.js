import { GLOBALTYPES } from './globalTypes';
import { getDataApi } from '../../utils/fetchData';

export const getPostsDiscover =
    ({ page }) =>
    async (dispatch) => {
        try {
            dispatch({
                type: GLOBALTYPES.DISCOVER.POSTS_DISCOVER_LOADING,
                payload: { loading: true }
            });

            const res = await getDataApi(`/posts_discover?page=${page}`);

            dispatch({
                type: GLOBALTYPES.DISCOVER.GET_POSTS_DISCOVER,
                payload: {
                    discoveredPosts: res.data.posts,
                    page: page,
                    maxPage: res.data.posts.length === 0 ? true : false
                }
            });

            dispatch({
                type: GLOBALTYPES.DISCOVER.POSTS_DISCOVER_LOADING,
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
