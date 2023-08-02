import { GLOBALTYPES } from '../actions/globalTypes';

function discoverReducer(state = [], action) {
    switch (action.type) {
        case GLOBALTYPES.DISCOVER.GET_POSTS_DISCOVER:
            return [...action.payload];
        default:
            return state;
    }
}

export default discoverReducer;
