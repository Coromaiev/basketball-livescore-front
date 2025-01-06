import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Player, PlayerUpdate } from '../models/player.model';
import { Team } from '../models/team.model';
import { PlayerService } from '../services/player/player.service';
import { TeamService } from '../services/team/team.service';
import { SignalrService } from '../services/signalr/signalr.service';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';

@Component({
  selector: 'app-player-transfer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './view-players.component.html',
  styleUrl: './view-players.component.css'
})
export class ViewPlayersComponent implements OnInit, OnDestroy {
  players: Player[] = [];
  teams: Map<string, string> = new Map();
  selectedPlayer: Player | null = null;
  playerHubUrl: string = `${environment.apiDomain}/playerhub`;
  teamHubUrl: string = `${environment.apiDomain}/teamhub`;

  constructor
    (
      private playerService: PlayerService,
      private teamService: TeamService,
      private playerSignalrService: SignalrService,
      private teamSignalrService: SignalrService,
      private router: Router
    ) { }

  ngOnInit(): void {
    this.loadData();
    this.initializePlayerSignalrConnection();
    this.initializeTeamSignalrConnection();
  }

  ngOnDestroy(): void {
    this.playerSignalrService.stopConnection();
    this.teamSignalrService.stopConnection();
  }

  initializePlayerSignalrConnection() : void {
    this.playerSignalrService.startConnection(this.playerHubUrl);

    this.playerSignalrService.listenToUpdates('PlayersUpdated', (updatedPlayer: any) => {
      const index = this.players.findIndex((player) => player.id === updatedPlayer.id);
      if (index !== -1) {
        this.players[index] = updatedPlayer;
      } else {
        this.players.push(updatedPlayer)
      }
    });

    this.playerSignalrService.listenToUpdates('PlayerRemoved', (playerId: string) => {
      this.players = this.players.filter((p) => p.id !== playerId);
    });
  }

  initializeTeamSignalrConnection(): void {
    this.teamSignalrService.startConnection(this.teamHubUrl);

    this.teamSignalrService.listenToUpdates('TeamsUpdated', (updatedTeam: any) => {
      this.teams.set(updatedTeam.id, updatedTeam.name);
    });

    this.teamSignalrService.listenToUpdates('TeamRemoved', (teamId: any) => {
      this.teams.delete(teamId);
    });
  }

  loadData(): void {
    this.playerService.getAllPlayers().subscribe({
      next: (data) => this.players = data,
      error: (error) => console.error("Error while fetching players:", error)
    });
    var teams = this.teamService.getAllTeams().subscribe({
      next: (data) => data.forEach((team) => this.teams.set(team.id, team.name)),
      error: (error) => console.error("Error while fetching teams:", error)
    });
  }

  getTeamName(teamId: string | null) {
    if (!teamId) return "Not part of a team";
    return this.teams.get(teamId);
  }

  navigateToUpdatePlayer(playerId: string): void {
    this.router.navigate(['/update-player', playerId]);
  }
}
