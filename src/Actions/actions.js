export const START_DRAG_DRAW = "start-drag-draw";
export const UPDATE_DRAG_DRAW = "update-drag-draw";
export const END_DRAG_DRAW = "end-drag-draw";

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