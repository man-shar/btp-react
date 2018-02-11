import {
  START_DRAG_DRAW,
  UPDATE_DRAG_DRAW,
  END_DRAG_DRAW,
  TOGGLE_CURRENT_SHAPE,
  CHANGE_ATTRIBUTE_EXPRESSION_STRING,
  ADD_ATTRIBUTE_REFERENCE_TO_ATTRIBUTE
} from "../Actions/actions";
import ShapeUtil from "../Util/ShapeUtil";
import { initialState } from "./init.js";

export function manageDrawingActions(state = initialState["drawing"], action) {
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
      newLayer,
      updatedLayerAttributes,
      activeLayerId,
      activeShapeId,
      attributeId,
      attributeExprString,
      newExprString;


  switch (action.type) {
    case START_DRAG_DRAW:
      // startDragDrawShape returns a layer with dimensionList. A shape is not initialised with any attributes: dimensions or styles.

      newLayer = ShapeUtil.startDragDrawShape(currentShape, action.e);

      newLayerName = "Layer " + layerCount;
      newLayerId = "layer" + layerCount;
      layerIds.push(newLayerId);

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

      // every layer and shape has a own attributes and inherited attributes. on editing an inhertides attribute, the attribute gets shifted to own attributes.
      // attributes are both dimensions and styles.
      // so every layer and shape has an ownStyleList, inheritedStyleList, ownDimensionList and inheritedDimensionList.
      // initially, a shape has neither own dimensions not styles. it takes everything from layer.
      // a layer has both dimensions and styles.

      newObj[newLayerId + "$ownDimensionList"] = newLayer.dimensionList.list.slice();
      newObj[newLayerId + "$inheritedDimensionList"] = [];
      newObj[newLayerId + "$ownStyleList"] = [];
      newObj[newLayerId + "$inheritedStyleList"] = [];

      newObj[newShapeId + "$name"] = newShapeName;
      newObj[newShapeId + "$id"] = newShapeId;
      newObj[newShapeId + "$index"] =
        newObj[newLayerId + "$shapeIds"].length - 1;
      newObj[newShapeId + "$type"] = currentShape;
      newObj[newShapeId + "$layerId"] = newLayerId;
      newObj[newShapeId + "$inheritedDimensionList"] = newLayer.dimensionList.list.slice();
      newObj[newShapeId + "$ownDimensionList"] = [];
      newObj[newShapeId + "$ownStyleList"] = [];
      newObj[newShapeId + "$inheritedStyleList"] = [];

      newObj[newLayerId + "$ownDimensionList"].forEach(attr => {
        newObj[newLayerId + "$" + attr + "$value"] = newLayer["dimensionList"][attr + "$value"];
        newObj[newLayerId + "$" + attr + "$name"] = newLayer["dimensionList"][attr + "$name"];
        newObj[newLayerId + "$" + attr + "$exprString"] = newLayer["dimensionList"][attr + "$exprString"];
      });

      return Object.assign({}, state, newObj);

    case UPDATE_DRAG_DRAW:
      if (!state.beingDrawn) return state;

      activeLayerId = state.activeLayerId;
      activeShapeId = state.activeShapeId;

      // Updates *layer* not shape. Remember, we have no initialised the shape with it's own defined attributes yet. It still takes it's attributes from the layer.
      updatedLayerAttributes = ShapeUtil.updateDragDrawShape(
        activeShapeId,
        activeLayerId,
        state,
        action.e
      );

      return Object.assign({}, state, updatedLayerAttributes);

    case END_DRAG_DRAW:
      activeLayerId = state.activeLayerId;
      activeShapeId = state.activeShapeId;

      ShapeUtil.checkIfShapeIsValid(state);
      return Object.assign({}, state, {
        beingDrawn: false
      });

    case TOGGLE_CURRENT_SHAPE:
      return Object.assign({}, state, {
        currentShape:
          ShapeUtil.keyToShape[action.newShape] === undefined
            ? state.currentShape
            : ShapeUtil.keyToShape[action.newShape]
      });

    case CHANGE_ATTRIBUTE_EXPRESSION_STRING:
      newObj = {};
      attributeId = action.attributeId;
      newExprString = action.newExprString;

      newObj[attributeId + "$exprString"] = newExprString;

      ShapeUtil.updateMarks(action.attributeId, action.newExprString, state);
      return Object.assign({}, state, newObj);

    default:
      return state;
  }

  return state;
}
