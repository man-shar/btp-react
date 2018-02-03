import React from 'react';
import {render} from 'react-dom';

class Circle extends React.Component {
  render () {
    const dimensions = this.props.dimensions;
    const { cx, cy, r } = dimensions;

    return (
      <circle shape={shape} id={shape.id} name={shape.name} cx={cx} cy={cy} r={r}></circle>
    );
  }
}

module.exports = Circle;