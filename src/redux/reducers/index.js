import { combineReducers } from 'redux';
import authReducer from './authReducer';
import alertReducer from './alertReducer';
import { themeReducer } from './themeReducer';
import activePageReducer from './activePageReducer';
import usersReducer from './usersReducer';
import profileReducer from './profileReducer';
import postReducer from './postReducer';
import statusReducer from './statusReducer';
import detailPostReducer from './detailPostListReducer';
import discoverReducer from './discoverReducer';
import suggestedUsersReducer from './suggestedUsersReducer';
import socketReducer from './socketReducer';

const rootReducer = combineReducers({
    auth: authReducer,
    alert: alertReducer,
    theme: themeReducer,
    activePage: activePageReducer,
    users: usersReducer,
    profile: profileReducer,
    status: statusReducer,
    homePost: postReducer,
    detailPostList: detailPostReducer,
    postsDiscover: discoverReducer,
    suggestedUsers: suggestedUsersReducer,
    socket: socketReducer
});

export default rootReducer;
