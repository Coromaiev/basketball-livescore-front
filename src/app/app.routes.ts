import { Routes } from '@angular/router';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { ViewPlayersComponent } from './view-players/view-players.component';
import { AddMatchComponent } from './add-match/add-match.component';
import { authorizationGuard } from './guards/authorization.guard';
import { AccessDeniedComponent } from './access-denied/access-denied.component';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'login', component: LoginComponent, title: 'Login' },
  { path: 'register', component: RegisterComponent, title: 'Register' },
  { path: 'players', component: ViewPlayersComponent, title: 'Players' },
  { path: "dashboard", component: DashboardComponent, title: 'Dashboard' },
  { path: "add-match", component: AddMatchComponent, title: 'Create Match', canActivate: [authorizationGuard], data: { roles: ['Encoder', 'Admin'] } },
  { path: "access-denied", component: AccessDeniedComponent },
  { path: "**", component: NotFoundComponent, title: 'Page Not Found' }
];
