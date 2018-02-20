import React from 'react';
import { render } from 'react-dom';
import { connect } from 'react-redux';
import { startDragDraw, updateDragDraw, endDragDraw, toggleCurrentShape, checkIfNewLayerIsValid, changeActiveLayerAndShape, loopAll, loopActiveLayer } from '../Actions/actions';
import ShapeUtil from "../Util/ShapeUtil";
import Layer from './Layer';
import keydown from 'react-keydown';
// Handles svg mouse events. Drag draw etc. Dispatches actions for user drawing.

class Chart extends React.Component {
  constructor() {
    super();

    // slight lag on mousemove updates so throttling the action to be dispatched every "x" (guessed from trial and error) events. Declaring local state because throttle not really needed elsewhere (yet).

    this.state = {
      throttle: 0,
    }
  }

  @keydown(ShapeUtil.keysToShapes)
  toggleCurrentShape(event) {
    this.props.toggleCurrentShape(event)
  }

  @keydown(ShapeUtil.loopKeyCombinations)
  loopKeyCombination(event) {
    this.props.loopKeyCombination(event)
  }

  // componentDidMount() {
  //   window.addEventListener("keydown", , false);
  // }

  onMouseDown(e) {
    document.activeElement.blur();
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
    const chartWidth = drawing["overallAttributes$chartWidth$value"];
    const chartHeight = drawing["overallAttributes$chartHeight$value"];
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
          width={chartWidth}
          height={chartHeight}
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
          <rect width={chartWidth} height={chartHeight} fill="#fff"></rect>

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

const mapDispatchToProps = (dispatch) => {
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
    toggleCurrentShape: (e) => {
      dispatch(toggleCurrentShape(e.key));
    },
    loopKeyCombination: (e) => {
      if(e.shiftKey)
        dispatch(loopAll());
      else
        dispatch(loopActiveLayer());
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