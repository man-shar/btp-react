import React from 'react';
import { render } from 'react-dom';
import { connect } from 'react-redux';
import { startDragDraw, updateDragDraw, endDragDraw, toggleCurrentShape, checkIfNewLayerIsValid, changeActiveLayerAndShape } from '../Actions/actions';
import ShapeUtil from "../Util/ShapeUtil"
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

  onMouseDown(e) {
    e.preventDefault();

    // yeah so I can't bind a click event on both svg and it's child. yet. so have to fire it from here. fuck.
    if (e.target.classList.contains("shape")) {
      this.props.changeActiveLayerAndShape(e.target.id);
      return;
    }

    this.props.onMouseDown(e);
  }

  render () {
    const drawing = this.props.drawing;
    const width = drawing["overallAttributes$width$value"];
    const height = drawing["overallAttributes$height$value"];
    const onMouseDown = this.props.onMouseDown;
    const onMouseMove = this.props.onMouseMove;
    const onMouseUp = this.props.onMouseUp;
    const checkIfNewLayerIsValid = this.props.checkIfNewLayerIsValid;
    const currentShape = drawing.currentShape;
    const layerIds = drawing.layerIds;
    const beingDrawn = drawing.beingDrawn;

    const overallStyles = ShapeUtil.getAllOverallAttributesStylesProperty(drawing, "value");

    // SVG doesn't support ondrag events so have to work with mousedown, mousemove and mouseup here.

    return (
      <div id="chart-container">
        <svg 
          id="chart"
          width={width}
          height={height}
          onMouseDown={this.onMouseDown.bind(this)}
          onMouseMove={(e) => {
            e.preventDefault();

            if(beingDrawn) {
              if(this.state.throttle % 1 === 0)
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
            if(beingDrawn) {
              checkIfNewLayerIsValid();
              onMouseUp(e);
            }

            this.setState({
              throttle: 0
            }) 
          }}
          style={overallStyles}
          >
          <rect width={width} height={height}></rect>

          {layerIds.map((layerId, i) =>
            <g key={i} id={layerId}>
              <Layer className="layer" id={layerId} type={drawing[layerId + "$type"]} attributeList={drawing[layerId + "$attributeList"]} />
            </g>
          )}

        </svg>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    "drawing": state.drawing,
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
      // TODO dispatch action only when svg in focus.
      if(ShapeUtil.knownKeys.indexOf(e.key) > -1)
        dispatch(toggleCurrentShape(e.key));
    },
    checkIfNewLayerIsValid: (e) => {
      dispatch(checkIfNewLayerIsValid());
    },
    changeActiveLayerAndShape: (shapeId) => {
      dispatch(changeActiveLayerAndShape(shapeId));
    }
  }
}

Chart = connect(mapStateToProps, mapDispatchToProps)(Chart);

export default Chart;