import React from "react"
import ReactDOM from "react-dom"
import {Provider} from "react-redux"

import App from "./App"
import InstanceWrapper from './InstanceWrapper'
import configureStore from "./configureStore"

if (process.env.NODE_ENV === 'development') {
  require("./index.css")
}
const store = configureStore()

ReactDOM.render(
  <Provider store={store}>
    <InstanceWrapper>
      <App />
    </InstanceWrapper>
  </Provider>,
  document.getElementById("root")
)

if (module.hot) {
  module.hot.accept('./App', () => {
    ReactDOM.render(
      <Provider store={store}>
        <InstanceWrapper>
          <App />
        </InstanceWrapper>
      </Provider>,
      document.getElementById('root')
    )
  })
}
