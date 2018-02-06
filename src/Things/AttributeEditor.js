import React from 'react';
import { render } from 'react-dom';
import { connect } from "react-redux";
import OverallAttributeEditor from './OverallAttributeEditor';
import LayerAttributesEditor from './LayerAttributesEditor';
import ShapeAttributesEditor from './ShapeAttributesEditor';

// Attributes are both dimensions and styles.

class AttributeEditor extends React.Component {
  render() {
    const drawing = this.props.drawing;
    const activeLayerId = drawing.activeLayerId;
    const activeShapeId = drawing.activeShapeId;

    return (
      <div id="attributes-container">
        <div className="things-label" draggable="true">Attributes</div>
        <OverallAttributeEditor/>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    "overallAttributes": state["overallAttributes"],
    "drawing": state["drawing"]
  }
}


AttributeEditor = connect(mapStateToProps)(AttributeEditor);

export default AttributeEditor;