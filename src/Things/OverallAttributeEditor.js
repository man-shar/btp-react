import React from 'react';
import { render } from 'react-dom';
import { connect } from "react-redux";
import ShapeUtil from "../Util/ShapeUtil";
import AttributeFlexRow from "./AttributeFlexRow"

// Attributes are both dimensions and styles.

class OverallAttributeEditor extends React.Component {
  render() {
    if(!this.props.drawing)
    {
      return (<div />);
    }
    const ownDimensionList = this.props.drawing["overallAttributes" + "$ownDimensionList"];
    const ownStyleList = this.props.drawing["overallAttributes" + "$ownStyleList"];

    const overallAttributesDimensionsAllProperties = ShapeUtil.getAllOverallAttributesDimensionsAllProperties(
      this.props.drawing,
    );

    const overallAttributesStylesAllProperties = ShapeUtil.getAllOverallAttributesStylesAllProperties(
      this.props.drawing,
    );

    if(this.props.drawing["overallAttributes$ownDimensionList"])
    {
      return (
        <div className="AttributeFlexContainer">
          {ownDimensionList.map((attribute, i) =>
            {
              const attributeName = overallAttributesDimensionsAllProperties[attribute + "$name"];
              const attributeValue = overallAttributesDimensionsAllProperties[attribute + "$value"];
              const attributeExprString = overallAttributesDimensionsAllProperties[attribute + "$exprString"];
              
              return (<AttributeFlexRow
                  key={i}
                  attributeId={"overallAttributes" + "$" + attribute}
                  attributeName={attributeName}
                  attributeValue={attributeValue}
                  attributeExprString={attributeExprString}
                  shapeOrLayerId={"overallAttributes"}
                  shapeOrLayer="layer"
                  typeOfAttribute="dimension"
                  own={true}
                />)
            }
          )}
          {ownStyleList.map((attribute, i) =>
            {
              const attributeName = overallAttributesStylesAllProperties[attribute + "$name"];
              const attributeValue = overallAttributesStylesAllProperties[attribute + "$value"];
              const attributeExprString = overallAttributesStylesAllProperties[attribute + "$exprString"];
              
              return (<AttributeFlexRow
                  key={i}
                  attributeId={"overallAttributes" + "$" + attribute}
                  attributeName={attributeName}
                  attributeValue={attributeValue}
                  attributeExprString={attributeExprString}
                  shapeOrLayerId={"overallAttributes"}
                  shapeOrLayer="layer"
                  typeOfAttribute="style"
                  own={true}
                />)
            }
          )}
        </div>
      );
    }

    else {
      return (<div />);
    }
  }
}

const mapStateToProps = state => {
  return {
    drawing: state["drawing"]
  }
}

export default connect(mapStateToProps)(OverallAttributeEditor);