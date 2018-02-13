import React from "react";
import { render } from "react-dom";
import { connect } from "react-redux";
import ShapeUtil from "../Util/ShapeUtil";
import AttributeFlexRow from "./AttributeFlexRow"

// Attributes are both dimensions and styles.
// Attributes of a particular Layer.

class LayerAttributeEditor extends React.Component {
  render() {
    const layerId = this.props.layerId;
    const ownDimensionList = this.props.drawing[layerId + "$ownDimensionList"];
    const inheritedDimensionList = this.props.drawing[layerId + "$inheritedDimensionList"];
    const ownStyleList = this.props.drawing[layerId + "$ownStyleList"];
    const inheritedStyleList = this.props.drawing[layerId + "$inheritedStyleList"];

    const ownLayerDimensionsAllProperties = ShapeUtil.getAllLayerOwnDimensionsAllProperties(
      layerId,
      this.props.drawing,
    );

    const inheritedLayerDimensionsAllProperties = ShapeUtil.getAllLayerInheritedDimensionsAllProperties(
      layerId,
      this.props.drawing,
    );

    const ownLayerStylesAllProperties = ShapeUtil.getAllLayerOwnStylesAllProperties(
      layerId,
      this.props.drawing,
    );

    const inheritedLayerStylesAllProperties = ShapeUtil.getAllLayerInheritedStylesAllProperties(
      layerId,
      this.props.drawing,
    );

    if(layerId)
    {
      return (
        <div className="AttributeFlexContainer">
          {ownDimensionList.map((attribute, i) =>
            {
              const attributeName = ownLayerDimensionsAllProperties[attribute + "$name"];
              const attributeValue = ownLayerDimensionsAllProperties[attribute + "$value"];
              const attributeExprString = ownLayerDimensionsAllProperties[attribute + "$exprString"];
              
              return (<AttributeFlexRow
                  key={i}
                  attributeId={layerId + "$" + attribute}
                  attributeName={attributeName}
                  attributeValue={attributeValue}
                  attributeExprString={attributeExprString}
                  shapeOrLayerId={layerId}
                  shapeOrLayer="layer"
                  typeOfAttribute="dimension"
                  own={true}
                />)
            }
          )}
          <div className="inherited-attributes">
            {inheritedDimensionList.map((attribute, i) =>
              {
                const attributeName = inheritedLayerDimensionsAllProperties[attribute + "$name"];
                const attributeValue = inheritedLayerDimensionsAllProperties[attribute + "$value"];
                const attributeExprString = inheritedLayerDimensionsAllProperties[attribute + "$exprString"];
                
                return (
                  <AttributeFlexRow
                    key={i}
                    attributeId={"overallAttributes$" + attribute}
                    attributeName={attributeName}
                    attributeValue={attributeValue}
                    attributeExprString={attributeExprString}
                    shapeOrLayerId={layerId}
                    shapeOrLayer="layer"
                    typeOfAttribute="dimension"
                    own={false}
                  />
                )
              }
            )}
          </div>
          {ownStyleList.map((attribute, i) =>
            {
              const attributeName = ownLayerStylesAllProperties[attribute + "$name"];
              const attributeValue = ownLayerStylesAllProperties[attribute + "$value"];
              const attributeExprString = ownLayerStylesAllProperties[attribute + "$exprString"];
              
              return (<AttributeFlexRow
                  key={i}
                  attributeId={layerId + "$" + attribute}
                  attributeName={attributeName}
                  attributeValue={attributeValue}
                  attributeExprString={attributeExprString}
                  shapeOrLayerId={layerId}
                  shapeOrLayer="layer"
                  typeOfAttribute="style"
                  own={true}
                />)
            }
          )}
          <div className="inherited-attributes">
            {inheritedStyleList.map((attribute, i) =>
              {
                const attributeName = inheritedLayerStylesAllProperties[attribute + "$name"];
                const attributeValue = inheritedLayerStylesAllProperties[attribute + "$value"];
                const attributeExprString = inheritedLayerStylesAllProperties[attribute + "$exprString"];
                
                return (
                  <AttributeFlexRow
                    key={i}
                    attributeId={"overallAttributes$" + attribute}
                    attributeName={attributeName}
                    attributeValue={attributeValue}
                    attributeExprString={attributeExprString}
                    shapeOrLayerId={layerId}
                    shapeOrLayer="layer"
                    typeOfAttribute="style"
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
  };
};

LayerAttributeEditor = connect(mapStateToProps)(LayerAttributeEditor);

export default LayerAttributeEditor;
