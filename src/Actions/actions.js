import * as d3 from "d3";
import ShapeUtil from "../Util/ShapeUtil"
import Util from "../Util/Util"

export const START_DRAG_DRAW = "start-drag-draw";
export const UPDATE_DRAG_DRAW = "update-drag-draw";
export const END_DRAG_DRAW = "end-drag-draw";
export const TOGGLE_CURRENT_SHAPE = "toggle-current-shape"
export const READ_FILE = "read-file";
export const FILE_LOADED_AND_PARSED = "file-loaded-and-parsed";
export const CHANGE_ATTRIBUTE_EXPRESSION_STRING = "change-attribute-expression-string";
export const ADD_ATTRIBUTE_REFERENCE_TO_ATTRIBUTE = "add-attribute-reference-to-attribute";
export const UPDATE_HOVERED_ATTRIBUTE = "update-hovered-attribute";
export const DELETE_ACTIVE_LAYER = "delete-active-layer";
export const CHANGE_ACTIVE_LAYER_AND_SHAPE = "change-active-layer-and-shape";
export const UPDATE_DEPENDENTS_VALUES = "update-dependents-values";
export const ADD_ATTRIBUTE_TO_OWN_ATTRIBUTES = "add-attribute-to-own-attributes";
export const ADD_DATA_COLUMNS_TO_ATTRIBUTES = "add-data-columns-to-attributes";
export const UPDATE_ATTRIBUTE_VALUE = "update-attribute-value";
export const LOOP_ALL = "loop-all";
export const LOOP_ACTIVE_LAYER = "loop-active-layer";


export function startDragDraw(e, allState) {
  const action = {
    type: START_DRAG_DRAW,
    e: e
  };
  return action;
}

export function updateDragDraw(e) {
  const action = {
    type: UPDATE_DRAG_DRAW,
    e: e
  };
  return action;
}

export function endDragDraw(e) {
  const action = {
    type: END_DRAG_DRAW,
    e: e
  };
  return action;
}

export function toggleCurrentShape(newShape) {
  const action = {
    type: TOGGLE_CURRENT_SHAPE,
    newShape: newShape
  };
  return action;
}

export function fileLoadedAndParsed(fileAsText, fileObj, parsed) {
  const action = {
    type: FILE_LOADED_AND_PARSED,
    fileAsText: fileAsText,
    fileObj: fileObj,
    parsed: parsed
  };
  return action;
}

export function addDataColumnsToAttributes(parsed) {
  const action = {
    type: ADD_DATA_COLUMNS_TO_ATTRIBUTES,
    data: parsed
  }
  return action;
}


// TODO: Error Handling
export function fileLoaded(fileAsText, fileObj) {
  return (dispatch) => {
    // parse file with d3
    let parsed = d3.csvParse(fileAsText)
    // add index column to parsed file.
    parsed = Util.addIndexColumnToParsedFile(parsed);
    // dispatch file loaded and parsed event.
    dispatch(fileLoadedAndParsed(fileAsText, fileObj, parsed));
    dispatch(addDataColumnsToAttributes(parsed));
  }
}


// TODO: Error Handling
export function readFile(file) {
  return (dispatch, getState) => {
    const reader = new FileReader();

    reader.onload = () => {
      const fileAsText = reader.result;
      // read file and dispatch file loaded event.
      dispatch(fileLoaded(fileAsText, file));
    };

    reader.onabort = () => console.log('file reading was aborted');
    reader.onerror = () => console.log('file reading has failed');

    reader.readAsText(file);
  }
}

export function changeAttributeExpressionString(attributeId, newExprString, typeOfAttributeReceivingDrop) {
  const action = {
    type: CHANGE_ATTRIBUTE_EXPRESSION_STRING,
    attributeId: attributeId,
    newExprString: newExprString,
    typeOfAttributeReceivingDrop: typeOfAttributeReceivingDrop,
  };

  return action;
}

export function updateAttributeValue(attributeId, typeOfAttributeReceivingDrop) {
  const action = {
    type: UPDATE_ATTRIBUTE_VALUE,
    attributeId: attributeId,
    typeOfAttributeReceivingDrop: typeOfAttributeReceivingDrop
  };

  return action;
}


// actionOccuredAtId is the id of the attribute receiving the drop
export function changeAttributeExpressionStringThunk(attributeId, newExprString, typeOfAttributeReceivingDrop, actionOccuredAtId, attributeIndex) {
  return (dispatch, getState) => {
    let state = getState();
    const drawing = state.drawing;
    // for eg: attributeId: layer0$width, attributeAccessorName:"width"
    const attributeAccessorName = attributeId.split("$")[1];
    // now construct an id from the attrbute name and id of the object where the action occured for eg: layer0rect0 + "$width" = "layer0rect0$width"
    const ownAttributeId = actionOccuredAtId + "$" + attributeAccessorName;

    // check if this is an inherited attribute
    if(state["drawing"][ownAttributeId + "$name"] === undefined)
    {
      dispatch(addAttributeToOwnAttributes(attributeId, typeOfAttributeReceivingDrop, actionOccuredAtId, attributeIndex));

      dispatch(changeAttributeExpressionString(ownAttributeId, state["drawing"][attributeId + "$exprString"], typeOfAttributeReceivingDrop));
    }

    if(typeOfAttributeReceivingDrop === "axis")
    {
      const newAxis = ShapeUtil.updateAxis(newExprString, ownAttributeId, drawing);
    }

    dispatch(changeAttributeExpressionString(ownAttributeId, newExprString, typeOfAttributeReceivingDrop));
    dispatch(updateAttributeValue(ownAttributeId, typeOfAttributeReceivingDrop));

    // get latest state
    state = getState();

    // now check if this was a layer. if it was, change this attribute for all the child shapes.
    if(state["drawing"][actionOccuredAtId + "$whatAmI"] === "layer" && ShapeUtil.isDependentOnData(ownAttributeId, state["drawing"]))
    {
      // for all child shapes in this layer, create an own attribute for this attribute where a data attribute is dropped and calculate value.
      const shapeIds = state["drawing"][actionOccuredAtId + "$shapeIds"].slice();

      shapeIds.forEach((shapeId) => {
        const ownAttributeIdForShape = shapeId + "$" + attributeAccessorName;

        // if it isn't an own attribute, add it first
        if(state["drawing"][ownAttributeIdForShape + "$name"] === undefined)
        {
          dispatch(addAttributeToOwnAttributes(attributeId, typeOfAttributeReceivingDrop, shapeId, attributeIndex));
        }

        dispatch(changeAttributeExpressionString(ownAttributeIdForShape, state["drawing"][attributeId + "$exprString"], typeOfAttributeReceivingDrop));

        // to get latest state.
        state = getState();

        // // update codemirror marks.
        // ShapeUtil.updateMarks(ownAttributeIdForShape, state["drawing"][ownAttributeIdForShape + "$exprString"], state["drawing"]);

        dispatch(updateAttributeValue(ownAttributeIdForShape, typeOfAttributeReceivingDrop));
      })
    }
    
    // update values of attributes depending on this attribute.
    dispatch(updateDependentsValues(ownAttributeId, typeOfAttributeReceivingDrop));
  }
}

export function updateDependentsValues(attributeId) {
  const action = {
    type: UPDATE_DEPENDENTS_VALUES,
    attributeId: attributeId,
  };

  return action;
}

// actionOccuredAtId is the id of the attribute receiving the drop.
export function addAttributeReferenceToAttribute(editor, event, attributeId, droppedAttributeMonitorItem, typeOfAttributeReceivingDrop, actionOccuredAtId, attributeIndex) {

  return (dispatch, getState) => {
    let state = getState();
    const drawing = state.drawing
    // for eg: attributeId: layer0$width, attributeAccessorName:"width"
    const attributeAccessorName = attributeId.split("$")[1];
    const ownAttributeId = actionOccuredAtId + "$" + attributeAccessorName;

    // add attribute to own attributes in case this isn't one.
    if(state["drawing"][ownAttributeId + "$name"] === undefined)
    {
      dispatch(addAttributeToOwnAttributes(attributeId, typeOfAttributeReceivingDrop, actionOccuredAtId, attributeIndex));

      dispatch(changeAttributeExpressionString(ownAttributeId, state["drawing"][attributeId + "$exprString"], typeOfAttributeReceivingDrop));
    }

    ShapeUtil.addAttributeReferenceToAttribute(editor, event, ownAttributeId, droppedAttributeMonitorItem);
    const attributeExprString = editor.getValue();

    const newExprString = attributeExprString + droppedAttributeMonitorItem["attributeId"];

    // if the user is dropping data on an axis, initiate/update axis.
    if(typeOfAttributeReceivingDrop === "axis" && droppedAttributeMonitorItem["type"] === "data")
    {
      const newAxis = ShapeUtil.updateAxis(newExprString, attributeId, drawing);
    }

    // now change attribute Expression string of *own* attribute.
    dispatch(changeAttributeExpressionString(ownAttributeId, newExprString, typeOfAttributeReceivingDrop))
    dispatch(updateAttributeValue(ownAttributeId, typeOfAttributeReceivingDrop));

    // get latest state
    state = getState();

    // now check if this was a layer. if it was, change this attribute for all the child shapes.
    if(state["drawing"][actionOccuredAtId + "$whatAmI"] === "layer" && ShapeUtil.isDependentOnData(ownAttributeId, state["drawing"]))
    {
      // for all child shapes in this layer, create an own attribute for this attribute where a data attribute is dropped and calculate value.
      const shapeIds = state["drawing"][actionOccuredAtId + "$shapeIds"].slice();

      shapeIds.forEach((shapeId) => {
        const ownAttributeIdForShape = shapeId + "$" + attributeAccessorName;

        // if it isn't an own attribute, add it first
        if(state["drawing"][ownAttributeIdForShape + "$name"] === undefined)
        {
          dispatch(addAttributeToOwnAttributes(attributeId, typeOfAttributeReceivingDrop, shapeId, attributeIndex));
        }

        // make shape attribute also dependent on whatever layer is dependent on.
        // we aren't using editor and event in addAttributeReferenceToAttribute so just pass null.
        ShapeUtil.addAttributeReferenceToAttribute(null, null, ownAttributeIdForShape, droppedAttributeMonitorItem);

        dispatch(changeAttributeExpressionString(ownAttributeIdForShape, state["drawing"][attributeId + "$exprString"], typeOfAttributeReceivingDrop));

        // to get latest state.
        state = getState();

        // // update codemirror marks.
        // ShapeUtil.updateMarks(ownAttributeIdForShape, state["drawing"][ownAttributeIdForShape + "$exprString"], state["drawing"]);

        dispatch(updateAttributeValue(ownAttributeIdForShape, typeOfAttributeReceivingDrop));
      })
    }
  }
}

export function updateHoveredAttribute(hoveredAttributeId) {
  const action = {
    type: UPDATE_HOVERED_ATTRIBUTE,
    hoveredAttributeId: hoveredAttributeId,
  };

  return action;
}

export function checkIfNewLayerIsValid() {
  return (dispatch, getState) => {
    const isActiveShapeValid = ShapeUtil.checkIfNewLayerIsValid(getState()["drawing"]);

    if(!isActiveShapeValid)
    {
      dispatch(deleteActiveLayer());
    }
  }
}

export function deleteActiveLayer() {
  const action = {
    type: DELETE_ACTIVE_LAYER
  };

  return action;
}

export function changeActiveLayerAndShape(shapeId) {
  const action = {
    type: CHANGE_ACTIVE_LAYER_AND_SHAPE,
    shapeId: shapeId
  }

  return action;
}

export function addAttributeToOwnAttributes(attributeId, typeOfAttributeReceivingDrop, actionOccuredAtId, attributeIndex) {
  const action = {
    type: ADD_ATTRIBUTE_TO_OWN_ATTRIBUTES,
    attributeId: attributeId,
    typeOfAttributeReceivingDrop: typeOfAttributeReceivingDrop,
    actionOccuredAtId: actionOccuredAtId,
    attributeIndex: attributeIndex
  }

  return action;
}

export function loopAll() {
  const action = {
    type: LOOP_ALL
  }
  return action;
}

export function loopActiveLayer() {
  const action = {
    type: LOOP_ACTIVE_LAYER
  }
  return action;
}