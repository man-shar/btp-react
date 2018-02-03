import React from 'react';
import {render} from 'react-dom';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import logger from 'redux-logger'
import thunkMiddleware from 'redux-thunk'
import manageActions from './Reducers/reducer';
import {startDrag} from './Actions/actions';
import "./styles/styles.css";
import "./styles/shapeStyles.css";

let store = createStore(
  manageActions,
  applyMiddleware(
    thunkMiddleware,
    logger
  )
);

import Things from './Things/Things'
import Viz from './Viz/Viz'

class App extends React.Component {
  render () {
    return (
      <div id="main-container">
        <Viz/>
        <Things/>
      </div>
    )
  }
}

render(
  <Provider store={store}>
    <App/>
  </Provider>,
  document.getElementById('app')
);