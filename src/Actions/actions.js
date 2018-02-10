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


export function startDragDraw(e) {
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
  return (dispatch) => {
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

export function changeAttributeExpressionString(attributeId, newExprString) {
  const action = {
    type: CHANGE_ATTRIBUTE_EXPRESSION_STRING,
    attributeId: attributeId,
    newExprString: newExprString
  };
  return action;
}

export function addAttributeReferenceToAttribute(editor, event, attributeId, droppedAttributeMonitorItem) {
  ShapeUtil.addAttributeReferenceToAttribute(editor, event, attributeId, droppedAttributeMonitorItem);

  const action = {
    type: ADD_ATTRIBUTE_REFERENCE_TO_ATTRIBUTE,
    attributeId: attributeId,
    droppedAttributeMonitorItem: droppedAttributeMonitorItem
  };

  return action;
}