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
      "height$exprString": "" + 0,
      "list": ["width", "height", "x", "y"]
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
      "list": ["cx", "cy", "r"]
    }
  }

  return {
    type: shape,
    attributes: attributes
  }
}

export const updateDragDrawShape = function(activeShapeId, activeLayerId, state, e) {
  let type = state[activeLayerId + "$type"];
  let newObj = {};

  if(type === "rect")
  {
    newObj[activeLayerId + "$width$value"] = e.nativeEvent.offsetX - state[activeLayerId + "$x$value"] - 5;
    newObj[activeLayerId + "$width$exprString"] = "" + newObj[activeLayerId + "$width$value"];
    newObj[activeLayerId + "$height$value"] = e.nativeEvent.offsetY - state[activeLayerId + "$y$value"] - 5;
    newObj[activeLayerId + "$height$exprString"] = "" + newObj[activeLayerId + "$height$value"];
  }

  if(type === "circle")
  {
    newObj[activeLayerId + "$r$value"] = e.nativeEvent.offsetX - state[activeLayerId + "$cx$value"];
    newObj[activeLayerId + "$r$exprString"] = "" + newObj[activeLayerId + "$r$value"];
  }

  console.log(newObj)

  return newObj;
}