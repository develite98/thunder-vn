import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { injectMixClient } from '@mixcore/sdk-client-ng';

export const roleGuard: CanActivateFn = (route) => {
  const auth = injectMixClient().auth;
  const router = inject(Router);

  const authSesstionInvalid = auth.checkAuthSessionExpired();
  if (authSesstionInvalid) {
    router.navigate(['auth/login']);
    return false;
  }

  const expectedRoles = route.data['roles'] as string[];
  if (!expectedRoles || expectedRoles.length === 0) {
    return true;
  }

  const userRoles = auth.getUserRoles() || [];
  const hasAccess = expectedRoles?.some((role) => userRoles.includes(role));

  if (!hasAccess) {
    router.navigate(['error/unauthorized']);
    return false;
  }

  return true;
};
