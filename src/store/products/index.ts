import productsActions, { paginationActions } from "./actions"

const actions = {
  search: productsActions.searchProducts.request,
  goToPage: (page: number, itemsPerPage: number) =>
    paginationActions.requestPage({ page, itemsPerPage })
}
export { Product, ProductsState } from "./types"
export {
  default as productsReducer,
  paginationReducer as productsPaginationReducer
} from "./reducer"
export { default as productsSelectors } from "./selectors"

export { paginationActions as productsPaginationActions, actions as productsActions }
export { default as productsSaga } from "./sagas"
