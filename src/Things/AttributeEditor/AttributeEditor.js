import React from "react";
import { connect } from "react-redux";
import OverallAttributeEditor from "./OverallAttributeEditor";
import LayerAttributeEditor from "./LayerAttributeEditor";
import ShapeAttributeEditor from "./ShapeAttributeEditor";

// Attributes are both dimensions and styles.

class AttributeEditor extends React.Component {
  componentDidMount() {
    console.log("mounted");
    try {
      document.getElementById('layer-attributes-tab-input').checked = true;
      console.log('layer-attributes-tab-input');
    } catch(e) {

    }
    // document.getElementById('layer-attributes-tab-input').checked = false;
    try {
      document.getElementById('shape-attributes-tab-input').checked = true;
      document.getElementById('shape-attributes-tab-input').checked = false;
    } catch(e) {

    }
    try {
      document.getElementById('default-attributes-tab-input').checked = true;
      debugger;
      console.log('default-attributes-tab-input');
    } catch(e) {

    }
    // document.getElementById('default-attributes-tab-input').checked = false;
    try {
      document.getElementById('artboard-tree-tab-input').checked = true;
      document.getElementById('artboard-tree-tab-input').checked = false;
    } catch(e) {

    }
  }

  render() {
    const { activeLayerId, activeShapeId, drawing, activeOnly, togglePanel } = this.props;

    return (
      <div className="attribute-editor panel pad-bot active">
        <div
          className="things-label accordion"
          onClick={togglePanel.bind(this)}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="panel-collapse-svg relative dib pen relative v-top rotate-90"><polyline points="10 18 16 12 10 6"></polyline></svg>
          {
            (activeOnly) ? "Active Items" : "Artboard Outline"
          }
        </div>
        <div>
          <div className="attribute-container">
            {
              // check if this is for entire outline or just the active layer+shape
              (activeOnly) ? (
                  (!activeLayerId) ? (
                      null
                    ) : (
                      <div>
                        <input id="layer-attributes-tab-input" type="radio" name="activeOnly-tabs"></input>
                        <label htmlFor="layer-attributes-tab-input">Layer</label>
                          
                        <input id="shape-attributes-tab-input" type="radio" name="activeOnly-tabs"></input>
                        <label htmlFor="shape-attributes-tab-input">Shape</label>
                        <section id="layer-attributes-tab">
                          <LayerAttributeEditor layerId={activeLayerId} ownOnly={false}/>
                        </section>
                        <section id="shape-attributes-tab">
                          <ShapeAttributeEditor shapeId={activeShapeId} layerId={activeLayerId} ownOnly={false}/>
                        </section>
                      </div>
                    )
                ) : (
                  // if this is the entire outline
                  <div>
                    <input id="default-attributes-tab-input" type="radio" name="nonActiveOnly-tabs"></input>
                    <label htmlFor="default-attributes-tab-input">Default Attributes</label>
                      
                    <input id="artboard-tree-tab-input" type="radio" name="nonActiveOnly-tabs"></input>
                    <label htmlFor="artboard-tree-tab-input">Artboard</label>
                    <section id="default-attributes-tab">
                      <OverallAttributeEditor />
                    </section>
                    <section id="artboard-tree-tab">
                      <LayerAttributeEditor layerId={activeLayerId} ownOnly={true}/>
                      <ShapeAttributeEditor shapeId={activeShapeId} layerId={activeLayerId} ownOnly={true}/>
                    </section>
                  </div>
                )
              }
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    activeLayerId: state["drawing"]["activeLayerId"],
    activeShapeId: state["drawing"]["activeShapeId"],
    drawing: state["drawing"]
  };
};

AttributeEditor = connect(mapStateToProps)(AttributeEditor);

export default AttributeEditor;
