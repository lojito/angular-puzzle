/* tslint:disable:no-string-literal */
import { Component, NgZone } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By, Title } from '@angular/platform-browser';
import { Route, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { Subject } from 'rxjs';
import { AppComponent } from './app.component';
import { AppError } from './errors/app-error';
import { NotFoundError } from './errors/not-found-error';
import { CategoryService } from './services/category.service';
import { DictionaryService } from './services/dictionary.service';

@Component({
  selector: 'app-header',
  template: '',
})
class HeaderComponent {}

@Component({
  selector: 'app-navigation',
  template:
    '<nav><input type="checkbox" id="menu" style="display:none"/></nav>',
})
class NavigationComponent {}

@Component({
  selector: 'app-game',
  template: '',
})
class GameComponent {}

@Component({
  selector: 'app-historical',
  template: '',
})
class GameHistoricalComponent {}

class CategoryServiceStub {
  private fetchCategoriesSource = new Subject();

  fetchCategories() {
    return this.fetchCategoriesSource.asObservable();
  }

  emit(categoryServiceTexts) {
    this.fetchCategoriesSource.next(categoryServiceTexts);
  }

  error(err: AppError) {
    this.fetchCategoriesSource.error(err);
  }
}

class DictionaryServiceStub {
  private getTextsSource = new Subject();

  getTexts() {
    return this.getTextsSource.asObservable();
  }

  emit(categoryServiceTexts) {
    this.getTextsSource.next(categoryServiceTexts);
  }

  error(err: AppError) {
    this.getTextsSource.error(err);
  }
}

describe('AppComponent', () => {
  beforeEach(async () => {
    const home: Route = {
      path: '',
      component: GameComponent,
      data: { title: 'Home' },
    };
    const historical: Route = {
      path: 'historical',
      component: GameHistoricalComponent,
      data: {},
    };
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([home, historical])],
      declarations: [AppComponent, HeaderComponent, NavigationComponent],
      providers: [
        { provide: CategoryService, useClass: CategoryServiceStub },
        { provide: DictionaryService, useClass: DictionaryServiceStub },
      ],
    }).compileComponents();
  });

  let fixture: ComponentFixture<AppComponent>;
  let component: AppComponent;

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    // fixture.detectChanges();
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it('should set the properties correctly', () => {
    expect(component['subscription']).toBeUndefined();
    expect(component['categoriesSubscription']).toBeUndefined();
    expect(component.loading).toBeFalsy();
    expect(component.loadingMessage).toContain('dictionary.json');
    expect(component.error).toBeFalsy();
    expect(component.errorMessage).toBe('');
  });

  it('should call the fetchCategories() method and set the loading property to false', (done) => {
    const categoryService = TestBed.inject(CategoryService);
    component.loadCategories();

    categoryService.fetchCategories().subscribe(() => {
      expect(component.loading).toBeFalsy();
      done();
    });

    categoryService['emit']([]);
  });

  it('should call the fetchCategories() method and error with a NotFoundError instance', (done) => {
    const categoryService = TestBed.inject(CategoryService);
    component.loadCategories();

    categoryService.fetchCategories().subscribe(
      () => {},
      (err: AppError) => {
        expect(err).toBeInstanceOf(NotFoundError);
        done();
      }
    );

    categoryService['error'](new NotFoundError());
  });

  it('should call the fetchCategories() method and error with a AppError instance', (done) => {
    const categoryService = TestBed.inject(CategoryService);
    component.loadCategories();

    categoryService.fetchCategories().subscribe(
      () => {},
      (err: AppError) => {
        expect(err).not.toBeInstanceOf(NotFoundError);
        done();
      }
    );

    categoryService['error'](new AppError());
  });

  it('should call the getTexts() method and set the loading property to false', (done) => {
    spyOn(component, 'loadCategories');
    const dictionaryService = TestBed.inject(DictionaryService);
    component.loadDictionary();

    dictionaryService.getTexts().subscribe(() => {
      expect(component.loading).toBeFalsy();
      done();
    });

    dictionaryService['emit']([]);
  });

  it('should call the getTexts() method and error with a NotFoundError instance', (done) => {
    const dictionaryService = TestBed.inject(DictionaryService);
    component.loadDictionary();

    dictionaryService.getTexts().subscribe(
      () => {},
      (err: AppError) => {
        expect(err).toBeInstanceOf(NotFoundError);
        done();
      }
    );

    dictionaryService['error'](new NotFoundError());
  });

  it('should call the getTexts() method and error with a AppError instance', (done) => {
    const dictionaryService = TestBed.inject(DictionaryService);
    component.loadDictionary();

    dictionaryService.getTexts().subscribe(
      () => {},
      (err: AppError) => {
        expect(err).not.toBeInstanceOf(NotFoundError);
        done();
      }
    );

    dictionaryService['error'](new AppError());
  });

  it('should update the browser page title', async () => {
    component.ngOnInit();
    const router = TestBed.inject(Router);
    const titleService = fixture.debugElement.injector.get(Title);
    const ngZone: NgZone = TestBed.inject(NgZone);

    await ngZone.run(async () => router.navigateByUrl(''));

    expect(titleService.getTitle()).toContain('Puzzle');
  });

  it('should not update the browser page title', async () => {
    component.ngOnInit();
    const router = TestBed.inject(Router);
    const titleService = fixture.debugElement.injector.get(Title);
    const ngZone: NgZone = TestBed.inject(NgZone);

    await ngZone.run(async () => router.navigateByUrl('historical'));

    expect(titleService.getTitle()).not.toContain('historical');
  });

  it('should render the id=menu input', async () => {
    const de = fixture.debugElement.query(By.css('#menu'));

    expect(de.nativeElement).toBeDefined();
  });
});
