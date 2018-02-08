import React from "react";
import { render } from "react-dom";
import { connect } from "react-redux";
import ShapeUtil from "../Util/ShapeUtil";

class Rect extends React.Component {
  render() {
    const [allShapeAttributes, foundInShape] = ShapeUtil.getAllShapeAttributesProperty(
      this.props.id,
      this.props.layerId,
      this.props.drawing,
      "value"
    );
    const shapeId = this.props.id;
    const index = this.props.index;

    return (
      <rect
        id={shapeId}
        index={index}
        name={this.props.drawing[shapeId + "$name"]}
        {...allShapeAttributes}
      />
    );
  }
}

const mapStateToProps = state => {
  return {
    drawing: state.drawing
  };
};

Rect = connect(mapStateToProps)(Rect);

export default Rect;
