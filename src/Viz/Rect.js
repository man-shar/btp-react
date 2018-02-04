import React from 'react';
import { render } from 'react-dom';

class Rect extends React.Component {
  render () {
    const dimensions = this.props.dimensions;
    const { x, y, width, height } = this.props.dimensions;

    return (
      <rect shape={this.props.shape} id={this.props.shape.id} name={this.props.shape.name} x={x} y={y} width={width} height={height}></rect>
    );
  }
}

export default Rect;