Util = {}

// builds a dimension object from shapeId
Util.getAttributes = function(shapeId, state) {
  const shapeAttributes = state[shapeId + "$attributes"];

  return shapeAttributes.reduce((acc, attr) => {
    acc[attr] = state[shapeId + "$" + attr];
    return acc;
  }, {});
}

export default Util;