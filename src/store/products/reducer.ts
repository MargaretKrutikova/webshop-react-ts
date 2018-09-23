import { ProductsState, InnerProductsState, Product } from "./types"
import { getType } from "typesafe-actions"
import { ApplicationState } from "../"
import actions, { ProductsAction } from "./actions"
import pagination from "./pagination"
import { combineReducers, Reducer } from "redux"

const initialState: InnerProductsState = {
  data: {}
}

const productsReducer = (state = initialState, action: ProductsAction): InnerProductsState => {
  switch (action.type) {
    case getType(actions.searchProducts.request): {
      return { ...state, searchTerm: action.payload }
    }
    case getType(actions.updateProducts): {
      const dataMap = action.payload.reduce((acc, value) => ({ ...acc, [value.id]: value }), {})
      return {
        ...state,
        data: { ...state.data, ...dataMap }
      }
    }
    case getType(actions.searchProducts.failure): {
      return { ...state }
    }
    default:
      return state
  }
}
const getProductList = (state: ApplicationState) => state.products.inner.data

const getCurrentPageItems = (state: ApplicationState): Product[] => {
  const { data } = state.products.inner
  const { pagesMap, currentPage } = state.products.pagination
  if (!pagesMap[currentPage]) {
    return []
  }
  const ids = pagesMap[currentPage].ids as string[]
  return ids.map(id => data[id.toString()])
}

const getCurrentPage = (state: ApplicationState): number => {
  return state.products.pagination.currentPage
}

const reducer: Reducer<ProductsState> = combineReducers({
  pagination: pagination.reducer,
  inner: productsReducer
})

export const selectors = { getProductList, getCurrentPageItems, getCurrentPage }
export default reducer
