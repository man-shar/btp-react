import { combineReducers } from 'redux'
import { START_DRAG_DRAW, UPDATE_DRAG_DRAW, END_DRAG_DRAW, TOGGLE_CURRENT_SHAPE } from "../Actions/actions";
import { startDragDrawShape, updateShapeBeingDrawn } from "../Shape Handlers/shapeMethods";

const initialState = {
  "overallAttributes": {
    "width": 900,
    "height": 600,
  },
  drawing: {
    "currentShape": "rect",
    "initialShapes": [],
    "layers": [],
    "beingDrawn": false
  }
};

const keyToShape = {
  "r": "rect",
  "c": "circle"
};

function manageDrawingActions(state = initialState["drawing"], action) {
  let initialShapes,
      newShape,
      layers,
      shapeBeingDrawn,
      updatedShapeBeingDrawn;

  switch (action.type) {
    case START_DRAG_DRAW:
      initialShapes = state.initialShapes.slice();
      layers = state.layers.slice();
      newShape = startDragDrawShape(state.currentShape, action.e);

      layers.push({});
      layers[layers.length - 1]["shapes"] = [];
      layers[layers.length - 1]["shapes"].push(newShape);
      layers[layers.length - 1]["type"] = newShape.type;
      layers[layers.length - 1]["dimensions"] = Object.keys(newShape.dimensions);

      initialShapes.push(newShape);

      return Object.assign({}, state, {
        "initialShapes": initialShapes,
        "beingDrawn": true,
        "layers": layers
      });

    case UPDATE_DRAG_DRAW:
      if(!state.beingDrawn)
        return state

      layers = state.layers.slice();
      shapeBeingDrawn = layers[layers.length - 1]["shapes"][0];
      updatedShapeBeingDrawn = updateShapeBeingDrawn(shapeBeingDrawn, action.e);

      layers[layers.length - 1]["shapes"][0] = updatedShapeBeingDrawn;

      return Object.assign({}, state, {
        layers: layers,
      });

    case END_DRAG_DRAW:
      return Object.assign({}, state, {
        beingDrawn: false,
      });

    case TOGGLE_CURRENT_SHAPE:
    return Object.assign({}, state, {
      currentShape: (keyToShape[action.newShape] === undefined ? keyToShape["r"] : keyToShape[action.newShape])
    });

    default:
      return state
  }

  return state;
}

function manageChangesToOverallAttributes(state = initialState["overallAttributes"], action) {
  return state;
}

const manageActions = combineReducers({
  overallAttributes: manageChangesToOverallAttributes,
  drawing: manageDrawingActions
});



export default manageActions;