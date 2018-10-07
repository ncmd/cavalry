import {
    EDIT_SUBMIT_TITLE,
    EDIT_SUBMIT_DESCRIPTION,
    EDIT_SUBMIT_TAGS,
    EDIT_SUBMIT_OBJECTIVES,
    EDIT_CLEAR,
    EDIT_SUBMIT_DEPARTMENT,
} from '../actions/types';

export default function(state = [], action) {
    switch (action.type) {
        case EDIT_SUBMIT_TITLE:
          return [{ ...state[0], title:action.payload}];
        case EDIT_SUBMIT_DESCRIPTION:
          return [{ ...state[0], description:action.payload}];
        case EDIT_SUBMIT_TAGS:
          return [{ ...state[0], tags:action.payload}];
        case EDIT_SUBMIT_OBJECTIVES:
          return [{ ...state[0], objectives:action.payload}];
        case EDIT_SUBMIT_DEPARTMENT:
          return [{ ...state[0], department:action.payload}];
        case EDIT_CLEAR:
          return [];
        default:
            return state;
    }
}
