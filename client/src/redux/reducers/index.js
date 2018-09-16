import { combineReducers } from 'redux';
import postsReducer from './postsReducer';
import status from './statusReducer';
import usersReducer from './usersReducer';
import emailReducer from './emailReducer';
import requestsReducer from './requestsReducer';
import search from './searchReducer';
import submit from './submitReducer';
import path from './pathReducer';
import groupsReducer from './groupsReducer';
import accountReducer from './accountReducer';
import themeReducer from './themeReducer';
import stripeReducer from './stripeReducer';

const rootReducer = combineReducers({
  users:usersReducer,
  requests:requestsReducer,
  account:accountReducer,
  posts:postsReducer,
  groups:groupsReducer,
  status,
  email:emailReducer,
  search,
  submit,
  path,
  theme:themeReducer,
  stripe:stripeReducer,
})

export default rootReducer;
