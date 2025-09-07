/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { LRUCache } from 'lru-cache';
import { Subject, debounceTime } from 'rxjs';

export type StorageCache = { [key: string]: any };

@Injectable({
  providedIn: 'root',
})
export class CacheService {
  public cache: LRUCache<string, any>;
  public localStoreDelay$ = new Subject();

  constructor() {
    this.cache = new LRUCache({
      max: 100,
      maxSize: 5000,
      sizeCalculation: () => {
        return 1;
      },
      ttl: 1000 * 60 * 120,
    });

    this.initFromDiskCache();
    this.localStoreDelay$
      .pipe(debounceTime(300), takeUntilDestroyed())
      .subscribe(() => {
        this.storeIntoDiskCache();
      });
  }

  public get<T>(url: string): T {
    return this.cache.get(url);
  }

  public delete(url: string): boolean {
    return this.cache.delete(url);
  }

  public deleteAll() {
    localStorage.removeItem('__MIX_CACHE_STORAGE__');
  }

  public set(url: string, data: unknown): void {
    this.cache.set(url, data, {});
    this.localStoreDelay$.next({});
  }

  public has(url: string): boolean {
    return this.cache.has(url);
  }

  public storeIntoDiskCache() {
    function removeCircularReferences() {
      const seen = new WeakSet();
      return (key: string, value: any) => {
        if (typeof value === 'object' && value !== null) {
          if (seen.has(value)) {
            return;
          }
          seen.add(value);
        }
        return value;
      };
    }
    const storeValue: StorageCache = {};
    Array.from(this.cache.keys()).forEach((key) => {
      storeValue[key] = this.cache.get(key);
    });

    localStorage.setItem(
      '__MIX_CACHE_STORAGE__',
      JSON.stringify(storeValue, removeCircularReferences()),
    );
  }

  public initFromDiskCache() {
    const dataString = localStorage.getItem('__MIX_CACHE_STORAGE__');
    if (dataString) {
      const data = JSON.parse(dataString) as StorageCache;
      Object.keys(data).forEach((key) => {
        this.set(key, data[key]);
      });
    }
  }
}
