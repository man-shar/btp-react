import React from 'react';
import { render } from 'react-dom';
import { AttributeFlexRow } from './AttributeFlexRow'

class AttributeFlexContainer extends React.Component {
  render() {
    const attributes = Object.keys(this.props.attributes);

    return (
      <div>
      {attributes.map((attribute, i) => {
        <AttributeFlexRow key={i} attribute={attribute} value={}/>
      })
      }        
      </div>
      }
    );
  }
}

export default AttributeFlexContainer;