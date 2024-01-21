import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import {
  DictionaryEntry,
  DictionaryService,
} from '../../services/dictionary.service';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css'],
})
export class AboutComponent implements OnInit, OnDestroy {
  private subscription: Subscription;
  tech: string;
  source: string;
  others: string;

  constructor(private dictionaryService: DictionaryService) {}

  private setProperties(texts: DictionaryEntry) {
    this.tech = texts.TECH_STACK;
    this.source = texts.SOURCE_CODE;
    this.others = texts.OTHER_PROJECTS;
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
