import React from 'react';
import { render } from 'react-dom';
import { connect } from 'react-redux';
import Chart from './Chart'

class Viz extends React.Component {
  constructor(props) {
    super(props);
  }

  render () {
    return (
      <Chart/>
    );
  }
}

module.exports = Viz;