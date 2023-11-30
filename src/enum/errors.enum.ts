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

  HOURS_EMPTY = 'errors.hours.empty',

  APPOINTMENT_NOT_FOUND = 'errors.appointment.not_found',
  APPOINTMENT_ALREADY_EXIST = 'errors.appointment.already_exist',

  DESCRIPTION_INVALID = 'errors.description.invalid',
  DESCRIPTION_NOT_SEND = 'errors.description.not_send',
  DESCRIPTION_TOO_LONG = 'errors.description.too_long',
  USER_ID_INVALID = 'errors.user_id.invalid',
  TEACHER_ID_INVALID = 'errors.teacher_id.invalid',
  SUBJECT_ID_INVALID = 'errors.subject_id.invalid',
  STATUS_INVALID = 'errors.status.invalid',

  TOKEN_INVALID = 'errors.token.invalid',

  HOURS_NOT_AVAILABLE = 'errors.hours.not_available',
  TIME_CONFLICT = 'errors.time_conflict',

  INVALID_APPOINTMENT_STATUS = 'errors.invalid.appointment_status',

  APPOINTMENT_STATUS_NOT_ASSIGNABLE = 'errors.appointment_status.not_assignable',

  REJECT_MESSAGE_NOT_SEND = 'errors.reject_message.not_send',

  APPOINTMENT_NOT_SEND = 'errors.appointment_not_send',

  VALUE_MUST_BE_NUMBER = 'errors.value.must_be_number',

  VALUE_CANNOT_BE_NEGATIVE = 'errors.value.cannot_be_negative',

  PAYMENT_STATUS_MUST_BE_ENUM = 'errors.payment_status.must_be_enum',

  APPOINTMENT_NOT_ACCESSIBLE = 'errors.appointment_not_accessible',

  PAYMENT_NOT_FOUND = 'errors.payment_not_found',

  PAYMENT_ERROR = 'errors.payment_error',

  APPOINTMENT_IS_BEFORE = 'errors.appointment_is_before',

  INVALID_REVIEW_DATA = 'errors.invalid_review_data',
}
