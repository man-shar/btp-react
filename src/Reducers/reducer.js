import {START_DRAG_DRAW, UPDATE_DRAG_DRAW, END_DRAG_DRAW } from "../Actions/actions";
import { startDragDrawShape, updateShapeBeingDrawn } from "../Shape Handlers/shapeMethods";

const initialState = {
  "width": 900,
  "height": 600,
  "currentShape": "rect",
  "initialShapes": [],
  "layers": [],
  "beingDrawn": false,
}

function manageActions(state = initialState, action) {
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

    default:
      return state
  }

  return state;
}

export default manageActions;