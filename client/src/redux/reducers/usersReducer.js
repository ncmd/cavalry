import {
    SET_EMAIL,
    LOGIN_USER,
    FETCH_USER,
    SIGNOUT_USER,
} from '../actions/types';

const initialLoginState = { logged: false };

export default function(state = [], action) {

    switch (action.type) {
        case FETCH_USER:
          return state
        case SET_EMAIL:
            return action.payload;
        case LOGIN_USER:
            return action.payload;
        case SIGNOUT_USER:
            return {logged: false}
        default:
            return initialLoginState;
    }
}
