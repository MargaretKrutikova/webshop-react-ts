import { Product } from "./types"
import { ApplicationState } from "store"

const getProductList = (state: ApplicationState) => state.products.data

const getCurrentPageItems = (state: ApplicationState): Product[] => {
  const { data } = state.products
  const { pagesMap, currentPage } = state.pagination.products
  if (!pagesMap[currentPage]) {
    return []
  }
  const ids = pagesMap[currentPage].ids as string[]
  return ids.map(id => data[id.toString()])
}

const getCurrentPage = (state: ApplicationState): number => {
  return state.pagination.products.currentPage
}

export default { getProductList, getCurrentPageItems, getCurrentPage }
