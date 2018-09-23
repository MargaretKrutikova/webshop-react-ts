import { PaginatedData, PaginatedDataItem, PageCache } from "./types"
import { ActionType, getType } from "typesafe-actions"
import createPaginationActions from "./actions"

const getInitialState = <T extends PaginatedDataItem>(): PaginatedData<T> => ({
  currentPage: 1,
  data: {},
  itemsPerPage: 10,
  pagesMap: {},
  totalItems: 0
})

const getPageCacheInitialState = <T extends PaginatedDataItem>(): PageCache<T> => ({
  error: undefined,
  ids: [],
  isLoading: false,
  lastFetched: undefined,
  page: 1
})

export const createPaginatedDataReducer = <T extends PaginatedDataItem>(module: string) => {
  const initialState = getInitialState<T>()

  const actions = createPaginationActions<T>(module)
  type PagingActionType = ActionType<typeof actions>

  const pageCacheReducer = (
    cache = getPageCacheInitialState<T>(),
    action: PagingActionType
  ): PageCache<T> => {
    switch (action.type) {
      case getType(actions.requestPage): {
        const { page } = action.payload
        return { ...cache, page, isLoading: true }
      }
      case getType(actions.requestPageSuccess): {
        const { data, fetchedAt } = action.payload
        return { ...cache, ids: data.map(value => value.id), lastFetched: fetchedAt }
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

  const reducer = (state = initialState, action: PagingActionType): PaginatedData<T> => {
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
        const { data, totalItems } = action.payload
        const dataMap = data.reduce((acc, value) => ({ ...acc, [value.id]: value }), {})

        return {
          ...state,
          data: { ...state.data, ...dataMap },
          totalItems,
          pagesMap: pagesMapReducer(state.pagesMap, action)
        }
      }
      case getType(actions.requestPageError): {
        return { ...state, pagesMap: pagesMapReducer(state.pagesMap, action) }
      }
      default:
        return state
    }
  }

  return { reducer, actions }
}
