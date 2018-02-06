import {
  START_DRAG_DRAW,
  UPDATE_DRAG_DRAW,
  END_DRAG_DRAW,
  TOGGLE_CURRENT_SHAPE
} from "../Actions/actions";
import ShapeUtil from "../Util/ShapeUtil";
import { initialState, keyToShape } from "./init.js";
import cloneDeep from "lodash.clonedeep";

export function manageDrawingActions(state = initialState["drawing"], action) {
  switch (action.type) {
    case START_DRAG_DRAW:
      let layerIds = state.layerIds.slice(),
        layerCount = layerIds.length,
        currentShape = state.currentShape,
        newObj = {},
        newLayerName = "",
        newLayerId = "",
        shapeIds = [],
        shapeCount = 0,
        newShapeName = "",
        newShapeId = "",
        newLayer;

      // startDragDrawShape returns a layer. A shape is not initialised with any attributes. It takes it's attributes from the layer.
      newLayer = ShapeUtil.startDragDrawShape(currentShape, action.e);

      newLayerName = "Layer " + layerCount;
      newLayerId = "layer" + layerCount;
      layerIds.push(newLayerId);
      ShapeUtil.referenceAttributes[newLayerId] = 1;

      shapeIds = [];
      shapeCount = shapeIds.length;
      newShapeName = currentShape + " " + shapeCount;
      newShapeId = newLayerId + currentShape + shapeCount;

      shapeIds.push(newShapeId);

      newObj = {
        beingDrawn: true,
        currentShape: currentShape,
        activeLayerId: newLayerId,
        activeShapeId: newShapeId,
        layerIds: layerIds
      };

      newObj[newLayerId + "$shapeIds"] = shapeIds;
      newObj[newLayerId + "$name"] = newLayerName;
      newObj[newLayerId + "$id"] = newLayerId;
      newObj[newLayerId + "$type"] = currentShape;
      newObj[newLayerId + "$attributeList"] = newLayer.attributeList.list.slice();

      newObj[newShapeId + "$name"] = newShapeName;
      newObj[newShapeId + "$id"] = newShapeId;
      newObj[newShapeId + "$index"] =
        newObj[newLayerId + "$shapeIds"].length - 1;
      newObj[newShapeId + "$type"] = currentShape;
      newObj[newShapeId + "$layerId"] = newLayerId;
      newObj[newShapeId + "$attributeList"] = newLayer.attributeList.list.slice();

      newObj[newLayerId + "$attributeList"].forEach(attr => {
        newObj[newLayerId + "$" + attr + "$value"] =
          newLayer["attributeList"][attr + "$value"];
        newObj[newLayerId + "$" + attr + "$name"] =
          newLayer["attributeList"][attr + "$name"];
        newObj[newLayerId + "$" + attr + "$exprString"] =
          newLayer["attributeList"][attr + "$exprString"];
      });

      return Object.assign({}, state, newObj);

    case UPDATE_DRAG_DRAW:
      if (!state.beingDrawn) return state;

      let updatedLayerAttributes;
      let activeLayerId = state.activeLayerId;
      let activeShapeId = state.activeShapeId;

      // Updates *layer* not shape. Remember, we have no initialised the shape with it's own defined attributes yet. It still takes it's attributes from the layer.
      updatedLayerAttributes = ShapeUtil.updateDragDrawShape(
        activeShapeId,
        activeLayerId,
        state,
        action.e
      );

      return Object.assign({}, state, updatedLayerAttributes);

    case END_DRAG_DRAW:
      return Object.assign({}, state, {
        beingDrawn: false
      });

    case TOGGLE_CURRENT_SHAPE:
      return Object.assign({}, state, {
        currentShape:
          keyToShape[action.newShape] === undefined
            ? keyToShape["r"]
            : keyToShape[action.newShape]
      });

    default:
      return state;
  }

  return state;
}
