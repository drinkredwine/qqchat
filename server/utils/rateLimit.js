// Simple in-memory rate limiter
// In production, you might want to use Redis or another shared storage
const ipRequestCounts = new Map();
const userRequestCounts = new Map();

// Default rate limits
const DEFAULT_IP_LIMIT = 50; // 50 requests per hour per IP
const DEFAULT_USER_LIMIT = 100; // 100 requests per hour per user

// Clean old entries every hour
setInterval(() => {
  const now = Date.now();
  
  // Clean IP entries older than 1 hour
  for (const [ip, entries] of ipRequestCounts.entries()) {
    const filteredEntries = entries.filter(timestamp => now - timestamp < 3600000);
    if (filteredEntries.length === 0) {
      ipRequestCounts.delete(ip);
    } else {
      ipRequestCounts.set(ip, filteredEntries);
    }
  }
  
  // Clean user entries older than 1 hour
  for (const [userId, entries] of userRequestCounts.entries()) {
    const filteredEntries = entries.filter(timestamp => now - timestamp < 3600000);
    if (filteredEntries.length === 0) {
      userRequestCounts.delete(userId);
    } else {
      userRequestCounts.set(userId, filteredEntries);
    }
  }
}, 3600000); // Run every hour

/**
 * Check if a request is rate limited
 * @param {string} ip - The IP address
 * @param {string|null} userId - Optional user ID
 * @returns {boolean} - True if rate limited, false otherwise
 */
export function isRateLimited(ip, userId = null) {
  const now = Date.now();
  
  // Check IP rate limit
  let ipRequests = ipRequestCounts.get(ip) || [];
  ipRequests = ipRequests.filter(timestamp => now - timestamp < 3600000); // Keep only requests from the last hour
  
  if (ipRequests.length >= DEFAULT_IP_LIMIT) {
    return true;
  }
  
  // Add current request timestamp
  ipRequests.push(now);
  ipRequestCounts.set(ip, ipRequests);
  
  // Check user rate limit if userId is provided
  if (userId) {
    let userRequests = userRequestCounts.get(userId) || [];
    userRequests = userRequests.filter(timestamp => now - timestamp < 3600000);
    
    if (userRequests.length >= DEFAULT_USER_LIMIT) {
      return true;
    }
    
    // Add current request timestamp
    userRequests.push(now);
    userRequestCounts.set(userId, userRequests);
  }
  
  return false;
}

/**
 * Get remaining requests for an IP or user
 * @param {string} ip - The IP address
 * @param {string|null} userId - Optional user ID
 * @returns {Object} - Object with remaining requests info
 */
export function getRemainingRequests(ip, userId = null) {
  const now = Date.now();
  
  // Get IP remaining requests
  let ipRequests = ipRequestCounts.get(ip) || [];
  ipRequests = ipRequests.filter(timestamp => now - timestamp < 3600000);
  const ipRemaining = Math.max(0, DEFAULT_IP_LIMIT - ipRequests.length);
  
  // Get user remaining requests if userId is provided
  let userRemaining = null;
  if (userId) {
    let userRequests = userRequestCounts.get(userId) || [];
    userRequests = userRequests.filter(timestamp => now - timestamp < 3600000);
    userRemaining = Math.max(0, DEFAULT_USER_LIMIT - userRequests.length);
  }
  
  return {
    ipRemaining,
    userRemaining,
    resetInSeconds: 3600 - Math.floor((now % 3600000) / 1000)
  };
}