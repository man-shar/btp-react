import React from 'react';
import { render } from 'react-dom';
import { connect } from 'react-redux';
import { startDragDraw, updateDragDraw, endDragDraw, toggleCurrentShape } from '../Actions/actions';
import Layer from './Layer'

// Handles svg mouse events. Drag draw etc. Dispatches actions for user drawing.

class Chart extends React.Component {
  constructor() {
    super();

    // slight lag on mousemove updates so throttling the action to be dispatched every "x" (guessed from trial and error) events. Declaring local state because throttle not really needed elsewhere (yet).

    this.state = {
      throttle: 0,
    }
  }

  componentDidMount() {
    window.addEventListener("keydown", this.props.onKeyDown, false);
  }

  render () {
    const width = this.props.size[0];
    const height = this.props.size[1];
    const onMouseDown = this.props.onMouseDown;
    const onMouseMove = this.props.onMouseMove;
    const onMouseUp = this.props.onMouseUp;
    const currentShape = this.props.currentShape;
    const layers = this.props.layers;

    const backgroundStyles = {
      "fill": this.props.overallAttributes["background-fill"],
      "stroke": this.props.overallAttributes.border
    }

    // SVG doesn't support ondrag events so have to work with mousedown, mousemove and mouseup here.

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

            if(this.props.beingDrawn) {
              if(this.state.throttle % 2 === 0)
              {
                onMouseMove(e);
              }

              this.setState({
                throttle: this.state.throttle + 1
              });
            }
          }}
          onMouseUp={(e) => {
            e.preventDefault();

            onMouseUp(e);

            this.setState({
              throttle: 0
            }) 
          }}>
          <rect width={width} height={height} style={backgroundStyles}></rect>

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
    "size": [state.overallAttributes.width, state.overallAttributes.height],
    "overallAttributes": state.overallAttributes,
    "currentShape": state.drawing.currentShape,
    "layers": state.drawing.layers,
    "beingDrawn": state.drawing.beingDrawn,
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
    },
    onKeyDown: (e) => {
      dispatch(toggleCurrentShape(e.key));
    }
  }
}

Chart = connect(mapStateToProps, mapDispatchToProps)(Chart);

module.exports = Chart;