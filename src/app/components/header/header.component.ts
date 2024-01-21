import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import {
  DictionaryService,
  ENGLISH,
  Language,
} from '../../services/dictionary.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  private subscription: Subscription;
  languages: Language[];
  defaultLanguage = ENGLISH;

  constructor(private dictionaryService: DictionaryService) {}

  ngOnInit() {
    this.subscription = this.dictionaryService.getTexts().subscribe(() => {
      this.languages = this.dictionaryService.getLanguages();
      this.subscription.unsubscribe();
    });
  }

  setLanguage(lang: string) {
    this.defaultLanguage = lang;
    this.dictionaryService.setLanguage(lang);
    this.languages = this.dictionaryService.getLanguages();
  }
}
