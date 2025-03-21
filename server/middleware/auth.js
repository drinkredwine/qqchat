import { defineEventHandler, getRequestIP } from 'h3';

export default defineEventHandler((event) => {
  // Add security headers
  event.node.res.setHeader('X-Content-Type-Options', 'nosniff');
  event.node.res.setHeader('X-Frame-Options', 'DENY');
  event.node.res.setHeader('X-XSS-Protection', '1; mode=block');
  
  // Log request (in a production environment, you might want to use a proper logging system)
  const clientIp = getRequestIP(event) || 'unknown';
  const path = event.node.req.url;
  const method = event.node.req.method;
  
  console.log(`[${new Date().toISOString()}] ${method} ${path} - IP: ${clientIp}`);
});