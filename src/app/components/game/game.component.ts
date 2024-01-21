import {
  AfterContentChecked,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { Subscription } from 'rxjs';
import {
  DictionaryEntry,
  DictionaryService,
} from '../../services/dictionary.service';
import { GameService } from '../../services/game.service';
import { GameDBService } from '../../services/gamedb.service';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css'],
})
export class GameComponent implements OnInit, OnDestroy, AfterContentChecked {
  private subscription: Subscription;
  gameGoalMessage: string;
  gameOverMessage: string;
  categoryId = 0;
  folder = '';
  image = 0;
  moves = 0;
  misses = 0;

  constructor(
    private dictionaryService: DictionaryService,
    public gameService: GameService,
    private gameDBService: GameDBService,
    private changeDetector: ChangeDetectorRef
  ) {}

  newImage(image: number) {
    this.image = image;
    this.moves = 0;
    this.misses = 0;
    this.gameService.reset();
  }

  newCategory({ categoryId, folder }) {
    this.categoryId = categoryId;
    this.folder = folder;
    this.moves = 0;
    this.misses = 0;
    this.gameService.reset();
  }

  newStats(stats: Stats) {
    this.moves = stats.moves;
    this.misses = stats.misses;
    this.gameService.over = stats.gameOver;

    if (stats.gameOver) {
      this.saveGame();
    }
  }

  saveGame() {
    this.gameDBService.saveGame({
      categoryId: this.categoryId,
      folder: this.folder,
      image: this.image,
      moves: this.moves,
      misses: this.misses,
      time: this.gameService.time,
    });
  }

  private setProperties(texts: DictionaryEntry) {
    this.gameGoalMessage = texts.GAME_GOAL;
    this.gameOverMessage = texts.GAME_OVER;
  }

  ngAfterContentChecked(): void {
    this.changeDetector.detectChanges();
  }

  ngOnInit() {
    this.subscription = this.dictionaryService
      .getTexts()
      .subscribe((texts: DictionaryEntry) => {
        this.setProperties(texts);
      });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}

export type Stats = {
  time?: string;
  moves: number;
  misses: number;
  gameOver?: boolean;
};
