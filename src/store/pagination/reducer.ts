import { PaginatedData, PageCache } from "./types"
import { ActionType, getType } from "typesafe-actions"
import createPaginationActions from "./actions"

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

export const createPaginatedDataReducer = (module: string, initialItemsPerPage: number) => {
  const initialState = getInitialState(initialItemsPerPage)

  const actions = createPaginationActions(module)
  type PagingActionType = ActionType<typeof actions>

  const pageCacheReducer = (
    cache = getPageCacheInitialState(),
    action: PagingActionType
  ): PageCache => {
    switch (action.type) {
      case getType(actions.requestPage): {
        const { page } = action.payload
        return { ...cache, page, isLoading: true }
      }
      case getType(actions.requestPageSuccess): {
        const { ids, fetchedAt } = action.payload
        return { ...cache, ids, lastFetched: fetchedAt }
      }
      case getType(actions.requestPageError): {
        const { error } = action.payload
        return { ...cache, error }
      }
      default:
        return cache
    }
  }

  const pagesMapReducer = (state: typeof initialState.pagesMap = {}, action: PagingActionType) => {
    const { page } = action.payload
    return { ...state, [page]: pageCacheReducer(state[page], action) }
  }

  const reducer = (state = initialState, action: PagingActionType): PaginatedData => {
    if (action.meta && action.meta.module !== module) {
      return state
    }
    switch (action.type) {
      case getType(actions.requestPage): {
        const { page, itemsPerPage } = action.payload
        return {
          ...state,
          currentPage: page,
          itemsPerPage,
          pagesMap: pagesMapReducer(state.pagesMap, action)
        }
      }
      case getType(actions.requestPageSuccess): {
        const { totalItems } = action.payload

        return {
          ...state,
          totalItems,
          pagesMap: pagesMapReducer(state.pagesMap, action)
        }
      }
      case getType(actions.requestPageError): {
        return { ...state, pagesMap: pagesMapReducer(state.pagesMap, action) }
      }
      case getType(actions.resetPaginator): {
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

  return { reducer, actions }
}
