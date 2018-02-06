import React from 'react';
import { render } from 'react-dom';

// Attributes are both dimensions and styles.

class OverallAttributeEditor extends React.Component {
  render() {
    const overallAttributes = this.props.overallAttributes;

    return (
      <div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    overallAttributes: state["overallAttributes"]
  }
}

export default OverallAttributeEditor;