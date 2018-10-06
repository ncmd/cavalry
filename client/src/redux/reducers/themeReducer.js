import {
    SET_THEME,
} from '../actions/types';

const initialState = {
  theme: [{background:'#e3e8ee'}]
};

export default function(state = [], action) {
    switch (action.type) {
        case SET_THEME:
            return action.payload;
        default:
            return state;
    }
}
