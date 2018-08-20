import {
    GET_POSTS,
    ADD_POST,
    REMOVE_POST,
    GET_POST,
} from '../actions/types';

export default function(state = [], action) {
    switch (action.type) {
        case GET_POSTS:
            return action.payload;
        case GET_POST:
            return action.payload;
        case ADD_POST:
            return action.payload;
        case REMOVE_POST:
            return action.payload;
        default:
            return state;
    }
}
