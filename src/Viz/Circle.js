import React from 'react';
import { render } from 'react-dom';

class Circle extends React.Component {
  render () {
    const dimensions = this.props.dimensions;
    const { cx, cy, r } = dimensions;

    return (
      <circle shape={this.props.shape} id={this.props.shape.id} name={this.props.shape.name} cx={cx} cy={cy} r={r}></circle>
    );
  }
}

export default Circle;