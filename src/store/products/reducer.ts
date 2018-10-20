import { ProductsState } from "./types"
import { ActionType, getType } from "typesafe-actions"
import { createPaginatedDataReducer } from "store/pagination"
import actions, { paginationActions } from "./actions"

const initialItemsPerPage = 3

const initialState: ProductsState = {
  data: {}
}

const reducer = (state = initialState, action: ActionType<typeof actions>): ProductsState => {
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

const paginationReducer = createPaginatedDataReducer(paginationActions, initialItemsPerPage)

export { initialItemsPerPage, paginationReducer }
export default reducer
