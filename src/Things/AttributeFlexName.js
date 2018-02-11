import React from 'react';
import { render } from 'react-dom';
import ShapeUtil from "../Util/ShapeUtil";
import { DragSource } from 'react-dnd';
import ItemTypesDnd from "./ItemTypesDnd";
import { connect } from 'react-redux';
import { updateHoveredAttribute } from '../Actions/actions';

/**
 * Implements the drag source contract.
 */
const attributeSource = {
  beginDrag(props) {
    return {
      attributeId: props.attributeId,
      shapeOrLayer: props.shapeOrLayer,
      shapeOrLayerId: props.shapeOrLayerId
    };
  }
};

/**
 * Specifies the props to inject into the component.
 */
function collect(connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging()
  };
}

// TODO: Add DragLayer component for showing component while dragging.

// render editable attribute name
class AttributeFlexName extends React.Component {
  render() {
    const { isDragging, connectDragSource, attributeName, attributeId, shapeOrLayer, shapeOrLayerId, hoveredAttributeId } = this.props;

    const updateHoveredAttribute = this.props.updateHoveredAttribute.bind(this);

    // have to wrap span in div to allow for drag events to happen with contenteditable;

    const className = "AttributeFlexName" + ((attributeId === hoveredAttributeId) ? " isHovered" : "");

    return connectDragSource(
      <div
        className={className}
        onMouseOver={(e) => {
          updateHoveredAttribute(attributeId);
        }}
        onMouseOut={(e) => {
          updateHoveredAttribute("");
        }}
        >
        <div className="EditableTextAttributeFlexName" contentEditable="true">
          <span>{attributeName}</span>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    hoveredAttributeId: state.drawing.hoveredAttributeId
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    updateHoveredAttribute: (hoveredAttributeId) => {
      dispatch(updateHoveredAttribute(hoveredAttributeId));
    }
  }
};

export default DragSource(ItemTypesDnd.ATTRIBUTE, attributeSource, collect)(connect(mapStateToProps, mapDispatchToProps)(AttributeFlexName));