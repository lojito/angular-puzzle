import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import {
  DictionaryEntry,
  DictionaryService,
} from '../../services/dictionary.service';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css'],
})
export class NavigationComponent implements OnInit, OnDestroy {
  private subscription: Subscription;
  puzzle: string;
  historical: string;
  repository: string;
  about: string;
  contact: string;

  constructor(private dictionaryService: DictionaryService) {}

  setProperties(texts: DictionaryEntry) {
    this.puzzle = texts.HOME;
    this.historical = texts.HISTORY;
    this.repository = texts.REPOSITORY;
    this.about = texts.ABOUT;
    this.contact = texts.CONTACT;
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
