import { createPaginatedDataReducer } from "./reducer"
import { PaginatedDataItem } from "./types"
import { GetPaginationState, createPaginationSagas } from "./sagas"

export const createPaginatedDataModule = <T extends PaginatedDataItem>(
  module: string,
  maxCacheMs: number,
  getPaginationState: GetPaginationState<T>
) => {
  const { reducer, actions } = createPaginatedDataReducer<T>(module)
  const saga = createPaginationSagas(module, maxCacheMs, getPaginationState)

  return { actions, reducer, saga }
}

export { RequestPageAction } from "./actions"
