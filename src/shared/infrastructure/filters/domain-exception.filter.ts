import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from '@nestjs/common';
import type { Response } from 'express';
import { DomainError, DomainErrorType } from '../../domain/domain-error.js';

const HTTP_STATUS: Record<DomainErrorType, HttpStatus> = {
  NOT_FOUND: HttpStatus.NOT_FOUND,
  VALIDATION: HttpStatus.BAD_REQUEST,
  CONFLICT: HttpStatus.CONFLICT,
};

@Catch(DomainError)
export class DomainExceptionFilter implements ExceptionFilter {
  catch(error: DomainError, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse<Response>();
    const status = HTTP_STATUS[error.type];

    response.status(status).json({
      statusCode: status,
      error: error.name,
      message: error.message,
    });
  }
}
