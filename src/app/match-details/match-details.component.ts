import { Component, Input } from '@angular/core';
import { Match } from '../models/match.model';
import { Player } from '../models/player.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-match-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './match-details.component.html',
  styleUrl: './match-details.component.css'
})
export class MatchDetailsComponent {
  @Input() match!: Match;
  hostsFieldPlayers: Player[] = []
  visitorsFieldPlayers: Player[] = [];

  getFieldPlayers(): void {
    if (this.match) {
      this.hostsFieldPlayers = this.match.hosts.players.filter((player) =>
        this.match?.fieldPlayers.includes(player.id)
      );
      this.visitorsFieldPlayers = this.match.visitors.players.filter((player) =>
        this.match?.fieldPlayers.includes(player.id)
      );
    }
  }

  get matchStatus(): string {
    if (this.match.isFinished) {
      return 'finished';
    }
    if (this.match.hasStarted) {
      return 'live';
    }
    return 'upcoming';
  }

  get winner(): string {
    return this.match.winner === this.match.hosts.id ? this.match.hosts.name : this.match.visitors.name;
  }
}
