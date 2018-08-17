import axios from 'axios';
import {
    GET_POSTS,
    ADD_POST,
    REMOVE_POST,
    PING_BACKEND,
    ADD_USER,
    SET_EMAIL,
    EMAIL_JIDOKA,
    APPLY_SECURITY,
    ADD_SUBSCRIBER,
    LOGIN_USER,
} from './types';

let axiosConfig = {
    headers: {
        'Content-Type': 'application/json',
    }
};


if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
  //Dev
  let backend = 'http://localhost:8000'
} else {
  //Prod
  let backend = 'https://cavalry-app.herokuapp.com'
}



// Action Creator, call Golang RestAPI, uses Dispatch Redux to send to store
export const getPosts = () => async dispatch => {
    const res = await axios.get(backend+'/api/posts');
    dispatch({ type: GET_POSTS, payload: res.data });
};

export const addPost = (title,description,tags) => async dispatch =>{
    const data = {title:title,description:description,tags:tags};
    const res = await axios.post(backend+'/api/post/new',data,axiosConfig);
    dispatch({ type: ADD_POST, payload: res.data });
};

export const addSubscriber = (email) => async dispatch =>{
    const data = {email:email};
    const res = await axios.post(backend+'/api/subscriber/new',data,axiosConfig);
    dispatch({ type: ADD_SUBSCRIBER, payload: res.data });
};


export const setUserEmail = (email) => async dispatch => {
    const data = {email:email};
    dispatch({ type: SET_EMAIL, payload: data });
    console.log("setUserEmail:",data);
};

export const loginUser = (auth) => async dispatch => {
  const data = {login:auth};
  dispatch({ type: LOGIN_USER, payload: data });
};


// Need to add user email to the state because need to keep track of email address
export const addUser = (email,token) => async dispatch =>{
    const data = {email:email, token:token};
    console.log("DATA:",data)
    const res =  await axios.post(backend+'/api/user/new',data);
    console.log(res);
    dispatch({ type: ADD_USER, payload: res.data });
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
export const applySecurity = (email,recaptcha, date) => async dispatch => {
    let data = {  email:"test@gmail.com", recaptcha:recaptcha, date:date};
    const res = await axios.post(backend+'/api/apply', data );
    dispatch({ type: APPLY_SECURITY, payload: res.data });
};
