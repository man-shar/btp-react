export const START_DRAG_DRAW = "start-drag-draw";
export const UPDATE_DRAG_DRAW = "update-drag-draw";
export const END_DRAG_DRAW = "end-drag-draw";
export const TOGGLE_CURRENT_SHAPE = "toggle-current-shape"

export function startDragDraw(e) {
  const action = {
    type: START_DRAG_DRAW,
    e: e
  }
  return action;
}

export function updateDragDraw(e) {
  const action = {
    type: UPDATE_DRAG_DRAW,
    e: e
  }
  return action;
}

export function endDragDraw(e) {
  const action = {
    type: END_DRAG_DRAW,
    e: e
  }
  return action;
}

export function toggleCurrentShape(newShape) {
  const action = {
    type: TOGGLE_CURRENT_SHAPE,
    newShape: newShape
  }
  return action;
}