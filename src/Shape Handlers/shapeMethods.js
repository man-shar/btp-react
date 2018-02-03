export const startDragDrawShape = function(shape, e) {
  let dimensions;

  if(shape === "rect")
  {
    return {
      "type": shape.type,
      "x": e.nativeEvent.offsetX,
      "y": e.nativeEvent.offsetY,
      "width": 0,
      "height": 0,
      "dimensions": ["x", "y", "width", "height"]
    };
  }

  if(shape === "circle")
  {
    return {
      "type": shape.type,
      "cx": e.nativeEvent.offsetX,
      "cy": e.nativeEvent.offsetY,
      "r": 0,
      "dimensions": ["cx", "cy", "r"]
    };
  }

  return {};
}

export const updateShapeBeingDrawn = function(shape, e) {
  let dimensions = shape.dimensions;
  let type = shape.type

  if(type === "rect")
  {
    dimensions = Object.assign({}, dimensions, {
      "width": e.nativeEvent.offsetX - dimensions["x"] - 5,
      "height": e.nativeEvent.offsetY - dimensions["y"] - 5
    });
  }

  if(type === "circle")
  {
    dimensions = Object.assign({}, dimensions, {
      "r": e.nativeEvent.offsetX - dimensions["cx"],
    });
  }

  return {
    type: type,
    dimensions: dimensions
  }
}