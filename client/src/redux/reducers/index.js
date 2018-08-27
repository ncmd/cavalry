import { combineReducers } from 'redux';
import posts from './postsReducer';
import status from './statusReducer';
import users from './usersReducer';
import email from './emailReducer';
import search from './searchReducer';

export default combineReducers({
    posts: posts,
    status: status,
    users:users,
    emails: email,
    search: search,
});
