import {
    SET_EMAIL,
    // LOGIN_USER,
    FETCH_USER,
    SIGNOUT_USER,
    SET_PLAN,
} from '../actions/types';
//
// const initialLoginState = { logged: false };

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
        case 'LOGIN_USER':
            return action.payload;
        case SIGNOUT_USER:
            return {logged: false}
        default:
            return state;
    }
}
