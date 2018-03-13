import React from "react";

class XAxis extends React.Component {
  render() {
    return (
      <g class="x-axis">
      </g>
    );
  }
}

const mapStateToProps = state => {
  return {
    drawing: state.drawing,
  };
};

export default XAxis;