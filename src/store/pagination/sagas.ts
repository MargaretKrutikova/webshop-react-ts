import { put, takeEvery, select } from "redux-saga/effects"
import { SagaIterator } from "redux-saga"
import { isActionOf } from "typesafe-actions"
import { Action } from "redux"
import { PaginatedData, PaginatedDataItem } from "./types"
import { ApplicationState } from "../"
import { RequestPageAction, requestPage, requestPageApi } from "./actions"

export type GetPaginationState<T extends PaginatedDataItem> = (
  state: ApplicationState
) => PaginatedData<T>

export const createPaginationSagas = <T extends PaginatedDataItem>(
  module: string,
  maxCacheMs: number,
  getPaginationState: GetPaginationState<T>
) => {
  const requestPageActionCreator = requestPage(module)
  const requestPageApiActionCreator = requestPageApi(module)

  function* requestPageSaga(action: RequestPageAction) {
    const { page, itemsPerPage } = action.payload

    const { pagesMap }: PaginatedData<T> = yield select(getPaginationState)
    const pageCache = pagesMap[page]
    if (!pageCache.lastFetched || Date.now() - pageCache.lastFetched > maxCacheMs) {
      yield put(requestPageApiActionCreator(page, itemsPerPage))
    }
  }

  return function* paginationSaga(): SagaIterator {
    yield takeEvery((action: Action) => {
      return isActionOf(requestPageActionCreator, action) && action.meta.module === module
    }, requestPageSaga)
  }
}
