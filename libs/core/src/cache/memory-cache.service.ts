/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@angular/core';
import { LRUCache } from 'lru-cache';

@Injectable({
  providedIn: 'root',
})
export class MemoryCache {
  public cache: LRUCache<string, any>;

  constructor() {
    this.cache = new LRUCache({
      max: 100,
      ttl: 1000 * 60 * 120,
    });
  }

  public get<T>(key: string): T {
    return this.cache.get(key);
  }

  public delete(key: string): boolean {
    return this.cache.delete(key);
  }

  public set(key: string, data: unknown): void {
    try {
      this.cache.set(key, data, {});
    } catch (error) {
      console.error(error);
      return;
    }
  }

  public has(key: string): boolean {
    return this.cache.has(key);
  }

  public clearAllByPrefix(prefix: string): void {
    for (const key of this.cache.keys()) {
      if (key.startsWith(prefix)) {
        this.cache.delete(key);
      }
    }
  }
}
