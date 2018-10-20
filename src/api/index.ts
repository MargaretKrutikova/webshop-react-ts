import axios from "axios"
import { Product } from "store/products"

const API_ROOT = "https://reqres.in/api"

const request = axios.create({
  baseURL: API_ROOT
})

export type ProductsApiResponse = {
  page: number
  per_page: number
  total: number
  total_pages: number
  data: Product[]
}

const products = {
  getProducts: () => request.get<ProductsApiResponse>(`/products`).then(resp => resp.data.data),
  getProductsPaginated: (page: number, itemsPerPage: number): Promise<ProductsApiResponse> =>
    request
      .get<ProductsApiResponse>(`/products?page=${page}&per_page=${itemsPerPage}`)
      .then(resp => resp.data),
  searchProducts: (
    searchTerm: string,
    page: number,
    itemsPerPage: number
  ): Promise<ProductsApiResponse> =>
    request.get<ProductsApiResponse>(`/products?page=1&per_page=12`).then(resp => {
      const filtered = resp.data.data.filter(val => val.name.indexOf(searchTerm) > -1)
      const startInd = (page - 1) * itemsPerPage
      return {
        page,
        per_page: itemsPerPage,
        total: filtered.length,
        total_pages: 8,
        data: filtered.slice(startInd, startInd + itemsPerPage)
      }
    })
}

export default { products }
