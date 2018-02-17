import React from 'react'
import { render } from 'react-dom'
import Data from './Data/Data'
import AttributeEditor from './AttributeEditor/AttributeEditor'

class Things extends React.Component {
  render () {
    return (
      <div id='things'>
        <Data />
        <AttributeEditor />
      </div>
    )
  }
}

export default Things
