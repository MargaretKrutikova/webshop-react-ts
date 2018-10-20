import { Product } from "./types"
import { createAsyncAction, createAction } from "typesafe-actions"
import { createPaginationActions } from "store/pagination"

const searchProducts = createAsyncAction(
  "@@products/SEARCH_REQUEST",
  "@@products/SEARCH_REQUEST_SUCCESS",
  "@@products/SEARCH_REQUEST_ERROR"
)<string, void, Error>()

const updateProducts = createAction(
  "@@products/PRODUCTS_DATA_UPDATE",
  resolve => (data: Product[]) => resolve(data)
)

const paginationActions = createPaginationActions(
  "@@products/REQUEST_PAGE",
  "@@products/REQUEST_API_PAGE",
  "@@products/SET_PAGE_DATA",
  "@@products/SET_PAGE_ERROR",
  "@@products/RESET_PAGE"
)

export { paginationActions }
export default {
  searchProducts,
  updateProducts
}
