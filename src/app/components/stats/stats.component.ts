import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import {
  DictionaryEntry,
  DictionaryService,
} from '../../services/dictionary.service';

@Component({
  selector: 'app-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.css'],
})
export class StatsComponent implements OnInit, OnDestroy {
  private subscription: Subscription;
  @Input() time: string;
  @Input() moves: number;
  @Input() misses: number;
  timeText: string;
  movesText: string;
  missesText: string;

  constructor(private dictionaryService: DictionaryService) {}

  setProperties(texts: DictionaryEntry) {
    this.timeText = texts.TIME;
    this.movesText = texts.MOVES;
    this.missesText = texts.MISSES;
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
