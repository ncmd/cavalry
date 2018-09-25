import {
    CHECK_ORGANIZATION,
    LEAVE_ORGANIZATION,
    SIGNOUT_ORGANIZATION,
} from '../actions/types';

export default function(state = [{organizationmember:false}], action) {
    switch (action.type) {
        case CHECK_ORGANIZATION:
            return {...state,
              check: action.payload
            }
        case LEAVE_ORGANIZATION:
            return {...state,
              organizationname: "",
              organizationmember: false,
            }
        case SIGNOUT_ORGANIZATION:
            return []
        default:
            return state;
    }
}
