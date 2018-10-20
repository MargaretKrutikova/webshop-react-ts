interface PageCache {
  readonly page: number
  readonly isLoading: boolean
  readonly error?: Error
  readonly ids: string[] | number[]
  readonly lastFetched?: number
}

interface PagesMap {
  [key: number]: PageCache
}

interface PaginatedData {
  readonly currentPage: number
  readonly itemsPerPage: number
  readonly totalItems: number
  readonly pagesMap: PagesMap
}

export { PageCache, PaginatedData, PagesMap }
