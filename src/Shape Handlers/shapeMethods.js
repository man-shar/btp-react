const addShape = function(shape, dimensions) {
  return {
    type: shape,
    dimensions: dimensions
  }
}

export const dragDrawShape = function(shape, e) {
  let dimensions;

  if(shape === "rect")
  {
    dimensions = {
      "x": e.nativeEvent.offsetX,
      "y": e.nativeEvent.offsetX,
      "width": 0,
      "height": 0
    }
  }

  if(shape === "circle")
  {
    dimensions = {
      "cx": e.nativeEvent.offsetX,
      "cy": e.nativeEvent.offsetX,
      "r": 0
    }
  }

  return addShape(shape, dimensions);
}