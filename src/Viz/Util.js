import React from 'react';
import { render } from 'react-dom';
import { connect } from 'react-redux';

class Util extends React.Component {
}

const mapStateToProps = state => {
  return state;
}

Util = connect(mapStateToProps)(Util);

export default Util;