import productsActions from "./actions"
import pagination from "./pagination"

export const actions = {
  search: productsActions.searchProducts.request,
  goToPage: pagination.actions.requestPage
}
export { Product, ProductsState } from "./types"
export { default as productsReducer, selectors } from "./reducer"

export { default as productsSaga } from "./sagas"
