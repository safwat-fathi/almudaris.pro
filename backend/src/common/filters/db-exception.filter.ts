import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { QueryFailedError, TypeORMError } from 'typeorm';

@Catch(TypeORMError)
export class TypeOrmExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(TypeOrmExceptionFilter.name);

  catch(exception: TypeORMError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    const code = (exception as TypeORMError & { code?: string }).code;

    if (exception instanceof QueryFailedError) {
      const result = this.handleQueryFailedError(
        exception as QueryFailedError<Error>,
        code as string,
      );
      status = result.status;
      message = result.message;
    }

    if (status === HttpStatus.INTERNAL_SERVER_ERROR) {
      this.logger.error(
        `Database Error [${code}]: ${exception.message}`,
        exception.stack,
      );
    }

    response.status(status).json({
      success: false,
      message: message,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }

  private handleQueryFailedError(
    exception: QueryFailedError,
    code?: string,
  ): { status: number; message: string } {
    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';

    if (code === '23505') {
      status = HttpStatus.CONFLICT;
      message = 'Duplicate entry.';
    } else if (code === '23503') {
      status = HttpStatus.BAD_REQUEST;
      message = 'Invalid related resource.';
    } else if (code === '22P02') {
      status = HttpStatus.BAD_REQUEST;
      message = 'Invalid request data.';
    }

    return { status, message };
  }
}
