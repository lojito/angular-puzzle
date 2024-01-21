import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { CategoryService, CategoryType } from '../../services/category.service';
import {
  DictionaryEntry,
  DictionaryService,
} from '../../services/dictionary.service';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css'],
})
export class CategoryComponent implements OnInit, OnDestroy {
  private categoriesSubscription: Subscription;
  private subscription: Subscription;
  readonly numberOfCategories = 10;
  categories: CategoryType[] = [];
  categoryId = -1;
  categoryText = '';
  firstTime = true;
  @Output() newCategory = new EventEmitter<{
    categoryId: number;
    folder: string;
  }>();

  constructor(
    private dictionaryService: DictionaryService,
    private categoryService: CategoryService
  ) {}

  updateCategory() {
    this.newCategory.emit({
      categoryId: this.categoryId,
      folder: this.categories[this.categoryId].folder,
    });
  }

  private setCategoryId() {
    if (this.categories.length !== 0) {
      this.categoryId =
        this.categories[Math.floor(Math.random() * this.numberOfCategories)].id;
      this.updateCategory();
    }
  }

  loadCategories() {
    this.categoriesSubscription = this.categoryService
      .fetchCategories()
      .subscribe((categories: CategoryType[]) => {
        this.categories = categories;
        if (this.firstTime) {
          this.firstTime = false;
          this.setCategoryId();
        }
      });
  }

  private setProperties(texts: DictionaryEntry) {
    this.categoryText = texts.CATEGORY;
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

  onChange(event) {
    this.categoryId = event.target.value;
    this.updateCategory();
  }
}
