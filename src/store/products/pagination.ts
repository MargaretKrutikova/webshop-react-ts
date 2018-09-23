import { PaginationModule } from "./types"
import { createPaginatedDataModule } from "../pagination"

const cacheMs = 100000
const initialItemsPerPage = 3

export default createPaginatedDataModule(
  PaginationModule,
  cacheMs,
  initialItemsPerPage,
  state => state.products.pagination
)
