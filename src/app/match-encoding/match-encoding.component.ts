import { Component, OnDestroy, OnInit } from '@angular/core';
import { Match, MatchListUpdate, MatchPrepUpdate } from '../models/match.model';
import { ActivatedRoute, Router } from '@angular/router';
import { MatchService } from '../services/match/match.service';
import { CommonModule } from '@angular/common';
import { Player } from '../models/player.model';
import { User } from '../models/user.model';
import { UserService } from '../services/user/user.service';
import { AuthService } from '../services/auth/auth.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-match-encoding',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './match-encoding.component.html',
  styleUrl: './match-encoding.component.css'
})
export class MatchEncodingComponent implements OnInit, OnDestroy {
  matchId: string = '';
  match: Match | null = null;
  isPreparationMode: boolean = false;
  hostsAddedPlayers: string[] = [];
  hostsRemovedPlayers: string[] = [];
  visitorsAddedPlayers: string[] = [];
  visitorsRemovedPlayers: string[] = [];
  addedEncoders: string[] = [];
  removedEncoders: string[] = [];

  get hostsSelectedPlayers() {
    return this.match?.fieldPlayers.filter(playerId => this.match?.hosts.players.some((teamPlayer => teamPlayer.id === playerId)));
  }

  get visitorsSelectedPlayers() {
    return this.match?.fieldPlayers.filter(playerId => this.match?.visitors.players.some((teamPlayer => teamPlayer.id === playerId)));
  }

  constructor(
    private route: ActivatedRoute,
    private matchService: MatchService,
    private userService: UserService,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.matchId = this.route.snapshot.paramMap.get('id') ?? '';
    this.loadMatchDetails();
  }

  ngOnDestroy(): void { }

  loadMatchDetails(): void {
    if (this.matchId) {
      this.matchService.getMatchById(this.matchId).subscribe({
        next: (match) => {
          this.match = match;
          this.isPreparationMode = !this.match.hasStarted && !this.match.isFinished;
        },
        error: (error) => {
          console.error('Error fetching match:', error)
          this.router.navigate(['/not-found']);
        }
      });
    }
  }

  togglePlayer(team: 'hosts' | 'visitors', player: Player): void {
    const addedList = team === 'hosts' ? this.hostsAddedPlayers : this.visitorsAddedPlayers;
    const removedList = team === 'hosts' ? this.hostsRemovedPlayers : this.visitorsRemovedPlayers;

    if (this.match?.fieldPlayers.includes(player.id)) {
      const indexInAdded = addedList.indexOf(player.id);
      if (indexInAdded !== -1) addedList.splice(indexInAdded, 1);
      else removedList.push(player.id);
      this.match?.fieldPlayers.splice(this.match?.fieldPlayers.indexOf(player.id), 1);
    } else {
      const indexInRemoved = removedList.indexOf(player.id);
      if (indexInRemoved !== -1) removedList.splice(indexInRemoved, 1);
      else addedList.push(player.id);
      this.match?.fieldPlayers.push(player.id);
    }
  }

  toggleEncoder(encoder: User): void {
    if (this.match?.playEncoders.includes(encoder)) {
      this.match?.playEncoders.splice(this.match?.playEncoders.indexOf(encoder), 1);
      this.removedEncoders.push(encoder.id);
      const indexInAdded = this.addedEncoders.indexOf(encoder.id);
      if (indexInAdded !== -1) this.addedEncoders.splice(indexInAdded, 1);
    } else {
      this.match?.playEncoders.push(encoder);
      this.addedEncoders.push(encoder.id);
      const indexInRemoved = this.removedEncoders.indexOf(encoder.id);
      if (indexInRemoved !== -1) this.removedEncoders.splice(indexInRemoved, 1);
    }
  }

  saveListsChanges(): void {
    if (!this.match) return;

    this.updateMatch(this.hostsRemovedPlayers, this.hostsAddedPlayers, 'hosts');
    this.updateMatch(this.visitorsRemovedPlayers, this.visitorsAddedPlayers, 'visitors');
    this.updateMatch(this.removedEncoders, this.addedEncoders);

    this.hostsAddedPlayers = [];
    this.hostsRemovedPlayers = [];
    this.visitorsAddedPlayers = [];
    this.visitorsRemovedPlayers = [];
    this.addedEncoders = [];
    this.removedEncoders = [];
  }

  updateMatch(leavingEntities: string[], incomingEntities: string[], side?: 'hosts' | 'visitors') {
    if (leavingEntities.length !== 0 || incomingEntities.length !== 0) {
      var listUpdate: MatchListUpdate = {
        leavingEntities: leavingEntities,
        incomingEntities: incomingEntities
      };
      var headers = this.authService.getAuthHeader();
      var updateCall!: Observable<Match>;
      if (side) updateCall = this.matchService.updatePlayers(this.matchId, side, listUpdate, headers);
      else updateCall = this.matchService.updateEncoders(this.matchId, listUpdate, headers);
      updateCall.subscribe({
        next: (updatedMatch) => this.match = updatedMatch,
        error: (error) => {
          console.error('Error updating match:', error);
          this.router.navigate(['/access-denied'])
        }
      })
    }
  }

  startMatch(): void {
    if (this.match && this.isPreparationMode) {
      if (this.hostsSelectedPlayers?.length === 5 && this.visitorsSelectedPlayers?.length === 5) {
        this.match.hasStarted = true;
        var update: MatchPrepUpdate = {
          hasStarted: true
        }
        var headers = this.authService.getAuthHeader();
        this.matchService.updatePrep(this.match.id, update, headers).subscribe({
          next: (updatedMatch) => {
            this.match = updatedMatch
          },
          error: (err: any) => {
            console.error('Error starting match', err);
          },
        });
      } else {
        console.log("Both teams must have exactly 5 players on field each to be able to start the match");
      }
    }
  }

  // Placeholder method to handle play events
  encodeEvent(eventType: string, eventDetails: any): void {
    console.log('Encoding event:', eventType, eventDetails);
  }
}
