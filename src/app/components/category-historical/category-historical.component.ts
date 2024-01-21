import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { CategoryService, CategoryType } from '../../services/category.service';
import {
  DictionaryEntry,
  DictionaryService,
} from '../../services/dictionary.service';

@Component({
  selector: 'app-category-historical',
  templateUrl: './category-historical.component.html',
  styleUrls: ['./category-historical.component.css'],
})
export class CategoryHistoricalComponent implements OnInit, OnDestroy {
  private subscription: Subscription;
  private categoriesSubscription: Subscription;
  categoryName: string;
  categoryText: string;
  @Input() categoryId: number;

  constructor(
    private dictionaryService: DictionaryService,
    private categoryService: CategoryService
  ) {}

  private setProperties(texts: DictionaryEntry) {
    this.categoryText = texts.CATEGORY;
  }

  loadCategories() {
    this.categoriesSubscription = this.categoryService
      .fetchCategories()
      .subscribe((categories: CategoryType[]) => {
        this.categoryName = categories[this.categoryId].name;
      });
  }

  ngOnInit() {
    this.subscription = this.dictionaryService
      .getTexts()
      .subscribe((texts: DictionaryEntry) => {
        this.setProperties(texts);
        this.loadCategories();
      });
  }

  ngOnDestroy() {
    this.categoriesSubscription.unsubscribe();
    this.subscription.unsubscribe();
  }
}
