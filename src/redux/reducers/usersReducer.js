import { GLOBALTYPES } from '../actions/globalTypes';

const initialState = {
    userList: [],
    loading: false,
    page: 1,
    maxPage: false
};
function usersReducer(state = initialState, action) {
    switch (action.type) {
        case GLOBALTYPES.USERS.SEARCH_USERS:
            if (action.payload.loadMore) {
                return {
                    ...state,
                    userList: [...state.userList, ...action.payload.users],
                    page: action.payload.page,
                    maxPage: action.payload.maxPage
                };
            }
            return { loading: false, page: 1, maxPage: false, userList: action.payload.users };
        case GLOBALTYPES.USERS.SEARCH_LOADING:
            return { ...state, loading: action.payload };
        default:
            return state;
    }
}

export default usersReducer;
