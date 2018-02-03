import { START_DRAG_DRAW, UPDATE_DRAG_DRAW, END_DRAG_DRAW, TOGGLE_CURRENT_SHAPE } from "../Actions/actions";
import { startDragDrawShape, updateShapeBeingDrawn } from "../Shape Handlers/shapeMethods";
import { initialState, keyToShape } from "./init.js";

export function manageDrawingActions(state = initialState["drawing"], action) {
  let newShape,
      layers,
      shapeBeingDrawn,
      updatedShapeBeingDrawn;

  switch (action.type) {
    case START_DRAG_DRAW:
      layers = state.layers.slice();
      newShape = startDragDrawShape(state.currentShape, action.e);

      var newLayerName = "Layer " + (layers.count - 1);
      var newLayerId = "layer" + (layers.count - 1);
      var newShapeName = newShape.type + " 0";
      var newShapeId = newLayerId + "-" + newShapeName;

      layers[newLayerId] = {};
      layers[newLayerId]["shapes"] = {}
      layers[layers.length - 1]["shapes"] = {};
      layers[layers.length - 1]["id"] = "layer-" + (layers.length - 1);
      layers[layers.length - 1]["type"] = newShape.type;
      layers[layers.length - 1]["dimensions"] = Object.keys(newShape.dimensions);
      layers[layers.length - 1]["name"] = ;

      newShape.name = ;
      newShape.id = 

      layers[layers.length - 1]["shapes"].push(Object.assign({}, newShape));

      return Object.assign({}, state, {
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