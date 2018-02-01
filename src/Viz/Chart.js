import React from 'react';
import {render} from 'react-dom';
import { connect } from 'react-redux';
import { startDragDraw } from '../Actions/actions';
import Layer from './Layer'

class Chart extends React.Component {
  render () {
    const width = this.props.size[0];
    const height = this.props.size[1];
    const onMouseDown = this.props.onMouseDown;
    const currentShape = this.props["current-shape"];
    const layers = this.props["layers"];

    return (
      <div id="chart-container">
        <svg 
          id="chart"
          width={width}
          height={height}
          onMouseDown={(e) => {
            e.preventDefault();

            onMouseDown(e);
          }}>
          {layers.map((layer, i) => 
            <Layer key={i} shapes={layer.shapes} type={layer.type} dimensions={layer.dimensions}/>
          )}
        </svg>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    size: [state.width, state.height],
    "current-shape": state["current-shape"],
    "layers": state["layers"]
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onMouseDown: (e) => {
      dispatch(startDragDraw(e))
    }
    onMouseMove: (e) => {
      dispatch
    }
  }
}

Chart = connect(mapStateToProps, mapDispatchToProps)(Chart);

module.exports = Chart;