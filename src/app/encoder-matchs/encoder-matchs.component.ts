import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth/auth.service';
import { MatchService } from '../services/match/match.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-encoder-matchs',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './encoder-matchs.component.html',
  styleUrl: './encoder-matchs.component.css'
})
export class EncoderMatchsComponent implements OnInit {
  currentUserRole: string | null = null;
  username: string = '';
  matches: any[] = [];

  constructor(private authService: AuthService, private matchService: MatchService, private router: Router) { }
  ngOnInit(): void {
    this.username = this.authService.getCurrentUsername() ?? '';
    this.authService.getUserRoleSubject().subscribe(role => {
      this.currentUserRole = role;
      if (AuthService.ENCODER_ROLES.includes(this.currentUserRole ?? '')) {
        this.fetchMatchesForEncoder();
      } else {
        this.router.navigate(['/login']);
      }
    });
  }

  fetchMatchesForEncoder(): void {
    this.matchService.getMatchesByEncoder(this.authService.getCurrentUserId() ?? '', this.authService.getAuthHeader()).subscribe(matches => {
      this.matches = matches.filter(match => !match.isFinished);
    });
  }

  getEncoderNames(encoders: any[]): string {
    return encoders.map(encoder => encoder.username).join(', ');
  }

  enterEncodingScreen(matchId: number): void {
    this.router.navigate(['/encoding', matchId]);
  }
}
