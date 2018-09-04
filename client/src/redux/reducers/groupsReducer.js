import {
    ADD_GROUP_CONTACTNAME,
    ADD_GROUP_EMAILADDRESS,
    ADD_GROUP_INSTANTMESSAGER,
    ADD_GROUP_DEPARTMENT,
    ADD_GROUP_LOCATION,
    ADD_GROUP_CLEAR,
    ADD_GROUPS
} from '../actions/types';

export default function(state = [], action) {
    switch (action.type) {
        case ADD_GROUP_CONTACTNAME:
          return [{ ...state[0], contactname:action.payload}];
        case ADD_GROUP_EMAILADDRESS:
          return [{ ...state[0], emailaddress:action.payload}];
        case ADD_GROUP_INSTANTMESSAGER:
          return [{ ...state[0], instantmessager:action.payload}];
        case ADD_GROUP_DEPARTMENT:
          return [{ ...state[0], department:action.payload}];
        case ADD_GROUP_LOCATION:
          return [{ ...state[0], location:action.payload}];
        case ADD_GROUPS:
            return [{ ...state[0], groups:action.payload}];
        case ADD_GROUP_CLEAR:
          return [];
        default:
            return state;
    }
}
