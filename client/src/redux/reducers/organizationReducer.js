import {
    CHECK_ORGANIZATION,
    LEAVE_ORGANIZATION,
    SIGNOUT_ORGANIZATION,
    LOAD_ORGANIZATION,
} from '../actions/types';

export default function(state = [], action) {
    switch (action.type) {
        case CHECK_ORGANIZATION:
            return {...state,
              check: action.payload
            }
        case LOAD_ORGANIZATION:
            return {...state,
              members: action.payload
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
