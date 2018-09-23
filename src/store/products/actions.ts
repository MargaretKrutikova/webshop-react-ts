import { ProductsActionTypes, Product } from "./types"
import { ActionType, createAsyncAction, createAction } from "typesafe-actions"

const searchProducts = createAsyncAction(
  ProductsActionTypes.SEARCH_REQUEST,
  ProductsActionTypes.SEARCH_REQUEST_SUCCESS,
  ProductsActionTypes.SEARCH_REQUEST_ERROR
)<string, void, Error>()

const updateProducts = createAction(
  ProductsActionTypes.PRODUCTS_DATA_UPDATE,
  resolve => (data: Product[]) => resolve(data)
)

const actions = {
  searchProducts,
  updateProducts
}
export type ProductsAction = ActionType<typeof actions>
export default actions
