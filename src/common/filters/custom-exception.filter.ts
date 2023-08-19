import {
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  ExceptionFilter,
} from '@nestjs/common';

import { Errors } from 'src/constants';

@Catch(HttpException)
export class CustomExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const status = exception.getStatus();
    const error = exception.name;
    if (exception instanceof HttpException) {
      response.status(status).json({
        message: exception.message,
        status,
        error,
      });
    } else {
      response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: Errors.SERVER_ERROR,
        status,
        error,
      });
    }
  }
}
