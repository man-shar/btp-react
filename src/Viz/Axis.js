import React from "react";
import { findDOMNode } from "react-dom";
import * as d3 from "d3";

class Axis extends React.Component {
  componentDidUpdate() {
    const { chartWidth, chartHeight, marginLeft, marginTop, marginRight, marginBottom, orientationName, orientationFunc, scale } = this.props;

    if(!scale || !orientationFunc) {
      return;
    }

    let transform = "";

    if(orientationName === "left" || orientationName === "right") {
      transform += "translate(" + marginLeft + ", " + (chartHeight + marginTop) + ") scale(1, -1)";
    }

    if(orientationName === "bottom") {
      transform = "translate(" + marginLeft + "," + (chartHeight + marginTop) + ")";
    }

    if(orientationName === "top") {
      transform = "translate(" + marginLeft + ", " + marginTop + ")";
    }

    d3.select(findDOMNode(this))
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