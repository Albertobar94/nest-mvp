import {
  Logger,
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from "@nestjs/common";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";

@Injectable()
export class executionTimeInterceptor implements NestInterceptor {
  private readonly logger = new Logger(executionTimeInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const self = this;
    const now = Date.now();
    const controllerName = context.getClass().name;
    const methodName = context.getHandler().name;

    return next
      .handle()
      .pipe(
        tap(() =>
          self.logger.log(
            `Executed method ${methodName} of ${controllerName} in ${
              Date.now() - now
            }ms`,
          ),
        ),
      );
  }
}
