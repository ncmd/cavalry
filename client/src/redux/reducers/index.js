import { combineReducers } from 'redux';
import posts from './postsReducer';
import status from './statusReducer';
import users from './usersReducer';
import emailReducer from './emailReducer';

export default combineReducers({
    posts: posts,
    status: status,
    users:users,
    emails: emailReducer,
});
