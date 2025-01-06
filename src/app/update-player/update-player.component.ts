import { Component, OnInit } from '@angular/core';
import { Player, PlayerUpdate } from '../models/player.model';
import { Team } from '../models/team.model';
import { PlayerService } from '../services/player/player.service';
import { TeamService } from '../services/team/team.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-update-player',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './update-player.component.html',
  styleUrl: './update-player.component.css'
})
export class UpdatePlayerComponent implements OnInit {
  playerId: string | null = null;
  player: Player | null = null;
  teams: Team[] = [];

  constructor
  (
    private playerService: PlayerService,
    private teamService: TeamService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.playerId = params.get('id');
      if (this.playerId) {
        this.loadPlayerData(this.playerId);
      }
    });
    this.loadTeams();
  }

  loadPlayerData(id: string): void {
    this.playerService.getPlayerById(id).subscribe({
      next: (data) => this.player = data,
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
      this.playerService.updatePlayer(this.playerId, playerUpdateData).subscribe({
        next: () => {
          alert('Player updated successfully!');
          this.router.navigate(['/players']);
        },
        error: (error) => console.error("Error updating player:", error)
      });
    }
  }
}
