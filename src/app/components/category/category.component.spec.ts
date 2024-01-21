/* tslint:disable:no-string-literal */
import { Subject, Subscription, of } from 'rxjs';
import { CategoryComponent } from './category.component';

describe('CategoryComponent', () => {
  const categoriesSpanish = [
    { id: 0, name: 'Monumentos de La Habana', folder: 'habana' },
    { id: 1, name: 'Monumentos de Montreal', folder: 'montreal' },
    { id: 2, name: 'Monumentos de Vancouver', folder: 'vancouver' },
    { id: 3, name: 'Monumentos de España', folder: 'spain' },
    { id: 4, name: 'Monumentos de Alemania', folder: 'germany' },
    { id: 5, name: 'Jugadores de fútbol', folder: 'soccer' },
    { id: 6, name: 'Frutas y vegetales', folder: 'fruits' },
    { id: 7, name: 'Animales', folder: 'animals' },
    { id: 8, name: 'Seinfeld', folder: 'seinfeld' },
    { id: 9, name: 'Cachorros', folder: 'puppies' },
  ];
  const texts = {
    CATEGORY: 'Category:',
  };

  class DictionaryServiceStub {
    private getTextsSource = new Subject();

    getTexts() {
      return this.getTextsSource.asObservable();
    }

    emit(categoryTexts) {
      this.getTextsSource.next(categoryTexts);
    }
  }

  let dictionaryServiceStub: DictionaryServiceStub;

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
    dictionaryServiceStub = new DictionaryServiceStub();
    categoryServiceStub = new CategoryServiceStub();
  });

  it('should emit a new category', () => {
    const component = new CategoryComponent(
      dictionaryServiceStub as any,
      categoryServiceStub as any
    );
    component.categories = categoriesSpanish;
    component.categoryId = 0;
    const spyOnNewCategory = spyOn(component.newCategory, 'emit');

    component.updateCategory();

    expect(spyOnNewCategory).toHaveBeenCalledWith({
      categoryId: component.categoryId,
      folder: component.categories[component.categoryId].folder,
    });
  });

  it('should pick a random categoryId', () => {
    const component = new CategoryComponent(
      dictionaryServiceStub as any,
      categoryServiceStub as any
    );
    component.categories = categoriesSpanish;
    const spyUpdateCategory = spyOn<any>(component, 'updateCategory');
    const previousCategoryId = component.categoryId;

    component['setCategoryId']();

    expect(component.categoryId).not.toBe(previousCategoryId);
    expect(spyUpdateCategory).toHaveBeenCalled();
  });

  it('should not pick a random categoryId', () => {
    const component = new CategoryComponent(
      dictionaryServiceStub as any,
      categoryServiceStub as any
    );
    const spyUpdateCategory = spyOn<any>(component, 'updateCategory');
    const previousCategoryId = component.categoryId;

    component['setCategoryId']();

    expect(component.categoryId).toBe(previousCategoryId);
    expect(spyUpdateCategory).not.toHaveBeenCalled();
  });

  it('should set the categoriesSubscription and the categories properties', () => {
    spyOn(categoryServiceStub as any, 'fetchCategories').and.returnValue(
      of(categoriesSpanish)
    );
    const component = new CategoryComponent(
      dictionaryServiceStub as any,
      categoryServiceStub as any
    );
    spyOn<any>(component, 'setCategoryId');

    component.loadCategories();

    expect(component['categoriesSubscription']).not.toBeUndefined();
    expect(component.categories).toEqual(categoriesSpanish);
  });

  it('should not call the setCategoryId() method', () => {
    spyOn(categoryServiceStub as any, 'fetchCategories').and.returnValue(
      of(categoriesSpanish)
    );
    const component = new CategoryComponent(
      dictionaryServiceStub as any,
      categoryServiceStub as any
    );
    component.firstTime = false;
    const spyOnSetCategoryId = spyOn<any>(component, 'setCategoryId');

    component.loadCategories();

    expect(spyOnSetCategoryId).not.toHaveBeenCalled();
  });

  it('should set the categoryText property', () => {
    const component = new CategoryComponent(
      dictionaryServiceStub as any,
      categoryServiceStub as any
    );

    component['setProperties'](texts);

    expect(component.categoryText).toBe(texts.CATEGORY);
  });

  it('should call the setProperties() method', () => {
    const component = new CategoryComponent(
      dictionaryServiceStub as any,
      categoryServiceStub as any
    );
    const spySetProperties = spyOn<any>(component, 'setProperties');
    component.ngOnInit();

    dictionaryServiceStub.emit(texts);

    expect(spySetProperties).toHaveBeenCalledWith(texts);
  });

  it('should call the unsubscribe() method', () => {
    const component = new CategoryComponent(
      dictionaryServiceStub as any,
      categoryServiceStub as any
    );
    component['subscription'] = new Subscription();
    spyOn(component['subscription'], 'unsubscribe');
    component['categoriesSubscription'] = new Subscription();
    spyOn(component['categoriesSubscription'], 'unsubscribe');

    component.ngOnDestroy();

    expect(component['subscription'].unsubscribe).toHaveBeenCalled();
    expect(component['categoriesSubscription'].unsubscribe).toHaveBeenCalled();
  });

  it('should call the updateCategory() method when changing categories', () => {
    const component = new CategoryComponent(
      dictionaryServiceStub as any,
      categoryServiceStub as any
    );
    const spyUpdateCategory = spyOn<any>(component, 'updateCategory');
    const categoryId = 2;
    const event = {
      target: {
        value: categoryId,
      },
    };

    component.onChange(event);

    expect(spyUpdateCategory).toHaveBeenCalled();
  });
});
