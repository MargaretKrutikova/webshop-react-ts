export interface PageCache {
  readonly page: number
  readonly isLoading: boolean
  readonly error?: Error
  readonly ids: string[] | number[]
  readonly lastFetched?: number
}

export interface PaginatedData {
  readonly currentPage: number
  readonly itemsPerPage: number
  readonly totalItems: number
  readonly pagesMap: { [key: number]: PageCache }
}
