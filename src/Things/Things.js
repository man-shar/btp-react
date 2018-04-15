import React from 'react'
import Data from './Data/Data'
import AttributeEditor from './AttributeEditor/AttributeEditor'
import Toolbar from './Toolbar/Toolbar'

class Things extends React.Component {
  togglePanel(e) {
    var el = e.nativeEvent.target;
    el.getElementsByTagName('svg')[0].classList.toggle("rotate-90");

    var attributesContainer = el.nextElementSibling;
    var parent = el.parentElement;

      if (parent.classList.contains("active")) {
        parent.classList.remove("active");
        attributesContainer.classList.add("hidden");
      } else {
        parent.classList.add("active");
        attributesContainer.classList.remove("hidden");
      }
    
    // if (panel.style.maxHeight){
    //   panel.style.maxHeight = null;
    // } else {
    //   panel.style.maxHeight = panel.scrollHeight + "px";
    // }
  }

  render() {
    return (
      <div id='things'>
        <Data togglePanel={this.togglePanel}/>
        <AttributeEditor togglePanel={this.togglePanel} activeOnly={false}/>
        <AttributeEditor togglePanel={this.togglePanel} activeOnly={true}/>
        <Toolbar />
      </div>
    )
  }
}

export default Things
