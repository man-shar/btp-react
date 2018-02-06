import React from 'react';
import { render } from 'react-dom';
import { connect } from 'react-redux';
import { getAttributes } from '../Util/Util'

class Circle extends React.Component {
  render () {
    const attributes = getAttributes(this.props.id, this.props.drawing);
    const shapeId = this.props.id;

    return (
      <circle id={shapeId} name={this.props.drawing[shapeId + "$name"]}  {...attributes}></circle>
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