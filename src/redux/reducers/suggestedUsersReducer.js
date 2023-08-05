import { GLOBALTYPES } from '../actions/globalTypes';

const initialState = {
    loading: false,
    users: []
};
function suggestedUsersReducer(state = initialState, action) {
    switch (action.type) {
        case GLOBALTYPES.SUGGESTION.LOADING:
            return { ...state, loading: action.payload };
        case GLOBALTYPES.SUGGESTION.SUGGEST_USER:
            return { ...state, users: [...action.payload] };

        default:
            return state;
    }
}

export default suggestedUsersReducer;
