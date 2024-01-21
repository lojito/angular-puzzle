import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import {
  DictionaryEntry,
  DictionaryService,
} from '../../services/dictionary.service';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css'],
})
export class ContactComponent implements OnInit, OnDestroy {
  private subscription: Subscription;
  author: string;
  email: string;
  github: string;
  linkedin: string;
  availability: string;
  status: string;

  constructor(private dictionaryService: DictionaryService) {}

  private setProperties(texts: DictionaryEntry) {
    this.author = texts.AUTHOR;
    this.email = texts.EMAIL;
    this.github = texts.GITHUB;
    this.linkedin = texts.LINKEDIN;
    this.availability = texts.AVAILABILITY;
    this.status = texts.STATUS;
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
