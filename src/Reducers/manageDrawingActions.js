import { START_DRAG_DRAW, UPDATE_DRAG_DRAW, END_DRAG_DRAW, TOGGLE_CURRENT_SHAPE } from "../Actions/actions";
import { startDragDrawShape, updateShapeBeingDrawn } from "../Shape Handlers/shapeMethods";
import { initialState, keyToShape } from "./init.js";
import cloneDeep from "lodash.clonedeep";

export function manageDrawingActions(state = initialState["drawing"], action) {
  let newShape,
      layers,
      shapeBeingDrawn,
      updatedShapeAttributes;

  switch (action.type) {
    case START_DRAG_DRAW:
      let layerIds = state.layerIds.slice();
      let layerCount = layerIds.length;

      let newObj = {};

      newShape = startDragDrawShape(state.currentShape, action.e);

      let newLayerName = "Layer " + (layerCount);
      let newLayerId = "layer" + (layerCount);

      let shapeIds = [];
      let shapeCount = shapeIds.length;

      layerIds.push(newLayerId);

      let newShapeName = newShape.type + " " + shapeCount;
      let newShapeId = newLayerId + newShape.type + shapeCount;

      shapeIds.push(newShapeId);

      var newObj = {      
        "beingDrawn": true,
        "currentShape": state.currentShape,
        "activeLayerId" : newLayerId,
        "activeShapeId" : newShapeId,
        "layerIds": layerIds
      }

      newObj[newLayerId + "$shapeIds"] = shapeIds;
      newObj[newLayerId + "$name"] = newLayerName;
      newObj[newLayerId + "$id"] = newLayerId;
      newObj[newLayerId + "$type"] = state.currentShape;
      newObj[newLayerId + "$attributes"] = [];

      newObj[newShapeId + "$name"] = newShapeName;
      newObj[newShapeId + "$id"] = newShapeId;
      newObj[newShapeId + "$type"] = state.currentShape;
      newObj[newShapeId + "$attributes"] = [];

      Object.keys(newShape.dimensions).forEach(dim => {
        newObj[newShapeId + "$" + dim] = newShape["dimensions"][dim];
        newObj[newShapeId + "$attributes"].push(dim);
        newObj[newLayerId + "$attributes"].push(dim);
      });

      return Object.assign({}, state, newObj);

    case UPDATE_DRAG_DRAW:
      if(!state.beingDrawn)
        return state

      let activeLayerId = state.activeLayerId;
      let activeShapeId = state.activeShapeId;

      updatedShapeAttributes = updateShapeBeingDrawn(activeShapeId, state, action.e);
      console.log(updatedShapeAttributes);

      return Object.assign({}, state, updatedShapeAttributes);

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