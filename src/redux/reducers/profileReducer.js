import { GLOBALTYPES } from '../actions/globalTypes';

const initialState = {
    loading: false,
    users: [],
    posts: []
};

function profileReducer(state = initialState, action) {
    switch (action.type) {
        case GLOBALTYPES.PROFILE.LOADING:
            return { ...state, loading: action.payload };
        case GLOBALTYPES.PROFILE.GET_USER:
            return { ...state, users: [...state.users, action.payload] };
        default:
            return state;
    }
}

export default profileReducer;
