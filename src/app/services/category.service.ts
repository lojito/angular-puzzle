import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { of, throwError } from 'rxjs';
import 'rxjs/add/operator/catch';
import { map } from 'rxjs/operators';
import { AppError } from '../errors/app-error';
import { NotFoundError } from '../errors/not-found-error';
import { DictionaryEntry, DictionaryService } from './dictionary.service';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private subscription;
  private categories: CategoryType[] = [];
  private texts: DictionaryEntry;

  constructor(
    private http: HttpClient,
    private dictionaryService: DictionaryService
  ) {
    this.init();
  }

  init() {
    this.subscription = this.dictionaryService
      .getTexts()
      .subscribe((texts: DictionaryEntry) => {
        this.texts = texts;
      });
  }

  fetchCategories() {
    return this.categories.length > 0
      ? of(this.getCategories())
      : this.http
          .get('assets/json/categories.json')
          .catch((err: Response) => {
            if (err.status === 404) {
              return throwError(new NotFoundError());
            }
            return throwError(new AppError(err));
          })
          .pipe(
            map((categories: CategoryType[]) => {
              this.categories = categories;

              return this.getCategories();
            })
          );
  }

  getCategories() {
    const categories = [];

    for (const category of this.categories) {
      categories.push({
        id: category.id,
        name: this.texts[category.name],
        folder: category.folder,
      });
    }

    return categories;
  }
}

export type CategoryType = {
  id: number;
  name: string;
  folder: string;
};
