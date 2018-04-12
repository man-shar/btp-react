import React from "react";
import { connect } from "react-redux";
import OverallAttributeEditor from "./OverallAttributeEditor";
import LayerAttributeEditor from "./LayerAttributeEditor";
import ShapeAttributeEditor from "./ShapeAttributeEditor";

// Attributes are both dimensions and styles.

class AttributeEditor extends React.Component {
  render() {
    const { activeLayerId, activeShapeId, drawing } = this.props;

    return (
      <div id="attribute-editor">
        <div
          className="things-label accordion"
          onClick={this.props.togglePanel.bind(this)}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="panel-collapse-svg relative dib pen relative v-top"><polyline points="10 18 16 12 10 6"></polyline></svg>
          Attributes
        </div>
        <div className="panel">
          <div id="attribute-container">
            <div className="AttributesSectionHeading">
              <span>Default Attributes</span>
            </div>
            <OverallAttributeEditor />
            <LayerAttributeEditor layerId={activeLayerId} />
            <ShapeAttributeEditor shapeId={activeShapeId} layerId={activeLayerId}/>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    activeLayerId: state["drawing"]["activeLayerId"],
    activeShapeId: state["drawing"]["activeShapeId"],
    drawing: state["drawing"]
  };
};

AttributeEditor = connect(mapStateToProps)(AttributeEditor);

export default AttributeEditor;
