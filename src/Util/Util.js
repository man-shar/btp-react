import ShapeUtil from "./ShapeUtil"

// contains Utility functions that may not be shape functions
const Util = {};

Util.toSentenceCase = function(text) {
  return text[0].toUpperCase() + text.substr(1);
}

// add index column to parsed file
Util.addIndexColumnToParsedFile = function(parsedFile){
  const columns = parsedFile.columns.slice();
  columns.unshift("index");

  parsedFile.forEach((row, i) => (row["index"] = i));
  parsedFile.columns = columns;

  return parsedFile;
};

Util.columnType = function(data, column) {
  // just check first row for now.
  // TODO: add stuff for dates, etc;
  return (isNaN(data[0][column]) ? "string" : "number");
};

export default Util;