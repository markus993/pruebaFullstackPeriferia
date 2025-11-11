import { ExecutionContext, createParamDecorator } from "@nestjs/common";

import { AuthenticatedUser } from "../types/authenticated-user.type";

export const CurrentUser = createParamDecorator(
  (_: unknown, ctx: ExecutionContext): AuthenticatedUser | undefined => {
    const request = ctx.switchToHttp().getRequest();
    return request.user as AuthenticatedUser | undefined;
  }
);
