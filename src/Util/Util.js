const Util = {}

// builds a dimension object from shapeId
Util.getAttributeValue = function(shapeId, layerId, drawing) {
  const shapeAttributes = drawing[shapeId + "$attributes"];

  return shapeAttributes.reduce((acc, attr) => {
    // look if this shape has this defined
    if(drawing[shapeId + "$" + attr + "$value"]) {
      // add it to accumulator
      acc[attr] = drawing[shapeId + "$" + attr + "$value"];
    }

    // else check in layer
    else {
      acc[attr] = drawing[layerId + "$" + attr + "$value"];
    }
    return acc;
  }, {});
}

export default Util;