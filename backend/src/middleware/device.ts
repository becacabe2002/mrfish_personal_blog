import { Request, Response, NextFunction } from 'express';
import { UAParser } from 'ua-parser-js';

export interface DeviceInfo {
  device?: string;
  browser?: string;
  os?: string;
  userAgent: string;
}

declare global {
  namespace Express {
    interface Request {
      deviceInfo?: DeviceInfo;
    }
  }
}

export const deviceMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const userAgent = req.get('User-Agent') || '';
  const parser = new UAParser(userAgent);
  const result = parser.getResult();

  req.deviceInfo = {
    device: result.device.type || 'desktop',
    browser: result.browser.name,
    os: result.os.name,
    userAgent
  };

  next();
};
