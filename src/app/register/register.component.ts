import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';
import { Register } from '../models/register.model';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  registerData: Register = { email: '', username: '', password: '', permission: 'None' };
  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router) { }

  onSubmit(): void {
    this.authService.register(this.registerData).subscribe({
      next: (response) => {
        this.router.navigate(['/login']); // Redirection to the login page after successful registration
      },
      error: (error) => {
        this.errorMessage = 'Error during registration';
        console.error(error);
      }
    });
  }
}
