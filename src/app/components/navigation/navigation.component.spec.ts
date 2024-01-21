/* tslint:disable:no-string-literal */
import { Subject, Subscription } from 'rxjs';
import { NavigationComponent } from './navigation.component';

describe('NavigationComponent', () => {
  let component: NavigationComponent;

  const texts = {
    HOME: 'Puzzle:',
    HISTORY: 'Histórico:',
    REPOSITORY: 'Banco:',
    ABOUT: 'Acerca de:',
    CONTACT: 'Contacto:',
  };

  class DictionaryServiceStub {
    private getTextsSource = new Subject();

    getTexts() {
      return this.getTextsSource.asObservable();
    }

    emit(navigationTexts) {
      this.getTextsSource.next(navigationTexts);
    }
  }

  let dictionaryServiceStub: DictionaryServiceStub;

  beforeEach(() => {
    dictionaryServiceStub = new DictionaryServiceStub();
    component = new NavigationComponent(dictionaryServiceStub as any);
  });

  it('should set the properties correctly', () => {
    component['setProperties'](texts);

    expect(component.puzzle).toBe(texts.HOME);
    expect(component.historical).toBe(texts.HISTORY);
    expect(component.repository).toBe(texts.REPOSITORY);
    expect(component.about).toBe(texts.ABOUT);
    expect(component.contact).toBe(texts.CONTACT);
  });

  it('should call the setProperties() method', () => {
    const spySetProperties = spyOn<any>(component, 'setProperties');
    component.ngOnInit();

    dictionaryServiceStub.emit(texts);

    expect(spySetProperties).toHaveBeenCalled();
  });

  it('should call the unsubscribe method()', () => {
    component['subscription'] = new Subscription();
    spyOn(component['subscription'], 'unsubscribe');

    component.ngOnDestroy();

    expect(component['subscription'].unsubscribe).toHaveBeenCalled();
  });
});
