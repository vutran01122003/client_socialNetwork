const { GLOBALTYPES } = require('../actions/globalTypes');

const initialState = {
    searchedKeyword: 'laptop',
    queryList: [],
    data: [],
    loading: false,
    nextPage: null,
    maxPage: false
};

function marketplaceReducer(state = initialState, action) {
    switch (action.type) {
        case GLOBALTYPES.MARKETPLACE.GET_PRODUCTS: {
            return {
                ...state,
                data: [...state.data, ...action.payload.data],
                nextPage: action.payload.nextPage,
                maxPage: action.payload.maxPage
            };
        }
        case GLOBALTYPES.MARKETPLACE.MARKETPLACE_LOADING: {
            return {
                ...state,
                loading: action.payload
            };
        }
        case GLOBALTYPES.MARKETPLACE.MARKETPLACE_RESET: {
            return {
                searchedKeyword: 'laptop',
                queryList: [],
                data: [],
                loading: false,
                nextPage: null,
                maxPage: false
            };
        }
        case GLOBALTYPES.MARKETPLACE.MARKETPLACE_SET_SEARCHED_KEYWORD: {
            return {
                ...state,
                searchedKeyword: action.payload
            };
        }
        case GLOBALTYPES.MARKETPLACE.MARKETPLACE_SET_QUERY_LIST: {
            return {
                ...state,
                queryList: [...action.payload]
            };
        }
        default:
            return { ...state };
    }
}

export default marketplaceReducer;
