/* tslint:disable:no-string-literal */
import { Subject, Subscription } from 'rxjs';
import { AboutComponent } from './about.component';

describe('AboutComponent', () => {
  let component: AboutComponent;

  const texts = {
    TECH_STACK: 'El juego ha sido programado con:',
    SOURCE_CODE: 'Código fuente:',
    OTHER_PROJECTS: 'Otros proyectos:',
  };

  class DictionaryServiceStub {
    private getTextsSource = new Subject();

    getTexts() {
      return this.getTextsSource.asObservable();
    }

    emit(aboutTexts) {
      this.getTextsSource.next(aboutTexts);
    }
  }

  let dictionaryServiceStub: DictionaryServiceStub;

  beforeEach(() => {
    dictionaryServiceStub = new DictionaryServiceStub();
    component = new AboutComponent(dictionaryServiceStub as any);
  });

  it('should set the properties correctly', () => {
    component['setProperties'](texts);

    expect(component.tech).toBe(texts.TECH_STACK);
    expect(component.source).toBe(texts.SOURCE_CODE);
    expect(component.others).toBe(texts.OTHER_PROJECTS);
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
