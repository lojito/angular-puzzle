import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppError } from '../errors/app-error';
import { NotFoundError } from '../errors/not-found-error';

@Injectable({
  providedIn: 'root',
})
export class DictionaryService {
  private lang = ENGLISH;
  private texts: DictionaryEntry[] = [];
  private loading = false;
  private intervalId: number;

  constructor(private http: HttpClient) {}

  getTexts() {
    return new Observable((observer) => {
      if (this.loading) {
        this.intervalId = window.setInterval(() => {
          observer.next(this.texts[this.lang]);
        }, 200);
      } else {
        this.loading = true;

        this.http.get('assets/json/dictionary.json').subscribe(
          (texts: DictionaryEntry[]) => {
            this.texts = texts;
            observer.next(texts[ENGLISH]);
          },
          (err: Response) => {
            if (err.status === 404) {
              observer.error(new NotFoundError());
            } else {
              observer.error(new AppError());
            }
          }
        );
      }
    });
  }

  getLanguages() {
    const languages: Language[] = [];

    for (const text of this.texts) {
      languages.push({
        id: text.LANG,
        flag: text.FLAG,
        hint: text[
          this.texts[this.lang].ENGLISH_HINT.toUpperCase() + '_' + 'HINT'
        ],
      });
    }

    return languages;
  }

  setLanguage(lang: string) {
    this.lang = lang;
  }
}

export type Language = {
  id: string;
  flag: string;
  hint: string;
};

export const UNKNOWN = '-1';
export const ENGLISH = '0';
export const FRENCH = '1';
export const SPANISH = '2';

export type DictionaryEntry = Partial<
  Record<
    | 'ABOUT'
    | 'ANIMALS'
    | 'AUTHOR'
    | 'AVAILABILITY'
    | 'BACK'
    | 'CATEGORY'
    | 'CONTACT'
    | 'DELETE_PUZZLE'
    | 'EMAIL'
    | 'ENGLISH_HINT'
    | 'MISSES'
    | 'FLAG'
    | 'FRENCH_HINT'
    | 'FRUITS_AND_VEGETABLES'
    | 'GAME_GOAL'
    | 'GAME_OVER'
    | 'GERMANY_LANDMARKS'
    | 'GITHUB'
    | 'HAVANA_LANDMARKS'
    | 'HISTORY'
    | 'HOME'
    | 'LANG'
    | 'IMAGE'
    | 'LINKEDIN'
    | 'MONTREAL_LANDMARKS'
    | 'MOVES'
    | 'NO_HISTORICAL_DATA_YET'
    | 'OTHER_PROJECTS'
    | 'PUPPIES'
    | 'REPOSITORY'
    | 'SCORE'
    | 'SECONDS'
    | 'SEE_GAME'
    | 'SEINFELD'
    | 'SOCCER_PLAYERS'
    | 'SOURCE_CODE'
    | 'SPAIN_LANDMARKS'
    | 'SPANISH_HINT'
    | 'START_OVER'
    | 'STATUS'
    | 'TECH_STACK'
    | 'TIME'
    | 'VANCOUVER_LANDMARKS',
    string
  >
>;
