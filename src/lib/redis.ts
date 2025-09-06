import { Redis } from 'ioredis';

// Instance Redis singleton
let redis: Redis | null = null;

export function getRedis(): Redis {
  if (!redis) {
    // Configuration Redis avec les variables d'environnement
    const redisConfig = {
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT || '6379'),
      password: process.env.REDIS_PASSWORD,
      retryStrategy: (times: number) => {
        // Arrêter les tentatives après 3 essais en développement
        if (process.env.NODE_ENV === 'development' && times >= 3) {
          console.warn('Redis non disponible en développement, cache désactivé');
          return null;
        }
        const delay = Math.min(times * 50, 2000);
        return delay;
      },
      reconnectOnError: (err: Error) => {
        const targetError = 'READONLY';
        if (err.message.includes(targetError)) {
          return true;
        }
        return false;
      },
      maxRetriesPerRequest: process.env.NODE_ENV === 'development' ? 1 : 3,
      enableReadyCheck: true,
      connectTimeout: 5000, // Réduit en dev
      lazyConnect: true, // Ne pas se connecter immédiatement
    };

    redis = new Redis(redisConfig);

    redis.on('connect', () => {
      console.log('✅ Redis connecté avec succès');
    });

    redis.on('error', (err) => {
      if (process.env.NODE_ENV === 'development') {
        console.warn('⚠️ Redis non disponible (mode dev):', err.message);
      } else {
        console.error('❌ Erreur Redis:', err);
      }
    });

    redis.on('ready', () => {
      console.log('✅ Redis prêt à recevoir des commandes');
    });
  }
  return redis;
}

// Clés de cache organisées par namespace
export const cacheKeys = {
  // Sessions et authentification
  session: (sessionId: string) => `session:${sessionId}`,
  userPermissions: (userId: string) => `perms:${userId}`,
  userRoles: (userId: string) => `roles:${userId}`,

  // Feeds et activités
  publicFeed: (page: number = 1) => `feed:public:page:${page}`,
  userFeed: (userId: string) => `feed:user:${userId}`,

  // Données statiques
  instruments: () => 'data:instruments',
  genres: () => 'data:genres',
  badges: () => 'data:badges',
  teamSettings: () => 'data:team:settings',
  roles: () => 'data:roles',

  // Rate limiting
  rateLimit: {
    login: (ip: string) => `rl:login:${ip}`,
    api: (userId: string) => `rl:api:${userId}`,
    email: (email: string) => `rl:email:${email}`,
    passwordReset: (email: string) => `rl:pwd:${email}`,
  },

  // Statistiques
  stats: {
    members: () => 'stats:members',
    pending: () => 'stats:pending',
    online: () => 'stats:online',
  },
};

// Cache en mémoire pour fallback (développement)
const memoryCache = new Map<string, { data: unknown; expiry: number }>();

// Helper pour cache avec TTL automatique
export async function cacheWithTTL<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttl: number = 300, // 5 minutes par défaut
): Promise<T> {
  // En développement, utiliser cache mémoire si Redis indisponible
  if (process.env.NODE_ENV === 'development') {
    try {
      const redisClient = getRedis();
      const cached = await redisClient.get(key);
      if (cached) {
        return JSON.parse(cached);
      }

      // Récupérer les données
      const data = await fetcher();

      // Mettre en cache Redis (asynchrone)
      redisClient.setex(key, ttl, JSON.stringify(data)).catch((_error) => {}); // Ignorer erreurs en dev

      return data;
    } catch (error) {
      // Fallback sur cache mémoire
      console.warn(`Redis indisponible, utilisation cache mémoire pour ${key}`);

      // Vérifier cache mémoire
      const memCached = memoryCache.get(key);
      if (memCached && Date.now() < memCached.expiry) {
        return memCached.data;
      }

      // Récupérer les données
      const data = await fetcher();

      // Mettre en cache mémoire
      memoryCache.set(key, {
        data,
        expiry: Date.now() + ttl * 1000,
      });

      // Nettoyer les entrées expirées
      for (const [k, v] of memoryCache.entries()) {
        if (Date.now() >= v.expiry) {
          memoryCache.delete(k);
        }
      }

      return data;
    }
  }

  // Production : Redis obligatoire
  const redisClient = getRedis();

  try {
    // Essayer de récupérer depuis le cache
    const cached = await redisClient.get(key);
    if (cached) {
      return JSON.parse(cached);
    }
  } catch (error) {
    console.error(`Erreur lecture cache ${key}:`, error);
  }

  // Si pas en cache, récupérer les données
  const data = await fetcher();

  // Mettre en cache de manière asynchrone (ne pas attendre)
  redisClient
    .setex(key, ttl, JSON.stringify(data))
    .catch((error) => console.error(`Erreur écriture cache ${key}:`, error));

  return data;
}

// Helper pour invalider le cache
export async function invalidateCache(pattern: string): Promise<void> {
  const redisClient = getRedis();

  try {
    // Utiliser SCAN pour éviter KEYS (bloquant)
    const stream = redisClient.scanStream({
      match: pattern,
      count: 100,
    });

    stream.on('data', async (keys: string[]) => {
      if (keys.length) {
        await redisClient.del(...keys);
      }
    });

    stream.on('end', () => {
      console.log(`Cache invalidé pour pattern: ${pattern}`);
    });
  } catch (error) {
    console.error('Erreur invalidation cache:', error);
  }
}

// Rate limiting helper
export async function checkRateLimit(
  key: string,
  maxAttempts: number = 5,
  windowSeconds: number = 60,
): Promise<{ allowed: boolean; remaining: number; resetAt: Date }> {
  const redisClient = getRedis();

  try {
    const current = await redisClient.incr(key);

    if (current === 1) {
      await redisClient.expire(key, windowSeconds);
    }

    const ttl = await redisClient.ttl(key);
    const resetAt = new Date(Date.now() + ttl * 1000);

    return {
      allowed: current <= maxAttempts,
      remaining: Math.max(0, maxAttempts - current),
      resetAt,
    };
  } catch (error) {
    console.error('Erreur rate limiting:', error);
    // En cas d'erreur Redis, permettre l'accès
    return {
      allowed: true,
      remaining: maxAttempts,
      resetAt: new Date(Date.now() + windowSeconds * 1000),
    };
  }
}

// Test de connexion
export async function testRedisConnection(): Promise<boolean> {
  const redisClient = getRedis();

  try {
    const result = await redisClient.ping();
    console.log('Test Redis:', result === 'PONG' ? 'Succès' : 'Échec');
    return result === 'PONG';
  } catch (error) {
    console.error('Erreur test Redis:', error);
    return false;
  }
}
