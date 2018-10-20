interface Product {
  id: string
  name: string
  year: number
  color: string
  pantone_value: string
}

interface ProductsState {
  readonly data: { [id: string]: Product }
  readonly searchTerm?: string
}

export { Product, ProductsState }
