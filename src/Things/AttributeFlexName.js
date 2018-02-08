import React from 'react';
import { render } from 'react-dom';
import ShapeUtil from "../Util/ShapeUtil";
import { DragSource } from 'react-dnd';
import ItemTypesDnd from "./ItemTypesDnd";

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
    const { isDragging, connectDragSource, attributeName, attributeId, shapeOrLayer, shapeOrLayerId } = this.props;

    // have to wrap span in div to allow for drag events to happen with contenteditable;

    return connectDragSource(
      <div className="AttributeFlexName">
        <div className="EditableTextAttributeFlexName" contentEditable="true">
          <span>{attributeName}</span>
        </div>
      </div>
    );
  }
}

export default DragSource(ItemTypesDnd.ATTRIBUTE, attributeSource, collect)(AttributeFlexName);