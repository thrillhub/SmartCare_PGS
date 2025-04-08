export default function rateLimit(options = { interval: 60000, uniqueTokenPerInterval: 500 }) {
    const tokens = new Map();
  
    return {
      check: (res, limit, key) => new Promise((resolve, reject) => {
        const now = Date.now();
        const token = tokens.get(key) || { count: 0, lastReset: now };
  
        if (now - token.lastReset > options.interval) {
          token.count = 0;
          token.lastReset = now;
        }
  
        if (token.count >= limit) {
          res.setHeader('X-RateLimit-Limit', limit);
          res.setHeader('X-RateLimit-Remaining', 0);
          res.setHeader('X-RateLimit-Reset', token.lastReset + options.interval);
          reject(new Error('Rate limit exceeded'));
        } else {
          token.count += 1;
          tokens.set(key, token);
          res.setHeader('X-RateLimit-Limit', limit);
          res.setHeader('X-RateLimit-Remaining', Math.max(0, limit - token.count));
          res.setHeader('X-RateLimit-Reset', token.lastReset + options.interval);
          resolve();
        }
      })
    };
  }