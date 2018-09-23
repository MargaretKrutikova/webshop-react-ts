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

interface RequestPageSuccessActionPayload {
  ids: string[] | number[]
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
export const resetPaginator = (module: string) =>
  createAction("RESET_PAGINATOR", resolve => () => resolve({ page: 1 }, { module }))

const requestPageSuccess = (module: string) =>
  createAction("REQUEST_PAGE_SUCCESS", resolve => (data: RequestPageSuccessActionPayload) =>
    resolve(data, { module })
  )
const requestPageError = (module: string) =>
  createAction("REQUEST_PAGE_ERROR", resolve => (error: Error, page: number) =>
    resolve({ error, page }, { module })
  )

export default (module: string) => ({
  requestPageApi: requestPageApi(module),
  requestPage: requestPage(module),
  requestPageSuccess: requestPageSuccess(module),
  requestPageError: requestPageError(module),
  resetPaginator: resetPaginator(module)
})
