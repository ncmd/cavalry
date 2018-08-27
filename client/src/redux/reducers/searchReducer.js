import {
    SEARCH_BOX,
} from '../actions/types';

export default function(state = [], action) {
    switch (action.type) {
        case SEARCH_BOX:
            return action.payload;
        default:
            return state;
    }
}
