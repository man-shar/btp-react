import React from 'react';
import { render } from 'react-dom';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import { UnControlled as CodeMirror } from 'react-codemirror2';
import "codemirror/mode/javascript/javascript"
import ShapeUtil from "../Util/ShapeUtil";
import { changeAttributeExpressionStringThunk, addAttributeReferenceToAttribute } from "../Actions/actions";
import { DropTarget } from 'react-dnd';
import ItemTypesDnd from "./ItemTypesDnd";

// render editable attribute expression as codemirror editor. use references objects to render references to other attributes.

// to control whether the codemirror should update, we use a shouldupdate property in the state. so if you let react do it's thing, it updates codemirror everytime there is a change. which causes the cursor on codemirror to jump to the end because the component is re-mounted hence the editor is recreated. but what we can do in shouldcomponenetupdate is that use compoenentWillRecieveProps to decide whether the nextprops are the same as codemirror contents and if true, set the shouldupdate variable to false. else it will be true. and use this value as the return value in shouldComponentUpdate.

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
  constructor() {
    super();

    this.instance = null;
    this.state = {};
    this.state.shouldUpdate = true;
  }

  renderCodeMirrorMarks(editor) {
    const referenceAttributes = ShapeUtil.referenceAttributes[this.props.attributeId];
    if(referenceAttributes)
    {
      const marks = referenceAttributes["marks"]
    }
  }

  shouldComponentUpdate() {
    return (this.state.shouldUpdate);
  }

  componentWillReceiveProps(nextProps) {
    const editor = this.instance;
    if(editor && (nextProps.attributeExprString === editor.getValue())) 
    {
      this.setState({
        shouldUpdate: false,
      })
      return false;
    }

    this.setState({
      shouldUpdate: true,
    })

    return true;
  }

  onMirrorChange(editor, changeObj) {
    if(this.props.attributeExprString === editor.getValue())
      return;

    this.props.onAttributeExprStringChange(this.props.attributeId, editor.getValue(), this.props.typeOfAttribute, this.props.actionOccuredAtId, this.props.attributeIndex);

    this.renderCodeMirrorMarks(editor);
  }

  onMirrorDrop(editor, event) {
    const monitor = this.props.monitor;
    const attributeId = this.props.attributeId;

    if(!monitor.getItem().attributeId || this.props.typeOfAttribute !== "dimension")
    {
      console.log("not dropping reference")
      return;
    }

    this.props.onAttributeReferenceDrop(editor, event, attributeId, monitor.getItem(), this.props.typeOfAttribute, this.props.actionOccuredAtId, this.props.attributeIndex);
    this.renderCodeMirrorMarks(editor);
  }

  render() {
    const attributeExprString = this.props.attributeExprString;
    const attributeId = this.props.attributeId;
    const typeOfAttribute = this.props.typeOfAttribute;
    // can also be overallAttributes.
    const actionOccuredAtId = this.props.actionOccuredAtId;

    const connectDropTarget = this.props.connectDropTarget;
    const attributeIndex = this.props.attributeIndex;

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
          editorDidMount={(editor) => {
            editor.setValue(this.props.attributeExprString);
            
            this.renderCodeMirrorMarks(editor);
            this.instance = editor;
          }}
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
    onAttributeExprStringChange: (attributeId, newExprString, typeOfAttribute, actionOccuredAtId, attributeIndex) => {
      dispatch(changeAttributeExpressionStringThunk(attributeId, newExprString, typeOfAttribute, actionOccuredAtId, attributeIndex));
    },
    onAttributeReferenceDrop: (editor, event, attributeId, droppedAttributeMonitorItem, typeOfAttribute, actionOccuredAtId, attributeIndex) => {
      dispatch(addAttributeReferenceToAttribute(editor, event, attributeId, droppedAttributeMonitorItem, typeOfAttribute, actionOccuredAtId, attributeIndex));
    }
  }
}

AttributeFlexExpressionEditable = connect(mapStateToProps, mapDispatchToProps)(AttributeFlexExpressionEditable);

export default DropTarget(ItemTypesDnd.ATTRIBUTE, dropMethods, collect)(AttributeFlexExpressionEditable);;