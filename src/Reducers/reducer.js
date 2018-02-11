import { combineReducers } from 'redux'
import { manageDrawingActions } from "./manageDrawingActions.js"
import { manageDataActions } from "./manageDataActions.js"
import { manageFileActions } from "./manageFileActions.js"

const manageActions = combineReducers({
  drawing: manageDrawingActions,
  data: manageDataActions,
  file: manageFileActions
});

export default manageActions;