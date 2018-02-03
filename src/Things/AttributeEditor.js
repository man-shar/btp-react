import React from 'react';
import {render} from 'react-dom';

class AttributeEditor extends React.Component {
  render() {
    return (
      <div id="attributes-container">
        <div className="things-label" draggable="true">Attributes</div>
      </div>
    );
  }
}



export default AttributeEditor;