import { PaginatedData } from "../pagination/types"

export interface Product {
  id: string
  name: string
  year: number
  color: string
  pantone_value: string
}

export const enum ProductsActionTypes {
  PRODUCTS_DATA_UPDATE = "@@products/PRODUCTS_DATA_UPDATE",
  SEARCH_REQUEST = "@@products/SEARCH_REQUEST",
  SEARCH_REQUEST_SUCCESS = "@@products/SEARCH_REQUEST_SUCCESS",
  SEARCH_REQUEST_ERROR = "@@products/SEARCH_REQUEST_ERROR",
  SEARCH_CHANGE = "@@products/SEARCH_CHANGE"
}

export interface InnerProductsState {
  readonly data: { [id: string]: Product }
  readonly searchTerm?: string
}

export const PaginationModule = "@@products"

export interface ProductsState {
  readonly inner: InnerProductsState
  readonly pagination: PaginatedData
}
