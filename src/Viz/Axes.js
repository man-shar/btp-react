import React from "react";
import { connect } from "react-redux";
import ShapeUtil from "../Util/ShapeUtil";
import XAxis from './XAxis';
import YAxis from './YAxis';

// axis.scale([scale])
// axis.ticks(arguments…) 
// axis.tickArguments([arguments])
// axis.tickValues([values])
// axis.tickFormat([format])
// axis.tickSize([size])
// axis.tickSizeInner([size])
// axis.tickSizeOuter([size])
// axis.tickPadding([padding])

class Axes extends React.Component {
  render() {
    const drawing = this.props.drawing;
    const xScale = ShapeUtil.axes["xAxis"];
    const yScale = ShapeUtil.axes["yAxis"]
    const xTicks = drawing["overallAttributes$xAxis$ticks"];
    const xTicks = drawing["overallAttributes$xAxis$tickArguments"];
    const xTicks = drawing["overallAttributes$xAxis$tickFormat"];
    const xTicks = drawing["overallAttributes$xAxis$tickSize"];
    const xTicks = drawing["overallAttributes$xAxis$tickSizeInner"];
    const xTicks = drawing["overallAttributes$xAxis$tickSizeOuter"];
    const xTicks = drawing["overallAttributes$xAxis$tickPadding"];


    return (
      <g class="axes">
        <XAxis/>
        <YAxis/>
      </g>
    );
  }
}

const mapStateToProps = state => {
  return {
    drawing: state.drawing,
  };
};

Axes = connect(mapStateToProps)(Axes);

export default Axes;
