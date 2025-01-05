import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { Login } from '../models/login.model';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  login: Login = { email: '', password: '' };
  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router) { }

  onSubmit(): void {
    this.authService.login(this.login).subscribe({
      next: (response) => {
        this.authService.saveToken(response.token);
        // target url to be updated
        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        console.log(error);
        this.errorMessage = "Invalid Credentials"
      }
    });
  }
}
