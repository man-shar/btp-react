import React from 'react';
import { render } from 'react-dom';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import { UnControlled as CodeMirror } from 'react-codemirror2';
import "codemirror/mode/javascript/javascript"
import ShapeUtil from "../Util/ShapeUtil";
import { changeAttributeExpressionString, addAttributeReferenceToAttribute } from "../Actions/actions";
import { DropTarget } from 'react-dnd';
import ItemTypesDnd from "./ItemTypesDnd";

// render editable attribute expression as codemirror editor. use references objects to render references to other attributes.

const dropMethods = {
  drop: function(props, monitor) {
    // console.log(monitor.getItem());
  }
}

function collect(connect, monitor) {
  return {
    // Call this function inside render()
    // to let React DnD handle the drag events:
    connectDropTarget: connect.dropTarget(),
    monitor: monitor
  };
}

class AttributeFlexExpressionEditable extends React.Component {

  editorDidMount(editor) {
    editor.setValue(this.props.attributeExprString);
  }

  onMirrorChange(editor, changeObj) {
    if(this.props.attributeExprString === editor.getValue())
      return;

    this.props.onAttributeExprStringChange(this.props.attributeId, editor.getValue());
  }

  onMirrorDrop(editor, event) {
    const monitor = this.props.monitor;
    const attributeId = this.props.attributeId;

    if(!monitor.getItem().attributeId)
    {
      console.log("not dropping reference")
      return;
    }

    this.props.onAttributeReferenceDrop(editor, event, attributeId, monitor.getItem());
  }

  render() {
    const attributeExprString = this.props.attributeExprString;
    const attributeId = this.props.attributeId;

    const connectDropTarget = this.props.connectDropTarget;

    // have to wrap in div because react dnd only takes native nodes as drop targets
    return connectDropTarget(
      <div>
        <CodeMirror
          value={attributeExprString}
          options={{
            mode: "javascript",
            viewportMargin: Infinity,
            smartIndent: true,
            indentUnit: 2,
            tabSize: 2,
            indentWithTabs: true,
            lineWrapping: true,
            scrollbarStyle: "null",
            undoDepth: 0,
            dragDrop: true
          }}
          className="AttributeFlexExpressionEditable"
          onChange={this.onMirrorChange.bind(this)}
          onDrop={this.onMirrorDrop.bind(this)}
        />
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    drawing: state.drawing
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onAttributeExprStringChange: (attributeId, newExprString) => {
      dispatch(changeAttributeExpressionString(attributeId, newExprString));
      console.log(attributeId, newExprString)
    },
    onAttributeReferenceDrop: (editor, event, attributeId, droppedAttributeMonitorItem) => {
      dispatch(addAttributeReferenceToAttribute(editor, event, attributeId, droppedAttributeMonitorItem));
    }
  }
}

AttributeFlexExpressionEditable = connect(mapStateToProps, mapDispatchToProps)(AttributeFlexExpressionEditable);

export default DropTarget(ItemTypesDnd.ATTRIBUTE, dropMethods, collect)(AttributeFlexExpressionEditable);;