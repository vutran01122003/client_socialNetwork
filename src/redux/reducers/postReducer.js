import { GLOBALTYPES } from '../actions/globalTypes';

const initialState = {
    loading: false,
    result: 0,
    posts: []
};

function postReducer(state = initialState, action) {
    switch (action.type) {
        case GLOBALTYPES.POST.CREATE_POST:
            console.log('ok');
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
        default:
            return state;
    }
}

export default postReducer;
