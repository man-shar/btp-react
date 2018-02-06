import React from 'react';
import { render } from 'react-dom';
import { connect } from 'react-redux';
import Util from '../Util/Util'

class Circle extends React.Component {
  render () {
    const attributes = Util.getAttributeValue(this.props.id, this.props.layerId, this.props.drawing);
    const shapeId = this.props.id;
    const index = this.props.index;

    return (
      <circle id={shapeId} index={index} name={this.props.drawing[shapeId + "$name"]}  {...attributes}></circle>
    );
  }
}

const mapStateToProps = state => {
  return {
    "drawing": state.drawing,
  }
}

Circle = connect(mapStateToProps)(Circle);

export default Circle;