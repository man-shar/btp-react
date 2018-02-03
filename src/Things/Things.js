import React from 'react';
import {render} from 'react-dom';
import Data from "./Data"
import AttributeEditor from "./AttributeEditor"

// <div id="things">
  // <div id="data-drop-container">
    // <input type="file" name="data-file" id="selectedFile" style={{"display": "none"}}/>
    // <div className="things-label" draggable="true">
      // Data
    // </div>
    // <p id="data-drop-placeholder-text">Drag/Upload<br/> your data here</p>
    // <div id="data-table-container" style={{"display": "none"}}></div>
  // </div>
  // <div id="attributes-container">
    // <div className="things-label" draggable="true">Attributes</div>
  // </div>
// </div>

class Things extends React.Component {
  render () {
    return (
      <div id="things">
        <Data/>
        <AttributeEditor/>
      </div>
    )
  }
}

module.exports = Things;