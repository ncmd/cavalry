import {
    EMAIL_JIDOKA,
    ADD_SUBSCRIBER,
} from '../actions/types';

export default function(state = [], action) {
    switch (action.type) {
        case EMAIL_JIDOKA:
            return action.payload;
        case ADD_SUBSCRIBER:
            return action.payload;
        default:
            return state;
    }
}
