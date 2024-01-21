/* tslint:disable:no-string-literal */
import { HttpClient } from '@angular/common/http';
import { Subject, of, throwError } from 'rxjs';
import { AppError } from '../errors/app-error';
import { NotFoundError } from '../errors/not-found-error';
import { CategoryService, CategoryType } from './category.service';

describe('CategoryService', () => {
  let categoryService: CategoryService;

  const texts = {
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
    MISSES: 'Misses:',
    LANG: '0',
    FLAG: 'usa',
  };

  const languages = [
    { id: '0', flag: 'usa' },
    { id: '1', flag: 'france' },
    { id: '2', flag: 'spain' },
  ];

  class DictionaryServiceStub {
    private getTextsSource = new Subject();

    getTexts() {
      return this.getTextsSource.asObservable();
    }

    getLanguages() {
      return languages;
    }

    setLanguage(lang: string) {}

    emit(categoryServiceTexts) {
      this.getTextsSource.next(categoryServiceTexts);
    }
  }

  let dictionaryServiceStub: DictionaryServiceStub;

  const jsonCategories: CategoryType[] = [
    {
      folder: 'habana',
      id: 0,
      name: 'HAVANA_LANDMARKS',
    },
    {
      folder: 'montreal',
      id: 1,
      name: 'MONTREAL_LANDMARKS',
    },
    {
      folder: 'vancouver',
      id: 2,
      name: 'VANCOUVER_LANDMARKS',
    },
    {
      folder: 'spain',
      id: 3,
      name: 'SPAIN_LANDMARKS',
    },
    {
      folder: 'germany',
      id: 4,
      name: 'GERMANY_LANDMARKS',
    },
    {
      folder: 'soccer',
      id: 5,
      name: 'SOCCER_PLAYERS',
    },
    {
      folder: 'fruits',
      id: 6,
      name: 'FRUITS_AND_VEGETABLES',
    },
    {
      folder: 'animals',
      id: 7,
      name: 'ANIMALS',
    },
    {
      folder: 'seinfeld',
      id: 8,
      name: 'SEINFELD',
    },
    {
      folder: 'puppies',
      id: 9,
      name: 'PUPPIES',
    },
  ];

  const englishCategories: CategoryType[] = [
    {
      folder: 'habana',
      id: 0,
      name: 'La Havana landmarks',
    },
    {
      folder: 'montreal',
      id: 1,
      name: 'Montreal landmarks',
    },
    {
      folder: 'vancouver',
      id: 2,
      name: 'Vancouver landmarks',
    },
    {
      folder: 'spain',
      id: 3,
      name: 'Spain landmarks',
    },
    {
      folder: 'germany',
      id: 4,
      name: 'Germany landmarks',
    },
    {
      folder: 'soccer',
      id: 5,
      name: 'Soccer players',
    },
    {
      folder: 'fruits',
      id: 6,
      name: 'Fruits & Vegetables',
    },
    {
      folder: 'animals',
      id: 7,
      name: 'Animals',
    },
    {
      folder: 'seinfeld',
      id: 8,
      name: 'Seinfeld',
    },
    {
      folder: 'puppies',
      id: 9,
      name: 'Puppies',
    },
  ];

  beforeEach(() => {
    dictionaryServiceStub = new DictionaryServiceStub();
  });

  it('should set the properties correctly', () => {
    spyOn<any>(CategoryService.prototype, 'init');

    categoryService = new CategoryService(
      new HttpClient(null),
      dictionaryServiceStub as any
    );

    expect(categoryService['subscription']).toBeUndefined();
    expect(categoryService['categories']).toEqual([]);
    expect(categoryService['texts']).toBeUndefined();
    expect(categoryService['http']).not.toBeNull();
    expect(categoryService['dictionaryService']).not.toBeNull();
  });

  it('should call the init() method', () => {
    const spyInit = spyOn<any>(CategoryService.prototype, 'init');

    categoryService = new CategoryService(
      new HttpClient(null),
      dictionaryServiceStub as any
    );

    expect(spyInit).toHaveBeenCalled();
  });

  it('should call the dictionaryService getTexts() method', () => {
    const spyGetTexts = spyOn<any>(
      dictionaryServiceStub,
      'getTexts'
    ).and.callFake(() => ({ subscribe() {} }));
    const init = CategoryService.prototype.init;
    spyOn<any>(CategoryService.prototype, 'init');
    categoryService = new CategoryService(
      new HttpClient(null),
      dictionaryServiceStub as any
    );
    CategoryService.prototype.init = jasmine.createSpy().and.callFake(init);

    categoryService.init();

    expect(spyGetTexts).toHaveBeenCalled();
  });

  it('should set the texts property', () => {
    const init = CategoryService.prototype.init;
    spyOn<any>(CategoryService.prototype, 'init');
    categoryService = new CategoryService(
      new HttpClient(null),
      dictionaryServiceStub as any
    );
    CategoryService.prototype.init = jasmine.createSpy().and.callFake(init);

    categoryService.init();
    dictionaryServiceStub.emit(texts);

    expect(categoryService['texts']).toEqual(texts);
  });

  it('should fetch the categories.json file', (done) => {
    spyOn(HttpClient.prototype, 'get').and.returnValue(of(jsonCategories));
    spyOn<any>(CategoryService.prototype, 'init');
    categoryService = new CategoryService(
      new HttpClient(null),
      dictionaryServiceStub as any
    );
    spyOn(categoryService, 'getCategories').and.returnValue(englishCategories);

    categoryService
      .fetchCategories()
      .subscribe((categories: CategoryType[]) => {
        expect(categories).toEqual(englishCategories);
        done();
      });
  });

  it('should not fetch the categories.json file and instead error with a NotFoundError instance', (done) => {
    spyOn<any>(CategoryService.prototype, 'init');
    categoryService = new CategoryService(
      new HttpClient(null),
      dictionaryServiceStub as any
    );
    spyOn(HttpClient.prototype, 'get').and.returnValue(
      throwError({ status: 404 })
    );

    categoryService.fetchCategories().subscribe(
      () => {},
      (err: AppError) => {
        expect(err).toBeInstanceOf(NotFoundError);
        expect(categoryService['categories']).toEqual([]);
        done();
      }
    );
  });

  it('should not fetch the categories.json file and instead error with a AppError instance', (done) => {
    spyOn<any>(CategoryService.prototype, 'init');
    categoryService = new CategoryService(
      new HttpClient(null),
      dictionaryServiceStub as any
    );
    spyOn(HttpClient.prototype, 'get').and.returnValue(
      throwError({ status: 400 })
    );

    categoryService.fetchCategories().subscribe(
      () => {},
      (err: AppError) => {
        expect(err).toBeInstanceOf(AppError);
        expect(categoryService['categories']).toEqual([]);
        done();
      }
    );
  });

  it('should get the Categories texts without loading the categories.json file', (done) => {
    spyOn<any>(CategoryService.prototype, 'init');
    categoryService = new CategoryService(
      new HttpClient(null),
      dictionaryServiceStub as any
    );
    spyOn(categoryService, 'getCategories').and.returnValue(englishCategories);
    categoryService['categories'] = englishCategories;

    categoryService
      .fetchCategories()
      .subscribe((categories: CategoryType[]) => {
        expect(categories).toEqual(englishCategories);
        done();
      });
  });

  it('should get the categories', () => {
    spyOn<any>(CategoryService.prototype, 'init');
    categoryService = new CategoryService(
      new HttpClient(null),
      dictionaryServiceStub as any
    );
    const mappingCategoriesNames = {
      HAVANA_LANDMARKS: 'La Havana landmarks',
      MONTREAL_LANDMARKS: 'Montreal landmarks',
      VANCOUVER_LANDMARKS: 'Vancouver landmarks',
      SPAIN_LANDMARKS: 'Spain landmarks',
      GERMANY_LANDMARKS: 'Germany landmarks',
      SOCCER_PLAYERS: 'Soccer players',
      FRUITS_AND_VEGETABLES: 'Fruits & Vegetables',
      ANIMALS: 'Animals',
      SEINFELD: 'Seinfeld',
      PUPPIES: 'Puppies',
    };
    categoryService['texts'] = mappingCategoriesNames;
    categoryService['categories'] = jsonCategories;

    const translateCategories = categoryService.getCategories();

    expect(translateCategories).toEqual(englishCategories);
  });
});
