import { GLOBALTYPES } from '../actions/globalTypes';

function usersReducer(state = { userList: [] }, action) {
    switch (action.type) {
        case GLOBALTYPES.USERS.SEARCH_USERS:
            return { ...state, userList: action.payload };
        default:
            return state;
    }
}

export default usersReducer;
