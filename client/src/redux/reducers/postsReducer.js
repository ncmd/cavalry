import {
    // GET_POSTS,
    ADD_POST,
    STAR_POST,
    UPDATE_POST,
    REMOVE_POST,
    GET_POST,
    FILTERED_POSTS,
    STAR_POST_LOCAL,
    ADD_COMMENT
} from '../actions/types';

export default function(state = [], action) {
    switch (action.type) {
        case 'GET_POSTS':
            return action.payload;
        case FILTERED_POSTS:
            return action.payload;
        case GET_POST:
            return action.payload;
        case STAR_POST:
          const indexPost = action.payloadindex;
          return [
             ...state.slice(0, indexPost),
             { ...state[indexPost],
               stars: state[indexPost].stars + action.payloadaction },
             ...state.slice(indexPost + 1),
           ];
       case STAR_POST_LOCAL:
         return {
           ...state,
             stars: state.stars + action.payloadaction
           }
        case ADD_POST:
            return state;
        case UPDATE_POST:
            return state;
        case REMOVE_POST:
            return action.payload;
        default:
            return state;
    }
}
