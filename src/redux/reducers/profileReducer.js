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
        case GLOBALTYPES.PROFILE.SET_USER: {
            const newUsers = [...state.users].filter(
                (user) => user._id !== action.payload._id
            );

            return { ...state, users: [...newUsers, action.payload] };
        }
        default:
            return state;
    }
}

export default profileReducer;
