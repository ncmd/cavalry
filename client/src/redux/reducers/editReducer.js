import {
    EDIT_POST_TITLE,
    EDIT_POST_DESCRIPTION,
    EDIT_POST_TAGS,
    EDIT_POST_OBJECTIVES,
    EDIT_CLEAR
} from '../actions/types';

export default function(state = [], action) {
    switch (action.type) {
        case EDIT_POST_TITLE:
          return [{ ...state[0], title:action.payload}];
        case EDIT_POST_DESCRIPTION:
          return [{ ...state[0], description:action.payload}];
        case EDIT_POST_TAGS:
          return [{ ...state[0], tags:action.payload}];
        case EDIT_POST_OBJECTIVES:
          return [{ ...state[0], objectives:action.payload}];
        case EDIT_CLEAR:
          return [];
        default:
            return state;
    }
}
