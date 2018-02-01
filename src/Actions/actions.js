export const START_DRAG_DRAW = "start-drag-draw"

export function startDragDraw(e) {
  const action = {
    type: START_DRAG_DRAW,
    e: e
  }
  return action;
}