import * as d3 from "d3";
import ShapeUtil from "../Util/ShapeUtil"

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


// TODO: Error Handling
export function fileLoaded(fileAsText, fileObj) {
  return (dispatch) => {
    // parse file with d3
    const parsed = d3.csvParse(fileAsText)
    // dispatch file loaded and parsed event.
    dispatch(fileLoadedAndParsed(fileAsText, fileObj, parsed));
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

export function changeAttributeExpressionString(attributeId, newExprString, typeOfAttribute) {
  const action = {
    type: CHANGE_ATTRIBUTE_EXPRESSION_STRING,
    attributeId: attributeId,
    newExprString: newExprString,
    typeOfAttribute: typeOfAttribute,
  };

  return action;
}

export function changeAttributeExpressionStringThunk(attributeId, newExprString, typeOfAttribute, actionOccuredAtId, attributeIndex) {
  return (dispatch, getState) => {
    dispatch(addAttributeToOwnAttributes(attributeId, typeOfAttribute, actionOccuredAtId, attributeIndex));

    const attributeName = attributeId.split("$")[1];
    const ownAttributeId = actionOccuredAtId + "$" + attributeName;

    dispatch(changeAttributeExpressionString(ownAttributeId, newExprString, typeOfAttribute));
    
    // update values of attributes depending on this attribute.
    dispatch(updateDependentsValues(ownAttributeId));
    // dispatch action to add this attribute to own attributes in case it isn't.
  }
}

export function updateDependentsValues(attributeId) {
  const action = {
    type: UPDATE_DEPENDENTS_VALUES,
    attributeId: attributeId,
  };

  return action;  
}

export function addAttributeReferenceToAttribute(editor, event, attributeId, droppedAttributeMonitorItem, typeOfAttribute, actionOccuredAtId, attributeIndex) {

  return (dispatch, getState) => {

    // add attribute to own attributes in case this isn't one.
    dispatch(addAttributeToOwnAttributes(attributeId, typeOfAttribute, actionOccuredAtId, attributeIndex));

    const attributeName = attributeId.split("$")[1];
    const ownAttributeId = actionOccuredAtId + "$" + attributeName;

    ShapeUtil.addAttributeReferenceToAttribute(editor, event, ownAttributeId, droppedAttributeMonitorItem);
    const attributeExprString = editor.getValue();

    const newExprString = attributeExprString + droppedAttributeMonitorItem["attributeId"];

    // now change attribute Expression string of *own* attribute.
    dispatch(changeAttributeExpressionString(ownAttributeId, newExprString, typeOfAttribute))
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

export function addAttributeToOwnAttributes(attributeId, typeOfAttribute, actionOccuredAtId, attributeIndex) {
  return {
    type: ADD_ATTRIBUTE_TO_OWN_ATTRIBUTES,
    attributeId: attributeId,
    typeOfAttribute: typeOfAttribute,
    actionOccuredAtId: actionOccuredAtId,
    attributeIndex: attributeIndex
  }

  return action;
}