/* tslint:disable:no-string-literal */
import { Subject } from 'rxjs';
import { HeaderComponent } from './header.component';

describe('HeaderComponent', () => {
  let component: HeaderComponent;

  const texts = {};

  const languages = [
    { id: '0', flag: 'usa', hint: 'English' },
    { id: '1', flag: 'france', hint: 'French' },
    { id: '2', flag: 'spain', hint: 'Spanish' },
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

    emit(headerTexts) {
      this.getTextsSource.next(headerTexts);
    }
  }

  let dictionaryServiceStub: DictionaryServiceStub;

  beforeEach(() => {
    dictionaryServiceStub = new DictionaryServiceStub();
    component = new HeaderComponent(dictionaryServiceStub as any);
  });

  it('should set the language subscription', () => {
    component.ngOnInit();

    expect(component['subscription']).not.toBeUndefined();
  });

  it('should set the properties correctly when the language is updated', () => {
    component.ngOnInit();

    dictionaryServiceStub.emit(texts);

    expect(component.languages).toEqual(languages);
    expect(component.defaultLanguage).toBe('0');
  });

  it('should call the getTexts() method', () => {
    const spyGetTexts = spyOn<any>(
      dictionaryServiceStub,
      'getTexts'
    ).and.callFake(() => ({ subscribe() {} }));

    component.ngOnInit();

    expect(spyGetTexts).toHaveBeenCalled();
  });

  it('should call the unsubscribe method()', () => {
    component.ngOnInit();
    const spyUnsubscribe = spyOn(component['subscription'], 'unsubscribe');

    dictionaryServiceStub.emit(texts);

    expect(spyUnsubscribe).toHaveBeenCalled();
  });

  it('should change the defaultLanguage property', () => {
    const FRENCH_LANGUAGE_ID = '1';
    const spySetLanguage = spyOn(dictionaryServiceStub, 'setLanguage');

    component.setLanguage(FRENCH_LANGUAGE_ID);

    expect(component.defaultLanguage).toBe(FRENCH_LANGUAGE_ID);
    expect(spySetLanguage).toHaveBeenCalledWith(FRENCH_LANGUAGE_ID);
  });
});
