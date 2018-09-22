import { Store, createStore, applyMiddleware, combineReducers } from "redux"
import { composeWithDevTools } from "redux-devtools-extension"
import { createLogger } from "redux-logger"
import { productsReducer, ProductsState } from "./products"

export interface ApplicationState {
  products: ProductsState
}

export const rootReducer = combineReducers<ApplicationState>({
  products: productsReducer
})

const middlewares = [createLogger()]

const configureStore = (
  initialState?: ApplicationState
): Store<ApplicationState> => {
  const composeEnhancers = composeWithDevTools({})

  const store = createStore(
    rootReducer,
    initialState!,
    composeEnhancers(applyMiddleware(...middlewares))
  )

  return store
}

export default configureStore
