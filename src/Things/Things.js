import React from 'react'
import Data from './Data/Data'
import AttributeEditor from './AttributeEditor/AttributeEditor'
import Toolbar from './Toolbar/Toolbar'

class Things extends React.Component {
  togglePanel(e) {
    var el = e.nativeEvent.target;
    el.classList.toggle("active-panel");
    el.getElementsByTagName('svg')[0].classList.toggle("rotate-90");

    /* Toggle between hiding and showing the active panel */
    var panel = el.nextElementSibling;
    if (panel.style.maxHeight){
      panel.style.maxHeight = null;
    } else {
      panel.style.maxHeight = panel.scrollHeight + "px";
    }
  }

  render () {
    return (
      <div id='things'>
        <Data togglePanel={this.togglePanel}/>
        <AttributeEditor togglePanel={this.togglePanel}/>
        <Toolbar />
      </div>
    )
  }
}

export default Things
