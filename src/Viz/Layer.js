import React from 'react';
import {render} from 'react-dom';
import { connect } from 'react-redux';
import Rect from "./Rect"
import Circle from "./Circle"

class Layer extends React.Component {
  render() {
    const shapes = this.props.shapes;
    const shapeIds = this.props.shapeIds;
    const type = this.props.type;
    const dimensions = this.props.dimensions;

    if (type === "rect") {
      return (
        shapeIds.map((shapeId, i) => 
          <Rect shape={shapes[shapeId]} id={shapes[shapeId].id} name={shapes[shapeId].name} key={i} dimensions={shapes[shapeId].dimensions}/>
        )
      );
    }

    if (type === "circle") {
      return (
        shapeIds.map((shapeId, i) => 
          <Circle shape={shapes[shapeId]} id={shapes[shapeId].id} name={shapes[shapeId].name} key={i} dimensions={shapes[shapeId].dimensions}/>
        )
      );
    }
  }
}

export default Layer;