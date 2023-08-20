export enum Errors {
  SERVER_ERROR = 'errors.server_error',

  INVALID_MONGO_ID = 'errors.invalid.mongo_id',

  CATEGORY_ALREADY_EXIST = 'errors.categories.already_exist',
  CATEGORIES_NOT_FOUND = 'errors.categories.not_found',
  CATEGORY_ALREADY_INACTIVE = 'errors.categories.already_inactive',
  CATEGORY_ALREADY_ACTIVE = 'errors.categories.already_active',
 
  NAME_NOT_SEND = 'errors.name.not_send',
  NAME_TOO_SHORT = 'errors.name.too_short',
  NAME_MUST_BE_STRING = 'errors.name.must_be_string'
}
