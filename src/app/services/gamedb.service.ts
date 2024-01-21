import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

@Injectable({
  providedIn: 'root',
})
export class GameDBService {
  private games: GameDBRecord[] = [];
  private isLoaded = false;
  gamesChanged = new Subject<void>();

  loadGames() {
    if (typeof Storage !== 'undefined') {
      if (!this.isLoaded) {
        const games = localStorage.getItem('puzzle');
        this.games = games ? JSON.parse(games) : [];
        this.isLoaded = true;
      }
    }
  }

  getGames() {
    this.loadGames();
    return this.games.slice();
  }

  saveGame(game) {
    this.loadGames();

    const count = this.games.length;
    game.id = count ? this.games[count - 1].id + 1 : 0;
    this.games.push(game);

    localStorage.setItem('puzzle', JSON.stringify(this.games));
  }

  deleteGame(id: number) {
    this.games = this.games.filter((game) => game.id !== id);
    localStorage.setItem('puzzle', JSON.stringify(this.games));

    this.gamesChanged.next();
  }
}

export type GameDBRecord = {
  id: number;
  categoryId: number;
  folder: string;
  image: string;
  time: string;
  moves: number;
  misses: number;
};
