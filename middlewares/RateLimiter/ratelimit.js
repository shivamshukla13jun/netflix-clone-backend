const rateLimit = {};
const maxRequests = 5;
const intervalMs = 1000 * 60 * 60; // 1 hour
const ipToRequestsMap = {};
function limitRate(req, res, next) {
  const ip = req.ip;
  const now = Date.now();
  // If IP address has not made any requests yet, initialize requests count to 0
  if (!ipToRequestsMap[ip]) {
    ipToRequestsMap[ip] = {
      count: 0,
      lastRequestTime: now
    };
  }

  const { count, lastRequestTime } = ipToRequestsMap[ip];
  const timeSinceLastRequest = now - lastRequestTime;

  // If the time since last request is greater than the interval, reset the requests count
  if (timeSinceLastRequest > intervalMs) {
    ipToRequestsMap[ip].count = 0;
    ipToRequestsMap[ip].lastRequestTime = now;
  }

  // If the requests count is greater than or equal to the max requests, return a 429 error
  if (count >= maxRequests) {
    res.status(429).json({
      error: 'Too many requests'
    });
  } else {
    ipToRequestsMap[ip].count++;
    ipToRequestsMap[ip].lastRequestTime = now;
    next();
  }
}
module.exports = limitRate;