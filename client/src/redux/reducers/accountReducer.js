import {
    ADD_ACCOUNT,
    GET_ACCOUNT,
    SET_STRIPE_CUSTOMERID,
    SIGNOUT_ACCOUNT,
    JOIN_ORGANIZATION,
} from '../actions/types';

export default function(state = [], action) {
    switch (action.type) {
        case ADD_ACCOUNT:
            return action.payload;
        case SET_STRIPE_CUSTOMERID:
            return {
               ...state,
               stripeCustomerId: action.payload,
              }
        case GET_ACCOUNT:
            return action.payload;
        case JOIN_ORGANIZATION:
            return {...state,
              organizationname: action.payload,
              organizationmember: true,
            }
        case SIGNOUT_ACCOUNT:
            return []
        default:
            return state;
    }
}
