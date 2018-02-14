// contains generic utility functions for js

const Util = {};

Util.toSentenceCase = function(text) {
  return text[0].toUpperCase() + text.substr(1);
}

// defining basic dimensions and styles. because if I don't render the list similarly everytime, then my approach of saving inherited and own attributes separately results in the div jumping to the own list and codemirror cursor also jumping to the end after every change.

Util.allDimensions = {
  "rect": ["width", "height", "x", "y", "rx", "ry"],
  "circle": ["cx","cy", "r"]
}

// same for styles. so now that i am defining separate stuff for these, I can actually have specific styles for each type of shape. nice. Less rendering and no useless non-applicable attribtues. yay!

Util.allStyles = {
  "rect": ["fill", "fillOpacity", "opacity", "stroke", "strokeOpacity", "strokeWidth", "visibility"],
  "circle": ["fill", "fillOpacity", "opacity", "stroke", "strokeOpacity", "strokeWidth", "visibility"]
}

export default Util;