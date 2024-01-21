/* tslint:disable:no-string-literal */
import { Subject, Subscription } from 'rxjs';
import { ContactComponent } from './contact.component';

describe('ContactComponent', () => {
  let component: ContactComponent;

  const texts = {
    AUTHOR: 'Autor:',
    EMAIL: 'Correo:',
    GITHUB: 'Github:',
    LINKEDIN: 'LinkedIn:',
    AVAILABILITY: 'Disponibilidad:',
    STATUS: 'Inmediatamente',
  };

  class DictionaryServiceStub {
    private getTextsSource = new Subject();

    getTexts() {
      return this.getTextsSource.asObservable();
    }

    emit(contactTexts) {
      this.getTextsSource.next(contactTexts);
    }
  }

  let dictionaryServiceStub: DictionaryServiceStub;

  beforeEach(() => {
    dictionaryServiceStub = new DictionaryServiceStub();
    component = new ContactComponent(dictionaryServiceStub as any);
  });

  it('should set the properties correctly', () => {
    component['setProperties'](texts);

    expect(component.author).toBe(texts.AUTHOR);
    expect(component.email).toBe(texts.EMAIL);
    expect(component.github).toBe(texts.GITHUB);
    expect(component.linkedin).toBe(texts.LINKEDIN);
    expect(component.availability).toBe(texts.AVAILABILITY);
    expect(component.status).toBe(texts.STATUS);
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
