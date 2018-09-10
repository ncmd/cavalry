import axios from 'axios';
import {
    // GET_POSTS,
    GET_POST,
    ADD_POST,
    REMOVE_POST,
    UPDATE_POST,
    PING_BACKEND,
    ADD_USER,
    SET_EMAIL,
    SET_PLAN,
    EMAIL_JIDOKA,
    APPLY_SECURITY,
    ADD_SUBSCRIBER,
    // LOGIN_USER,
    FETCH_USER,
    SEARCH_BOX,
    SIGNOUT_USER,
    EDIT_SUBMIT_TITLE,
    EDIT_SUBMIT_DESCRIPTION,
    EDIT_SUBMIT_TAGS,
    EDIT_SUBMIT_OBJECTIVES,
    EDIT_CLEAR,
    SET_PATH,
    ADD_GROUP_CONTACTNAME,
    ADD_GROUP_EMAILADDRESS,
    ADD_GROUP_INSTANTMESSENGER,
    ADD_GROUP_DEPARTMENT,
    ADD_GROUP_LOCATION,
    ADD_GROUPS,
    ADD_ACCOUNT,
    // SET_THEME,
} from './types';

let backend = ''

if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
  //Dev
  backend = 'http://localhost:8000'
} else {
  //Prod
  backend = 'https://cavalry-app.herokuapp.com'
}

export const setPath = (path) => dispatch => {
  console.log("This Path:",path)
  const data ={path:path}
  dispatch({type: SET_PATH, payload: data})
}

export const searchBox = (data) => dispatch => {
  dispatch({type: SEARCH_BOX, payload: data})
}

// Edit Objectives
export const editSubmitTitle = (title) => dispatch => {
    const data = {title}
    dispatch({ type: EDIT_SUBMIT_TITLE, payload: data });
};
export const editSubmitDescription = (description) => dispatch => {
    const data = {description}
    dispatch({ type: EDIT_SUBMIT_DESCRIPTION, payload: data });
};
export const editSubmitTags = (tags) => dispatch => {
    const data = {tags}
    dispatch({ type: EDIT_SUBMIT_TAGS, payload: data });
};
export const editSubmitObjectives = (objectives) => dispatch => {
    const data = {objectives}
    dispatch({ type: EDIT_SUBMIT_OBJECTIVES, payload: data });
};
export const editClear = () => dispatch => {
    dispatch({ type: EDIT_CLEAR });
};

// Edit Groups
export const addGroupContactname = (contactname) => dispatch => {
    const data = {contactname}
    dispatch({ type: ADD_GROUP_CONTACTNAME, payload: data });
};
export const addGroupEmailaddress = (emailaddress) => dispatch => {
    const data = {emailaddress}
    dispatch({ type: ADD_GROUP_EMAILADDRESS, payload: data });
};
export const addGroupInstantmessenger = (instantmessenger) => dispatch => {
    const data = {instantmessenger}
    dispatch({ type: ADD_GROUP_INSTANTMESSENGER, payload: data });
};
export const addGroupDepartment = (department) => dispatch => {
    const data = {department}
    dispatch({ type: ADD_GROUP_DEPARTMENT, payload: data });
};
export const addGroupLocation = (location) => dispatch => {
    const data = {location}
    dispatch({ type: ADD_GROUP_LOCATION, payload: data });
};
export const addGroups = (groups) => async dispatch => {
    const data = {groups}
    dispatch({ type: ADD_GROUPS, payload: data });
};

export const addGroupUser = (uri, accountid, contactname,emailaddress,instantmessenger,department,location) => async dispatch => {
    const data = {accountid:accountid, contactname:contactname,emailaddress:emailaddress,instantmessenger:instantmessenger,department:department,location:location}
    await axios.post(backend+`${uri}`,data);
    dispatch({ type: ADD_GROUPS, payload: data });
};

export const setAccount = (accountid) => async dispatch => {
    const data = {accountid:accountid}
    await axios.post(backend+'/api/accounts/create',data);
    dispatch({ type: ADD_ACCOUNT, payload: data });
};



// Action Creator, call Golang RestAPI, uses Dispatch Redux to send to store
export const getPosts = () => async dispatch => {
    const res = await axios.get(backend+'/api/posts');
    // console.log("RES getPosts",res.data)
    dispatch({ type: 'GET_POSTS', payload: res.data });
};

export const addPost = (title,description,tags,objectives) => async dispatch =>{
    const data = {title:title,description:description,tags:tags,objectives:objectives};
    await axios.post(backend+'/api/post/new',data);
    dispatch({ type: ADD_POST });
};

// function findAndReplace(string, target, replacement) {
//  var i = 0, length = string.length;
//  for (i; i < length; i++) {
//   string = string.replace(target, replacement);
//  }
//  return string;
// }

export const updatePost = (id,title,description,tags,objectives) => async dispatch =>{
    const data = {id:id,title:title,description:description,tags:tags,objectives:objectives};
    await axios.post(backend+'/api/post/edit',data);
    dispatch({ type: UPDATE_POST });
};


export const getPost = (uri) => async dispatch => {
  // console.log("URI:",uri);

  const res = await axios.get(backend+`${uri}`);
  console.log("RES",res)
    dispatch({ type: GET_POST, payload: res.data });
}

export const editPost = (uri) => async dispatch => {
  console.log("URI:",uri);
  const res = await axios.get(backend+`${uri}`);
    dispatch({ type: GET_POST, payload: res.data });
}

export const addSubscriber = (email) => async dispatch =>{
    const data = {email:email};
    const res = await axios.post(backend+'/api/subscribe/new',data);
    console.log("Add Sub Response:",res)
    dispatch({ type: ADD_SUBSCRIBER, payload: res.data });
};


export const setUserEmail = (email,password) => dispatch => {
    const data = {email:email,password:password};
    dispatch({ type: SET_EMAIL, payload: data });
    console.log("setUserEmail:",data);
};

export const loginUser = (auth) => dispatch => {
  const data = {logged: true,login:auth};
  console.log("DATA LOGINUSER:",data)
  dispatch({ type: 'LOGIN_USER', payload: data });
};

export const signoutUser = () => dispatch => {
  dispatch({ type: SIGNOUT_USER, payload:{}})
  console.log("Signout Redux")
}

export const getUser = () => dispatch => {
  dispatch({ type: FETCH_USER});
};


// Need to add user email to the state because need to keep track of email address
// This Subscribes User to Stripe Plan
export const addUser = (email,source,plan) => async dispatch =>{
    const data = {email:email, source:source, plan:plan};
    console.log("DATA:",data)
    const res =  await axios.post(backend+'/api/user/new',data);
    console.log(res);
    dispatch({ type: ADD_USER, payload: res.data });
};

export const setPlan = (plan) => async dispatch =>{
    const data = {plan:plan};
    dispatch({ type: SET_PLAN, payload: data });
};

export const removePost = () => async dispatch => {
    const res = await axios.post(backend+'/api/post');
    dispatch({ type: REMOVE_POST, payload: res.data });
};

// Ping Backend
export const pingBackend = () => async dispatch => {
    await axios.get(backend+'/api/ping').then((response) => {
        dispatch({ type: PING_BACKEND, payload: 'up' });
    }).catch((response) => {
        if (response.status === undefined) {
           dispatch({ type: PING_BACKEND, payload: "down" });
        }
    });
};

// Action Creator, call Golang RestAPI, uses Dispatch Redux to send to store
export const emailJidoka = (email,recaptcha) => async dispatch => {
    let data = { email:"test@gmail.com", recaptcha:recaptcha};
    const res = await axios.post(backend+'/api/email', data );
    dispatch({ type: EMAIL_JIDOKA, payload: res.data });
};

// Action Creator, call Golang RestAPI, uses Dispatch Redux to send to store
export const applySecurity = (email,recaptcha) => async dispatch => {
    let data = {  email:email, recaptcha:recaptcha};
    const res = await axios.post(backend+'/api/apply', data );
    dispatch({ type: APPLY_SECURITY, payload: res.data });
};
