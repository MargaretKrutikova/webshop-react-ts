import { createAction, createStandardAction } from "typesafe-actions"
import { User, UpdateUserRequest, ApiValidationError } from "./types"

const fetchUser = createAction("user/FETCH_USER")
const setUser = createStandardAction("user/SET_USER")<User>()
const setFetchUserError = createStandardAction("user/SET_FETCH_USER_ERROR")<
  string
>()

const updateUser = createStandardAction("user/UPDATE_USER")<UpdateUserRequest>()
const setUpdateUserError = createStandardAction("user/SET_UPDATE_USER_ERROR")<
  string
>()
const setUserValidationError = createStandardAction(
  "user/SET_USER_VALIDATION_ERROR"
)<ApiValidationError>()

const editUser = createAction("user/EDIT_USER")
const cancelEditUser = createAction("user/CANCEL_EDIT_USER")

export default {
  fetchUser,
  setFetchUserError,
  updateUser,
  setUpdateUserError,
  setUserValidationError,
  setUser,
  editUser,
  cancelEditUser
}
