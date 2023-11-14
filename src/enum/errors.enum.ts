export enum Errors {
  SERVER_ERROR = 'errors.server_error',

  INVALID_MONGO_ID = 'errors.invalid.mongo_id',

  SUBJECT_ALREADY_EXIST = 'errors.subjects.already_exist',
  SUBJECTS_NOT_FOUND = 'errors.subjects.not_found',

  ROLE_MUST_BE_ENUM = `errors.roles.must_be_enum`,
  ROLE_ALREADY_EXIST = 'errors.roles.already_exist',
  ROLE_NOT_FOUND = 'errors.roles.not_found',
  ROLE_INVALID = 'errors.roles.invalid',

  NAME_NOT_SEND = 'errors.name.not_send',
  NAME_TOO_SHORT = 'errors.name.too_short',
  NAME_MUST_BE_STRING = 'errors.name.must_be_string',

  USER_NOT_FOUND = 'errors.user.not_found',
  INVALID_CREDENTIALS = 'errors.invalid_credentials',

  EMAIL_ALREADY_EXIST = 'errors.email.already_exist',
  PHONE_NUMBER_ALREADY_EXIST = 'errors.phone.already_exist',
  EMAIL_INVALID = 'errors.email.invalid',
  PASSWORD_INVALID = 'errors.password.invalid',
  PHONE_NUMBER_INVALID = 'errors.phone.invalid',

  INVALID_TOKEN = 'errors.token.invalid',

  DATE_INVALID_FORMAT = 'errors.date.invalid_format',
  DATE_INVALID = 'errors.date.invalid',
  DATE_IS_PREVIOUS = 'errors.date.is_previous',

  HOURS_INVALID = 'errors.hours.invalid',

  AVAILABLE_SCHEDULE_EXIST = 'errors.available_schedule.already_exist',
  AVAILABLE_SCHEDULE_NOT_FOUND = 'errors.available_schedule.not_found',

  IMG_MUST_BE_URL = 'errors.img.must_be_url',
  IMG_NOT_SEND = 'errors.img.not_send',
}
