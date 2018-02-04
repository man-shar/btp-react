import React from 'react';
import { render } from 'react-dom';
import { connect } from "react-redux";
import OverallAttributeEditor from './OverallAttributeEditor';
import LayerAttributesEditor from './LayerAttributesEditor';
import ShapeAttributesEditor from './ShapeAttributesEditor';

// Attributes are both dimensions and styles.

class AttributeEditor extends React.Component {
  render() {
    const activeLayerId = this.props.drawing.activeLayerId;
    const activeShapeId = this.props.drawing.activeShapeId;
    const activeLayer = this.props.drawing.layers[activeLayerId];
    const activeShape = activeLayer ? this.props.drawing.layers[activeLayerId][activeShapeId] : [];

    return (
      <div id="attributes-container">
        <div className="things-label" draggable="true">Attributes</div>
        <OverallAttributeEditor />
        <LayerAttributesEditor />
        <ShapeAttributesEditor />
      </div>
    );
  }
}

// const mapStateToProps = state => {
//   return {
//     "overallAttributes": state["overallAttributes"],
//     "drawing": state["drawing"]
//   }
// }


// AttributeEditor = connect(mapStateToProps)(AttributeEditor);

export default AttributeEditor;