import { combineReducers } from 'redux';
import postsReducer from './postsReducer';
import status from './statusReducer';
import usersReducer from './usersReducer';
import emailReducer from './emailReducer';
import search from './searchReducer';
import submit from './submitReducer';
import path from './pathReducer';
import groupsReducer from './groupsReducer';
import accountReducer from './accountReducer';

const rootReducer = combineReducers({
  users:usersReducer,
  account:accountReducer,
  posts:postsReducer,
  groups:groupsReducer,
  status,
  email:emailReducer,
  search,
  submit,
  path
})

export default rootReducer;
