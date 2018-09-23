import { createPaginatedDataReducer } from "./reducer"
import { GetPaginationState, createPaginationSagas } from "./sagas"

export const createPaginatedDataModule = (
  module: string,
  maxCacheMs: number,
  getPaginationState: GetPaginationState
) => {
  const { reducer, actions } = createPaginatedDataReducer(module)
  const saga = createPaginationSagas(module, maxCacheMs, getPaginationState)

  return { actions, reducer, saga }
}

export { RequestPageAction } from "./actions"
