import { NextResponse } from 'next/server';
import { testRedisConnection, cacheWithTTL, getRedis } from '@/lib/redis';

export async function GET() {
  try {
    console.log('🔍 Test de connexion Redis depuis API...');

    // Test 1: Connexion basique
    const isConnected = await testRedisConnection();
    console.log('Connexion Redis:', isConnected ? 'Succès' : 'Échec');

    if (!isConnected) {
      return NextResponse.json({
        success: false,
        message: 'Redis non disponible',
        fallback: 'Cache mémoire actif',
      });
    }

    // Test 2: Cache avec TTL
    const testData = await cacheWithTTL(
      'test:api',
      async () => {
        console.log('Fetcher appelé depuis API');
        return { message: 'Test depuis API', timestamp: Date.now() };
      },
      30, // 30 secondes
    );

    // Test 3: Vérifier si c'est bien en cache
    const redis = getRedis();
    const cached = await redis.get('test:api');

    return NextResponse.json({
      success: true,
      message: 'Redis fonctionne parfaitement',
      testData,
      cached: cached ? JSON.parse(cached) : null,
      fromCache: !!cached,
    });
  } catch (error) {
    console.error('Erreur test Redis API:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Erreur inconnue',
      fallback: 'Cache mémoire utilisé',
    });
  }
}
