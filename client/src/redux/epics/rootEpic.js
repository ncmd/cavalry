import { combineEpics, createEpicMiddleware } from 'redux-observable'
import { pingEpic } from '../reducers/pingReducer';

const rootEpic = combineEpics(
  pingEpic,
)

const epicMiddleware = createEpicMiddleware();
epicMiddleware.run(rootEpic);


export default epicMiddleware
