import React from "react";

class YAxis extends React.Component {
  render() {
    return (
      <g class="y-axis">
      </g>
    );
  }
}

const mapStateToProps = state => {
  return {
    drawing: state.drawing,
  };
};

export default YAxis;