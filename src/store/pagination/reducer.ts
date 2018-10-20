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
  const { requestPage, setPageData, setPageError, resetPage } = actions
  const pageActions = { requestPage, setPageData, setPageError }

  const updatePageCache = (
    cache = getPageCacheInitialState(),
    action: ActionType<typeof pageActions>
  ): PageCache => {
    switch (action.type) {
      case getType(requestPage): {
        const { page } = (action as ActionType<typeof requestPage>).payload
        return { ...cache, page, isLoading: true }
      }
      case getType(setPageData): {
        const { ids, fetchedAt } = (action as ActionType<typeof setPageData>).payload
        return { ...cache, ids, lastFetched: fetchedAt }
      }
      case getType(setPageError): {
        const { error } = (action as ActionType<typeof setPageError>).payload
        return { ...cache, error }
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
      case getType(requestPage): {
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
