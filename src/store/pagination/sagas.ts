import { put, takeEvery, select } from "redux-saga/effects"
import { getType, ActionType } from "typesafe-actions"
import { PaginatedData } from "./types"
import { ApplicationState } from "../"
import { PaginationActions } from "./actions"

export type GetPaginationState = (state: ApplicationState) => PaginatedData

export const createPaginationSagas = (
  actions: PaginationActions,
  maxCacheMs: number,
  getPaginationState: GetPaginationState
) => {
  function* requestPageSaga(action: ActionType<typeof actions.requestPage>) {
    const { page, itemsPerPage } = action.payload

    const { pagesMap }: PaginatedData = yield select(getPaginationState)
    const pageCache = pagesMap[page]
    if (!pageCache.lastFetched || Date.now() - pageCache.lastFetched > maxCacheMs) {
      yield put(actions.requestPageApi({ page, itemsPerPage }))
    }
  }

  return function* paginationSaga() {
    yield takeEvery(getType(actions.requestPage), requestPageSaga)
  }
}
