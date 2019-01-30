import { getType, ActionType } from "typesafe-actions"
// import { sessionActions } from "store/session"
import { ApiValidationError, User } from "./types"

import actions from "./actions"
import { ActionCreator } from "typesafe-actions/dist/types"

// 1.
type InitialState = {
  data: null
  status: Status.EMPTY
}
// 2.
type InitialFetchingState = {
  data: null
  status: Status.FETCHING
}
// 3.
type InitialFetchingErrorState = {
  data: null
  error: string
  status: Status.FETCHING_API_ERROR
}
// 4.
type FetchingSuccessState = {
  data: User
  status: Status.READY
}
// 5.
type ReFetchingState = {
  data: User
  status: Status.FETCHING
}
// 6.
type ReFetchingStateError = {
  data: User
  status: Status.FETCHING_API_ERROR
}
// 7.
type EditingState = {
  data: User
  status: Status.EDITING
}

// 8.
type SavingState = {
  data: User
  status: Status.UPDATING
}

// 9.
type SavingApiErrorState = {
  data: User
  error: string
  status: Status.UPDATING_API_ERROR
}

// 10.
type SavingValidationErrorState = {
  data: User
  validationError: ApiValidationError
  status: Status.UPDATING_VALIDATION_ERRROR
}

type UserState = {
  data: User | null
} & (SuccessState | ApiErrorState | ValidationErrorState)

type ErrorStatus =
  | Status.FETCHING_API_ERROR
  | Status.UPDATING_API_ERROR
  | Status.UPDATING_VALIDATION_ERRROR

type SuccessState = {
  error: null
  status: Exclude<Status, ErrorStatus>
}

type ApiErrorState = {
  error: string
  status: Status.FETCHING_API_ERROR | Status.UPDATING_API_ERROR
}

type ValidationErrorState = {
  error: ApiValidationError
  status: Status.UPDATING_VALIDATION_ERRROR
}

export enum Status {
  EMPTY = "EMPTY",
  FETCHING = "FETCHING",
  FETCHING_API_ERROR = "FETCHING_API_ERROR",
  READY = "READY",
  EDITING = "EDITING",
  UPDATING = "UPDATING",
  UPDATING_API_ERROR = "UPDATING_API_ERROR",
  UPDATING_VALIDATION_ERRROR = "UPDATING_VALIDATION_ERRROR"
}

// export enum ReadonlyStatus {
//   EMPTY = "EMPTY",
//   FETCHING = "FETCHING",
//   FETCHING_API_ERROR = "FETCHING_API_ERROR",
//   READY = "READY",
// }

// export enum EditingStatus {
//   READY = "READY",
//   UPDATING = "UPDATING",
//   UPDATING_API_ERROR = "UPDATING_API_ERROR",
//   UPDATING_VALIDATION_ERRROR = "UPDATING_VALIDATION_ERRROR"
// }

type UserActionTypes = ActionType<typeof actions>["type"]

type DiscriminateUnion<T, K extends keyof T, V extends T[K]> = T extends Record<K, V> ? T : never

type MapDiscriminatedUnion<T extends Record<K, string>, K extends keyof T> = {
  [V in T[K]]: DiscriminateUnion<T, K, V>
}

type CallStatus = "Success" | "Error"

type MapCallStatus = {
  [k in CallStatus]?: {
    call: (t: number) => number
  }
}

const testX: MapCallStatus = {
  ["Success"]: {
    call: t => t
  }
}

type WhatIWant = MapDiscriminatedUnion<ActionType<typeof actions>, "type">

type UserStateMachineTransition = {
  [K in UserActionTypes]?:
    | {
        state: Status
        extend: (state: UserState, action: WhatIWant[K]) => void
      }
    | Status
}

type UserActionType = "USER_LOGIN"
type UserActionMap = {
  USER_LOGIN: {
    resolve: (str: string) => string
    x?: string
  }
}

const getActionType = (): UserActionType => "USER_LOGIN"
const userActionMap: UserActionMap = {
  [getActionType()]: {
    resolve: (str: string) => str
  }
}

type Test = Partial<UserStateMachineTransition>

type OnlyStringKeyProps<T> = Pick<T, Extract<keyof T, string>>
type ExtractKeyValues<T, V> = { readonly [P in keyof OnlyStringKeyProps<T>]: V }

type UserStateMachine = { [k in Status]: Test }

type Y = WhatIWant[ActionType<typeof actions.setUser>["type"]]

const userDetailsMachine: UserStateMachine = {
  [Status.EMPTY]: {
    [getType(actions.fetchUser)]: Status.FETCHING
  },
  [Status.FETCHING]: {
    ["user/SET_USER"]: {
      state: Status.READY,
      extend: (state, action) => ({
        ...state,
        data: action.payload
      })
    },
    [getType(actions.setFetchUserError)]: Status.FETCHING_API_ERROR
  },
  [Status.FETCHING_API_ERROR]: {
    [getType(actions.fetchUser)]: Status.FETCHING
  },
  [Status.READY]: {
    [getType(actions.fetchUser)]: Status.FETCHING,
    [getType(actions.editUser)]: Status.EDITING
  },
  [Status.EDITING]: {
    [getType(actions.updateUser)]: Status.UPDATING,
    [getType(actions.fetchUser)]: Status.FETCHING,
    [getType(actions.cancelEditUser)]: Status.READY
  },
  [Status.UPDATING]: {
    [getType(actions.setUser)]: Status.READY,
    [getType(actions.setFetchUserError)]: Status.UPDATING_API_ERROR,
    [getType(actions.setUserValidationError)]: Status.UPDATING_VALIDATION_ERRROR
  },
  [Status.UPDATING_API_ERROR]: {
    [getType(actions.cancelEditUser)]: Status.READY,
    [getType(actions.updateUser)]: Status.UPDATING
  },
  [Status.UPDATING_VALIDATION_ERRROR]: {
    [getType(actions.cancelEditUser)]: Status.READY,
    [getType(actions.updateUser)]: Status.UPDATING
  }
}

const userReducer = (
  state: UserState = {
    status: Status.EMPTY,
    data: null,
    error: null
  },
  action: ActionType<typeof actions> // | ActionType<typeof sessionActions.logout>
): UserState => {
  switch (action.type) {
    case getType(actions.fetchUser):
      return { ...state, error: null, status: Status.FETCHING }

    case getType(actions.setFetchUserError):
      return {
        ...state,
        error: action.payload,
        status: Status.FETCHING_API_ERROR
      }
    case getType(actions.updateUser):
      return { ...state, error: null, status: Status.UPDATING }

    case getType(actions.setUpdateUserError):
      return {
        ...state,
        error: action.payload,
        status: Status.UPDATING_API_ERROR
      }

    case getType(actions.setUserValidationError):
      return {
        ...state,
        error: action.payload,
        status: Status.UPDATING_VALIDATION_ERRROR
      }

    case getType(actions.setUser):
      return {
        ...state,
        error: null,
        status: Status.READY,
        data: action.payload
      }

    // case getType(sessionActions.logout):
    //   return {
    //     ...state,
    //     error: null,
    //     status: Status.EMPTY,
    //     data: null
    //   }

    case getType(actions.editUser):
      return { ...state, error: null, status: Status.EDITING }

    case getType(actions.cancelEditUser):
      return { ...state, error: null, status: Status.READY }

    default:
      return state
  }
}

export { UserState }
export default userReducer
