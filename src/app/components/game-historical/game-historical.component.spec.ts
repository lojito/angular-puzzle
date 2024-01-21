/* tslint:disable:no-string-literal */
import { Subject, Subscription } from 'rxjs';
import { GameDBRecord } from '../../services/gamedb.service';
import { GameHistoricalComponent } from './game-historical.component';

describe('GameHistoricalComponent', () => {
  const texts = {
    NO_HISTORICAL_DATA_YET:
      'We do not have yet historical data of the puzzles. Solve some and comeback later.',
    DELETE_PUZZLE: 'Delete Puzzle',
  };

  class DictionaryServiceStub {
    private getTextsSource = new Subject();

    getTexts() {
      return this.getTextsSource.asObservable();
    }

    emit(gameHistoricalTexts) {
      this.getTextsSource.next(gameHistoricalTexts);
    }
  }

  class GameDBServiceStub {
    private games: GameDBRecord[] = [];
    gamesChanged = new Subject<void>();

    getGames() {
      return this.games;
    }

    deleteGame(id: number) {}
  }

  let dictionaryServiceStub: DictionaryServiceStub;
  let gameDBService: GameDBServiceStub;
  let component: GameHistoricalComponent;

  beforeEach(() => {
    dictionaryServiceStub = new DictionaryServiceStub();
    gameDBService = new GameDBServiceStub();
    component = new GameHistoricalComponent(
      dictionaryServiceStub as any,
      gameDBService as any
    );
  });

  it('should set the properties correctly', () => {
    const game: GameDBRecord = {
      categoryId: 6,
      misses: 14,
      folder: 'fruits',
      id: 0,
      image: '2',
      moves: 15,
      time: '1m 17s',
    };
    spyOn(gameDBService, 'getGames').and.returnValue([game]);

    component['setProperties'](texts);

    expect(component.noHistoricalDataYet).toBe(texts.NO_HISTORICAL_DATA_YET);
    expect(component.deleteGame).toBe(texts.DELETE_PUZZLE);
    expect(component.games).toEqual([game]);
  });

  it('should set the gamedb subscription', () => {
    component.setGameDBSubscription();

    expect(component['gamesChangedSubscription']).not.toBeUndefined();
  });

  it('should set the dictionary subscription', () => {
    component.ngOnInit();

    expect(component['subscription']).not.toBeUndefined();
  });

  it('should call the setGameDBSubscription() method', () => {
    const spySetGameDBSubscription = spyOn<any>(
      component,
      'setGameDBSubscription'
    );

    component.ngOnInit();

    expect(spySetGameDBSubscription).toHaveBeenCalled();
  });

  it('should call the getTexts() method', () => {
    const spyGetTexts = spyOn<any>(
      dictionaryServiceStub,
      'getTexts'
    ).and.callFake(() => ({ subscribe() {} }));

    component.ngOnInit();

    expect(spyGetTexts).toHaveBeenCalled();
  });

  it('should call the setProperties() method', () => {
    const spySetProperties = spyOn<any>(component, 'setProperties');
    component.ngOnInit();

    dictionaryServiceStub.emit(texts);

    expect(spySetProperties).toHaveBeenCalledWith(texts);
  });

  it('should set the games property correctly when the games db is updated', () => {
    const newGame: GameDBRecord = {
      categoryId: 6,
      misses: 14,
      folder: 'soccer',
      id: 4,
      image: '8',
      moves: 15,
      time: '2m 34s',
    };
    spyOn(gameDBService, 'getGames').and.returnValue([newGame]);
    component.setGameDBSubscription();

    gameDBService.gamesChanged.next();

    expect(component.games).toEqual([newGame]);
  });

  it('should call unsubscribe on the subscriptions', () => {
    component['subscription'] = new Subscription();
    spyOn(component['subscription'], 'unsubscribe');
    component['gamesChangedSubscription'] = new Subscription();
    spyOn(component['gamesChangedSubscription'], 'unsubscribe');

    component.ngOnDestroy();

    expect(component['subscription'].unsubscribe).toHaveBeenCalled();
    expect(
      component['gamesChangedSubscription'].unsubscribe
    ).toHaveBeenCalled();
  });

  it('should call the deleteGame() method of the GameDBService', () => {
    const spyDelete = spyOn(gameDBService, 'deleteGame');
    const gameId = 4;

    component.delete(gameId);

    expect(spyDelete).toHaveBeenCalledWith(gameId);
  });
});
