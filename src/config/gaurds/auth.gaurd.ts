import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { secrets } from '../secrets';
import { IS_PUBLIC_KEY } from '../decorators/auth.decorator';
import { RedisService } from '../common/services/redis/redis.service';
import { UserPayload } from '../common/types/user.type';
import { constants } from '../constants';
import { Session } from '../common/types/session.type';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private reflector: Reflector,
    private redisService: RedisService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException();
    }
    try {
      const payload: UserPayload = await this.jwtService.verifyAsync(token, {
        secret: secrets.JWT_SECRET,
      });

      const isSessionExists = await this.verifySession(payload, token);

      if (!isSessionExists)
        throw new UnauthorizedException('Session Expired, Please login again');

      request['user'] = payload;
    } catch (e) {
      throw new UnauthorizedException(e?.message);
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }

  private async verifySession(payload: UserPayload, token: string) {
    let userSession = await this.redisService.hGet(
      this.getSessionsKey(payload.uId),
      payload.sessionId,
    );
    if (typeof userSession === 'string') {
      userSession = JSON.parse(userSession);
      return !userSession['blocked'];
    }
    return false;
  }

  private getSessionsKey(userId) {
    return `user-session-${userId}`;
  }
}
