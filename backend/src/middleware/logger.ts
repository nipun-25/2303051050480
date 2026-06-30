import { Request, Response, NextFunction } from 'express';

/**
 * Reusable Logging Middleware
 * Captures request method, path, response status code, client IP, and response time.
 * Writes to process.stdout (non-blocking stream) instead of blocking console.log().
 */
export const loggerMiddleware = (req: Request, res: Response, next: NextFunction) => {
  // Capture high-resolution real time start
  const startTime = process.hrtime();
  const timestamp = new Date().toISOString();
  const method = req.method;
  const url = req.originalUrl || req.url;
  const ip = req.ip || req.socket.remoteAddress || 'unknown';

  // Hook into response 'finish' event to log after the request has been fully processed
  res.on('finish', () => {
    const diff = process.hrtime(startTime);
    const durationInMs = (diff[0] * 1e3 + diff[1] * 1e-6).toFixed(2);
    const statusCode = res.statusCode;

    // Structured log format
    const logMessage = `[${timestamp}] [IP: ${ip}] ${method} ${url} - Status: ${statusCode} - Duration: ${durationInMs}ms\n`;

    // Write directly to stdout stream (production standard)
    process.stdout.write(logMessage);
  });

  next();
};
