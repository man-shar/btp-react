import React from 'react'
import { render } from 'react-dom'
import { connect } from 'react-redux'
import ShapeUtil from '../../Util/ShapeUtil'
import Util from '../../Util/Util'
import AttributeFlexRow from './AttributeFlexRow'

// Attributes are both dimensions and styles.
// Attributes of a particular Layer.

class LayerAttributeEditor extends React.Component {
  render () {
    const layerId = this.props.layerId
    const drawing = this.props.drawing
    const dimensionList = Util.allDimensions[drawing[layerId + '$type']]
    const styleList = Util.allStyles[drawing[layerId + '$type']]

    if (layerId) {
      return (
        <div className='AttributeFlexContainer'>
          {dimensionList.map((attribute, i) => {
            const attributeProperties = ShapeUtil.getLayerDimensionAllProperties(attribute, layerId, drawing)
            const attributeName = attributeProperties[attribute + '$name']
            const attributeValue = attributeProperties[attribute + '$value']
            const attributeExprString = attributeProperties[attribute + '$exprString']
            const isAttributeOwn = ShapeUtil.isLayerOwn(attribute, layerId, drawing)
            const inheritedFrom = isAttributeOwn ? layerId : 'overallAttributes'

            return (<AttributeFlexRow
              key={i}
              attributeIndex={i}
              attributeId={inheritedFrom + '$' + attribute}
              attributeName={attributeName}
              attributeValue={attributeValue}
              attributeExprString={attributeExprString}
              actionOccuredAtId={layerId}
              actionOccuredAt='layer'
              typeOfAttributeRecievingDrop='dimension'
              isAttributeOwn={isAttributeOwn}
                />)
          }
          )}
          {styleList.map((attribute, i) => {
            const attributeProperties = ShapeUtil.getLayerStyleAllProperties(attribute, layerId, drawing)
            const attributeName = attributeProperties[attribute + '$name']
            const attributeValue = attributeProperties[attribute + '$value']
            const attributeExprString = attributeProperties[attribute + '$exprString']
            const isAttributeOwn = ShapeUtil.isLayerOwn(attribute, layerId, drawing)
            const inheritedFrom = isAttributeOwn ? layerId : 'overallAttributes'

            return (
              <AttributeFlexRow
                key={i}
                attributeIndex={i}
                attributeId={inheritedFrom + '$' + attribute}
                attributeName={attributeName}
                attributeValue={attributeValue}
                attributeExprString={attributeExprString}
                actionOccuredAtId={layerId}
                actionOccuredAt='layer'
                typeOfAttributeRecievingDrop='dimension'
                isAttributeOwn={isAttributeOwn}
                />
            )
          }
          )}
        </div>
      )
    } else {
      return (<div />)
    }
  }
}

const mapStateToProps = state => {
  return {
    drawing: state.drawing
  }
}

LayerAttributeEditor = connect(mapStateToProps)(LayerAttributeEditor)

export default LayerAttributeEditor