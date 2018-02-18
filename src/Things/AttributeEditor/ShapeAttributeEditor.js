import React from 'react'
import { render } from 'react-dom'
import { connect } from 'react-redux'
import ShapeUtil from '../../Util/ShapeUtil'
import AttributeFlexRow from './AttributeFlexRow'
import Util from '../../Util/Util'

// Attributes are both dimensions and styles.
// Attributes of a particular Shape.

class ShapeAttributeEditor extends React.Component {
  render () {
    const shapeId = this.props.shapeId
    const layerId = this.props.layerId
    const drawing = this.props.drawing
    const dimensionList = Util.allDimensions[drawing[shapeId + '$type']]
    const styleList = Util.allStyles[drawing[shapeId + '$type']]

    if (shapeId) {
      return (
        <div className='AttributeFlexContainer'>
          {dimensionList.map((attribute, i) => {
            const attributeProperties = ShapeUtil.getShapeDimensionAllProperties(attribute, shapeId, layerId, drawing)
            const attributeName = attributeProperties[attribute + '$name']
            const attributeValue = attributeProperties[attribute + '$value']
            const attributeExprString = attributeProperties[attribute + '$exprString']
            const isAttributeOwn = ShapeUtil.isShapeOwn(attribute, shapeId, drawing)
            const inheritedFrom = isAttributeOwn ? shapeId : (ShapeUtil.isLayerOwn(attribute, layerId, drawing) ? layerId : 'overallAttributes')

            return (<AttributeFlexRow
              key={i}
              attributeIndex={i}
              attributeId={inheritedFrom + '$' + attribute}
              attributeName={attributeName}
              attributeValue={attributeValue}
              attributeExprString={attributeExprString}
              actionOccuredAtId={shapeId}
              actionOccuredAt='shape'
              typeOfAttributeRecievingDrop='dimension'
              isAttributeOwn={isAttributeOwn}
                />)
          }
          )}
          {styleList.map((attribute, i) => {
            const attributeProperties = ShapeUtil.getShapeDimensionAllProperties(attribute, shapeId, layerId, drawing)

            const attributeName = attributeProperties[attribute + '$name']
            const attributeValue = attributeProperties[attribute + '$value']
            const attributeExprString = attributeProperties[attribute + '$exprString']
            const isAttributeOwn = ShapeUtil.isShapeOwn(attribute, shapeId, drawing)

            const inheritedFrom = isAttributeOwn ? shapeId : (ShapeUtil.isLayerOwn(attribute, layerId, drawing) ? layerId : 'overallAttributes')

            return (<AttributeFlexRow
              key={i}
              attributeIndex={i}
              attributeId={inheritedFrom + '$' + attribute}
              attributeName={attributeName}
              attributeValue={attributeValue}
              attributeExprString={attributeExprString}
              actionOccuredAtId={shapeId}
              actionOccuredAt='shape'
              typeOfAttributeRecievingDrop='style'
              isAttributeOwn={isAttributeOwn}
                />)
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

ShapeAttributeEditor = connect(mapStateToProps)(ShapeAttributeEditor)

export default ShapeAttributeEditor
