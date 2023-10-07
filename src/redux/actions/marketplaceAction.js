import { getDataApi, postDataApi } from '../../utils/fetchData';
import { GLOBALTYPES } from './globalTypes';

export const getProducts =
    ({ searchValue, nextPage }) =>
    (dispatch) => {
        dispatch({
            type: GLOBALTYPES.MARKETPLACE.MARKETPLACE_LOADING,
            payload: true
        });

        getDataApi(`/products?search=${searchValue}`, {
            nextPage
        })
            .then((res) => {
                console.log(res.data.data.marketplace_search.feed_units.edges);
                dispatch({
                    type: GLOBALTYPES.MARKETPLACE.GET_PRODUCTS,
                    payload: {
                        data: [...res.data.data.marketplace_search.feed_units.edges],
                        nextPage: res.data.data.marketplace_search.feed_units.page_info.end_cursor,
                        maxPage:
                            res.data.data.marketplace_search.feed_units.edges.length === 0
                                ? true
                                : false
                    }
                });
            })
            .catch((e) => {
                console.log(e);
                dispatch({
                    type: GLOBALTYPES.ALERT,
                    payload: {
                        error: e.response?.data.msg || 'Error'
                    }
                });
            })
            .finally(() => {
                dispatch({
                    type: GLOBALTYPES.MARKETPLACE.MARKETPLACE_LOADING,
                    payload: false
                });
            });
    };

export const getKeywords =
    ({ searchValue }) =>
    async (dispatch) => {
        try {
            const res = await postDataApi('/keywords', { searchValue });
            console.log(res.data.data);
            dispatch({
                type: GLOBALTYPES.MARKETPLACE.MARKETPLACE_SET_QUERY_LIST,
                payload: res.data.data
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
