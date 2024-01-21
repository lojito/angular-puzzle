import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class GameService {
  readonly secondsInAMinute = 60;
  private intervalId: number;
  private seconds = 0;
  private gameTime = '';
  private gameOver = false;

  get time() {
    return this.gameTime;
  }

  get over() {
    return this.gameOver;
  }

  set over(over: boolean) {
    this.gameOver = over;
  }

  internalCallback() {
    if (this.gameOver) {
      clearInterval(this.intervalId);
    } else {
      this.seconds++;
      const minutes = Math.floor(this.seconds / this.secondsInAMinute);
      const seconds = (this.seconds % this.secondsInAMinute) + 's';
      this.gameTime = minutes ? minutes + 'm ' + seconds : seconds;
    }
  }

  refreshTimer() {
    this.intervalId = window.setInterval(() => {
      this.internalCallback();
    }, 1000);
  }

  reset() {
    this.seconds = 0;
    this.gameTime = '';
    this.gameOver = false;

    if (this.intervalId) {
      clearInterval(this.intervalId);
    }

    this.refreshTimer();
  }
}
