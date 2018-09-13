import {
    SET_EMAIL,
    // LOGIN_USER,
    FETCH_USER,
    SIGNOUT_USER,
    SET_PLAN,
    ADD_USER
} from '../actions/types';


export default function(state = [], action) {

    switch (action.type) {
        case FETCH_USER:
          return state;
        case SET_EMAIL:
            return {
             ...state,
             email: action.payload.email,
             password: action.payload.password
            }
        case SET_PLAN:
            return {
              ...state,
              plan: action.payload.plan
            }
        case ADD_USER:
            return {
             ...state,
             password: action.payload
            }
        case 'LOGIN_USER':
            return action.payload;
        case SIGNOUT_USER:
            return {logged: false}
        default:
            return state;
    }
}
