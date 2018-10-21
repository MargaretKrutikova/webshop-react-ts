import { PaginatedData, PageCache, PagesMap } from "./types"
import { ActionType, getType } from "typesafe-actions"
import { PaginationActions } from "./actions"

const getInitialState = (itemsPerPage: number): PaginatedData => ({
  currentPage: 1,
  itemsPerPage,
  pagesMap: {},
  totalItems: 0
})

const getPageCacheInitialState = (): PageCache => ({
  error: undefined,
  ids: [],
  isLoading: false,
  lastFetched: undefined,
  page: 1
})

export const createPaginatedDataReducer = (
  actions: PaginationActions,
  initialItemsPerPage: number
) => {
  const { resetPage, ...pageActions } = actions
  const { requestPage, requestPageApi, setPageData, setPageError } = pageActions

  const updatePageCache = (
    cache = getPageCacheInitialState(),
    action: ActionType<typeof pageActions>
  ): PageCache => {
    switch (action.type) {
      case getType(requestPage):
      case getType(requestPageApi): {
        const { page } = (action as ActionType<typeof requestPage>).payload
        const isApiRequest = action.type === getType(requestPageApi)
        return { ...cache, page, isLoading: isApiRequest }
      }
      case getType(setPageData): {
        const { ids, fetchedAt } = (action as ActionType<typeof setPageData>).payload
        return { ...cache, isLoading: false, ids, lastFetched: fetchedAt }
      }
      case getType(setPageError): {
        const { error } = (action as ActionType<typeof setPageError>).payload
        return { ...cache, isLoading: false, error }
      }
      default:
        return cache
    }
  }

  const updatePagesMap = (
    state: PagesMap = {},
    action: ActionType<typeof pageActions>
  ): PagesMap => {
    const { page } = action.payload
    return { ...state, [page]: updatePageCache(state[page], action) }
  }

  const reducer = (
    state = getInitialState(initialItemsPerPage),
    action: ActionType<typeof actions>
  ): PaginatedData => {
    switch (action.type) {
      case getType(requestPage):
      case getType(requestPageApi): {
        const typedAction = action as ActionType<typeof requestPage>
        const { page, itemsPerPage } = typedAction.payload

        return {
          ...state,
          currentPage: page,
          itemsPerPage,
          pagesMap: updatePagesMap(state.pagesMap, typedAction)
        }
      }
      case getType(setPageData): {
        const typedAction = action as ActionType<typeof setPageData>
        const { totalItems } = typedAction.payload

        return {
          ...state,
          totalItems,
          pagesMap: updatePagesMap(state.pagesMap, typedAction)
        }
      }
      case getType(setPageError): {
        const typedAction = action as ActionType<typeof setPageError>
        return { ...state, pagesMap: updatePagesMap(state.pagesMap, typedAction) }
      }
      case getType(resetPage): {
        return {
          ...state,
          currentPage: 1,
          pagesMap: {},
          totalItems: 0
        }
      }
      default:
        return state
    }
  }
  return reducer
}
