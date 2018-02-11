const ShapeUtil = {};

// A lot of these functions are redundant or repetitive. But I like to have them just in case.


// #########################################
// Drag and drawing related functions. Handle initialisation of shapes and layers.
// #########################################

// initializes layer and a shape.
ShapeUtil.startDragDrawShape = function(shape, e) {
  let dimensionList;

  if (shape === "rect") {
    dimensionList = {
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
    dimensionList = {
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
    dimensionList: dimensionList
  };
};

// update shape being draw drawn
ShapeUtil.updateDragDrawShape = function(activeShapeId, activeLayerId, state, e) {
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

ShapeUtil.checkIfShapeIsValid = function (drawing) {
  return null;
}

// ################################################
// Shape functions
// ################################################

// get a particular dimension property from a shape. returns just the property of the dimension, not an object.
ShapeUtil.getShapeDimensionProperty = function(dimension, shapeId, layerId, drawing, overallAttributes, property) {
  // check if this dimension is defined in the shape.
  if(drawing[shapeId + "$" + dimension + "$" + property])
    return drawing[shapeId + "$" + dimension + "$" + property];

  // otherwise check in layer.
  return getLayerDimensionProperty(dimension, layerId, drawing, overallAttributes, property)
}

// get a particular style property from a shape. returns just the property of the style, not an object.
ShapeUtil.getShapeStyleProperty = function(style, shapeId, layerId, drawing, overallAttributes, property) {
  // check if this style is defined in the shape.
  if(drawing[shapeId + "$" + style + "$" + property])
    return drawing[shapeId + "$" + style + "$" + property];

  // otherwise check in layer.
  return getLayerStyleProperty(style, layerId, drawing, overallAttributes, property)
}

// get all own dimension **property**: value, name or expressionString from a shape.
ShapeUtil.getAllShapeOwnDimensionsProperty = function(shapeId, layerId, drawing, property) {
  let allShapeOwnDimensions = {}

  const ownDimensionList = drawing[shapeId + "$ownDimensionList"].slice();

  ownDimensionList.forEach((dimension) => {
    allShapeOwnDimensions[dimension] = drawing[shapeId + "$" + dimension + "$" + property];
  });

  return allShapeOwnDimensions;
};

// get all inherited dimension **property**: value, name or expressionString from a shape. Basically call getOwnDimensionProperty of 
ShapeUtil.getAllShapeInheritedDimensionsProperty = function(shapeId, layerId, drawing, overallAttributes, property) {
  const self = this;
  let allShapeInheritedDimensions = {}

  const inheritedDimensionList = drawing[shapeId + "$inheritedDimensionList"].slice();

  inheritedDimensionList.forEach((dimension) => {
    // this dimension can either be an own prop of the containing layer or maybe an prop inherited by the layer as well.
    allShapeInheritedDimensions[dimension] = self.getLayerDimensionProperty(dimension, layerId, drawing, overallAttributes, property);
  });

  return allShapeInheritedDimensions;
};

// get all own dimension **property**: value, name or expressionString from a shape.
ShapeUtil.getAllShapeOwnStylesProperty = function(shapeId, layerId, drawing, property) {
  let allShapeOwnStyles = {}

  const ownStyleList = drawing[shapeId + "$ownStyleList"].slice();

  ownStyleList.forEach((style) => {
    allShapeOwnStyles[style] = drawing[shapeId + "$" + style + "$" + property];
  });

  return allShapeOwnStyles;
};

// get all inherited Style **property**: value, name or expressionString from a shape. Basically call getOwnStyleProperty of 
ShapeUtil.getAllShapeInheritedStylesProperty = function(shapeId, layerId, drawing, overallAttributes, property) {
  const self = this;
  let allShapeInheritedStyles = {}

  const inheritedStyleList = drawing[shapeId + "$inheritedStyleList"].slice();

  inheritedStyleList.forEach((style) => {
    // this style can either be an own prop of the containing layer or maybe an prop inherited by the layer as well. so call a function to check that and return appropriately.
    allShapeInheritedStyles[style] = self.getLayerStyleProperty(style, layerId, drawing, overallAttributes, property);
  });

  return allShapeInheritedStyles;
};

// get all properties of all own dimensions of a shape
ShapeUtil.getAllShapeOwnDimensionsAllProperties = function(shapeId, layerId, drawing, overallAttributes) {
  const self = this;

  if (!shapeId) return;

  let ownDimensionsAllProperties = {};

  const ownDimensionList = drawing[shapeId + "$ownDimensionList"].slice();

  ownDimensionList.forEach((dimension) => {
    ownDimensionsAllProperties[dimension + "$" + "value"] = self.getShapeDimensionProperty(dimension, shapeId, layerId, drawing, overallAttributes, "value")
    ownDimensionsAllProperties[dimension + "$" + "name"] = self.getShapeDimensionProperty(dimension, shapeId, layerId, drawing, overallAttributes, "name")
    ownDimensionsAllProperties[dimension + "$" + "exprString"] = self.getShapeDimensionProperty(dimension, shapeId, layerId, drawing, overallAttributes, "exprString")
  });  

  return ownDimensionsAllProperties;
};

// get all properties of all inherited dimensions of a shape
ShapeUtil.getAllShapeInheritedDimensionsAllProperties = function(shapeId, layerId, drawing, overallAttributes) {
  const self = this;

  if (!shapeId) return;

  let inheritedDimensionsAllProperties = {};

  const inheritedDimensionList = drawing[shapeId + "$inheritedDimensionList"].slice();

  inheritedDimensionList.forEach((dimension) => {
    inheritedDimensionsAllProperties[dimension + "$" + "value"] = self.getLayerDimensionProperty(dimension, layerId, drawing, overallAttributes, "value")
    inheritedDimensionsAllProperties[dimension + "$" + "name"] = self.getLayerDimensionProperty(dimension, layerId, drawing, overallAttributes, "name")
    inheritedDimensionsAllProperties[dimension + "$" + "exprString"] = self.getLayerDimensionProperty(dimension, layerId, drawing, overallAttributes, "exprString")
  });  

  return inheritedDimensionsAllProperties;
};

// get all properties of all own styles of a shape
ShapeUtil.getAllShapeOwnStylesAllProperties = function(shapeId, layerId, drawing, overallAttributes) {
  const self = this;

  if (!shapeId) return;

  let ownStylesAllProperties = {};

  const ownStyleList = drawing[shapeId + "$ownStyleList"].slice();

  ownStyleList.forEach((style) => {
    ownStylesAllProperties[style + "$" + "value"] = self.getShapeStyleProperty(style, shapeId, layerId, drawing, overallAttributes, "value")
    ownStylesAllProperties[style + "$" + "name"] = self.getShapeStyleProperty(style, shapeId, layerId, drawing, overallAttributes, "name")
    ownStylesAllProperties[style + "$" + "exprString"] = self.getShapeStyleProperty(style, shapeId, layerId, drawing, overallAttributes, "exprString")
  });  

  return ownStylesAllProperties;
};

// get all properties of all inherited styles of a shape
ShapeUtil.getAllShapeInheritedStylesAllProperties = function(shapeId, layerId, drawing, overallAttributes) {
  const self = this;

  if (!shapeId) return;

  let inheritedStylesAllProperties = {};

  const inheritedStyleList = drawing[shapeId + "$inheritedStyleList"].slice();

  inheritedStyleList.forEach((style) => {
    inheritedStylesAllProperties[style + "$" + "value"] = self.getLayerStyleProperty(style, layerId, drawing, overallAttributes, "value")
    inheritedStylesAllProperties[style + "$" + "name"] = self.getLayerStyleProperty(style, layerId, drawing, overallAttributes, "name")
    inheritedStylesAllProperties[style + "$" + "exprString"] = self.getLayerStyleProperty(style, layerId, drawing, overallAttributes, "exprString")
  });  

  return inheritedStylesAllProperties;
};



// ################################################
// Layer functions
// ################################################

// get a particular dimension property from a layer. returns just the property of the dimension, not an object.
ShapeUtil.getLayerDimensionProperty = function(dimension, layerId, drawing, overallAttributes, property) {
  // check if this dimension is defined in the layer.
  if(drawing[layerId + "$" + dimension + "$" + property])
    return drawing[layerId + "$" + dimension + "$" + property];

  // otherwise return from overallAttributes
  return overallAttributes[dimension + "$" + property];
}

// get a particular style property from a layer. returns just the property of the style, not an object.
ShapeUtil.getLayerStyleProperty = function(style, layerId, drawing, overallAttributes, property) {
  // check if this style is defined in the layer.
  if(drawing[layerId + "$" + style + "$" + property])
    return drawing[layerId + "$" + style + "$" + property];

  // otherwise return from overallAttributes
  return overallAttributes[style + "$" + property];
}

// get all own dimension **property**: value, name or expressionString from a shape.
ShapeUtil.getAllLayerOwnDimensionsProperty = function(layerId, drawing, property) {
  let allLayerOwnDimensions = {}

  const ownDimensionList = drawing[layerId + "$ownDimensionList"].slice();

  ownDimensionList.forEach((dimension) => {
    allLayerOwnDimensions[dimension] = drawing[layerId + "$" + dimension + "$" + property];
  });

  return allLayerOwnDimensions;
};

// get all inherited dimension **property**: value, name or expressionString from a shape. Basically call getOwnDimensionProperty of 
ShapeUtil.getAllLayerInheritedDimensionsProperty = function(layerId, drawing, overallAttributes, property) {
  const self = this;
  let allLayerInheritedDimensions = {}

  const inheritedDimensionList = drawing[layerId + "$inheritedDimensionList"].slice();

  inheritedDimensionList.forEach((dimension) => {
    // get from overAllAttributes
    allLayerInheritedDimensions[dimension] = overallAttributes[dimension + "$" + property];
  });

  return allLayerInheritedDimensions;
};

// get all own dimension **property**: value, name or expressionString from a shape.
ShapeUtil.getAllLayerOwnStylesProperty = function(layerId, drawing, property) {
  let allLayerOwnStyles = {}

  const ownStyleList = drawing[layerId + "$ownStyleList"].slice();

  ownStyleList.forEach((style) => {
    allLayerOwnStyles[style] = drawing[layerId + "$" + style + "$" + property];
  });

  return allLayerOwnStyles;
};

// get all inherited Style **property**: value, name or expressionString from a shape. Basically call getOwnStyleProperty of 
ShapeUtil.getAllLayerInheritedStylesProperty = function(layerId, drawing, overallAttributes, property) {
  const self = this;
  let allLayerInheritedStyles = {}

  const inheritedStyleList = drawing[layerId + "$inheritedStyleList"].slice();

  inheritedStyleList.forEach((style) => {
    // get from overAllAttributes
    allLayerInheritedStyles[style] = overallAttributes[style + "$" + property];
  });

  return allLayerInheritedStyles;
};

// get all properties of all own dimensions of a layer
ShapeUtil.getAllLayerOwnDimensionsAllProperties = function(layerId, drawing, overallAttributes) {
  const self = this;

  if (!layerId) return;

  let ownDimensionsAllProperties = {};

  const ownDimensionList = drawing[layerId + "$ownDimensionList"].slice();

  ownDimensionList.forEach((dimension) => {
    ownDimensionsAllProperties[dimension + "$" + "value"] = self.getLayerDimensionProperty(dimension, layerId, drawing, overallAttributes, "value")
    ownDimensionsAllProperties[dimension + "$" + "name"] = self.getLayerDimensionProperty(dimension, layerId, drawing, overallAttributes, "name")
    ownDimensionsAllProperties[dimension + "$" + "exprString"] = self.getLayerDimensionProperty(dimension, layerId, drawing, overallAttributes, "exprString")
  });  

  return ownDimensionsAllProperties;
};

// get all properties of all own dimensions of a layer
ShapeUtil.getAllLayerInheritedDimensionsAllProperties = function(layerId, drawing, overallAttributes) {
  const self = this;

  if (!layerId) return;

  let inheritedDimensionsAllProperties = {};

  const inheritedDimensionList = drawing[layerId + "$inheritedDimensionList"].slice();

  inheritedDimensionList.forEach((dimension) => {
    inheritedDimensionsAllProperties[dimension + "$" + "value"] = self.getLayerDimensionProperty(dimension, layerId, drawing, overallAttributes, "value")
    inheritedDimensionsAllProperties[dimension + "$" + "name"] = self.getLayerDimensionProperty(dimension, layerId, drawing, overallAttributes, "name")
    inheritedDimensionsAllProperties[dimension + "$" + "exprString"] = self.getLayerDimensionProperty(dimension, layerId, drawing, overallAttributes, "exprString")
  });  

  return inheritedDimensionsAllProperties;
};

// get all properties of all own styles of a shape
ShapeUtil.getAllLayerOwnStylesAllProperties = function(layerId, drawing, overallAttributes) {
  const self = this;

  if (!layerId) return;

  let ownStylesAllProperties = {};

  const ownStyleList = drawing[layerId + "$ownStyleList"].slice();

  ownStyleList.forEach((style) => {
    ownStylesAllProperties[style + "$" + "value"] = self.getLayerStyleProperty(style, layerId, drawing, overallAttributes, "value")
    ownStylesAllProperties[style + "$" + "name"] = self.getLayerStyleProperty(style, layerId, drawing, overallAttributes, "name")
    ownStylesAllProperties[style + "$" + "exprString"] = self.getLayerStyleProperty(style, layerId, drawing, overallAttributes, "exprString")
  });  

  return ownStylesAllProperties;
};

// get all properties of all inherited styles of a shape
ShapeUtil.getAllLayerInheritedStylesAllProperties = function(layerId, drawing, overallAttributes) {
  const self = this;

  if (!layerId) return;

  let inheritedStylesAllProperties = {};

  const inheritedStyleList = drawing[layerId + "$inheritedStyleList"].slice();

  inheritedStyleList.forEach((style) => {
    inheritedStylesAllProperties[style + "$" + "value"] = self.getLayerStyleProperty(style, layerId, drawing, overallAttributes, "value")
    inheritedStylesAllProperties[style + "$" + "name"] = self.getLayerStyleProperty(style, layerId, drawing, overallAttributes, "name")
    inheritedStylesAllProperties[style + "$" + "exprString"] = self.getLayerStyleProperty(style, layerId, drawing, overallAttributes, "exprString")
  });  

  return inheritedStylesAllProperties;
};



// ################################################
// reference attribute functions
// ################################################

// Object to store when an attribute references other attributes.
ShapeUtil.referenceAttributes = {};

ShapeUtil.addAttributeReferenceToAttribute = function(editor, event, attributeId, droppedAttributeMonitorItem) {
  const self = this;

  // create a new object in ShapeUtil's referenceAttributes object for current attribute if not present already
  if(!self.referenceAttributes[attributeId])
  {
    self.referenceAttributes[attributeId] = {};
    // javascript set to store unique values.
    self.referenceAttributes[attributeId]["referredAttributesIdSet"] = new Set();
    self.referenceAttributes[attributeId]["marks"] = [];
    self.referenceAttributes[attributeId]["exprString"] = "";
  }

  self.referenceAttributes[attributeId]["referredAttributesIdSet"].add(droppedAttributeMonitorItem["attributeId"]);

  console.log(ShapeUtil.referenceAttributes);
}

ShapeUtil.removeReferenceAttribute = function (attributeId, referredAttribute) {
  const self = this;

  self.referenceAttributes[attributeId]["referredAttributesIdSet"].delete(referredAttribute);
}

ShapeUtil.updateMarks = function(attributeId, newExprString, drawing) {
  const self = this;

  const referredAttributesIdSet = self.referenceAttributes[attributeId]["referredAttributesIdSet"];
  self.referenceAttributes[attributeId]["marks"] = [];

  referredAttributesIdSet.forEach((referredAttribute) => {
    // find first index of this referred attribute
    // in case a reference is deleted completely, we will get no references to it in the string and will then remove it.
    let c = 0;
    let start = -1;
    while ((start = newExprString.indexOf(referredAttribute, start)) > -1)
    {
      let end = start + referredAttribute.length;

      let mark = {};
      mark["from"] = start;
      mark["to"] = end;
      mark["render"] = "bleh";
      mark["text"] = drawing[referredAttribute + "$name"];

      self.referenceAttributes[attributeId]["marks"].push(mark);
      c++;
      start = end;
    }

    if(c === 0) {
      self.removeReferenceAttribute(attributeId, referredAttribute);
    }
  });

  console.log(ShapeUtil.referenceAttributes);
}


export default ShapeUtil;


