import { GLOBALTYPES } from '../actions/globalTypes';

const initialState = {
    loading: false,
    result: 0,
    posts: []
};

function postReducer(state = initialState, action) {
    switch (action.type) {
        case GLOBALTYPES.POST.CREATE_POST:
            return {
                ...state,
                posts: [...state.posts, action.payload],
                result: state.result + 1
            };
        case GLOBALTYPES.POST.LOADING_POST:
            return { ...state, ...action.payload };
        case GLOBALTYPES.POST.GET_POST:
            return {
                ...state,
                posts: [...action.payload.posts],
                result: action.payload.result
            };
        case GLOBALTYPES.POST.UPDATE_POST:
            const newPosts = [...state.posts];
            for (let i = 0; i < newPosts.length; i++) {
                if (newPosts[i]._id === action.payload._id) {
                    newPosts.splice(i, 1, action.payload);
                    break;
                }
            }
            return {
                ...state,
                posts: [...newPosts]
            };
        default:
            return state;
    }
}

export default postReducer;
