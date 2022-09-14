import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Logger,
} from "@nestjs/common";
import { Request } from "express";
import JwtDto from "../../auth/dto/jwt.dto";

@Injectable()
export class isResourceOwnerGuard implements CanActivate {
  private readonly logger = new Logger(isResourceOwnerGuard.name);
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest() as Request;
    const id = parseInt(request.params["id"]);
    const controllerName = context.getClass().name;
    const methodName = context.getHandler().name;
    const user = request.user as JwtDto;
    const isValid = id === user.id;

    if (!isValid) {
      this.logger.warn(
        `User ${user.username} with role '${user.role}' has tried to access ${methodName} of ${controllerName}`,
      );

      return false;
    }

    return true;
  }
}
