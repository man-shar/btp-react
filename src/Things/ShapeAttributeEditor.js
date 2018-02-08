import React from "react";
import { render } from "react-dom";
import { connect } from "react-redux";
import ShapeUtil from "../Util/ShapeUtil";
import AttributeFlexRow from "./AttributeFlexRow"

// Attributes are both dimensions and styles.
// Attributes of a particular Shape.

class ShapeAttributeEditor extends React.Component {
  render() {
    const shapeId = this.props.shapeId;
    const layerId = this.props.layerId;
    const attributeList = this.props.drawing[shapeId + "$attributeList"];

    const allShapeAttributesEverything = ShapeUtil.getAllShapeAttributesEverything(
      shapeId,
      layerId,
      this.props.drawing
    );

    if(attributeList)
    {
      return (
        <div className="AttributeFlexContainer">
          {attributeList.map((attribute, i) =>
            {
              const attributeName = allShapeAttributesEverything[shapeId + "$" + attribute + "$name"];
              const attributeValue = allShapeAttributesEverything[shapeId + "$" + attribute + "$value"];
              const attributeExprString = allShapeAttributesEverything[shapeId + "$" + attribute + "$exprString"];
              return (<AttributeFlexRow
                  key={i}
                  attributeId={shapeId + "$" + attribute}
                  attributeName={attributeName}
                  attributeValue={attributeValue}
                  attributeExprString={attributeExprString}
                  shapeOrLayerId={layerId}
                  shapeOrLayer="shape"
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
    drawing: state.drawing
  };
};

ShapeAttributeEditor = connect(mapStateToProps)(ShapeAttributeEditor);

export default ShapeAttributeEditor;
