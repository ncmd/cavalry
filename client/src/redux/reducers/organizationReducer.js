import {
    CHECK_ORGANIZATION,
    LEAVE_ORGANIZATION,
    SIGNOUT_ORGANIZATION,
    LOAD_ORGANIZATION,
    INVITE_ORGANIZATION_MEMBER,
    CREATE_ORGANIZATION,
    SET_ORGANIZATION,
    CHANGE_DEPARTMENT_ORGANIZATION,
} from '../actions/types';

export default function(state = [], action) {
    switch (action.type) {
        case CREATE_ORGANIZATION:
            return {...state,
              organizationname: action.organizationname,
              organizationid: action.organizationid,
              organizationmember: true,
              organizationadmin: action.organizationadmin,
              organizationmembers: action.organizationmembers
            }
        case CHANGE_DEPARTMENT_ORGANIZATION:
            const indexOrgMembers = action.payloadindex;
            console.log(state)
            return {...state,
              organizationmembers: [
                ...state.organizationmembers.slice(0,indexOrgMembers),
                {
                  ...state.organizationmembers[indexOrgMembers],
                  department:action.payloaddepartment
                },
                ...state.organizationmembers.slice(indexOrgMembers+1),
              ]
          }
        case CHECK_ORGANIZATION:
            return {...state,
              check: action.payload
            }
        case LOAD_ORGANIZATION:
            return action.payload
        case INVITE_ORGANIZATION_MEMBER:
            return {...state,
              members: [...state.members, action.accountpayload]
            }
        case SET_ORGANIZATION:
            return {...state,
              members: [...state.members, action.accountpayload]
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
