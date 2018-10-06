import {
  ADD_ACTIVITY
} from '../actions/types';

export default function(state = [], action) {
    switch (action.type) {
        case ADD_ACTIVITY:
            return action.payload;
        default:
            return state;
    }
}
