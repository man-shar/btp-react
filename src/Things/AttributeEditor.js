import React from "react";
import { render } from "react-dom";
import { connect } from "react-redux";
import OverallAttributeEditor from "./OverallAttributeEditor";
import LayerAttributeEditor from "./LayerAttributeEditor";
import ShapeAttributeEditor from "./ShapeAttributeEditor";

// Attributes are both dimensions and styles.

class AttributeEditor extends React.Component {
  render() {
    const activeLayerId = this.props.activeLayerId;
    const activeShapeId = this.props.activeShapeId;

    return (
      <div id="attribute-container">
        <div className="things-label" draggable="true">
          Attributes
        </div>
        <OverallAttributeEditor />
        <LayerAttributeEditor layerId={activeLayerId} />
        <ShapeAttributeEditor shapeId={activeShapeId} />
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    overallAttributes: state["overallAttributes"],
    activeLayerId: state["drawing"]["activeLayerId"],
    activeShapeId: state["drawing"]["activeShapeId"]
  };
};

AttributeEditor = connect(mapStateToProps)(AttributeEditor);

export default AttributeEditor;
