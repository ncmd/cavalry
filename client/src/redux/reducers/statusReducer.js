import {
    PING_BACKEND
} from '../actions/types';

export default function(state = [], action) {
    switch (action.type) {
        case PING_BACKEND:
            return action.payload;
        default:
            return state;
    }
}
