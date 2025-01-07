import { Component, OnDestroy, OnInit } from '@angular/core';
import { Player, PlayerUpdate } from '../models/player.model';
import { Team } from '../models/team.model';
import { PlayerService } from '../services/player/player.service';
import { TeamService } from '../services/team/team.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth/auth.service';
import { HttpHeaders } from '@angular/common/http';
import { SignalrService } from '../services/signalr/signalr.service';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-update-player',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './update-player.component.html',
  styleUrl: './update-player.component.css'
})
export class UpdatePlayerComponent implements OnInit, OnDestroy {
  playerId: string | null = null;
  player: Player | null = null;
  teams: Team[] = [];
  initialTeamId: string | null = null;
  hubUrl: string = `${environment.apiDomain}/playerhub`;

  constructor
  (
    private playerService: PlayerService,
    private teamService: TeamService,
    private route: ActivatedRoute,
    private router: Router,
    private signalrService: SignalrService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.playerId = params.get('id');
      if (this.playerId) {
        this.loadPlayerData(this.playerId);
      }
    });
    this.loadTeams();
    this.initializeSignalrConnection();
  }

  ngOnDestroy(): void {
    this.signalrService.stopConnection();
  }

  private initializeSignalrConnection(): void {
    this.signalrService.startConnection(this.hubUrl);
    this.signalrService.listenToUpdates("PlayersUpdated", (updatedPlayer: any) => {
      if (updatedPlayer.id === this.playerId) {
        this.player = updatedPlayer;
      }
    });

    this.signalrService.listenToUpdates("PlayerRemoved", (removedPlayer: any) => {
      if (removedPlayer.id === this.playerId) {
        alert(`${this.player?.firstName} ${this.player?.lastName} has been deleted. You will be redirected to the players dashboard`);
        this.router.navigate(["/players"]);
      }
    })
  }

  loadPlayerData(id: string): void {
    this.playerService.getPlayerById(id).subscribe({
      next: (data) => {
        this.player = data;
        this.initialTeamId = data.teamId;
      },
      error: (error) => console.error("Error fetching player:", error)
    });
  }

  loadTeams(): void {
    this.teamService.getAllTeams().subscribe({
      next: (data) => this.teams = data,
      error: (error) => console.error("Error fetching teams:", error)
    });
  }

  updatePlayer(): void {
    if (this.player && this.playerId) {
      const playerUpdateData: PlayerUpdate = {
        firstName: this.player.firstName,
        lastName: this.player.lastName,
      }
      if (this.player.teamId) playerUpdateData.teamId = this.player.teamId;
      if (this.player.number) playerUpdateData.number = this.player.number;
      const headers = this.authService.getAuthHeader()
      this.playerService.updatePlayer(this.playerId, playerUpdateData, headers).subscribe({
        next: () => {
          alert('Player updated successfully!');
          this.router.navigate(['/players']);
        },
        error: (error) => console.error("Error updating player:", error)
      });
    }
  }

  quitTeam(): void {
    if (this.playerId && this.player) {
      const headers = this.authService.getAuthHeader();
      this.playerService.quitTeam(this.playerId, headers).subscribe({
        next: () => alert(`${this.player?.firstName} ${this.player?.lastName} successfully removed from their team`),
        error: (error) => console.error('Error updating player:', error)
      })
    }
  }
}
