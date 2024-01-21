/* tslint:disable:no-string-literal */
import { HttpClient } from '@angular/common/http';
import { of, throwError } from 'rxjs';
import { AppError } from '../errors/app-error';
import { NotFoundError } from '../errors/not-found-error';
import {
  DictionaryEntry,
  DictionaryService,
  ENGLISH,
  FRENCH,
} from './dictionary.service';

describe('DictionaryService', () => {
  const data: DictionaryEntry[] = [
    {
      ABOUT: 'About',
      ANIMALS: 'Animals',
      AUTHOR: 'Author:',
      AVAILABILITY: 'Availability:',
      BACK: 'Back',
      CATEGORY: 'Category:',
      CONTACT: 'Contact',
      DELETE_PUZZLE: 'Delete Puzzle',
      EMAIL: 'E-mail:',
      ENGLISH_HINT: 'English',
      FLAG: 'usa',
      LANG: '0',
    },
    {
      ABOUT: 'À propos de',
      ANIMALS: 'Des animaux',
      AUTHOR: 'Auteur:',
      AVAILABILITY: 'Disponibilité:',
      BACK: 'Retour',
      CATEGORY: 'Catégorie:',
      CONTACT: 'Contact',
      DELETE_PUZZLE: 'Effacer le jeu',
      EMAIL: 'Courrier électronique:',
      ENGLISH_HINT: 'French',
      FLAG: 'france',
      LANG: '1',
    },
  ];

  let dictionaryService: DictionaryService;

  beforeEach(() => {
    dictionaryService = new DictionaryService(new HttpClient(null));
  });

  it('should set the initial properties correctly', () => {
    expect(dictionaryService['lang']).toBe(ENGLISH);
    expect(dictionaryService['texts']).toEqual([]);
    expect(dictionaryService['loading']).toBe(false);
  });

  it('should fetch the dictionary.json file', (done) => {
    spyOn(HttpClient.prototype, 'get').and.returnValue(of(data));

    dictionaryService.getTexts().subscribe(() => {
      expect(dictionaryService['texts']).toEqual(data);
      done();
    });
  });

  it('should not fetch the dictionary.json file and instead error with a NotFoundError instance', (done) => {
    spyOn(HttpClient.prototype, 'get').and.returnValue(
      throwError({ status: 404 })
    );

    dictionaryService.getTexts().subscribe(
      () => {},
      (err: AppError) => {
        expect(err).toBeInstanceOf(NotFoundError);
        expect(dictionaryService['texts']).toEqual([]);
        done();
      }
    );
  });

  it('should not fetch the dictionary.json file and instead error with an AppError instance', (done) => {
    spyOn(HttpClient.prototype, 'get').and.returnValue(
      throwError({ status: 400 })
    );

    dictionaryService.getTexts().subscribe(
      () => {},
      (err: AppError) => {
        expect(err).toBeInstanceOf(AppError);
        expect(dictionaryService['texts']).toEqual([]);
        done();
      }
    );
  });

  it('should get the English texts without loading the dictionary.json file', (done) => {
    dictionaryService['texts'] = data;
    dictionaryService['loading'] = true;
    const httpClientGet = spyOn(HttpClient.prototype, 'get');

    dictionaryService.getTexts().subscribe(() => {
      clearTimeout(dictionaryService['intervalId']);

      expect(dictionaryService['texts']).toEqual(data);
      expect(httpClientGet).not.toHaveBeenCalled();
      done();
    });
  });

  it('should get the French texts without loading the dictionary.json file', (done) => {
    dictionaryService['lang'] = FRENCH;
    dictionaryService['texts'] = data;
    dictionaryService['loading'] = true;
    const httpClientGet = spyOn(HttpClient.prototype, 'get');

    dictionaryService.getTexts().subscribe((text: DictionaryEntry) => {
      clearTimeout(dictionaryService['intervalId']);

      expect(text).toEqual(data[1]);
      expect(httpClientGet).not.toHaveBeenCalled();
      done();
    });
  });

  it('should get the languages', () => {
    dictionaryService['texts'] = data;

    const languages = dictionaryService.getLanguages();

    expect(languages).toEqual([
      { id: '0', flag: 'usa', hint: 'English' },
      { id: '1', flag: 'france', hint: 'French' },
    ]);
  });

  it('should set the lang property', () => {
    const FRENCH_LANGUAGE_ID = FRENCH;

    dictionaryService.setLanguage(FRENCH_LANGUAGE_ID);

    expect(dictionaryService['lang']).toBe(FRENCH_LANGUAGE_ID);
  });
});
