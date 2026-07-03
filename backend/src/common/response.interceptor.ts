import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

export interface ApiResponse<T = any> {
  code: number;
  message: string;
  data: T;
}

@Injectable()
export class ResponseInterceptor implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const originalJson = res.json;
    res.json = function (body: any) {
      if (body && body.code !== undefined) {
        return originalJson.call(this, body);
      }
      const wrapped: ApiResponse = {
        code: 200,
        message: 'success',
        data: body,
      };
      return originalJson.call(this, wrapped);
    };
    next();
  }
}
