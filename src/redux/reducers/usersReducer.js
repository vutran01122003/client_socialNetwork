import { GLOBALTYPES } from '../actions/globalTypes';

function usersReducer(state = { userList: [] }, action) {
    switch (action.type) {
        case GLOBALTYPES.USERS:
            return { ...state, userList: action.payload };
        default:
            return state;
    }
}

export default usersReducer;
