export interface Product {
  id: string
  name: string
  price: number
  categories: string[]
  image: string
}

export const enum ProductsActionTypes {
  FETCH_REQUEST = "@@products/FETCH_REQUEST",
  FETCH_SUCCESS = "@@products/FETCH_SUCCESS",
  FETCH_ERROR = "@@products/FETCH_ERROR"
}

export interface ProductsState {
  readonly data: Product[]
  readonly isLoading: boolean
  readonly error?: Error
}
