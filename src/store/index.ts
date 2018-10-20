import { Store, createStore, applyMiddleware, combineReducers } from "redux"
import { composeWithDevTools } from "redux-devtools-extension"
import { createLogger } from "redux-logger"
import createSagaMiddleware from "redux-saga"
import { productsReducer, productsSaga, ProductsState, productsPaginationReducer } from "./products"
import { PaginatedData } from "./pagination"

interface PaginationState {
  products: PaginatedData
}

export interface ApplicationState {
  products: ProductsState
  pagination: PaginationState
}

const paginationReducer = combineReducers<PaginationState>({
  products: productsPaginationReducer
})

export const rootReducer = combineReducers<ApplicationState>({
  products: productsReducer,
  pagination: paginationReducer
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
