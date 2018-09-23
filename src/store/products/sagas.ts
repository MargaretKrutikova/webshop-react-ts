import { call, put, takeLatest, takeEvery, fork, select, take, cancel } from "redux-saga/effects"
import pagination from "./pagination"
import { isActionOf, ActionType, getType } from "typesafe-actions"
import { PaginationModule } from "./types"
import api, { ProductsApiResponse } from "api"
import { RequestPageAction } from "../pagination"
import actions from "./actions"
import { Action } from "redux"
import { ApplicationState } from "../"

function* requestApiPage(
  page: number,
  itemsPerPage: number,
  searchTerm?: string,
  resetPaginator?: boolean
) {
  try {
    const apiCall = searchTerm
      ? () => api.Products.searchProducts(searchTerm, page, itemsPerPage)
      : () => api.Products.getProductsPaginated(page, itemsPerPage)

    const response: ProductsApiResponse = yield call<Promise<ProductsApiResponse>>(apiCall)
    yield put(actions.updateProducts(response.data))

    const paginatedData = {
      ids: response.data.map(value => value.id),
      totalItems: response.total,
      fetchedAt: Date.now(),
      page
    }
    if (resetPaginator) {
      yield put(pagination.actions.resetPaginator())
    }
    yield put(pagination.actions.requestPageSuccess(paginatedData))
  } catch (err) {
    const error = err instanceof Error ? err : new Error("An unknown error occured.")
    yield put(pagination.actions.requestPageError(error, page))
  }
}

function* pagingSaga(searchTerm: string) {
  return yield takeEvery<RequestPageAction>(
    (action: Action) =>
      isActionOf(pagination.actions.requestPageApi, action) &&
      action.meta.module === PaginationModule,
    function*({ payload }) {
      const { page, itemsPerPage } = payload
      yield call<void, number, number, string>(requestApiPage, page, itemsPerPage, searchTerm)
    }
  )
}

export function* productsSaga() {
  // start pagination saga
  yield fork(pagination.saga)
  let searchTerm: string = ""

  // search task
  yield takeLatest(getType(actions.searchProducts.request), function*(
    action: ActionType<typeof actions.searchProducts.request>
  ) {
    searchTerm = action.payload
    const itemsPerPage = yield select(
      (state: ApplicationState) => state.products.pagination.itemsPerPage
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
    const paging = yield fork(pagingSaga, searchTerm)

    yield take(getType(pagination.actions.resetPaginator))
    yield cancel(paging)
  }
}

export default productsSaga
