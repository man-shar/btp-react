import math from "mathjs-expression-parser";
import * as d3 from "d3";
import Util from "./Util"

const ShapeUtil = {};

// A lot of these functions are redundant or repetitive. But I like to have them just in case.

// #########################################
// keymaps to shape to switch the shape that is drawng when dragging.
// #########################################

ShapeUtil.keysToShapes = ["r", "c", "R", "C"];

ShapeUtil.knownShapes = ["rect", "circle"];

ShapeUtil.keyToShape = {
  "r": "rect",
  "c": "circle",
  "R": "rect",
  "C": "circle"
};

ShapeUtil.loopKeyCombinations = ["ctrl+m", "ctrl+shift+m"];

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
};

ShapeUtil.styleList = ["alignmentBaseline", "baselineShift", "direction", "display", "dominantBaseline", "fill", "fillOpacity", "fontFamily", "fontSize", "fontStyle", "fontWeight", "opacity", "stroke", "strokeOpacity", "strokeWidth", "textAnchor", "textDecoration", "visibility"];

// defining basic dimensions and styles. because if I don't render the list similarly everytime, then my approach of saving inherited and own attributes separately results in the div jumping to the own list and codemirror cursor also jumping to the end after every change.
ShapeUtil.allDimensions = {
  "rect": ["width", "height", "x", "y", "rx", "ry"],
  "circle": ["cx","cy", "r"]
}

// same for styles. so now that i am defining separate stuff for these, I can actually have specific styles for each type of shape. nice. Less rendering and no useless non-applicable attribtues. yay!

ShapeUtil.allStyles = {
  "rect": ["fill", "fillOpacity", "opacity", "stroke", "strokeOpacity", "strokeWidth", "visibility"],
  "circle": ["fill", "fillOpacity", "opacity", "stroke", "strokeOpacity", "strokeWidth", "visibility"]
}

ShapeUtil.axisThisAttributeWillNeed = {
  "height": "yAxis",
  "y": "yAxis",
  "cy": "yAxis",
  "width": "xAxis",
  "x": "xAxis",
  "cx": "xAxis",
}


// #########################################
// Axes functions.
// #########################################

ShapeUtil.axes = {
  "xAxis": null,
  "yAxis": null
};

ShapeUtil.axisTypes = {
  "linear": d3.scaleLinear,
  "band": d3.scaleBand
};

ShapeUtil.axisToAxisType = {
  "xAxis": "linear",
  "yAxis": "linear"
}

ShapeUtil.updateAxis = function(newExprString, axisId, drawing) {
  const self = this;
  const data = drawing.data;
  // yAxis or xAxis
  const axis = axisId.split("$")[1];

  // pass math.eval object containing referredAttributesValues
  let referredAttributesValues = {};
  // also keep a record of data attributes to construct silimar object for dataattributevalues when we loop in findDomain.
  let referredDataAttributes = [];

  self.referenceAttributes[axisId]["referredAttributesIdSet"].forEach((referredAttributeId) => {
    if(drawing[referredAttributeId + "$whatAmI"] !== "dataAttribute")
    {
      referredAttributesValue = self.getAttributeValue(referredAttributeId, drawing);
      // TODO: better error handling.
      if(referredAttributesValue[0] !== null)
        return "error";

      else
        referredAttributesValues[referredAttributeId] = referredAttributesValue[1];
    }
    else
      referredDataAttributes.push(referredAttributeId);
  });

  // const currentAxisType = self.axisTypes[drawing["overallAttributes$" + axis + "Type" + "$value"]];
  const currentAxisType = self.axisToAxisType[axis];

  const currentAxisFunction = self.axisTypes[currentAxisType];

  let domain = self.findDomain(data, newExprString, drawing, referredAttributesValues, referredDataAttributes);

  // if this is band scale, change domain to dicrete.
  if(currentAxisType === "band")
    domain = d3.range(domain[0], domain[1]);

  const range = [0, ((axis === "xAxis") ?
                      (drawing["overallAttributes$chartWidth$value"])
                      : drawing["overallAttributes$chartHeight$value"])];

  self.axes[axis] = currentAxisFunction()
                    .domain(domain)
                    .range(range);

  return self.axes[axis];
}

ShapeUtil.findDomain = function(data, exprString, drawing, referredAttributesValues, referredDataAttributes) {
  let max = - Infinity;
  let min = 0;

  data.forEach((row, i) => {
    // construct an object for math.eval for current row with values of referredDataAttributes
    let referredDataAttributesValues = {};

    referredDataAttributes.forEach((referredAttributeId) => {
      const columnName = drawing[referredAttributeId + "$name"];

      referredDataAttributesValues[referredAttributeId] = +row[columnName];
    });

    const allValues = Object.assign(referredAttributesValues, referredDataAttributesValues);

    try {
      var math2 = math;
      const value = math.eval(exprString, allValues);
      if(value <= min)
        min = value;
      if(value >= max)
        max = value;
    }
    catch(e) {
      return [e.toString(), e.toString()];
    }
    });

    return [min, max];
}


// #########################################
// Drag and drawing related functions. Handle initialisation of shapes and layers.
// #########################################

// initializes layer or a particular shape type.
ShapeUtil.newLayerFromDrag = function(shape, e) {
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
      rx$value: 0,
      rx$name: "Horizontal Corner Radius",
      rx$exprString: "0",
      ry$value: 0,
      ry$name: "Vertical Corner Radius",
      ry$exprString: "0",
      list: ["width", "height", "x", "y", "rx", "ry"],
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
};

// ################################################
// Overall Attributes functions
// ################################################

// get a particular dimension property from overAllAttributes;
ShapeUtil.getOverallAttributesDimensionProperty = function(dimension, drawing, property) {
  const self = this;
  return drawing["overallAttributes" + "$" + dimension + "$" + property];
};

ShapeUtil.getOverallAttributesStyleProperty = function(style, drawing, property) {
  const self = this;
  return drawing["overallAttributes" + "$" + style + "$" + property];
};

// particular property: value, exprstring or name of all overall attributes styles
ShapeUtil.getAllOverallAttributesStylesProperty = function (drawing, property) {
  const self = this;
  const styleList = drawing["overallAttributes$ownStyleList"].slice();

  let allOverallAttributesStylesProperty = {};
  styleList.forEach((style) => {
    allOverallAttributesStylesProperty[style] = drawing["overallAttributes" + "$" + style + "$" + property];
  });

  return allOverallAttributesStylesProperty;
};

// particular property: value, exprstring or name of all overall attributes dimensions
ShapeUtil.getAllOverallAttributesDimensionsProperty = function (drawing, property) {
  const self = this;
  const dimensionList = drawing["overallAttributes$ownDimensionList"].slice();

  let allOverallAttributesDimensionProperty = {};
  dimensionList.forEach((dimension) => {
    allOverallAttributesDimensionProperty[dimension] = drawing["overallAttributes" + "$" + dimension + "$" + property];
  });

  return allOverallAttributesDimensionProperty;
};

// all propertoes: value, exprstring or name of all overall attributes styles
ShapeUtil.getAllOverallAttributesStylesAllProperties = function (drawing) {
  const self = this;
  const styleList = drawing["overallAttributes$ownStyleList"].slice();

    let allOverallAttributesStylesAllProperties = {};
  styleList.forEach((style) => {
    allOverallAttributesStylesAllProperties[style + "$value"] = self.getOverallAttributesStyleProperty(style, drawing, "value")
    allOverallAttributesStylesAllProperties[style + "$name"] = self.getOverallAttributesStyleProperty(style, drawing, "name")
    allOverallAttributesStylesAllProperties[style + "$exprString"] = self.getOverallAttributesStyleProperty(style, drawing, "exprString")
  });

  return allOverallAttributesStylesAllProperties;
};

// all propertoes: value, exprstring or name of all overall attributes dimensions
ShapeUtil.getAllOverallAttributesDimensionsAllProperties = function (drawing) {
  const self = this;
  const dimensionList = drawing["overallAttributes$ownDimensionList"].slice();

    let allOverallAttributesDimensionsAllProperties = {};
  dimensionList.forEach((dimension) => {
    allOverallAttributesDimensionsAllProperties[dimension + "$value"] = self.getOverallAttributesDimensionProperty(dimension, drawing, "value")
    allOverallAttributesDimensionsAllProperties[dimension + "$name"] = self.getOverallAttributesDimensionProperty(dimension, drawing, "name")
    allOverallAttributesDimensionsAllProperties[dimension + "$exprString"] = self.getOverallAttributesDimensionProperty(dimension, drawing, "exprString")
  });

  return allOverallAttributesDimensionsAllProperties;
}


// ################################################
// Shape functions
// ################################################

// check if attribute is a shape's own attribute.
ShapeUtil.isShapeOwn = function (dimensionOrStyle, shapeId, drawing) {
  // we can check just the value. as name is defined first and then value and exprstring are defined.
  if(drawing[shapeId + "$" + dimensionOrStyle + "$exprString"] !== undefined)
    return true;

  return false;
}

// get a particular dimension property from a shape. returns just the property of the dimension, not an object.
ShapeUtil.getShapeDimensionProperty = function(dimension, shapeId, layerId, drawing, property) {
  var self = this;

  // check if this dimension is defined in the shape.
  if(drawing[shapeId + "$" + dimension + "$" + property] !== undefined)
    return drawing[shapeId + "$" + dimension + "$" + property];

  // otherwise check in layer. we pass shapeId because if this layer attribute is dependent on data, we should be able to calculate dimension for this shape from index.
  return self.getLayerDimensionProperty(dimension, layerId, drawing, property, shapeId);
}

// get a particular style property from a shape. returns just the property of the style, not an object.
ShapeUtil.getShapeStyleProperty = function(style, shapeId, layerId, drawing, property) {
  var self = this;

  // check if this style is defined in the shape.
  if(drawing[shapeId + "$" + style + "$" + property] !== undefined)
    return drawing[shapeId + "$" + style + "$" + property];

  // otherwise check in layer.
  return self.getLayerStyleProperty(style, layerId, drawing, property)
}

// get all properties of a particular dimension from a shape. returns the three properties:name, id and exprString of the dimension in an object.
ShapeUtil.getShapeDimensionAllProperties = function(dimension, shapeId, layerId, drawing) {
  const self = this;

  var shapeDimensionAllProperties = {};

  // check if this dimension is defined in the shape.
  if(drawing[shapeId + "$" + dimension + "$" + "name"] !== undefined)
  {
    shapeDimensionAllProperties[dimension + "$" + "name"] = drawing[shapeId + "$" + dimension + "$" + "name"];
    shapeDimensionAllProperties[dimension + "$" + "value"] = drawing[shapeId + "$" + dimension + "$" + "value"];
    shapeDimensionAllProperties[dimension + "$" + "exprString"] = drawing[shapeId + "$" + dimension + "$" + "exprString"];

    return shapeDimensionAllProperties;
  }

  // otherwise return from layer
  return self.getLayerDimensionAllProperties(dimension, layerId, drawing);
}

// get all properties of a particular style from a shape. returns the three properties:name, id and exprString of the style in an object.
ShapeUtil.getShapeStyleAllProperties = function(style, shapeId, layerId, drawing) {
  const self = this;

  var shapeStyleAllProperties = {};

  // check if this style is defined in the shape.
  if(drawing[shapeId + "$" + style + "$" + "name"] !== undefined)
  {
    shapeStyleAllProperties[style + "$" + "name"] = drawing[shapeId + "$" + style + "$" + "name"];
    shapeStyleAllProperties[style + "$" + "value"] = drawing[shapeId + "$" + style + "$" + "value"];
    shapeStyleAllProperties[style + "$" + "exprString"] = drawing[shapeId + "$" + style + "$" + "exprString"];

    return shapeStyleAllProperties;
  }

  // otherwise return from layer
  return self.getLayerStyleAllProperties(style, layerId, drawing);
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
    allShapeInheritedDimensions[dimension] = self.getLayerDimensionProperty(dimension, layerId, drawing, property, null);
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
    inheritedDimensionsAllProperties[dimension + "$" + "value"] = self.getLayerDimensionProperty(dimension, layerId, drawing, "value", null)
    inheritedDimensionsAllProperties[dimension + "$" + "name"] = self.getLayerDimensionProperty(dimension, layerId, drawing, "name", null)
    inheritedDimensionsAllProperties[dimension + "$" + "exprString"] = self.getLayerDimensionProperty(dimension, layerId, drawing, "exprString", null)
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
ShapeUtil.getLayerDimensionProperty = function(dimension, layerId, drawing, property , shapeId) {
  const self = this;

  const attributeId = layerId + "$" + dimension;
  const attributeExprString = drawing[attributeId + "$exprString"]

  // check if this dimension is defined in the layer.
  if(drawing[attributeId + "$" + property] !== undefined)
  {
    // check if a shape is asking for this dimension and this layer dimension is dependent on data. if so, use shape index to calculate data reference attribute values for this.
    if(shapeId !== null && self.isDependentOnData(attributeId, drawing))
    {
      // find what non data attributes and data attributes this attribute depends on.
      let referredAttributesValues = {};
      // this is a list because I don't know the value yet. I'll construct an object later with the values.
      let referredDataAttributesValues = {};
      const shapeIndex = drawing[shapeId + "$index"];
      const axisThisAttributeWillNeed = self.axisThisAttributeWillNeed[dimension];

      self.referenceAttributes[attributeId]["referredAttributesIdSet"].forEach((referredAttributeId) => {
        if(drawing[referredAttributeId + "$whatAmI"] !== "dataAttribute")
        {
          // TODO better error handling here.
          let referredAttributesValue = self.getAttributeValue(referredAttributeId, drawing, shapeId);

          if(referredAttributesValue[0] !== null)
            return "error";

          else
            referredAttributesValues[referredAttributeId] = referredAttributesValue[1];
        }

        else {
          // so earlier I was using isPurelyDependentOnData function, but I think we can just use the axis to calculate data attributes and the other can remain as such. so far seems fine.
          referredDataAttributesValues[referredAttributeId] = self.axes[axisThisAttributeWillNeed](+drawing["data"][shapeIndex][drawing[referredAttributeId + "$name"]]);
        }
      });

      var math2 = math;

      /** NOT USING THIS FOR NOW
      // now, if this attribtue is "purely" dependent on dataAttributes. i.e. it has no reference to any other attributes not dependent on data, then we can use it's axis.
      // if(self.isPurelyDependentOnData(attributeId, drawing))
      // {
      //   // if(attributeId === "layer0$cy")
      //   //   debugger;
      //   try {
      //     let value = self.axes[axisThisAttributeWillNeed](math.eval(attributeExprString, Object.assign(referredAttributesValues, referredDataAttributesValues)));
      //     var math2 = math;
      //     return value;
      //   }
      //   catch(e) {
      //     return e.toString();
      //   }
      // }

      // // else, we should return value without using axis.
      // if(!self.isPurelyDependentOnData(attributeId, drawing))
      // {
      //   // if(attributeId === "layer0$cy")
      //   //   debugger;
      //   try {
      //     let value = (math.eval(attributeExprString, Object.assign(referredAttributesValues, referredDataAttributesValues)));
      //     var math2 = math;
      //     return value;
      //   }
      //   catch(e) {
      //     return e.toString();
      //   }
      // }
      **/
      
      try {
        let value = (math.eval(attributeExprString, Object.assign(referredAttributesValues, referredDataAttributesValues)));
        var math2 = math;
        return value;
      }
      catch(e) {
        return e.toString();
      }
    }

    return drawing[layerId + "$" + dimension + "$" + property];
  }

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

// get all properties of a particular dimension: own or inherited from a layer. returns the three properties:name, id and exprString of the dimension in an object.
ShapeUtil.getLayerDimensionAllProperties = function(dimension, layerId, drawing) {
  var layerDimensionAllProperties = {};

  // check if this dimension is defined in the layer.
  if(drawing[layerId + "$" + dimension + "$" + "name"] !== undefined)
  {
    layerDimensionAllProperties[dimension + "$" + "name"] = drawing[layerId + "$" + dimension + "$" + "name"];
    layerDimensionAllProperties[dimension + "$" + "value"] = drawing[layerId + "$" + dimension + "$" + "value"];
    layerDimensionAllProperties[dimension + "$" + "exprString"] = drawing[layerId + "$" + dimension + "$" + "exprString"];

    return layerDimensionAllProperties;
  }

  // otherwise return from overallAttributes
  layerDimensionAllProperties[dimension + "$" + "name"] = drawing["overallAttributes" + "$" + dimension + "$" + "name"];
  layerDimensionAllProperties[dimension + "$" + "value"] = drawing["overallAttributes" + "$" + dimension + "$" + "value"];
  layerDimensionAllProperties[dimension + "$" + "exprString"] = drawing["overallAttributes" + "$" + dimension + "$" + "exprString"];
  
  return layerDimensionAllProperties;
}

// get all properties of a particular style: own or inherited from a layer. returns the three properties:name, id and exprString of the style in an object.
ShapeUtil.getLayerStyleAllProperties = function(style, layerId, drawing) {
  var layerStyleAllProperties = {};

  // check if this style is defined in the layer.
  if(drawing[layerId + "$" + style + "$" + "name"] !== undefined)
  {
    layerStyleAllProperties[style + "$" + "name"] = drawing[layerId + "$" + style + "$" + "name"];
    layerStyleAllProperties[style + "$" + "value"] = drawing[layerId + "$" + style + "$" + "value"];
    layerStyleAllProperties[style + "$" + "exprString"] = drawing[layerId + "$" + style + "$" + "exprString"];

    return layerStyleAllProperties;
  }

  // otherwise return from overallAttributes
  layerStyleAllProperties[style + "$" + "name"] = drawing["overallAttributes" + "$" + style + "$" + "name"];
  layerStyleAllProperties[style + "$" + "value"] = drawing["overallAttributes" + "$" + style + "$" + "value"];
  layerStyleAllProperties[style + "$" + "exprString"] = drawing["overallAttributes" + "$" + style + "$" + "exprString"];
  
  return layerStyleAllProperties;
}

// check if attribute is a layer's own attribute.
ShapeUtil.isLayerOwn = function (dimensionOrStyle, layerId, drawing) {
  // we can check just the value. as name is defined first and then value and exprstring are defined.
  if(drawing[layerId + "$" + dimensionOrStyle + "$exprString"] !== undefined)
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
    ownDimensionsAllProperties[dimension + "$" + "value"] = self.getLayerDimensionProperty(dimension, layerId, drawing, "value", null)
    ownDimensionsAllProperties[dimension + "$" + "name"] = self.getLayerDimensionProperty(dimension, layerId, drawing, "name", null)
    ownDimensionsAllProperties[dimension + "$" + "exprString"] = self.getLayerDimensionProperty(dimension, layerId, drawing, "exprString", null)
  });  

  return ownDimensionsAllProperties;
};

// get all properties of all inherited dimensions of a layer
ShapeUtil.getAllLayerInheritedDimensionsAllProperties = function(layerId, drawing) {
  const self = this;

  if (!layerId) return;

  let inheritedDimensionsAllProperties = {};

  const inheritedDimensionList = drawing[layerId + "$inheritedDimensionList"].slice();

  inheritedDimensionList.forEach((dimension) => {
    inheritedDimensionsAllProperties[dimension + "$" + "value"] = self.getLayerDimensionProperty(dimension, layerId, drawing, "value", null)
    inheritedDimensionsAllProperties[dimension + "$" + "name"] = self.getLayerDimensionProperty(dimension, layerId, drawing, "name", null)
    inheritedDimensionsAllProperties[dimension + "$" + "exprString"] = self.getLayerDimensionProperty(dimension, layerId, drawing, "exprString", null)
  });  

  return inheritedDimensionsAllProperties;
};

// get all properties of all own styles of a layer
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

// get all properties of all inherited styles of a layer
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

// attributeId is of the attribute receiving the dropped item.
ShapeUtil.addAttributeReferenceToAttribute = function(editor, event, attributeId, droppedAttributeMonitorItem) {
  const self = this;

  const droppedAttributeId = droppedAttributeMonitorItem["attributeId"];

  // create a new object in ShapeUtil's referenceAttributes object for current attribute if not present already
  if(!self.referenceAttributes[attributeId])
  {
    self.referenceAttributes[attributeId] = {};
    // javascript set to store unique values.
    self.referenceAttributes[attributeId]["referredAttributesIdSet"] = new Set();
    self.referenceAttributes[attributeId]["marks"] = [];
    self.referenceAttributes[attributeId]["exprString"] = "";
    self.referenceAttributes[attributeId]["dependentAttributesIdSet"] = new Set();
  }

  self.referenceAttributes[attributeId]["referredAttributesIdSet"].add(droppedAttributeId);

  // add the attribute on which droppedAttribute is dropped to dependents of droppedAttribute
  if(!self.referenceAttributes[droppedAttributeId])
  {
    self.referenceAttributes[droppedAttributeId] = {};
    // javascript set to store unique values.
    self.referenceAttributes[droppedAttributeId]["referredAttributesIdSet"] = new Set();
    self.referenceAttributes[droppedAttributeId]["marks"] = [];
    self.referenceAttributes[droppedAttributeId]["exprString"] = "";
    self.referenceAttributes[droppedAttributeId]["dependentAttributesIdSet"] = new Set();
  }

  self.referenceAttributes[droppedAttributeId]["dependentAttributesIdSet"].add(attributeId);

  console.log(self.referenceAttributes);
}

// remove reference attribute from an attribute's referred attribute Set.
ShapeUtil.removeReferenceAttribute = function (attributeId, referredAttribute) {
  const self = this;

  self.referenceAttributes[attributeId]["referredAttributesIdSet"].delete(referredAttribute);
}

// remove dependent attribute from an attribute's referred attribute Set.
ShapeUtil.removeDependent = function(referredAttributeId, dependentAttributeId) {
  const self = this;

  self.referenceAttributes[referredAttributeId]["dependentAttributesIdSet"].delete(dependentAttributeId);
}

ShapeUtil.updateMarks = function(attributeId, newExprString, drawing) {
  const self = this;

  if(!self.referenceAttributes[attributeId])
    return

  const referredAttributesIdSet = self.referenceAttributes[attributeId]["referredAttributesIdSet"];
  self.referenceAttributes[attributeId]["marks"] = [];

  referredAttributesIdSet.forEach((referredAttributeId) => {
    // find first index of this referred attribute
    // in case a reference is deleted completely, we will get no references to it in the string and will then remove it.
    let c = 0;
    let start = -1;
    while ((start = newExprString.indexOf(referredAttributeId, start)) > -1)
    {
      let end = start + referredAttributeId.length;

      let mark = {};
      mark["from"] = start;
      mark["to"] = end;
      mark["attributeId"] = referredAttributeId;
      mark["text"] = drawing[referredAttributeId + "$name"];

      self.referenceAttributes[attributeId]["marks"].push(mark);
      c++;
      start = end;
    }

    // if we didn't find the referredAttribute in the expession string, remove it. ALso remove this attribute from the dependents of the referredAttribute.
    if(c === 0) {
      self.removeReferenceAttribute(attributeId, referredAttributeId);
      self.removeDependent(referredAttributeId, attributeId);
    }
  });
  console.log(self.referenceAttributes)
}

// recursive function to check if an attribute is dependent on data.
ShapeUtil.isDependentOnData = function(attributeId, drawing) {
  const self = this;
  let referenceAttributes = self.referenceAttributes[attributeId];
  if(!referenceAttributes)
    return false

  let referredAttributesIdSet = referenceAttributes["referredAttributesIdSet"]

  if(!referredAttributesIdSet)
    return false

  let isDependentOnData = false;

  referredAttributesIdSet.forEach((referredAttributeId) => {
    if(self.isDependentOnData(referredAttributeId, drawing) || drawing[referredAttributeId + "$whatAmI"] === "dataAttribute")
      isDependentOnData = true;
  });

  return isDependentOnData;
}

// recursive function to check if an attribute is PURELY dependent on data. i.e if it contains reference to only dataAttributes. using this to figure out if i should use axis to calculate a shape's attribute value.
ShapeUtil.isPurelyDependentOnData = function(attributeId, drawing) {
  const self = this;
  let referenceAttributes = self.referenceAttributes[attributeId];
  if(!referenceAttributes)
    return false

  let referredAttributesIdSet = referenceAttributes["referredAttributesIdSet"]

  if(!referredAttributesIdSet || referredAttributesIdSet.size === 0)
    return false

  let isPurelyDependentOnData = true;

  referredAttributesIdSet.forEach((referredAttributeId) => {
    // if this is not a data attribute, check if this is purely dependent on data.
    if(drawing[referredAttributeId + "$whatAmI"] !== "dataAttribute")
      isPurelyDependentOnData = false;
  });

  return isPurelyDependentOnData;
}

// recursively get value of an attribute.
// returns an array: [error, value]
// return value if no error is [null, value]
// return value if error is [error string, null]
// TODO: check for cyclic reference.
ShapeUtil.getAttributeValue = function(attributeId, drawing, shapeId=null) {
  const self = this;
  const attributeExprString = drawing[attributeId + "$exprString"];
  const attributeOwnerId = attributeId.split("$")[0];

  if(attributeOwnerId === "overallAttributes" && drawing[attributeId + "$type"] !== "axis")
  {
    return [null, drawing[attributeId + "$value"]];
  }

  // if this is an axis, return text showing the domain and range of the axis.
  if(drawing[attributeId + "$type"] === "axis")
  {
    const axis = attributeId.split("$")[1];
    // return  [null, "Domain: " + Util.shortenString(JSON.stringify((ShapeUtil.axes[axis]).domain())) + "\n" + "Range: " + Util.shortenString(JSON.stringify((ShapeUtil.axes[axis]).range()))];
    return  [null, "Domain: " + JSON.stringify((ShapeUtil.axes[axis]).domain()) + "\n" + "Range: " + JSON.stringify((ShapeUtil.axes[axis]).range())];
  }

  // now check if this is a layer attribute and has a data attributes. if so, return "Dependent on data."
  if((drawing[attributeOwnerId + "$whatAmI"] === "layer") && (self.isDependentOnData(attributeId, drawing)) && shapeId === null) {
    return [null, "Dependent on data."];
  }

  // check if a shape is asking for a layer attribute dependent on data.
  if((drawing[attributeOwnerId + "$whatAmI"] === "layer") && (self.isDependentOnData(attributeId, drawing)) && shapeId !== null) {
    return [null, self.getLayerDimensionProperty(attributeId.split("$")[1], attributeOwnerId, drawing, "value", shapeId)];
  }


  let referredAttributesValues = {};
  let value;

  if (self.referenceAttributes[attributeId] === undefined || self.referenceAttributes[attributeId]["referredAttributesIdSet"].size === 0) {
    try {
      value = math.eval(attributeExprString);
      return [null, value];
    }

    catch (e) {
      return [e.toString(), null];
    }
  }


  else if (self.referenceAttributes[attributeId] !== undefined && self.referenceAttributes[attributeId]["referredAttributesIdSet"].size !== 0)
  {
    const referredAttributesIdSet = self.referenceAttributes[attributeId]["referredAttributesIdSet"]
    if(referredAttributesIdSet.size !== 0)
    {
      referredAttributesIdSet.forEach(function(referredAttributeId) {
        const referredAttributeExprString = drawing[referredAttributeId + "$exprString"];
        const referredAttributeValue = self.getAttributeValue(referredAttributeId, drawing)

        // check if this referred attrbute has an error in it's value. if so,return error.
        if(referredAttributeValue[0] !== null)
          return [referredAttributeValue[0], null];

        // otherwise add it's value to object
        referredAttributesValues[referredAttributeId] = referredAttributeValue[1];
      });
    }
  }

  try {
    value = [null, math.eval(attributeExprString, referredAttributesValues)]
    return value;
  }

  catch (e) {
    return [e.toString(), null];
  }
}

// check if an attribute has dependents.
ShapeUtil.hasDependents = function (attributeId) {
  const self = this;

  if((self.referenceAttributes[attributeId]) && (self.referenceAttributes[attributeId]["dependentAttributesIdSet"].size > 0))
    return true;

  return false;
}

ShapeUtil.updateDependentsValues = function (attributeId, drawing) {
  const self = this;

  if(!self.hasDependents(attributeId))
    return {};

  let newValueObj = {};

  self.referenceAttributes[attributeId]["dependentAttributesIdSet"].forEach((dependentId) => {
    // TODO error handing here.
    // check if this referred attrbute has an error in it's value. if so,return error.
    const dependentValue = self.getAttributeValue(dependentId, drawing);
    if(dependentValue[0] !== null)
      newValueObj[dependentId + "$value"] = dependentValue[0];

    else
      newValueObj[dependentId + "$value"] = dependentValue[1];
  })

  return newValueObj;
}


export default ShapeUtil;