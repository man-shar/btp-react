import ShapeUtil from "./ShapeUtil"

// contains reusable Utility functions
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

Util.strLen = 10;

Util.shortenString =  function (fullStr, separator) {
  const self = this;
  if (fullStr.length <= self.strLen) return fullStr;

  separator = separator || '...';

  var sepLen = separator.length,
      charsToShow = self.strLen - sepLen,
      frontChars = Math.ceil(charsToShow / 2),
      backChars = Math.floor(charsToShow / 2);

  return fullStr.substr(0, frontChars) +
         separator +
         fullStr.substr(fullStr.length - backChars);
};

Util.escapeRegExp= function(s) {
    return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
};

Util.getColumnProps = function(data) {
  const self = this;
  let props = {};
  const columns = data.columns;

  for (let i = 0; i < columns.length - 1; i++) {
    const column = columns[i];
    if(self.columnType(data, column) === "string")
      continue;

    let mean = 0,
        sum = 0,
        max = -Infinity,
        min = Infinity;

    for (let i = 0; i < data.length - 1; i++) {
      const value = +data[i][column];
      sum += value;

      if (value > max)
        max = value;

      if (value < min)
        min = value;
    }

    props["dataAttribute$" + column + "$mean$name"] = "MEAN " + column;
    props["dataAttribute$" + column + "$mean$value"] = sum / data.length;
    props["dataAttribute$" + column + "$mean$exprString"] = "" + sum / data.length;
    props["dataAttribute$" + column + "$sum$name"] = "SUM " + column;;
    props["dataAttribute$" + column + "$sum$value"] = sum;
    props["dataAttribute$" + column + "$sum$exprString"] = "" + sum;
    props["dataAttribute$" + column + "$max$name"] = "MAX " + column;
    props["dataAttribute$" + column + "$max$value"] = max;
    props["dataAttribute$" + column + "$max$exprString"] = "" + max;
    props["dataAttribute$" + column + "$min$name"] = "MIN " + column;;
    props["dataAttribute$" + column + "$min$value"] = min;
    props["dataAttribute$" + column + "$min$exprString"] = "" + min;
    props["dataAttribute$" + column + "$count$name"] = "COUNT " + column;;;
    props["dataAttribute$" + column + "$count$value"] = data.length;
    props["dataAttribute$" + column + "$count$exprString"] = "" + data.length;
  }

  return props;
};

export default Util;
