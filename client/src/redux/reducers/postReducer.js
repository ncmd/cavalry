import {
    post_objectives
} from '../actions/types';

export default function(state = [], action) {
    switch (action.type) {
        case post_objectives:
            return action.payload;
        default:
            return state;
    }
}
