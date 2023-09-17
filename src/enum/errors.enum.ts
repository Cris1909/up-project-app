export enum Errors {
  SERVER_ERROR = 'errors.server_error',

  INVALID_MONGO_ID = 'errors.invalid.mongo_id',

  SUBJECT_ALREADY_EXIST = 'errors.subjects.already_exist',
  SUBJECTS_NOT_FOUND = 'errors.subjects.not_found',

  ROLE_MUST_BE_ENUM = `errors.roles.must_be_enum`,
  ROLE_ALREADY_EXIST = 'errors.roles.already_exist',
  ROLE_NOT_FOUND = 'errors.roles.not_found',
 
  NAME_NOT_SEND = 'errors.name.not_send',
  NAME_TOO_SHORT = 'errors.name.too_short',
  NAME_MUST_BE_STRING = 'errors.name.must_be_string'
}
