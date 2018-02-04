import React from 'react';
import { render } from 'react-dom';
import { connect } from 'react-redux';
import Rect from "./Rect"
import Circle from "./Circle"

class Layer extends React.Component {
  render() {
    const layerId = this.props.id;
    const layer = this.props.layer
    const shapes = layer.shapes;
    const shapeIds = layer.shapeIds;
    const type = layer.type;

    if (type === "rect") {
      return (
        shapeIds.map((shapeId, i) => 
          <Rect id={shapes[shapeId].id} name={shapes[shapeId].name} key={i} dimensions={shapes[shapeId].dimensions} shape={shapes[shapeId]}/>
        )
      );
    }

    if (type === "circle") {
      return (
        shapeIds.map((shapeId, i) => 
          <Circle id={shapes[shapeId].id} name={shapes[shapeId].name} key={i} dimensions={shapes[shapeId].dimensions} shape={shapes[shapeId]}/>
        )
      );
    }
  }
}

const mapStateToProps = state => {
  return {
    "layers": state.drawing.layers,
  }
}

Layer = connect(mapStateToProps)(Layer);

export default Layer;