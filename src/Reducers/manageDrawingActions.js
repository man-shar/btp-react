import { START_DRAG_DRAW, UPDATE_DRAG_DRAW, END_DRAG_DRAW, TOGGLE_CURRENT_SHAPE } from "../Actions/actions";
import { startDragDrawShape, updateShapeBeingDrawn } from "../Shape Handlers/shapeMethods";
import { initialState, keyToShape } from "./init.js";
import cloneDeep from "lodash.clonedeep";

export function manageDrawingActions(state = initialState["drawing"], action) {
  let newShape,
      layers,
      shapeBeingDrawn,
      updatedShapeBeingDrawn;

  switch (action.type) {
    case START_DRAG_DRAW:
      // deep clone. yeah, sorry.
      layers = cloneDeep(state.layers);
      newShape = startDragDrawShape(state.currentShape, action.e);
      let layerCount = Object.keys(layers).length;

      let newLayerName = "Layer " + (layerCount);
      let newLayerId = "layer" + (layerCount);

      layers[newLayerId] = {};
      layers[newLayerId]["shapes"] = {};

      let shapeCount = Object.keys(layers[newLayerId]["shapes"]).length;

      let newShapeName = newShape.type + " " + shapeCount;
      let newShapeId = newLayerId + newShape.type + shapeCount;

      layers[newLayerId]["id"] = newLayerId;
      layers[newLayerId]["type"] = state.currentShape;
      layers[newLayerId]["dimensions"] = Object.keys(newShape.dimensions);
      layers[newLayerId]["name"] = newLayerName;
      layers[newLayerId]["shapeIds"] = [newShapeId];

      newShape["name"] = newShapeName;
      newShape["id"] = newShapeId;

      layers[newLayerId]["shapes"][newShapeId] = newShape;

      return Object.assign({}, state, {
        "beingDrawn": true,
        "currentShape": state.currentShape,
        "activeLayerId" : newLayerId,
        "activeShapeId" : newShapeId,
        "layers": layers
      });

    case UPDATE_DRAG_DRAW:
      if(!state.beingDrawn)
        return state

      // really sorry.
      layers = cloneDeep(state.layers);
      let activeLayerId = state.activeLayerId;
      let activeShapeId = state.activeShapeId;

      shapeBeingDrawn = layers[activeLayerId]["shapes"][activeShapeId];
      updatedShapeBeingDrawn = updateShapeBeingDrawn(shapeBeingDrawn, action.e);

      layers[activeLayerId]["shapes"][activeShapeId] = updatedShapeBeingDrawn;

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