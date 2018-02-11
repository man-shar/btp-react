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
    const ownDimensionList = this.props.drawing[shapeId + "$ownDimensionList"];
    const inheritedDimensionList = this.props.drawing[shapeId + "$inheritedDimensionList"];
    const ownStyleList = this.props.drawing[shapeId + "$ownStyleList"];
    const inheritedStyleList = this.props.drawing[shapeId + "$inheritedStyleList"];

    const ownShapeDimensionsAllProperties = ShapeUtil.getAllShapeOwnDimensionsAllProperties(
      shapeId,
      layerId,
      this.props.drawing,
      this.props.overallAttributes
    );

    const inheritedShapeDimensionsAllProperties = ShapeUtil.getAllShapeInheritedDimensionsAllProperties(
      shapeId,
      layerId,
      this.props.drawing,
      this.props.overallAttributes
    );

    const ownShapeStylesAllProperties = ShapeUtil.getAllShapeOwnStylesAllProperties(
      shapeId,
      layerId,
      this.props.drawing,
      this.props.overallAttributes
    );

    const inheritedShapeStylesAllProperties = ShapeUtil.getAllShapeInheritedStylesAllProperties(
      shapeId,
      layerId,
      this.props.drawing,
      this.props.overallAttributes
    );


    if(shapeId) {
      return (
        <div className="AttributeFlexContainer">
          {ownDimensionList.map((attribute, i) =>
            {
              const attributeName = ownShapeDimensionsAllProperties[attribute + "$name"];
              const attributeValue = ownShapeDimensionsAllProperties[attribute + "$value"];
              const attributeExprString = ownShapeDimensionsAllProperties[attribute + "$exprString"];
              
              return (<AttributeFlexRow
                  key={i}
                  attributeId={shapeId + "$" + attribute}
                  attributeName={attributeName}
                  attributeValue={attributeValue}
                  attributeExprString={attributeExprString}
                  shapeOrLayerId={shapeId}
                  shapeOrLayer="shape"
                  own={true}
                />)
            }
          )}
          <div className="inherited-attributes">
            {inheritedDimensionList.map((attribute, i) =>
              {
                const attributeName = inheritedShapeDimensionsAllProperties[attribute + "$name"];
                const attributeValue = inheritedShapeDimensionsAllProperties[attribute + "$value"];
                const attributeExprString = inheritedShapeDimensionsAllProperties[attribute + "$exprString"];
                const inheritedFrom = inheritedShapeDimensionsAllProperties[attribute + "$inheritedFrom"];
                
                return (
                  <AttributeFlexRow
                      key={i}
                      attributeId={inheritedFrom + "$" + attribute}
                      attributeName={attributeName}
                      attributeValue={attributeValue}
                      attributeExprString={attributeExprString}
                      shapeOrLayerId={shapeId}
                      shapeOrLayer="shape"
                      own={false}
                    />
                  )
                }
              )}
          </div>
          {ownStyleList.map((attribute, i) =>
            {
              const attributeName = ownShapeStylesAllProperties[attribute + "$name"];
              const attributeValue = ownShapeStylesAllProperties[attribute + "$value"];
              const attributeExprString = ownShapeStylesAllProperties[attribute + "$exprString"];
              
              return (<AttributeFlexRow
                  key={i}
                  attributeId={shapeId + "$" + attribute}
                  attributeName={attributeName}
                  attributeValue={attributeValue}
                  attributeExprString={attributeExprString}
                  shapeOrLayerId={shapeId}
                  shapeOrLayer="shape"
                  own={true}
                />)
            }
          )}
          <div className="inherited-attributes">
            {inheritedStyleList.map((attribute, i) =>
              {
                const attributeName = inheritedShapeStylesAllProperties[attribute + "$name"];
                const attributeValue = inheritedShapeStylesAllProperties[attribute + "$value"];
                const attributeExprString = inheritedShapeStylesAllProperties[attribute + "$exprString"];
                const inheritedFrom = inheritedShapeStylesAllProperties[attribute + "$inheritedFrom"];
                
                return (
                  <AttributeFlexRow
                    key={i}
                    attributeId={inheritedFrom + "$" + attribute}
                    attributeName={attributeName}
                    attributeValue={attributeValue}
                    attributeExprString={attributeExprString}
                    shapeOrLayerId={shapeId}
                    shapeOrLayer="shape"
                    own={false}
                  />
                )
              }
            )}
          </div>
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
    drawing: state.drawing,
    overallAttributes: state.overallAttributes
  };
};

ShapeAttributeEditor = connect(mapStateToProps)(ShapeAttributeEditor);

export default ShapeAttributeEditor;
