/* tslint:disable:no-string-literal */
import { Subject, Subscription } from 'rxjs';
import { StatsComponent } from './stats.component';

describe('StatsComponent', () => {
  let component: StatsComponent;

  const texts = {
    TIME: 'Tiempo:',
    MOVES: 'Jugadas:',
    MISSES: 'Errores:',
  };

  class DictionaryServiceStub {
    private getTextsSource = new Subject();

    getTexts() {
      return this.getTextsSource.asObservable();
    }

    emit(statsTexts) {
      this.getTextsSource.next(statsTexts);
    }
  }

  let dictionaryServiceStub: DictionaryServiceStub;

  beforeEach(() => {
    dictionaryServiceStub = new DictionaryServiceStub();
    component = new StatsComponent(dictionaryServiceStub as any);
  });

  it('should set the properties', () => {
    component['setProperties'](texts);

    expect(component.timeText).toBe(texts.TIME);
    expect(component.movesText).toBe(texts.MOVES);
    expect(component.missesText).toBe(texts.MISSES);
  });

  it('should call the setProperties() method when the language is updated', () => {
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
