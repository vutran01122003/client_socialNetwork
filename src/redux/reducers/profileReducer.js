import replaceOldElem from '../../utils/replaceOldElem';
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
        case GLOBALTYPES.PROFILE.GET_USER_POST:
            return { ...state, posts: [...state.posts, action.payload] };
        case GLOBALTYPES.PROFILE.SET_USER: {
            const newUsers = replaceOldElem(state.users, action.payload);
            return { ...state, users: [...newUsers] };
        }
        default:
            return state;
    }
}

export default profileReducer;
