import { NextResponse } from 'next/server';
import { cacheWithTTL } from '@/lib/redis';

export async function GET() {
  try {
    console.log('🧪 Test du cache mémoire fallback...');

    // Test 1: Premier appel (doit aller chercher les données)
    const startTime1 = Date.now();
    const data1 = await cacheWithTTL(
      'test:memory:cache',
      async () => {
        console.log('Fetcher appelé - premier appel');
        // Simuler une requête DB lente
        await new Promise((resolve) => setTimeout(resolve, 100));
        return {
          message: 'Données depuis fetcher',
          timestamp: Date.now(),
          call: 1,
        };
      },
      10, // 10 secondes TTL
    );
    const time1 = Date.now() - startTime1;

    // Test 2: Deuxième appel immédiat (doit venir du cache)
    const startTime2 = Date.now();
    const data2 = await cacheWithTTL(
      'test:memory:cache',
      async () => {
        console.log('Fetcher appelé - deuxième appel (ne devrait pas apparaître)');
        await new Promise((resolve) => setTimeout(resolve, 100));
        return {
          message: 'Nouvelles données',
          timestamp: Date.now(),
          call: 2,
        };
      },
      10,
    );
    const time2 = Date.now() - startTime2;

    // Test 3: Cache différent
    const data3 = await cacheWithTTL(
      'test:memory:cache:2',
      async () => {
        console.log('Fetcher appelé - cache différent');
        return {
          message: 'Cache séparé',
          timestamp: Date.now(),
          call: 3,
        };
      },
      10,
    );

    return NextResponse.json({
      success: true,
      message: 'Cache mémoire testé',
      results: {
        premier_appel: {
          data: data1,
          temps_ms: time1,
          depuis_cache: false,
        },
        deuxieme_appel: {
          data: data2,
          temps_ms: time2,
          depuis_cache: data1.timestamp === data2.timestamp,
          gain_temps: time1 - time2,
        },
        cache_separe: {
          data: data3,
          different: data3.timestamp !== data1.timestamp,
        },
      },
      conclusion: {
        cache_fonctionne: data1.timestamp === data2.timestamp,
        performance_amelioree: time2 < time1,
        isolation_ok: data3.timestamp !== data1.timestamp,
      },
    });
  } catch (error) {
    console.error('Erreur test cache:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Erreur inconnue',
    });
  }
}
