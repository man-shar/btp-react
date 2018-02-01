import React from 'react';
import {render} from 'react-dom';
import { connect } from 'react-redux';
import Rect from "./Rect"

class Layer extends React.Component {
  render() {
    const shapes = this.props.shapes;
    const type = this.props.type;
    const dimensions = this.props.dimensions;

    if (type === "rect") {
      return (
        shapes.map((shape, i) => 
          <Rect key={i} dimensions={shape.dimensions}/>
        )
      );
    }
  }
}

export default Layer;