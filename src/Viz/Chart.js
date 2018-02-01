import React from 'react';
import {render} from 'react-dom';
import { connect } from 'react-redux';
import { startDragDraw, updateDragDraw, endDragDraw } from '../Actions/actions';
import Layer from './Layer'

class Chart extends React.Component {
  constructor() {
    super();

    this.state = {
      throttle: 0,
    }
  }

  render () {
    const width = this.props.size[0];
    const height = this.props.size[1];
    const onMouseDown = this.props.onMouseDown;
    const onMouseMove = this.props.onMouseMove;
    const onMouseUp = this.props.onMouseUp;
    const currentShape = this.props.currentShape;
    const layers = this.props.layers;

    return (
      <div id="chart-container">
        <svg 
          id="chart"
          width={width}
          height={height}
          onMouseDown={(e) => {
            e.preventDefault();

            onMouseDown(e);
          }}
          onMouseMove={(e) => {
            e.preventDefault();

            if(this.state.throttle % 3 === 0)
            {
              onMouseMove(e);
            }

            this.setState({
              throttle: this.state.throttle + 1
            });
          }}
          onMouseUp={(e) => {
            e.preventDefault();

            onMouseUp(e);

            this.setState({
              throttle: 0
            }) 
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
    "size": [state.width, state.height],
    "currentShape": state.currentShape,
    "layers": state.layers
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onMouseDown: (e) => {
      dispatch(startDragDraw(e));
    },
    onMouseMove: (e) => {
      dispatch(updateDragDraw(e));
    },
    onMouseUp: (e) => {
      dispatch(endDragDraw(e));
    }
  }
}

Chart = connect(mapStateToProps, mapDispatchToProps)(Chart);

module.exports = Chart;