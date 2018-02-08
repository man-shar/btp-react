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
    const attributeList = this.props.drawing[layerId + "$attributeList"];

    const allLayerAttributesEverything = ShapeUtil.getAllLayerAttributesEverything(
      layerId,
      this.props.drawing
    );

    if(attributeList)
    {
      return (
        <div className="AttributeFlexContainer">
          {attributeList.map((attribute, i) =>
            {
              const attributeName = allLayerAttributesEverything[layerId + "$" + attribute + "$name"];
              const attributeValue = allLayerAttributesEverything[layerId + "$" + attribute + "$value"];
              const attributeExprString = allLayerAttributesEverything[layerId + "$" + attribute + "$exprString"];
              return (<AttributeFlexRow
                  key={i}
                  attributeId={layerId + "$" + attribute}
                  attributeName={attributeName}
                  attributeValue={attributeValue}
                  attributeExprString={attributeExprString}
                  shapeOrLayerId={layerId}
                  shapeOrLayer="layer"
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

LayerAttributeEditor = connect(mapStateToProps)(LayerAttributeEditor);

export default LayerAttributeEditor;
