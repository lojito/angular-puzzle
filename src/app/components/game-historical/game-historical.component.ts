import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import {
  DictionaryEntry,
  DictionaryService,
} from '../../services/dictionary.service';
import { GameDBRecord, GameDBService } from '../../services/gamedb.service';

@Component({
  selector: 'app-historical',
  templateUrl: './game-historical.component.html',
  styleUrls: ['./game-historical.component.css'],
})
export class GameHistoricalComponent implements OnInit, OnDestroy {
  private subscription: Subscription;
  private gamesChangedSubscription: Subscription;
  noHistoricalDataYet: string;
  deleteGame: string;
  games: GameDBRecord[] = [];

  constructor(
    private dictionaryService: DictionaryService,
    private gamedb: GameDBService
  ) {}

  private setProperties(texts: DictionaryEntry) {
    this.noHistoricalDataYet = texts.NO_HISTORICAL_DATA_YET;
    this.deleteGame = texts.DELETE_PUZZLE;
    this.games = this.gamedb.getGames();
  }

  setGameDBSubscription() {
    this.gamesChangedSubscription = this.gamedb.gamesChanged.subscribe(() => {
      this.games = this.gamedb.getGames();
    });
  }

  ngOnInit() {
    this.setGameDBSubscription();
    this.subscription = this.dictionaryService
      .getTexts()
      .subscribe((texts: DictionaryEntry) => {
        this.setProperties(texts);
      });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.gamesChangedSubscription.unsubscribe();
  }

  delete(gameId) {
    this.gamedb.deleteGame(gameId);
  }
}
