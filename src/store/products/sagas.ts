import { call, put, takeLatest, takeEvery, fork, select, take, race } from "redux-saga/effects"
import { paginationActions } from "./actions"
import { ActionType, getType } from "typesafe-actions"
import api, { ProductsApiResponse } from "api"
import { createPaginationSagas } from "../pagination"
import actions from "./actions"
import { ApplicationState } from "../"

const cacheMs = 100000

function* requestApiPage(
  page: number,
  itemsPerPage: number,
  searchTerm?: string,
  resetPaginator?: boolean
) {
  try {
    const apiCall = searchTerm
      ? () => api.products.searchProducts(searchTerm, page, itemsPerPage)
      : () => api.products.getProductsPaginated(page, itemsPerPage)

    const response: ProductsApiResponse = yield call<Promise<ProductsApiResponse>>(apiCall)
    yield put(actions.updateProducts(response.data))

    const paginatedData = {
      ids: response.data.map(value => value.id),
      totalItems: response.total,
      fetchedAt: Date.now(),
      page
    }
    if (resetPaginator) {
      yield put(paginationActions.resetPage())
    }
    yield put(paginationActions.setPageData(paginatedData))
  } catch (err) {
    const error = err instanceof Error ? err : new Error("An unknown error occured.")
    yield put(paginationActions.setPageError({ error, page }))
  }
}

function* pagingSaga(searchTerm: string) {
  return yield takeEvery<ActionType<typeof paginationActions.requestPageApi>>(
    getType(paginationActions.requestPageApi),
    function*({ payload }) {
      const { page, itemsPerPage } = payload
      yield call<void, number, number, string>(requestApiPage, page, itemsPerPage, searchTerm)
    }
  )
}

export function* productsSaga() {
  const paginationSagas = createPaginationSagas(
    paginationActions,
    cacheMs,
    state => state.pagination.products
  )

  // start pagination saga
  yield fork(paginationSagas)
  let searchTerm: string = ""

  // search task
  yield takeLatest(getType(actions.searchProducts.request), function*(
    action: ActionType<typeof actions.searchProducts.request>
  ) {
    searchTerm = action.payload
    const itemsPerPage = yield select(
      (state: ApplicationState) => state.pagination.products.itemsPerPage
    )
    yield call<void, number, number, string, boolean>(
      requestApiPage,
      1,
      itemsPerPage,
      searchTerm,
      true
    )
  })

  while (true) {
    // paging task
    // const paging = yield fork(pagingSaga, searchTerm)

    // yield take(getType(pagination.actions.resetPaginator))

    // cancel all pending paging requests since they will return obsolete data
    // yield cancel(paging)

    // OR
    yield race({
      task: call(pagingSaga, searchTerm),
      cancel: take(getType(paginationActions.resetPage))
    })
  }
}

export default productsSaga
