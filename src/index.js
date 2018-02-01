import React from 'react';
import {render} from 'react-dom';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import logger from 'redux-logger'
import manageActions from './Reducers/reducer';
import {startDrag} from './Actions/actions';

let store = createStore(
  manageActions,
  applyMiddleware(logger)
);

import Things from './Things/Things'
import Viz from './Viz/Viz'

class App extends React.Component {
  render () {
    return (
      <div>
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