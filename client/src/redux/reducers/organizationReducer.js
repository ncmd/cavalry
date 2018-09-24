import {
    CHECK_ORGANIZATION,
    JOIN_ORGANIZATION,
    LEAVE_ORGANIZATION,
} from '../actions/types';

export default function(state = [], action) {
    switch (action.type) {
        case CHECK_ORGANIZATION:
            return {...state,
              check: action.payload
            }
        case JOIN_ORGANIZATION:
            return {...state,
              organizationname: action.payload,
              organizationmember: true,
            }
        case LEAVE_ORGANIZATION:
            return {...state,
              organizationname: "",
              organizationmember: false,
            }
        default:
            return state;
    }
}
