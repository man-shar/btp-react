import { combineReducers } from 'redux'
import { manageChangesToOverallAttributes } from "./manageChangesToOverallAttributes.js"
import { manageDrawingActions } from "./manageDrawingActions.js"
import { manageDataActions } from "./manageDataActions.js"
import { manageFileActions } from "./manageFileActions.js"

const manageActions = combineReducers({
  overallAttributes: manageChangesToOverallAttributes,
  drawing: manageDrawingActions,
  data: manageDataActions,
  file: manageFileActions
});

export default manageActions;