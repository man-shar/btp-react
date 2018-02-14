// contains generic utility functions for js

const Util = {};

Util.toSentenceCase = function(text) {
  return text[0].toUpperCase() + text.substr(1);
}

// defining dimensions and styles. because if I don't render the list similarly everytime, then my approach of saving inherited and own attributes separately results in the div jumping to the own list and codemirror cursor also jumping to the end after every change.

export default Util;