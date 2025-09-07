import { computed, inject } from '@angular/core';
import { websiteBuilderStore } from '../stores';

export function injectUiConfig<T = unknown>(key: string) {
  const builder = inject(websiteBuilderStore);
  return computed(() => builder.dataEntityMap()?.[key]?.data as T | undefined);
}
