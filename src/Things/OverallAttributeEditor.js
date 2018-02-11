import React from 'react';
import { render } from 'react-dom';

// Attributes are both dimensions and styles.

class OverallAttributeEditor extends React.Component {
  render() {

    return (
      <div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    drawing: state["drawing"]
  }
}

export default OverallAttributeEditor;