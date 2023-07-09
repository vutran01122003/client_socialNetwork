import { combineReducers } from 'redux';
import authReducer from './authReducer';
import alertReducer from './alertReducer';
import { themeReducer } from './themeReducer';
import activePageReducer from './activePageReducer';
import usersReducer from './usersReducer';

const rootReducer = combineReducers({
    auth: authReducer,
    alert: alertReducer,
    theme: themeReducer,
    activePage: activePageReducer,
    users: usersReducer
});

export default rootReducer;
