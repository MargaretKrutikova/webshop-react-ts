type User = {
  id: string
  email: string
  firstName?: string
  birthDate: string | null
  lastName?: string
  phoneNumber: string | null
  gender: string | null
  isApproved: boolean
  isLocked: boolean
  customerGroup: string | null
  preferredCurrency: string | null
  preferredLanguage: string | null
  organization: any | null
  subscribedToNewsletter: boolean
}

type UpdateUserRequest = {
  firstName?: string
  lastName?: string
  newEmail?: string
  email: string
  birthDate?: string | null
  password: string
  organizationId?: string
  newPassword?: string
  gender?: string
  confirmPassword?: string
  customerGroup?: string | null
  preferredCurrency?: string
  preferredLanguage?: string
  subscribedToNewsletter?: boolean
}

type ValidationError = {
  Field: string
  Code: string
}

type ApiError = {
  status: number
  code: string
  message: string
}

type ApiValidationError = {
  validationErrors: ValidationError[]
} & ApiError

export { User, UpdateUserRequest, ApiError, ApiValidationError }
