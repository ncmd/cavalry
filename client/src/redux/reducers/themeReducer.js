import {
    SET_THEME,
} from '../actions/types';

export default function(state = [], action) {
    switch (action.type) {
        case SET_THEME:
            return action.payload;
        default:
            return state;
    }
}
