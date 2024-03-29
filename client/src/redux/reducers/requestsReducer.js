import {
    ADD_REQUEST,
    EDIT_REQUEST_TAGS
} from '../actions/types';

export default function(state = [], action) {
    switch (action.type) {
        case 'GET_REQUESTS':
          return action.payload;
        case ADD_REQUEST:
          const indexActivity = action.payloadindex;
          console.log(state)
            return {...state,
                  [indexActivity]: action.payload
            };
        case EDIT_REQUEST_TAGS:
          return [{ ...state[0], tags:action.payload}];
        default:
            return state;
    }
}
