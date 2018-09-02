import { combineReducers } from 'redux';
import posts from './postsReducer';
import status from './statusReducer';
import users from './usersReducer';
import email from './emailReducer';
import search from './searchReducer';
import submit from './submitReducer';
import path from './pathReducer';

export default combineReducers({
  users: users,
  posts: posts,
  status: status,
  emails: email,
  search: search,
  submit:submit,
  path:path,
})
