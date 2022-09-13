import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from "@nestjs/common";
import { HttpAdapterHost } from "@nestjs/core";

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost;
    const isHttpException = exception instanceof HttpException;
    const isError = exception instanceof Error;
    const ctx = host.switchToHttp();

    const exceptionStatus = isHttpException
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;
    const exceptionResponse = isHttpException
      ? (exception.getResponse() as Error)
      : undefined;

    const name =
      isHttpException || isError ? exception.name : "InternalServerException";
    const message = exceptionResponse
      ? exceptionResponse.message
      : isError
      ? exception.message
      : "Internal Server Exception";
    const stack = isHttpException || isError ? exception.stack : undefined;

    const responseBody = {
      errors: [
        {
          name: name,
          message: message,
          path: httpAdapter.getRequestUrl(ctx.getRequest()),
          stack: process.env.ENVIRONMENT === "development" ? stack : undefined,
        },
      ],
    };

    httpAdapter.reply(ctx.getResponse(), responseBody, exceptionStatus);
  }
}
