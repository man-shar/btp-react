const ShapeUtil = {};

// A lot of these functions are redundant or repetitive. But I like to have them just in case.

// #########################################
// keymaps to shape to switch the shape that is drawng when dragging.
// #########################################

ShapeUtil.knownKeys = "rcRC";

ShapeUtil.keyToShape = {
  "r": "rect",
  "c": "circle",
  "R": "rect",
  "C": "circle"
};

// #########################################
// Default SVG styles.
// #########################################

ShapeUtil.styleDefaults = {
  "alignmentBaseline$name": "alignment-baseline",
  "alignmentBaseline$options": ["auto", "baseline", "before-edge", "text-before-edge", "middle", "central", "after-edge", "text-after-edge", "ideographic", "alphabetic", "hanging", "mathematical", "inherit"],
  "alignmentBaseline$value": "auto",
  "alignmentBaseline$exprString": "auto",
  "baselineShift$name": "baseline-shift",
  "baselineShift$options": ["auto", "baseline", "super", "sub", "<percentage>", "<length>", "inherit"],
  "baselineShift$value": "auto",
  "baselineShift$exprString": "auto",
  "direction$name": "direction",
  "direction$options": ["ltr", "rtl", "inherit"],
  "direction$value": "ltr",
  "direction$exprString": "ltr",
  "display$name": "display",
  "display$options": ["inline", "block", "list-item", "run-in", "compact", "marker", "table", "inline-table", "table-row-group", "table-header-group", "table-footer-group", "table-row", "table-column-group", "table-column", "table-cell", "table-caption", "none", "inherit"],
  "display$value": "inline",
  "display$exprString": "inline",
  "dominantBaseline$name": "dominant-baseline",
  "dominantBaseline$options": ["auto", "use-script", "no-change", "reset-size", "ideographic", "alphabetic", "hanging", "mathematical", "central", "middle", "text-after-edge", "text-before-edge", "inherit"],
  "dominantBaseline$value": "auto",
  "dominantBaseline$exprString": "auto",
  "fill$name": "fill",
  "fill$options": ["<paint>", "context-fill", "context-stroke"],
  "fill$value": "#ccc",
  "fill$exprString": "#ccc",
  "fillOpacity$name": "fill-opacity",
  "fillOpacity$options": [  "<opacity-value>", "inherit"],
  "fillOpacity$value": "1",
  "fillOpacity$exprString": "1",
  "fontFamily$name": "font-family",
  "fontFamily$options": [],
  "fontFamily$value": "inherit",
  "fontFamily$exprString": "inherit",
  "fontSize$name": "font-size",
  "fontSize$options": ["<absolute-size>", "<relative-size>", "<length>", "<percentage>", "inherit"],
  "fontSize$value": "inherit",
  "fontSize$exprString": "inherit",
  "fontStyle$name": "font-style",
  "fontStyle$options": ["normal", "italic", "oblique", "inherit"],
  "fontStyle$value": "normal",
  "fontStyle$exprString": "normal",
  "fontWeight$name": "font-weight",
  "fontWeight$options": ["normal", "bold", "bolder", "lighter", "100", "200", "300", "400", "500", "600", "700", "800", "900", "inherit"],
  "fontWeight$value": "normal",
  "fontWeight$exprString": "normal",
  "opacity$name": "opacity",
  "opacity$options": ["<opacity-value>", "inherit"],
  "opacity$value": "1",
  "opacity$exprString": "1",
  "stroke$name": "stroke",
  "stroke$options": ["<paint>", "context-fill", "context-stroke"],
  "stroke$value": "steelblue",
  "stroke$exprString": "steelblue",
  "strokeOpacity$name": "stroke-opacity",
  "strokeOpacity$options": ["<opacity-value>", "inherit"],
  "strokeOpacity$value": "1",
  "strokeOpacity$exprString": "1",
  "strokeWidth$name": "stroke-width",
  "strokeWidth$options": ["<length>", "<percentage>", "inherit"],
  "strokeWidth$value": "1",
  "strokeWidth$exprString": "1",
  "textAnchor$name": "text-anchor",
  "textAnchor$options": ["start", "middle", "end", "inherit"],
  "textAnchor$value": "inherit",
  "textAnchor$exprString": "inherit",
  "textDecoration$name": "text-decoration",
  "textDecoration$options": ["none", "underline", "overline", "line-through", "blink", "inherit"],
  "textDecoration$value": "inherit",
  "textDecoration$exprString": "inherit",
  "visibility$name": "visibility",
  "visibility$options": ["visible", "hidden", "collapse", "inherit"],
  "visibility$value": "visible",
  "visibility$exprString": "visible",
}

ShapeUtil.styleList = ["alignmentBaseline", "baselineShift", "direction", "display", "dominantBaseline", "fill", "fillOpacity", "fontFamily", "fontSize", "fontStyle", "fontWeight", "opacity", "stroke", "strokeOpacity", "strokeWidth", "textAnchor", "textDecoration", "visibility"];

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
      width$exprString: "0",
      height$exprString: "0",
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

ShapeUtil.checkIfNewLayerIsValid = function (drawing) {
  const activeLayerId = drawing.activeLayerId;

  const el = document.getElementById(activeLayerId);
  const size = el.getBoundingClientRect()

  // if diagonal is less than 10 px, return false: shape is not valid.
  // TODO throw error notification
  if(Math.hypot(size.width, size.height) <= 30)
    return false

  return true;
}



// ################################################
// Overall Attributes functions
// ################################################

ShapeUtil.getAllOverallAttributesStylesProperty = function (drawing, property) {
  const styleList = drawing["overallAttributes$ownStyleList"].slice();

  let allOverallAttributesStylesProperty = {};
  styleList.forEach((style) => {
    allOverallAttributesStylesProperty[style] = drawing["overallAttributes" + "$" + style + "$" + property];
  });

  return allOverallAttributesStylesProperty;
}

ShapeUtil.getAllOverallAttributesDimensionsProperty = function (drawing, property) {
  const dimensionList = drawing["overallAttributes$ownDimensionList"].slice();

  let allOverallAttributesDimensionProperty = {};
  dimensionList.forEach((dimension) => {
    allOverallAttributesDimensionProperty[dimension] = drawing["overallAttributes" + "$" + dimension + "$" + property];
  });

  return allOverallAttributesDimensionProperty;
}


// ################################################
// Shape functions
// ################################################

// check if attribute is a shape's own attribute.
ShapeUtil.isShapeOwn = function (dimensionOrStyle, shapeId, drawing) {
  // we can check just the name. as name, value and exprstring are defined simultaneously.
  if(drawing[shapeId + "$" + dimensionOrStyle + "$name"])
    return true;

  return false;
}

// get a particular dimension property from a shape. returns just the property of the dimension, not an object.
ShapeUtil.getShapeDimensionProperty = function(dimension, shapeId, layerId, drawing, property) {
  // check if this dimension is defined in the shape.
  if(drawing[shapeId + "$" + dimension + "$" + property])
    return drawing[shapeId + "$" + dimension + "$" + property];

  // otherwise check in layer.
  return getLayerDimensionProperty(dimension, layerId, drawing, property)
}

// get a particular style property from a shape. returns just the property of the style, not an object.
ShapeUtil.getShapeStyleProperty = function(style, shapeId, layerId, drawing, property) {
  // check if this style is defined in the shape.
  if(drawing[shapeId + "$" + style + "$" + property])
    return drawing[shapeId + "$" + style + "$" + property];

  // otherwise check in layer.
  return getLayerStyleProperty(style, layerId, drawing, property)
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
ShapeUtil.getAllShapeInheritedDimensionsProperty = function(shapeId, layerId, drawing, property) {
  const self = this;
  let allShapeInheritedDimensions = {}

  const inheritedDimensionList = drawing[shapeId + "$inheritedDimensionList"].slice();

  inheritedDimensionList.forEach((dimension) => {
    // this dimension can either be an own prop of the containing layer or maybe an prop inherited by the layer as well.
    allShapeInheritedDimensions[dimension] = self.getLayerDimensionProperty(dimension, layerId, drawing, property);
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
ShapeUtil.getAllShapeInheritedStylesProperty = function(shapeId, layerId, drawing, property) {
  const self = this;
  let allShapeInheritedStyles = {}

  const inheritedStyleList = drawing[shapeId + "$inheritedStyleList"].slice();

  inheritedStyleList.forEach((style) => {
    // this style can either be an own prop of the containing layer or maybe an overall prop. so call a function to check that and return appropriately.
    allShapeInheritedStyles[style] = self.getLayerStyleProperty(style, layerId, drawing, property);
  });

  return allShapeInheritedStyles;
};

// get all properties of all own dimensions of a shape
ShapeUtil.getAllShapeOwnDimensionsAllProperties = function(shapeId, layerId, drawing) {
  const self = this;

  if (!shapeId) return;

  let ownDimensionsAllProperties = {};

  const ownDimensionList = drawing[shapeId + "$ownDimensionList"].slice();

  ownDimensionList.forEach((dimension) => {
    ownDimensionsAllProperties[dimension + "$" + "value"] = self.getShapeDimensionProperty(dimension, shapeId, layerId, drawing, "value")
    ownDimensionsAllProperties[dimension + "$" + "name"] = self.getShapeDimensionProperty(dimension, shapeId, layerId, drawing, "name")
    ownDimensionsAllProperties[dimension + "$" + "exprString"] = self.getShapeDimensionProperty(dimension, shapeId, layerId, drawing, "exprString")
  });  

  return ownDimensionsAllProperties;
};

// get all properties of all inherited dimensions of a shape
ShapeUtil.getAllShapeInheritedDimensionsAllProperties = function(shapeId, layerId, drawing) {
  const self = this;

  if (!shapeId) return;

  let inheritedDimensionsAllProperties = {};

  const inheritedDimensionList = drawing[shapeId + "$inheritedDimensionList"].slice();

  inheritedDimensionList.forEach((dimension) => {
    inheritedDimensionsAllProperties[dimension + "$" + "value"] = self.getLayerDimensionProperty(dimension, layerId, drawing, "value")
    inheritedDimensionsAllProperties[dimension + "$" + "name"] = self.getLayerDimensionProperty(dimension, layerId, drawing, "name")
    inheritedDimensionsAllProperties[dimension + "$" + "exprString"] = self.getLayerDimensionProperty(dimension, layerId, drawing, "exprString")
    inheritedDimensionsAllProperties[dimension + "$" + "inheritedFrom"] = (self.isLayerOwn(dimension, layerId, drawing) ? layerId : "overallAttributes")
  });  

  return inheritedDimensionsAllProperties;
};

// get all properties of all own styles of a shape
ShapeUtil.getAllShapeOwnStylesAllProperties = function(shapeId, layerId, drawing) {
  const self = this;

  if (!shapeId) return;

  let ownStylesAllProperties = {};

  const ownStyleList = drawing[shapeId + "$ownStyleList"].slice();

  ownStyleList.forEach((style) => {
    ownStylesAllProperties[style + "$" + "value"] = self.getShapeStyleProperty(style, shapeId, layerId, drawing, "value")
    ownStylesAllProperties[style + "$" + "name"] = self.getShapeStyleProperty(style, shapeId, layerId, drawing, "name")
    ownStylesAllProperties[style + "$" + "exprString"] = self.getShapeStyleProperty(style, shapeId, layerId, drawing, "exprString")
  });  

  return ownStylesAllProperties;
};

// get all properties of all inherited styles of a shape
ShapeUtil.getAllShapeInheritedStylesAllProperties = function(shapeId, layerId, drawing) {
  const self = this;

  if (!shapeId) return;

  let inheritedStylesAllProperties = {};

  const inheritedStyleList = drawing[shapeId + "$inheritedStyleList"].slice();

  inheritedStyleList.forEach((style) => {
    inheritedStylesAllProperties[style + "$" + "value"] = self.getLayerStyleProperty(style, layerId, drawing, "value")
    inheritedStylesAllProperties[style + "$" + "name"] = self.getLayerStyleProperty(style, layerId, drawing, "name")
    inheritedStylesAllProperties[style + "$" + "exprString"] = self.getLayerStyleProperty(style, layerId, drawing, "exprString")
    inheritedStylesAllProperties[style + "$" + "inheritedFrom"] = (self.isLayerOwn(style, layerId, drawing) ? layerId : "overallAttributes")
  });  

  return inheritedStylesAllProperties;
};



// ################################################
// Layer functions
// ################################################

// get a particular dimension property from a layer. returns just the property of the dimension, not an object.
ShapeUtil.getLayerDimensionProperty = function(dimension, layerId, drawing, property) {
  // check if this dimension is defined in the layer.
  if(drawing[layerId + "$" + dimension + "$" + property] !== undefined)
    return drawing[layerId + "$" + dimension + "$" + property];

  // otherwise return from overallAttributes
  return drawing["overallAttributes" + "$" + dimension + "$" + property];
}

// get a particular style property from a layer. returns just the property of the style, not an object.
ShapeUtil.getLayerStyleProperty = function(style, layerId, drawing, property) {
  // check if this style is defined in the layer.
  if(drawing[layerId + "$" + style + "$" + property] !== undefined)
    return drawing[layerId + "$" + style + "$" + property];

  // otherwise return from overallAttributes
  return drawing["overallAttributes" + "$" + style + "$" + property];
}

// check if attribute is a layer's own attribute.
ShapeUtil.isLayerOwn = function (dimensionOrStyle, layerId, drawing) {
  // we can check just the name as name, value and exprstring are defined simultaneously.
  if(drawing[layerId + "$" + dimensionOrStyle + "$name"] !== undefined)
    return true;

  return false;
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
ShapeUtil.getAllLayerInheritedDimensionsProperty = function(layerId, drawing, property) {
  const self = this;
  let allLayerInheritedDimensions = {}

  const inheritedDimensionList = drawing[layerId + "$inheritedDimensionList"].slice();

  inheritedDimensionList.forEach((dimension) => {
    // get from overAllAttributes
    allLayerInheritedDimensions[dimension] = drawing["overallAttributes" + "$" + dimension + "$" + property];
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
ShapeUtil.getAllLayerInheritedStylesProperty = function(layerId, drawing, property) {
  const self = this;
  let allLayerInheritedStyles = {}

  const inheritedStyleList = drawing[layerId + "$inheritedStyleList"].slice();

  inheritedStyleList.forEach((style) => {
    // get from overAllAttributes
    allLayerInheritedStyles[style] = drawing["overallAttributes" + "$" + style + "$" + property];
  });

  return allLayerInheritedStyles;
};

// get all properties of all own dimensions of a layer
ShapeUtil.getAllLayerOwnDimensionsAllProperties = function(layerId, drawing) {
  const self = this;

  if (!layerId) return;

  let ownDimensionsAllProperties = {};

  const ownDimensionList = drawing[layerId + "$ownDimensionList"].slice();

  ownDimensionList.forEach((dimension) => {
    ownDimensionsAllProperties[dimension + "$" + "value"] = self.getLayerDimensionProperty(dimension, layerId, drawing, "value")
    ownDimensionsAllProperties[dimension + "$" + "name"] = self.getLayerDimensionProperty(dimension, layerId, drawing, "name")
    ownDimensionsAllProperties[dimension + "$" + "exprString"] = self.getLayerDimensionProperty(dimension, layerId, drawing, "exprString")
  });  

  return ownDimensionsAllProperties;
};

// get all properties of all own dimensions of a layer
ShapeUtil.getAllLayerInheritedDimensionsAllProperties = function(layerId, drawing) {
  const self = this;

  if (!layerId) return;

  let inheritedDimensionsAllProperties = {};

  const inheritedDimensionList = drawing[layerId + "$inheritedDimensionList"].slice();

  inheritedDimensionList.forEach((dimension) => {
    inheritedDimensionsAllProperties[dimension + "$" + "value"] = self.getLayerDimensionProperty(dimension, layerId, drawing, "value")
    inheritedDimensionsAllProperties[dimension + "$" + "name"] = self.getLayerDimensionProperty(dimension, layerId, drawing, "name")
    inheritedDimensionsAllProperties[dimension + "$" + "exprString"] = self.getLayerDimensionProperty(dimension, layerId, drawing, "exprString")
  });  

  return inheritedDimensionsAllProperties;
};

// get all properties of all own styles of a shape
ShapeUtil.getAllLayerOwnStylesAllProperties = function(layerId, drawing) {
  const self = this;

  if (!layerId) return;

  let ownStylesAllProperties = {};

  const ownStyleList = drawing[layerId + "$ownStyleList"].slice();

  ownStyleList.forEach((style) => {
    ownStylesAllProperties[style + "$" + "value"] = self.getLayerStyleProperty(style, layerId, drawing, "value")
    ownStylesAllProperties[style + "$" + "name"] = self.getLayerStyleProperty(style, layerId, drawing, "name")
    ownStylesAllProperties[style + "$" + "exprString"] = self.getLayerStyleProperty(style, layerId, drawing, "exprString")
  });  

  return ownStylesAllProperties;
};

// get all properties of all inherited styles of a shape
ShapeUtil.getAllLayerInheritedStylesAllProperties = function(layerId, drawing) {
  const self = this;

  if (!layerId) return;

  let inheritedStylesAllProperties = {};

  const inheritedStyleList = drawing[layerId + "$inheritedStyleList"].slice();

  inheritedStyleList.forEach((style) => {
    inheritedStylesAllProperties[style + "$" + "value"] = self.getLayerStyleProperty(style, layerId, drawing, "value")
    inheritedStylesAllProperties[style + "$" + "name"] = self.getLayerStyleProperty(style, layerId, drawing, "name")
    inheritedStylesAllProperties[style + "$" + "exprString"] = self.getLayerStyleProperty(style, layerId, drawing, "exprString")
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

  if(!self.referenceAttributes[attributeId])
    return

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


