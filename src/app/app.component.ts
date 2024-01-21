import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { AppError } from './errors/app-error';
import { NotFoundError } from './errors/not-found-error';
import { CategoryService } from './services/category.service';
import { DictionaryService } from './services/dictionary.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [Title],
})
export class AppComponent implements OnInit {
  private subscription: Subscription;
  private categoriesSubscription: Subscription;
  loading = false;
  loadingMessage = 'Loading the dictionary.json file...';
  error = false;
  errorMessage = '';

  constructor(
    private dictionaryService: DictionaryService,
    private categoryService: CategoryService,
    private router: Router,
    private titleService: Title
  ) {}

  loadCategories() {
    this.loading = true;
    this.loadingMessage = 'Loading the categories.json file...';

    this.categoriesSubscription = this.categoryService
      .fetchCategories()
      .subscribe(
        () => {
          this.loading = false;
        },
        (err: AppError) => {
          this.loading = false;
          this.error = true;

          if (err instanceof NotFoundError) {
            this.errorMessage = 'Cannot find the categories.json file.';
          } else {
            this.errorMessage =
              'An unexpected error occurred while loading the categories.json file.';
          }
        }
      );
  }

  loadDictionary() {
    this.loading = true;

    this.subscription = this.dictionaryService.getTexts().subscribe(
      () => {
        this.loading = false;
        this.loadCategories();
      },
      (err: AppError) => {
        this.loading = false;
        this.error = true;

        if (err instanceof NotFoundError) {
          this.errorMessage = 'Cannot find the dictionary.json file.';
        } else {
          this.errorMessage =
            'An unexpected error occurred while loading the dictionary.json file.';
        }
      }
    );
  }

  ngOnInit() {
    this.loadDictionary();

    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        map(() => {
          let route: ActivatedRoute = this.router.routerState.root;
          let routeTitle = '';

          while (route && route.firstChild) {
            route = route.firstChild;
          }
          if (route.snapshot.data.title) {
            routeTitle = route.snapshot.data.title;
          }

          return routeTitle;
        })
      )
      .subscribe((title: string) => {
        if (title) {
          this.titleService.setTitle(`Puzzle - ${title}`);
        }
      });
  }

  onChildLoaded() {
    const chk = document.getElementById('menu') as HTMLInputElement;
    chk.checked = false;
  }
}
