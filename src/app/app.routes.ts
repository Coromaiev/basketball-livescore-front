import { Routes } from '@angular/router';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { ViewPlayersComponent } from './view-players/view-players.component';
import { AddMatchComponent } from './add-match/add-match.component';
import { authorizationGuard } from './guards/authorization.guard';
import { AccessDeniedComponent } from './access-denied/access-denied.component';
import { UpdatePlayerComponent } from './update-player/update-player.component';
import { matchAssignmentGuard } from './guards/match-assignment.guard';
import { MatchEncodingComponent } from './match-encoding/match-encoding.component';
import { EncoderMatchsComponent } from './encoder-matchs/encoder-matchs.component';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'login', component: LoginComponent, title: 'Login' },
  { path: 'register', component: RegisterComponent, title: 'Register' },
  { path: 'players', component: ViewPlayersComponent, title: 'Players' },
  { path: "dashboard", component: DashboardComponent, title: 'Dashboard' },
  { path: "add-match", component: AddMatchComponent, title: 'Create Match', canActivate: [authorizationGuard], data: { roles: ['Encoder', 'Admin'] } },
  { path: 'update-player/:id', component: UpdatePlayerComponent, title: 'Update Player', canActivate: [authorizationGuard], data: { roles: ['Admin'] } },
  { path: "access-denied", component: AccessDeniedComponent },
  { path: 'encoding/:id', component: MatchEncodingComponent, canActivate: [authorizationGuard, matchAssignmentGuard], data: { roles: ['Encoder', 'Admin'] } },
  { path: 'my-encodings', component: EncoderMatchsComponent, canActivate: [authorizationGuard], data: { roles: ['Encoder', 'Admin'] }, title: 'My assigned matches' },
  { path: 'not-found', component: NotFoundComponent, title: 'Page Not Found' },
  { path: "**", component: NotFoundComponent, title: 'Page Not Found' }
];
