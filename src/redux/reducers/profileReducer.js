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
            const newUsers = [...state.users];
            for (let i = 0; i < newUsers.length; i++) {
                if (newUsers[i]._id === action.payload._id) {
                    newUsers.splice(i, 1, action.payload);
                    break;
                }
            }

            return { ...state, users: [...newUsers] };
        }
        default:
            return state;
    }
}

export default profileReducer;
