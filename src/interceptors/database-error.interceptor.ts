import {
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Injectable,
  BadRequestException,
  ConflictException,
  NotFoundException,
} from "@nestjs/common";
import { catchError, Observable } from "rxjs";
import { databaseExceptionMapper } from "../utils/exceptionMappers/db-exeption-mapper";

@Injectable()
export class DatabaseErrorInterceptor implements NestInterceptor {
  intercept(_: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((error) => {
        const [status, message] = databaseExceptionMapper(error);

        switch (status) {
          case 400:
            throw new BadRequestException(message);
          case 409:
            throw new ConflictException(message);
          case 404:
            throw new NotFoundException(message);
          default:
            throw error;
        }
      }),
    );
  }
}
