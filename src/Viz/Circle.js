import React from "react";
import { render } from "react-dom";
import { connect } from "react-redux";
import ShapeUtil from "../Util/ShapeUtil";

class Circle extends React.Component {
  render() {
    // get own dimensions
    const ownShapeDimensions = ShapeUtil.getAllShapeOwnDimensionsProperty(
      this.props.id,
      this.props.layerId,
      this.props.drawing,
      "value"
    );

    // get inherited dimensions
    const inheritedShapeDimensions = ShapeUtil.getAllShapeInheritedDimensionsProperty(
      this.props.id,
      this.props.layerId,
      this.props.drawing,
      "value"
    );

    // get own styles
    const ownShapeStyles = ShapeUtil.getAllShapeOwnStylesProperty(
      this.props.id,
      this.props.layerId,
      this.props.drawing,
      "value"
    );

    // get inherited styles
    const inheritedShapeStyles = ShapeUtil.getAllShapeInheritedStylesProperty(
      this.props.id,
      this.props.layerId,
      this.props.drawing,
      "value"
    );

    const shapeId = this.props.id;
    const index = this.props.index;

    return (
      <circle
        id={shapeId}
        index={index}
        name={this.props.drawing[shapeId + "$name"]}
        {...ownShapeDimensions}
        {...inheritedShapeDimensions}
      />
    );
  }
}

const mapStateToProps = state => {
  return {
    drawing: state.drawing,
  };
};

Circle = connect(mapStateToProps)(Circle);

export default Circle;
