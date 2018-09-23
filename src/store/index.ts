import { Store, createStore, applyMiddleware, combineReducers } from "redux"
import { composeWithDevTools } from "redux-devtools-extension"
import { createLogger } from "redux-logger"
import createSagaMiddleware from "redux-saga"
import { productsReducer, productsSaga, ProductsState } from "./products"

export interface ApplicationState {
  products: ProductsState
}

export const rootReducer = combineReducers<ApplicationState>({
  products: productsReducer
})

const sagaMiddleware = createSagaMiddleware()
const middlewares = [createLogger(), sagaMiddleware]

const configureStore = (initialState?: ApplicationState): Store<ApplicationState> => {
  const composeEnhancers = composeWithDevTools({})

  const store = createStore(
    rootReducer,
    initialState!,
    composeEnhancers(applyMiddleware(...middlewares))
  )

  sagaMiddleware.run(productsSaga)

  return store
}

export default configureStore
