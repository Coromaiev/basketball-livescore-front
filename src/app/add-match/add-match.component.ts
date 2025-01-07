import { Component, OnInit } from '@angular/core';
import { Team } from '../models/team.model';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatchService } from '../services/match/match.service';
import { TeamService } from '../services/team/team.service';
import { CommonModule } from '@angular/common';
import { MatchCreate } from '../models/match.model';
import { AuthService } from '../services/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-match',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './add-match.component.html',
  styleUrl: './add-match.component.css'
})
export class AddMatchComponent implements OnInit {
  teams: Team[] = [];
  matchForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private teamService: TeamService,
    private matchService: MatchService,
    private authService: AuthService,
    private router: Router
  ) {
    this.matchForm = this.formBuilder.group({
      hostsId: ['', Validators.required],
      visitorsId: ['', Validators.required],
      quarterDuration: [null, [Validators.min(1)]],
      numberOfQuarters: [null, [Validators.min(1)]],
      timeoutDuration: [null, [Validators.min(1)]],
    });
  }

  ngOnInit(): void {
    this.loadTeams();
  }

  loadTeams(): void {
    this.teamService.getAllTeams().subscribe({
      next: (data) => this.teams = data,
      error: (err) => console.error('Error fetching teams:', err),
    });
  }

  addMatch(): void {
    if (this.matchForm.valid) {
      const matchData: MatchCreate = this.matchForm.value;
      const currentUserId = this.authService.getCurrentUserId();
      if (currentUserId) matchData.prepEncoderId = currentUserId;
      const headers = this.authService.getAuthHeader();
      this.matchService.addMatch(matchData, headers).subscribe({
        next: () => {
          alert('Match added successfully!');
          this.router.navigate(['/dashboard']);
        },
        error: (err) => console.error('Error adding match:', err),
      });
    }
  }
}
