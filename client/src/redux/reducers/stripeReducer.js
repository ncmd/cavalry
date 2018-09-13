import {
    SET_STRIPE_MODAL,
    SET_STRIPE_PROGRESS
} from '../actions/types';

const initialModalState = { modal: false, progresscompleted:0 };

export default function(state = [], action) {
    switch (action.type) {
        case SET_STRIPE_MODAL:
            return {
             ...state,
             modal: !state.modal
            }
        case SET_STRIPE_PROGRESS:
            return {
             ...state,
             progresscompleted: action.payload
            }
        default:
            return initialModalState;
    }
}
