import React from "react"
import ReactDOM from "react-dom"
import {Provider} from "react-redux"

// import "./index.css" // remove this for live deploy
import App from "./App"
import InstanceWrapper from './InstanceWrapper'
import configureStore from "./configureStore"

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
