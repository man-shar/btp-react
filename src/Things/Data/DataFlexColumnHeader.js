import React from 'react'
import { render } from 'react-dom'
import { DragSource } from 'react-dnd'
import ItemTypesDnd from '../ItemTypesDnd'
import { connect } from 'react-redux'

/**
 * What data do we want the drop target to recieve.
 */
const attributeSource = {
  beginDrag (props) {
    return {
      attributeId: props.attributeId,
      type: "data"
    }
  }
}

/**
 * Specifies the props to inject into the component.
 */
 // this connect is different from redux's connect.
function collect (connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging()
  }
}

// TODO: Add DragLayer component for showing component while dragging.

// render editable attribute name
class DataFlexColumnHeader extends React.Component {
  render () {
    const { isDragging, connectDragSource, attributeId, drawing } = this.props
    const hoveredAttributeId = drawing.hoveredAttributeId;

    const className = 'DataFlexColumnHeader' + ((attributeId === hoveredAttributeId) ? ' isHovered' : '')

    return connectDragSource(
      <div
        className={className}
        >
        <span>{drawing[attributeId + "$name"]}</span>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    drawing: state.drawing,
  }
}

export default DragSource(ItemTypesDnd.DATA, attributeSource, collect)(connect(mapStateToProps)(DataFlexColumnHeader))
