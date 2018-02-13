  import React from 'react';
import { render } from 'react-dom';
import ShapeUtil from "../Util/ShapeUtil";
import AttributeFlexName from "./AttributeFlexName"
import AttributeFlexExpressionEditable from "./AttributeFlexExpressionEditable"
import AttributeFlexValue from "./AttributeFlexValue"

// single row for an attribute.

class AttributeFlexRow extends React.Component {
  render() {
    const attribute = this.props.attribute;
    const attributeId = this.props.attributeId;
    const attributeValue = this.props.attributeValue;
    const attributeName = this.props.attributeName;
    const attributeExprString = this.props.attributeExprString;
    const shapeOrLayer = this.props.shapeOrLayer;
    const shapeOrLayerId = this.props.shapeOrLayerId;
    const typeOfAttribute = this.props.typeOfAttribute;

    // check if attribute's value is not a pure number.
    return (
      <div className="AttributeFlexRow" id={attributeId}>
        <AttributeFlexName shapeOrLayerId={shapeOrLayerId} attributeId={attributeId} attributeName={attributeName} shapeOrLayer={shapeOrLayer}/>
        <div className="AttributeFlexExpression">
          <AttributeFlexExpressionEditable typeOfAttribute={typeOfAttribute} shapeOrLayerId={shapeOrLayerId} attributeId={attributeId} attributeExprString={attributeExprString} shapeOrLayer={shapeOrLayer}/>
          <AttributeFlexValue shapeOrLayerId={shapeOrLayerId} attributeId={attributeId} attributeValue={attributeValue} shapeOrLayer={shapeOrLayer}/>
        </div>
      </div>
    );
  }
}

export default AttributeFlexRow;
