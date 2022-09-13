import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Logger,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";

@Injectable()
export class RoleGuard implements CanActivate {
  private readonly logger = new Logger(RoleGuard.name);
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const role = this.reflector.get<string>("role", context.getHandler());
    if (!role) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const controllerName = context.getClass().name;
    const methodName = context.getHandler().name;
    const user = request.user;
    const isValid = role === user.role;
    if (!isValid) {
      this.logger.warn(
        `User ${user.username} with role '${user.role}' has tried to access ${methodName} of ${controllerName}`,
      );

      return false;
    }

    return true;
  }
}
