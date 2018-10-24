//rxjs test
import { ofType } from 'redux-observable';
const PING = 'PING';
// const PONG = 'PONG';
//
// const ping = () => ({ type: PING });
// const pong = () => ({ type: PONG });

export const pingEpic = action$ => action$.pipe(
  ofType(PING),
);

// const pingReducer = (state = { isPinging: false }, action) => {
//   switch (action.type) {
//     case 'PING':
//       return { isPinging: true };
//
//     case 'PONG':
//       return { isPinging: false };
//
//     default:
//       return state;
//   }
// };
