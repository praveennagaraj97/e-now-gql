import { Injectable } from '@nestjs/common';
import type { Request, Response } from 'express';
import { CookieOptions } from 'express';
import { CookieNames } from 'src/constants/cookie.names';

@Injectable()
export class CookieService {
  setCookie(res: Response, name: string, value: any, options?: CookieOptions) {
    res.cookie(name, value, options);
  }

  getCookie(req: Request, name: CookieNames) {
    return req.cookies[name];
  }
}
