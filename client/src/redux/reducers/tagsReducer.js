import {
    SET_TAGS,
} from '../actions/types';

export default function(state = [], action) {
    switch (action.type) {
        case SET_TAGS:
            return {
               ...state,
               allTags: action.payload,
              }
        default:
            return state;
    }
}
