import { Router } from '@angular/router';

export function updateQueryParams(
  params: Record<string, any>,
  router: Router,
  acceptedFields: string[],
) {
  const filteredParams: Record<string, any> = {};
  for (const key of Object.keys(params)) {
    if (acceptedFields.includes(key)) {
      filteredParams[key] = params[key];
    }
  }

  router.navigate([], {
    queryParams: filteredParams,
    queryParamsHandling: 'merge',
  });
}
