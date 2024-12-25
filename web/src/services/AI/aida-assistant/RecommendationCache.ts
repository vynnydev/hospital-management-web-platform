import { LRUCache } from 'lru-cache';

class RecommendationCache {
    private cache: LRUCache<string, CachedRecommendation>;
  
    constructor() {
      const options = {
        max: 1000,              // número máximo de itens
        maxAge: 1000 * 60 * 60 * 24, // 24 horas em ms
        updateAgeOnGet: true,   // atualiza idade ao acessar
        ttl: 1000 * 60 * 60 * 24,    // tempo de vida em ms
        ttlAutopurge: true,          // limpa itens expirados automaticamente
        allowStale: false,           // não permite itens expirados
        updateAgeOnHas: false,       // não atualiza idade em verificações
        dispose: (value: CachedRecommendation, key: string) => {
          // função chamada quando um item é removido do cache
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