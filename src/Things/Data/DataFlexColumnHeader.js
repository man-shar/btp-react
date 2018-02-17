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
    const { isDragging, connectDragSource, columnName } = this.props
    const className = 'DataFlexColumnHeader'

    return connectDragSource(
      <div
        className={className}
        >
        <span>{columnName}</span>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    drawing: state.drawing,
    data: state.data
  }
}

export default DragSource(ItemTypesDnd.DATA, attributeSource, collect)(connect(mapStateToProps)(DataFlexColumnHeader))
