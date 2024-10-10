import { Request, Response, NextFunction } from 'express';
import logger from '../config/logger';

// Load whitelisted IPs from environment variables or use a default list
const whitelistedIPs = process.env.WHITELISTED_IPS
  ? process.env.WHITELISTED_IPS.split(',').map(ip => ip.trim()) // Split and trim spaces
  : [
    '192.168.1.1',  
    '203.0.113.0',
  ];

/**
 * Middleware to check if the request's IP is in the whitelist.
 */
export const ipWhitelist = (req: Request, res: Response, next: NextFunction) => {
  // Try to extract IP from 'x-forwarded-for' header or use req.ip
  const requestIP = req.headers['x-forwarded-for'] || req.ip;

  // Log the incoming request's IP
  logger.info(`Incoming request from IP: ${requestIP}`);

  // Check if the request's IP is in the whitelist
  if (whitelistedIPs.includes(requestIP as string)) {
    next(); // IP is whitelisted, proceed to the next middleware/route
  } else {
    logger.warn(`Access denied for IP: ${requestIP}`);
    return res.status(403).json({
      success: false,
      message: 'Access denied: Your IP is not whitelisted.',
    });
  }
};
