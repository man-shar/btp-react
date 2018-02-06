import React from 'react';
import { render } from 'react-dom';
import CodeMirror from "codemirror";
import ShapeUtil from "../Util/ShapeUtil";

// single row for an attribute.

class AttributeFlexRow extends React.Component {
  render() {
    const attribute = this.props.attribute;
    const attributeId = this.props.attributeId;
    const type = this.props.type;
    const attributeValue = 0;

    // check if attribute's value is not a pure number.
    return (
      <div></div> 
    );
  }
}

export default AttributeFlexRow;