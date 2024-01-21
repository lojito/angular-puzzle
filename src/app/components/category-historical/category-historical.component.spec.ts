/* tslint:disable:no-string-literal */
import { Subject, Subscription } from 'rxjs';
import { CategoryHistoricalComponent } from './category-historical.component';

describe('CategoryHistoricalComponent', () => {
  let component: CategoryHistoricalComponent;

  const texts = {
    CATEGORY: 'Category:',
  };

  class DictionaryServiceStub {
    private getTextsSource = new Subject();

    getTexts() {
      return this.getTextsSource.asObservable();
    }

    emit(categoryHistoricalTexts) {
      this.getTextsSource.next(categoryHistoricalTexts);
    }
  }

  let dictionaryServiceStub: DictionaryServiceStub;

  const categoriesSpanish = [
    { id: 0, name: 'Monumentos de La Habana', folder: 'habana' },
    { id: 1, name: 'Monumentos de Montreal', folder: 'montreal' },
    { id: 2, name: 'Monumentos de Vancouver', folder: 'vancouver' },
  ];

  class CategoryServiceStub {
    private fetchCategoriesSource = new Subject();

    fetchCategories() {
      return this.fetchCategoriesSource.asObservable();
    }

    emit(categories) {
      this.fetchCategoriesSource.next(categories);
    }
  }

  let categoryServiceStub: CategoryServiceStub;

  beforeEach(() => {
    categoryServiceStub = new CategoryServiceStub();
    dictionaryServiceStub = new DictionaryServiceStub();
    component = new CategoryHistoricalComponent(
      dictionaryServiceStub as any,
      categoryServiceStub as any
    );
    component.categoryId = 0;
  });

  it('should set the categoryText property correctly', () => {
    component['setProperties'](texts);

    expect(component.categoryText).toBe(texts.CATEGORY);
  });

  it('should set the categoriesSubscription and the categoryName properties', () => {
    component.loadCategories();

    categoryServiceStub.emit(categoriesSpanish);

    expect(component['categoriesSubscription']).not.toBeUndefined();
    expect(component.categoryName).toBe('Monumentos de La Habana');
  });

  it('should call the setProperties() method', () => {
    const spySetProperties = spyOn<any>(component, 'setProperties');
    component.ngOnInit();

    dictionaryServiceStub.emit(texts);

    expect(spySetProperties).toHaveBeenCalledWith(texts);
  });

  it('should call the unsubscribe method()', () => {
    component['subscription'] = new Subscription();
    spyOn(component['subscription'], 'unsubscribe');
    component['categoriesSubscription'] = new Subscription();
    spyOn(component['categoriesSubscription'], 'unsubscribe');

    component.ngOnDestroy();

    expect(component['subscription'].unsubscribe).toHaveBeenCalled();
    expect(component['categoriesSubscription'].unsubscribe).toHaveBeenCalled();
  });
});
