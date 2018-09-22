import { Reducer } from "redux"
import { ProductsState, ProductsActionTypes, Product } from "./types"
import { ActionType, createAsyncAction, getType } from "typesafe-actions"
import { ApplicationState } from "../"

const initialState: ProductsState = {
  data: [],
  isLoading: false
}

const fetchProducts = createAsyncAction(
  ProductsActionTypes.FETCH_REQUEST,
  ProductsActionTypes.FETCH_SUCCESS,
  ProductsActionTypes.FETCH_ERROR
)<void, Product[], Error>()

type ProductsAction = ActionType<typeof fetchProducts>

const reducer: Reducer<ProductsState, ProductsAction> = (
  state = initialState,
  action
) => {
  switch (action.type) {
    case getType(fetchProducts.request): {
      return { ...state, isLoading: true, error: undefined }
    }
    case getType(fetchProducts.success): {
      return {
        ...state,
        isLoading: false,
        error: undefined,
        data: action.payload
      }
    }
    case getType(fetchProducts.failure): {
      return { ...state, isLoading: false, error: action.payload }
    }
    default:
      return state
  }
}

const getProductList = (state: ApplicationState) => state.products.data

export const actions = {
  requestProducts: fetchProducts.request
}
export const selectors = {
  getProductList
}
export default reducer
