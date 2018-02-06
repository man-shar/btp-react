export const startDragDrawShape = function(shape, e) {
  let attributes;

  if(shape === "rect")
  {
    attributes = {
      "x$value": e.nativeEvent.offsetX,
      "y$value": e.nativeEvent.offsetY,
      "width$value": 0,
      "height$value": 0,
      "x$name": "Top Left X",
      "y$name": "Top Left Y",
      "width$name": "Width",
      "height$name": "Height",
      "x$exprString": "" + e.nativeEvent.offsetX,
      "y$exprString": "" + e.nativeEvent.offsetY,
      "width$exprString": "" + 0,
      "height$exprString": "" + 0
    }
  }

  if(shape === "circle")
  {
    attributes = {
      "cx$value": e.nativeEvent.offsetX,
      "cy$value": e.nativeEvent.offsetY,
      "r$value": 0,
      "cx$name": "Centre X",
      "cy$name": "Center Y",
      "r$name": "Radius",
      "cx$exprString": "" + e.nativeEvent.offsetX,
      "cy$exprString": "" + e.nativeEvent.offsetY,
      "r$exprString": "" + 0,      
    }
  }

  return {
    type: shape,
    attributes: attributes
  }
}

export const updateShapeBeingDrawn = function(shapeId, state, e) {
  let type = state[shapeId + "$type"];
  let newObj = {};

  if(type === "rect")
  {
    newObj[shapeId + "$width$value"] = e.nativeEvent.offsetX - state[shapeId + "$x"] - 5;
    newObj[shapeId + "$height$value"] = e.nativeEvent.offsetY - state[shapeId + "$y"] - 5;
  }

  if(type === "circle")
  {
    newObj[shapeId + "$r$value"] = e.nativeEvent.offsetX - state[shapeId + "$cx"];
  }

  return newObj;
}