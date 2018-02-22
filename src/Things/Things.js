import React from 'react'
import { render } from 'react-dom'
import Data from './Data/Data'
import AttributeEditor from './AttributeEditor/AttributeEditor'
import Toolbar from './Toolbar/Toolbar'

class Things extends React.Component {
  render () {
    return (
      <div id='things'>
        <Data />
        <AttributeEditor />
        <Toolbar />
      </div>
    )
  }
}

export default Things
