import { LRUCache } from 'lru-cache';
import { CachedRecommendation, PatientContext } from './types/aida-assistant';

class RecommendationCache {
    private cache: LRUCache<string, CachedRecommendation>;
  
    constructor() {
      const options = {
        max: 1000,
        maxAge: 1000 * 60 * 60 * 24,
        updateAgeOnGet: true,
        ttl: 1000 * 60 * 60 * 24,
        ttlAutopurge: true,
        allowStale: false,
        updateAgeOnHas: false,
        dispose: (value: CachedRecommendation, key: string) => {
          console.log(`Cache item removed: ${key}`);
        }
      };
  
      this.cache = new LRUCache<string, CachedRecommendation>(options);
    }
  
    get(key: string): CachedRecommendation | undefined {
      return this.cache.get(key);
    }
  
    set(key: string, value: CachedRecommendation): void {
      this.cache.set(key, value);
    }
  
    generateKey(context: PatientContext): string {
      return JSON.stringify({
        diagnoses: context.diagnoses.sort(),
        riskLevel: context.riskLevel,
        ageGroup: Math.floor(context.age / 10) * 10
      });
    }
}

export {
    RecommendationCache
}