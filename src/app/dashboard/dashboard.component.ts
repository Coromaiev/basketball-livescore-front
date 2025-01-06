import { Component, OnDestroy, OnInit } from '@angular/core';
import { Match } from '../models/match.model';
import { MatchService } from '../services/match/match.service';
import { CommonModule } from '@angular/common';
import { environment } from '../../environments/environment';
import { SignalrService } from '../services/signalr/signalr.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit, OnDestroy {
  matches: Match[] = [];
  private hubUrl = `${environment.apiDomain}/matchhub`;

  constructor(private matchService: MatchService, private signalRService: SignalrService) { }

  ngOnInit(): void {
    this.fetchMatchs();
    this.initializeSignalrConnection();
  }

  ngOnDestroy(): void {
    this.signalRService.stopConnection();
  }

  fetchMatchs(): void {
    this.matchService.getMatches().subscribe({
      next: (response) => this.matches = response,
      error: (error) => console.error("Error fetching matchs :", error)
    });
  }

  initializeSignalrConnection(): void {
    this.signalRService.startConnection(this.hubUrl);

    this.signalRService.listenToUpdates('MatchsUpdated', (updatedMatch: any) => {
      const index = this.matches.findIndex((match) => match.id === updatedMatch.id);
      if (index !== -1) {
        this.matches[index] = updatedMatch;
      } else {
        this.matches.push(updatedMatch)
      }
    });

    this.signalRService.listenToUpdates('MatchRemoved', (matchId: string) => {
      this.matches = this.matches.filter((m) => m.id !== matchId);
    });
  }
}
