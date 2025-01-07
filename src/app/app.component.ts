import { Component, OnDestroy, OnInit } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from './services/auth/auth.service';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit, OnDestroy{
  title = 'basketball-livescore';
  isEncoder: boolean = false;
  isAdmin: boolean = false;
  private roleSubscription!: Subscription;

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.roleSubscription = this.authService.getUserRoleSubject()?.subscribe((role) => {
      this.isEncoder = this.authService.isLoggedIn() && AuthService.ENCODER_ROLES.includes(role ?? '');
      this.isAdmin = this.authService.isLoggedIn() && AuthService.ADMIN_ROLE === role;
    })
  }

  ngOnDestroy(): void {
    if (this.roleSubscription) {
      this.roleSubscription.unsubscribe();
    }
  }
}
