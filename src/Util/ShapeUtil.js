const ShapeUtil = {};

// initializes layer and a shape.
ShapeUtil.startDragDrawShape = function(shape, e) {
  let attributeList;

  if (shape === "rect") {
    attributeList = {
      x$value: e.nativeEvent.offsetX,
      y$value: e.nativeEvent.offsetY,
      width$value: 0,
      height$value: 0,
      x$name: "Top Left X",
      y$name: "Top Left Y",
      width$name: "Width",
      height$name: "Height",
      x$exprString: "" + e.nativeEvent.offsetX,
      y$exprString: "" + e.nativeEvent.offsetY,
      width$exprString: "" + 0,
      height$exprString: "" + 0,
      list: ["width", "height", "x", "y"]
    };
  }

  if (shape === "circle") {
    attributeList = {
      cx$value: e.nativeEvent.offsetX,
      cy$value: e.nativeEvent.offsetY,
      r$value: 0,
      cx$name: "Centre X",
      cy$name: "Center Y",
      r$name: "Radius",
      cx$exprString: "" + e.nativeEvent.offsetX,
      cy$exprString: "" + e.nativeEvent.offsetY,
      r$exprString: "" + 0,
      list: ["cx", "cy", "r"]
    };
  }

  return {
    type: shape,
    attributeList: attributeList
  };
};

// update shape being draw drawn
ShapeUtil.updateDragDrawShape = function(
  activeShapeId,
  activeLayerId,
  state,
  e
) {
  let type = state[activeLayerId + "$type"];
  let newObj = {};

  if (type === "rect") {
    newObj[activeLayerId + "$width$value"] = e.nativeEvent.offsetX - state[activeLayerId + "$x$value"] - 5;
    newObj[activeLayerId + "$width$exprString"] = "" + newObj[activeLayerId + "$width$value"];
    newObj[activeLayerId + "$height$value"] = e.nativeEvent.offsetY - state[activeLayerId + "$y$value"] - 5;
    newObj[activeLayerId + "$height$exprString"] = "" + newObj[activeLayerId + "$height$value"];
  }

  if (type === "circle") {
    newObj[activeLayerId + "$r$value"] = e.nativeEvent.offsetX - state[activeLayerId + "$cx$value"];
    newObj[activeLayerId + "$r$exprString"] = "" + newObj[activeLayerId + "$r$value"];
  }

  return newObj;
};

// get **property**: value, name or expressionString from all attributes of a shape by first looking in the shape, then the layer.
ShapeUtil.getAllLayerAttributesProperty = function(layerId, drawing, property) {
  // if no layer is formed yet/some random error
  if (!layerId) return;

  const attributeList = drawing[layerId + "$attributeList"].slice();

  const allLayerAttributes = attributeList.reduce((acc, attribute) => {
    acc[layerId + "$" + attribute + "$" + property] = drawing[layerId + "$" + attribute + "$" + property];

    return acc;
  }, {});

  return allLayerAttributes;
};

// get all the attributes' value, expression string and name from a layer.
ShapeUtil.getAllLayerAttributesEverything = function(layerId, drawing) {
  // if no layer is formed yet/some random error
  if (!layerId) return;

  const attributeList = drawing[layerId + "$attributeList"].slice();

  const allLayerAttributes = attributeList.reduce((acc, attribute) => {
    acc[layerId + "$" + attribute + "$value"] = drawing[layerId + "$" + attribute + "$value"];
    acc[layerId + "$" + attribute + "$name"] = drawing[layerId + "$" + attribute + "$name"];
    acc[layerId + "$" + attribute + "$exprString"] = drawing[layerId + "$" + attribute + "$exprString"];

    return acc;
  }, {});

  return allLayerAttributes;
};

// get specific attribute **property**: value, name or expressionString from a shape by first looking in the shape, then the layer.
ShapeUtil.getAllShapeAttributesProperty = function(shapeId, layerId, drawing, property) {
  const attributeList = drawing[shapeId + "$attributeList"];
  let foundInShape;

  const allShapeAttributes = attributeList.reduce((acc, attribute) => {
    // look if this shape has this defined
    if (drawing[shapeId + "$" + attribute + "$" + property]) {
      // add it to accumulator
      acc[attribute] = drawing[layerId + "$" + attribute + "$" + property];
      foundInShape = true;
    } else {
      // else check in layer
      acc[attribute] = drawing[layerId + "$" + attribute + "$" + property];
      foundInShape = false;
    }
    return acc;
  }, {});

  return [allShapeAttributes, foundInShape];
};

ShapeUtil.getAllShapeAttributesEverything = function(shapeId, layerId, drawing) {
  if (!shapeId) return;

  const attributeList = drawing[shapeId + "$attributeList"];
  let foundInShape;

  const allShapeAttributes = attributeList.reduce((acc, attribute) => {
    // look if this shape has this defined
    if (drawing[shapeId + "$" + attribute + "$value"]) {
      // add it to accumulator
      acc[shapeId + "$" + attribute + "$value"] = drawing[shapeId + "$" + attribute + "$value"];
      acc[shapeId + "$" + attribute + "$name"] = drawing[shapeId + "$" + attribute + "$name"];
      acc[shapeId + "$" + attribute + "$exprString"] = drawing[shapeId + "$" + attribute + "$exprString"];
    } else {
      // else check in layer
      acc[shapeId + "$" + attribute + "$value"] = drawing[layerId + "$" + attribute + "$value"];
      acc[shapeId + "$" + attribute + "$name"] = drawing[layerId + "$" + attribute + "$name"];
      acc[shapeId + "$" + attribute + "$exprString"] = drawing[layerId + "$" + attribute + "$exprString"];
    }
    return acc;
  }, {});

  return allShapeAttributes;
};

// Object to store when an attribute references other attributes.
ShapeUtil.referenceAttributes = {};

export default ShapeUtil;

