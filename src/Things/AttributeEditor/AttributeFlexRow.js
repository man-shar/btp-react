  import React from 'react'
  import { render } from 'react-dom'
  import ShapeUtil from '../../Util/ShapeUtil'
  import AttributeFlexName from './AttributeFlexName'
  import AttributeFlexExpressionEditable from './AttributeFlexExpressionEditable'
  import AttributeFlexValue from './AttributeFlexValue'

// single row for an attribute.

  class AttributeFlexRow extends React.Component {
    render () {
      const attribute = this.props.attribute
      const attributeId = this.props.attributeId
      const attributeValue = this.props.attributeValue
      const attributeName = this.props.attributeName
      const attributeExprString = this.props.attributeExprString
      const actionOccuredAt = this.props.actionOccuredAt
      const actionOccuredAtId = this.props.actionOccuredAtId
      const typeOfAttributeRecievingDrop = this.props.typeOfAttributeRecievingDrop
      const isAttributeOwn = this.props.isAttributeOwn

    // passing this down because I have to edit own attributes and remove elements from own/inherited attributes.
      const attributeIndex = this.props.attributeIndex

    // check if attribute's value is not a pure number.
      return (
        <div className={'AttributeFlexRow' + (isAttributeOwn ? '' : ' inherited-attribute')} id={attributeId}>
          <AttributeFlexName attributeIndex={attributeIndex} actionOccuredAtId={actionOccuredAtId} attributeId={attributeId} attributeName={attributeName} actionOccuredAt={actionOccuredAt} />
          <div className='AttributeFlexExpression'>
            <AttributeFlexExpressionEditable attributeIndex={attributeIndex} typeOfAttributeRecievingDrop={typeOfAttributeRecievingDrop} actionOccuredAtId={actionOccuredAtId} attributeId={attributeId} attributeExprString={attributeExprString} actionOccuredAt={actionOccuredAt} />
            <AttributeFlexValue attributeIndex={attributeIndex} actionOccuredAtId={actionOccuredAtId} attributeId={attributeId} attributeValue={attributeValue} actionOccuredAt={actionOccuredAt} />
          </div>
        </div>
      )
    }
}

  export default AttributeFlexRow
