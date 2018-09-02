import {
    GET_POSTS,
    ADD_POST,
    UPDATE_POST,
    REMOVE_POST,
    GET_POST,
} from '../actions/types';

export default function(state = [], action) {
    switch (action.type) {
        case GET_POSTS:
            return state;
        case GET_POST:
            return action.payload;
        case ADD_POST:
            return state;
        case UPDATE_POST:
            return state;
        case REMOVE_POST:
            return action.payload;
        default:
            return state;
    }
}
