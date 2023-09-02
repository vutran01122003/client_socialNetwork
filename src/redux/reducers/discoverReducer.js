import { GLOBALTYPES } from '../actions/globalTypes';

const initialState = {
    loading: false,
    data: [],
    page: 1,
    maxPage: false
};

function discoverReducer(state = initialState, action) {
    switch (action.type) {
        case GLOBALTYPES.DISCOVER.GET_POSTS_DISCOVER:
            return {
                ...state,
                data:
                    action.payload.page === 1
                        ? [...action.payload.discoveredPosts]
                        : [...state.data, ...action.payload.discoveredPosts],
                page: action.payload.page,
                maxPage: action.payload.maxPage
            };
        case GLOBALTYPES.DISCOVER.POSTS_DISCOVER_LOADING:
            return {
                ...state,
                loading: action.payload.loading
            };
        default:
            return state;
    }
}

export default discoverReducer;
