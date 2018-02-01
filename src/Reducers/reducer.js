import {START_DRAG_DRAW } from "../Actions/actions";
import { dragDrawShape } from "../Shape Handlers/shapeMethods";

const initialState = {
  "width": 900,
  "height": 600,
  "current-shape": "rect",
  "initial-shapes": [],
  "layers": [],
  "being-dragged": false,
}

function manageActions(state = initialState, action) {
  switch (action.type) {

    case START_DRAG_DRAW:
      const initialShapes = state["initial-shapes"].slice();
      const layers = state["layers"].slice();
      const newShape = dragDrawShape(state["current-shape"], action.e);

      layers.push({});
      layers[layers.length - 1]["shapes"] = [];
      layers[layers.length - 1]["shapes"].push(newShape);
      layers[layers.length - 1]["type"] = newShape.type;
      layers[layers.length - 1]["dimensions"] = Object.keys(newShape.dimensions);

      initialShapes.push(newShape);

      return Object.assign({}, state, {
        "initial-shapes": initialShapes,
        "being-dragged": true,
        "layers": layers
      });

    default:
      return state
  }

  return state;
}

export default manageActions;