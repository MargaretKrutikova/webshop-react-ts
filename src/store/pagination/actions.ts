import { createAction } from "typesafe-actions"
import { ActionCreator, StringType, PayloadCreator } from "typesafe-actions/dist/types"

interface RequestPageActionPayload {
  page: number
  itemsPerPage: number
}

interface SetPageDataActionPayload {
  ids: string[] | number[]
  totalItems: number
  page: number
  fetchedAt: number
}

interface SetPageErrorActionPayload {
  error: Error
  page: number
}

type RequestPage = PayloadCreator<StringType, RequestPageActionPayload>
type SetPageData = PayloadCreator<StringType, SetPageDataActionPayload>
type SetPageError = PayloadCreator<StringType, SetPageErrorActionPayload>
type ResetPage = ActionCreator

const createRequestPage = (type: StringType): RequestPage =>
  createAction(type, resolve => (payload: RequestPageActionPayload) => resolve(payload))

const createSetPageData = (type: StringType): SetPageData =>
  createAction(type, resolve => (payload: SetPageDataActionPayload) => resolve(payload))

const createSetPageError = (type: StringType): SetPageError =>
  createAction(type, resolve => (payload: SetPageErrorActionPayload) => resolve(payload))

const createResetPageError = (type: StringType): ResetPage => createAction(type)

type PaginationActions = {
  requestPage: RequestPage
  requestPageApi: RequestPage
  setPageData: SetPageData
  setPageError: SetPageError
  resetPage: ResetPage
}

const createPaginationActions = (
  requestPageType: string,
  requestPageApiType: string,
  setPageDataType: string,
  setPageErrorType: string,
  resetPageType: string
): PaginationActions => ({
  requestPage: createRequestPage(requestPageType),
  requestPageApi: createRequestPage(requestPageApiType),
  setPageData: createSetPageData(setPageDataType),
  setPageError: createSetPageError(setPageErrorType),
  resetPage: createResetPageError(resetPageType)
})

export { PaginationActions, createPaginationActions }
