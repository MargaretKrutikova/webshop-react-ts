import { PaginatedDataItem } from "./types"
import { createAction } from "typesafe-actions"
import { Action } from "redux"

export interface RequestPageAction extends PaginationAction {
  payload: RequestPageActionPayload
}
interface PaginationAction extends Action {
  meta: PaginationActionMeta
}
interface PaginationActionMeta {
  module: string
}
interface RequestPageActionPayload {
  page: number
  itemsPerPage: number
}

interface RequestPageSuccessActionPayload<T extends PaginatedDataItem> {
  data: T[]
  totalItems: number
  page: number
  fetchedAt: number
}

export const requestPage = (module: string) =>
  createAction("REQUEST_PAGE", resolve => (page: number, itemsPerPage: number) =>
    resolve({ page, itemsPerPage }, { module })
  )
export const requestPageApi = (module: string) =>
  createAction("REQUEST_PAGE_API", resolve => (page: number, itemsPerPage: number) =>
    resolve({ page, itemsPerPage }, { module })
  )
const requestPageSuccess = <T extends PaginatedDataItem>(module: string) =>
  createAction("REQUEST_PAGE_SUCCESS", resolve => (data: RequestPageSuccessActionPayload<T>) =>
    resolve(data, { module })
  )
const requestPageError = (module: string) =>
  createAction("REQUEST_PAGE_ERROR", resolve => (error: Error, page: number) =>
    resolve({ error, page }, { module })
  )

export default <T extends PaginatedDataItem>(module: string) => ({
  requestPageApi: requestPageApi(module),
  requestPage: requestPage(module),
  requestPageSuccess: requestPageSuccess<T>(module),
  requestPageError: requestPageError(module)
})
