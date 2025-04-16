import { LRUCache } from 'lru-cache';
import { ICachedRecommendation, IPatientContext } from '@/types/cognitiva-ai-assistant';

class RecommendationCache {
    private cache: LRUCache<string, ICachedRecommendation>;
  
    constructor() {
      const options = {
        max: 1000,
        maxAge: 1000 * 60 * 60 * 24,
        updateAgeOnGet: true,
        ttl: 1000 * 60 * 60 * 24,
        ttlAutopurge: true,
        allowStale: false,
        updateAgeOnHas: false,
        dispose: (value: ICachedRecommendation, key: string) => {
          console.log(`Cache item removed: ${key}`);
        }
      };
  
      this.cache = new LRUCache<string, ICachedRecommendation>(options);
    }
  
    get(key: string): ICachedRecommendation | undefined {
      return this.cache.get(key);
    }
  
    set(key: string, value: ICachedRecommendation): void {
      this.cache.set(key, value);
    }
  
    generateKey(context: IPatientContext): string {
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