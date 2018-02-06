import React from 'react';
import { render } from 'react-dom';
import { connect } from 'react-redux';
import { getAttributes } from '../Util/Util'


class Rect extends React.Component {
  render () {
    const attributes = getAttributes(this.props.id, this.props.drawing);
    const shapeId = this.props.id

    return (
      <rect id={shapeId} name={this.props.drawing[shapeId + "$name"]} {...attributes}></rect>
    );
  }
}


const mapStateToProps = state => {
  return {
    "drawing": state.drawing,
  }
}

Rect = connect(mapStateToProps)(Rect);

export default Rect;