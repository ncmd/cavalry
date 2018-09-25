import {
    SET_STRIPE_MODAL,
    SET_STRIPE_PROGRESS,
    SET_STRIPE_PAYMENT_STATUS,
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
        case SET_STRIPE_PAYMENT_STATUS:
            return {
             ...state,
             paymentstatus: action.payload || false
            }
        default:
            return initialModalState;
    }
}
