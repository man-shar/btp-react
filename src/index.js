import React from "react";
import { render } from "react-dom";
import { createStore, applyMiddleware } from "redux";
import { Provider } from "react-redux";
import logger from "redux-logger";
import thunkMiddleware from "redux-thunk";
import manageActions from "./Reducers/reducer";
import { startDrag } from "./Actions/actions";
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import { reduxBatch }  from '@manaflair/redux-batch';
import 'codemirror/lib/codemirror.css'
import "./styles/styles.css";
import "./styles/shapeStyles.css";

let store = createStore(
  manageActions,
  reduxBatch,
  applyMiddleware(thunkMiddleware, logger),
  reduxBatch
);

import Things from "./Things/Things";
import Viz from "./Viz/Viz";

class App extends React.Component {
  render() {
    return (
        <div id="main-container">
          <Viz />
          <Things />
        </div>
    );
  }
}

App = DragDropContext(HTML5Backend)(App)

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("app")
);
