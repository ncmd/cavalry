import {
    ADD_ACCOUNT,

} from '../actions/types';

export default function(state = [], action) {
    switch (action.type) {
        case ADD_ACCOUNT:
            return action.payload;
        default:
            return state;
    }
}
