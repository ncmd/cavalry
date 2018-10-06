import axios from 'axios';
import {db} from '../../components/firebase/firebase'
import {auth} from '../../components/firebase'
import {
    // GET_POSTS,
    GET_POST,
    ADD_POST,
    ADD_REQUEST,
    ADD_ACTIVITY,
    EDIT_REQUEST_TAGS,
    REMOVE_POST,
    UPDATE_POST,
    PING_BACKEND,
    ADD_USER,
    SET_EMAIL,
    SET_PLAN,
    // EMAIL_JIDOKA,
    SET_RECAPTCHA,
    SET_STRIPE_CUSTOMERID,
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
    ADD_GROUP_SKILLSEXPERIENCE,
    ADD_GROUPS,
    ADD_ACCOUNT,
    GET_ACCOUNT,
    SET_STRIPE_MODAL,
    SET_STRIPE_PROGRESS,
    SET_STRIPE_PAYMENT_STATUS,
    LEAVE_ORGANIZATION,
    SET_THEME,
    SIGNOUT_ACCOUNT,
    CHECK_ORGANIZATION,
    JOIN_ORGANIZATION,
    SIGNOUT_ORGANIZATION,
    LOAD_ORGANIZATION,
    FILTERED_POSTS,
    SET_TAGS,
    CHANGE_DEPARTMENT_ORGANIZATION,
} from './types';

const keys = require('../../secrets/keys');
let backend = keys.heroku_backend_uri

export const lightThemeLoad = () => dispatch => {
  const theme = [{
    theme:'light',
    PrimaryDark:'#5533ff',
    PrimaryLight:'#3d63ff',
    PrimaryLinear:'linear-gradient(#5533ff, #3d63ff)',
    BorderRadius:'5px 5px 5px 5px',
    Secondary:'#6772e5',
    MainBackground:'#e3e8ee',
    HeaderBackground: '#e3e8ee',
    PostsButtonBackground:"white",
    PostsButtonBorder:"1px solid #ced4da",
    PostsTypographyTitle:"#333333",
    PostsTypographyDescription:"#525f7f",
    PostsTypographyObjectives:"#525f7f",
    PostsSectionBorder:'2px solid #ced4da',
    PostsTagsBackground:"#7795f8",
    PostsTagsText:"white",
    AlgoliaSearchText:"black",
  }]
  dispatch({ type: SET_THEME, payload: theme})
}

export const darkThemeLoad = () => dispatch => {
  const theme = [{
    theme:'dark',
    PrimaryDark:'#5533ff',
    PrimaryLight:'#3d63ff',
    PrimaryLinear:'linear-gradient(#5533ff, #3d63ff)',
    BorderRadius:'5px 5px 5px 5px',
    Secondary:'#6772e5',
    MainBackground:'#030303',
    HeaderBackground: '#030303',
    PostsButtonBackground:"#1A1A1B",
    PostsButtonBorder:"1px solid #ced4da",
    PostsTypographyTitle:"#6772e5",
    PostsTypographyDescription:"#E0E0E0",
    PostsTypographyObjectives:"#E0E0E0",
    PostsSectionBorder:'2px solid #424242',
    PostsTagsBackground:"#7795f8",
    PostsTagsText:"white",
    AlgoliaSearchText:"black",
  }]
  dispatch({ type: SET_THEME, payload: theme})
}




export const filterPostByTagAction = (filtertagname) => async dispatch => {
  const data = await auth.filterPostByTag(filtertagname)
  console.log("DAAATA",data)
  dispatch({ type: FILTERED_POSTS, payload: data})

}

// Get VerifyIDToken
export const sendVerifyIdTokenToBackend = (token) => {
  console.log("Received Token: ",token)
  let data = {token:token}
  const res = axios.post(backend+'/api/verify',data);
  console.log("Response from backend:",res)
}

export const loadOrganizationAll = (organizationname) => async dispatch => {
  const data =await  auth.loadOrganization(organizationname)
  console.log("DAAATA",data)
  dispatch({type: LOAD_ORGANIZATION, payload:data })
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
export const addGroupSkillsExperience = (skillsexperience) => dispatch => {
    const data = {skillsexperience}
    dispatch({ type: ADD_GROUP_SKILLSEXPERIENCE, payload: data });
};
export const addGroups = (groups) => async dispatch => {
    const data = {groups}
    dispatch({ type: ADD_GROUPS, payload: data });
};

export const changeOrgMemberDepartment = (organizationname,index,department) => dispatch => {
  auth.changeOrgMemberDepartmentFirestore(organizationname,index,department)
  dispatch({ type: CHANGE_DEPARTMENT_ORGANIZATION, payloadindex: index, payloaddepartment:department})
}

export const addGroupUser = (uri, accountid, contactname,emailaddress,instantmessenger,department,location) => async dispatch => {
    const data = {accountid:accountid, contactname:contactname,emailaddress:emailaddress,instantmessenger:instantmessenger,department:department,location:location}
    await axios.post(backend+`${uri}`,data);
    dispatch({ type: ADD_GROUPS, payload: data });
};

export const setAccount = (email,accountid,plan) => async dispatch => {
    console.log(email,accountid,plan)
    const data = {email:email,accountid:accountid, plan:plan}
    await axios.post(backend+'/api/accounts/create',data);
    dispatch({ type: ADD_ACCOUNT, payload: data });
};

export const createAccount = (email) => async dispatch => {
  const data = {email:email}
  await axios.post(backend+'/api/account/create',data)
  // console.log(res)
}

export const getAccount = (accountid) => async dispatch => {
    const data = {accountid:accountid}
    const res = await axios.post(backend+'/api/account/get',data);
    dispatch({ type: GET_ACCOUNT, payload: res.data });
};

export const inviteAccount = (email,organizationname) => async dispatch => {
  const data = {email:email,organizationname:organizationname}
  const res = await axios.post(backend+'/api/account/invite',data)
  console.log(res.data)
  return res.data
}

export const createOrganization = (organizationname,emailaddress,accountid) => async dispatch => {
  const data = {organizationname:organizationname.toLowerCase(),emailaddress:emailaddress,accountid:accountid}
  await axios.post(backend+'/api/organization/create',data).then(function(result){
    console.log("Create Organization:",result)
      dispatch({ type: JOIN_ORGANIZATION, payload:organizationname})
      const orgdata = auth.loadOrganization(organizationname)
      console.log(orgdata)
  })
}

export const joinOrganization = (organizationname,accountid) => async dispatch => {
  console.log("Joining Organization")
  const data = {organizationname:organizationname.toLowerCase(),accountid:accountid}
  await axios.post(backend+'/api/organization/join',data)
  // dispatch({ type: JOIN_ORGANIZATION, payload:organizationname})
}

export const leaveOrganization = (organizationname,accountid) => async dispatch => {
  const data = {organizationname:organizationname,accountid:accountid}
  await axios.post(backend+'/api/organization/leave',data)
  dispatch({ type: LEAVE_ORGANIZATION, payload:organizationname})
}



export const checkOrganization = (organizationname) => async dispatch => {
  const data = {organizationname:organizationname.toLowerCase()}
  const res = await axios.post(backend+'/api/organization/check',data)
  console.log(res.data.Message)
  dispatch({ type: CHECK_ORGANIZATION, payload: res.data.Message})
}

export const unsubscribeAccount = (subscriptionid) => async dispatch => {
  console.log("Canceling Subscription:",subscriptionid)
  const data = {stripeSubscriptionId: subscriptionid}
  await axios.post(backend+'/api/account/unsubscribe',data)
}

export const editRequestTags = (tags) => dispatch => {
    const data = {tags}
    dispatch({ type: EDIT_REQUEST_TAGS, payload: data });
};

// Need to adjust performance
export const getTags = () => async dispatch => {
  const res = await axios.get(backend+'/api/posts')
    let allTags = []
    res.data.map((post) => {
      // console.log("getPost",post.tags)
      post.tags.map((tag) => {
        allTags.push(tag)
      })
    })
    console.log("allTags:",allTags)
    console.log("resdata",res.data)
    dispatch({ type: SET_TAGS, payload: allTags})
    return res.data
}

// Action Creator, call Golang RestAPI, uses Dispatch Redux to send to store
export const getPosts = () => async dispatch => {
    const res = await axios.get(backend+'/api/posts')
    dispatch({ type: 'GET_POSTS', payload: res.data });
};

export const getRequests = () => async dispatch => {
    const res = await axios.get(backend+'/api/requests')
    dispatch({ type: 'GET_REQUESTS', payload: res.data });
};

export const getStripeCustomerID = (email) => async dispatch => {
  const data = {email:email}
  const res = await axios.get(backend+'/api/user/customerid',data)
  console.log("getStripeCustomerID:",res.data.id)
  // dispatch to account redux
  dispatch({ type: SET_STRIPE_CUSTOMERID, payload: res.data.id})
}

export const stripePaymentStatus = (status) => async dispatch => {
  dispatch ({ type: SET_STRIPE_PAYMENT_STATUS, payload: status})
}

export const updateFirebaseAccountsWithStripeCustomerId = (accountid,customerid) => async disptach => {
  const data = {accountid:accountid, customerid:customerid}
  await axios.post(backend+'/api/accounts/update',data)
}

export const addPost = (title,description,tags,objectives) => async dispatch =>{
    const data = {title:title,description:description,tags:tags,objectives:objectives};
    await axios.post(backend+'/api/post/new',data);
    dispatch({ type: ADD_POST });
};

export const addRequest = (description,tags) => async dispatch =>{
    const data = {description:description,tags:tags};
    await axios.post(backend+'/api/request/new',data);
    dispatch({ type: ADD_REQUEST });
};

export const addActivity = (postid,accountid) => async dispatch =>{
    const data = {postid:postid,accountid:accountid};
    await axios.post(backend+'/api/activity/new',data);
    dispatch({ type: ADD_ACTIVITY });
};

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


export const setUserEmail = (email) => dispatch => {
    const data = {email:email};
    dispatch({ type: SET_EMAIL, payload: data });
};

export const loginUser = (accountid,email) => dispatch => {
  const data = {logged: true,login:accountid,email:email};
  dispatch({ type: 'LOGIN_USER', payload: data });
};

export const signoutUser = () => dispatch => {
  dispatch({ type: SIGNOUT_USER, payload:{}})
}

export const signoutAccount = () => dispatch => {
  dispatch({ type: SIGNOUT_ACCOUNT, payload:{}})
}

export const signoutOrganization = () => dispatch => {
  dispatch({ type: SIGNOUT_ORGANIZATION, payload:{}})
}

export const getUser = () => dispatch => {
  dispatch({ type: FETCH_USER});
};

export const addUser = (email,accountid,source,plan) => async dispatch =>{
    let data = {email:email, accountid:accountid, source:source, plan:plan};
    console.log("DATA:",data)
    const res =  await axios.post(backend+'/api/user/new',data);
    dispatch({ type: ADD_USER, payload: res.data });
    return res.data
};

export const setPlan = (plan) => async dispatch =>{
    const data = {plan:plan};
    dispatch({ type: SET_PLAN, payload: data });
};

export const removePost = () => async dispatch => {
    const res = await axios.post(backend+'/api/post');
    dispatch({ type: REMOVE_POST, payload: res.data });
};

export const pingBackend = () => async dispatch => {
    await axios.get(backend+'/api/ping').then((response) => {
        dispatch({ type: PING_BACKEND, payload: 'up' });
    }).catch((response) => {
        if (response.status === undefined) {
           dispatch({ type: PING_BACKEND, payload: "down" });
        }
    });
};

export const setStripeProgress = (value) => dispatch => {
  dispatch({ type: SET_STRIPE_PROGRESS, payload: value})
}

// Action Creator, call Golang RestAPI, uses Dispatch Redux to send to store
export const applySecurity = (email,recaptcha) => async dispatch => {
    let data = {  email:email, recaptcha:recaptcha};
    const res = await axios.post(backend+'/api/apply', data );
    dispatch({ type: SET_RECAPTCHA, payload: res.data });
};

export const setStripeModal = () => dispatch => {
    dispatch({ type: SET_STRIPE_MODAL})
}
