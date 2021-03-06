import * as React from "react"
import "./App.css"
import { Store } from "redux"
import logo from "./logo.svg"
import { Provider } from "react-redux"
import ProductListing from "../ProductListing"

type Props = {
  store: Store
}

const App: React.SFC<Props> = props => {
  const { store } = props
  return (
    <Provider store={store}>
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>

        <p className="App-intro">
          To get started, edit <code>src/App.tsx</code> and save to reload.
        </p>
        <ProductListing />
      </div>
    </Provider>
  )
}

export default App
