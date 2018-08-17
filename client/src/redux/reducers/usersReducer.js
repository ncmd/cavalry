import {
    ADD_USER,
    SET_EMAIL,
    LOGIN_USER,
} from '../actions/types';

export default function(state = [], action) {
    switch (action.type) {
        case LOGIN_USER:
            return action.payload || false;
        case SET_EMAIL:
            return action.payload;
        case ADD_USER:
            return action.payload;
        default:
            return state;
    }
}
