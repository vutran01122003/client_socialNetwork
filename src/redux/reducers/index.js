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
import notifyReducer from './notifyReducer';
import messageReducer from './messageReducer';
import callReducer from './callReducer';
import peerReducer from './peerReducer';
import passwordReducer from './passwordReducer';
import marketplaceReducer from './marketplaceReducer';

const rootReducer = combineReducers({
    auth: authReducer,
    password: passwordReducer,
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
    socket: socketReducer,
    peer: peerReducer,
    notify: notifyReducer,
    message: messageReducer,
    call: callReducer,
    marketplace: marketplaceReducer
});

export default rootReducer;
