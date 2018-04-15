import React from "react";
import { findDOMNode } from "react-dom";
import { select, call, attr } from "d3-selection";

class Axis extends React.Component {
  componentDidUpdate() {
    const { chartWidth, chartHeight, marginLeft, marginTop, marginRight, marginBottom, orientationName, orientationFunc, scale } = this.props;

    // if scale or orientation function is not defined, do nothing.
    if(!scale || !orientationFunc) {
      return;
    }

    let transform = "";

    // in case of left or right orientation, we need to take care of y axis inversion.
    if(orientationName === "left" || orientationName === "right") {
      transform += "translate(" + marginLeft + ", " + (chartHeight + marginTop) + ") scale(1, -1)";
    }

    // bottom orientation just requires translate.
    if(orientationName === "bottom") {
      transform = "translate(" + marginLeft + "," + (chartHeight + marginTop) + ")";
    }

    // top orientation just requires translate.
    if(orientationName === "top") {
      transform = "translate(" + marginLeft + ", " + marginTop + ")";
    }

    // d3 magic.
    select(findDOMNode(this))
      .call(orientationFunc(scale))
      .attr("transform", transform);
  }

  render() {
    return (
      <g id={this.props.id} className={this.props.orientationName}>
      </g>
    );
  }
}

export default Axis;
