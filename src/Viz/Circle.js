import React from 'react';
import {render} from 'react-dom';

class Circle extends React.Component {
  render () {
    const dimensions = this.props.dimensions;
    const { cx, cy, r } = dimensions;

    return (
      <circle cx={cx} cy={cy} r={r}></circle>
    );
  }
}

module.exports = Circle;