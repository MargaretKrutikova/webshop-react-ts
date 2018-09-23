export interface PaginatedDataItem<T = string | number> {
  id: T
}

interface PageContainer<T> {
  readonly page: number
  readonly isLoading: boolean
  readonly error?: Error
  readonly ids: T[]
  readonly lastFetched?: number
}

export type PageCache<T extends PaginatedDataItem<R>, R = string | number> = PageContainer<R>

export interface PaginatedData<T extends PaginatedDataItem> {
  readonly data: { [key: number]: T } | { [key: string]: T }
  readonly currentPage: number
  readonly itemsPerPage: number
  readonly totalItems: number
  readonly pagesMap: { [key: number]: PageCache<T> }
}
