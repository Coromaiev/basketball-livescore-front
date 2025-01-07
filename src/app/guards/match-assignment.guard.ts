import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';
import { MatchService } from '../services/match/match.service';
import { catchError, map, of } from 'rxjs';

export const matchAssignmentGuard: CanActivateFn = (route, state) => {
  const matchId = route.paramMap.get('id');
  const router = inject(Router);
  const authService = inject(AuthService);
  const matchService = inject(MatchService);

  if (authService.getCurrentUserRole() === 'Admin') return of(true);

  if (!authService.isLoggedIn()) {
    router.navigate(['/login']);
    return of(false);
  }

  if (!matchId) {
    router.navigate(['/dashboard']);
    return of(false);
  }

  const currentUserId = authService.getCurrentUserId() ?? '';
  return matchService.getMatchById(matchId).pipe(
    map((match) => {
      const isPrepEncoder =
        !match.hasStarted
        && !match.isFinished
        && currentUserId === match.prepEncoder.id;

      const isPlayEncoder =
        match.hasStarted
        && !match.isFinished
        && match.playEncoders.some((encoder) => encoder.id === currentUserId)

      if (isPrepEncoder || isPlayEncoder) return true;
      else {
        router.navigate(['/access-denied']);
        return false;
      }
    }),
    catchError(() => {
      router.navigate(['/not-found']);
      return of(false);
    })
  );
};
