import NodeCache from "node-cache";

const cache = new NodeCache({ stdTTL: 600, checkperiod: 120 });

export function cacheMiddleware(req, res, next) {
  const key = req.originalUrl;
  const hit = cache.get(key);

  if (hit) {
    res.set("X-Cache", "HIT");
    return res.json(hit);
  }

  const originalJson = res.json.bind(res);
  res.json = (body) => {
    if (res.statusCode === 200) cache.set(key, body);
    res.set("X-Cache", "MISS");
    return originalJson(body);
  };

  next();
}
