import React from "react";
import { render } from "react-dom";
import { connect } from "react-redux";
import ShapeUtil from "../../Util/ShapeUtil"

class Toolbar extends React.Component {
  render() {
    const currentShape = this.props.currentShape;
    const knownShapes = ShapeUtil.knownShapes;

    return (
      <div id="ToolbarFlexContainer">
        {
          knownShapes.map((shape) => {
            const className = "ToolbarItemFlex " + (shape + "-toolbar ") + ((currentShape === shape) ? "activeToolbarItem" : "");
            return (
              <div className={className}>
                <span>{shape}</span>
              </div>
            )
          })
        }
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    currentShape: state["drawing"]["currentShape"],
  };
};

Toolbar = connect(mapStateToProps)(Toolbar);

export default Toolbar;
