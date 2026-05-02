import {
  CallHandler,
  ExecutionContext,
  HttpStatus,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Response } from 'express';

@Injectable()
export class ResponseTransformInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const ctx = context.switchToHttp();
    const response = ctx.getResponse<Response>();

    // The status code can be derived from the response or hard-coded as needed.
    const statusCode = response.statusCode;

    return next.handle().pipe(
      map((data: unknown) => {
        const success =
          statusCode >= (HttpStatus.OK as number) && statusCode < 300;

        const message = this.getMessageFromStatus(statusCode);

        // For success-only handlers that explicitly return true,
        // omit the data key from the global envelope.
        if (success && data === true) {
          return {
            success,
            message,
          };
        }

        return {
          success,
          message,
          data,
        };
      }),
    );
  }

  private getMessageFromStatus(status: number): string {
    // You can customize messages based on the status code
    if (status >= (HttpStatus.OK as number) && status < 300) {
      return 'Success';
    } else if (status >= 400 && status < 500) {
      return 'Client error';
    } else if (status >= 500) {
      return 'Server error';
    }

    return 'Ok';
  }
}
