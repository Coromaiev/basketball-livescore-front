import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';

export const authorizationGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const requiredRoles = route.data?.['roles'] as string[];

  if (authService.isLoggedIn() && authService.hasRole(requiredRoles)) {
    return true;
  }

  router.navigate(['/access-denied']);
  return false;
};
