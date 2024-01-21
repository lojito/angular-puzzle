/* tslint:disable:no-string-literal */
import { Subject, Subscription } from 'rxjs';
import { GameComponent } from './game.component';

describe('GameComponent', () => {
  const cdRefMock = {
    detectChanges: jasmine.createSpy(),
    markForCheck: () => null,
    detach: () => null,
    checkNoChanges: () => null,
    reattach: () => null,
  };

  const texts = {
    GAME_GOAL: 'Drag and drop the images!',
    GAME_OVER: 'Game over!',
  };

  class DictionaryServiceStub {
    private getTextsSource = new Subject();

    getTexts() {
      return this.getTextsSource.asObservable();
    }

    emit(gameTexts) {
      this.getTextsSource.next(gameTexts);
    }
  }

  class GameServiceStub {
    private gameOver = false;

    reset() {}

    get time() {
      return '2m 5s';
    }

    get over() {
      return this.gameOver;
    }

    set over(over: boolean) {
      this.gameOver = over;
    }
  }

  class GameDBServiceStub {
    saveGame() {}
  }

  let dictionaryService: DictionaryServiceStub;
  let gameService: GameServiceStub;
  let gameDBService: GameDBServiceStub;
  let component: GameComponent;

  beforeEach(() => {
    dictionaryService = new DictionaryServiceStub();
    gameService = new GameServiceStub();
    gameDBService = new GameDBServiceStub();
    component = new GameComponent(
      dictionaryService as any,
      gameService as any,
      gameDBService as any,
      cdRefMock
    );
  });

  it('should set the image, moves and misses properties', () => {
    const image = 10;

    component.newImage(image);

    expect(component.image).toBe(image);
    expect(component.moves).toBe(0);
    expect(component.misses).toBe(0);
  });

  it('should call the reset() method of the GameService', () => {
    const image = 10;
    const spyGameServiceReset = spyOn(gameService, 'reset');

    component.newImage(image);

    expect(spyGameServiceReset).toHaveBeenCalled();
  });

  it('should set the categoryId, folder, moves and misses properties', () => {
    const categoryId = 10;
    const folder = 'soccer';

    component.newCategory({ categoryId, folder });

    expect(component.categoryId).toBe(categoryId);
    expect(component.folder).toBe(folder);
    expect(component.moves).toBe(0);
    expect(component.misses).toBe(0);
  });

  it('should call the reset() method of the GameService', () => {
    const categoryId = 10;
    const folder = 'soccer';
    const spyGameServiceReset = spyOn(gameService, 'reset');

    component.newCategory({ categoryId, folder });

    expect(spyGameServiceReset).toHaveBeenCalled();
  });

  it('should update the stats properties method when the game is not over yet', () => {
    const stats = {
      moves: 10,
      misses: 10,
      gameOver: false,
    };
    spyOn(component, 'saveGame');

    component['newStats'](stats);

    expect(component.moves).toBe(stats.moves);
    expect(component.misses).toBe(stats.misses);
    expect(component.gameService.over).toBe(stats.gameOver);
  });

  it('should not call the saveGame() method when the game is not over yet', () => {
    const stats = {
      moves: 10,
      misses: 10,
      gameOver: false,
    };
    const spySaveGame = spyOn(component, 'saveGame');

    component['newStats'](stats);

    expect(spySaveGame).not.toHaveBeenCalled();
  });

  it('should update the stats properties when the game is over', () => {
    spyOn(component, 'saveGame');
    const stats = {
      moves: 10,
      misses: 10,
      gameOver: true,
    };

    component['newStats'](stats);

    expect(component.moves).toBe(stats.moves);
    expect(component.misses).toBe(stats.misses);
    expect(component.gameService.over).toBe(stats.gameOver);
  });

  it('should call the saveGame() method when the game is over', () => {
    const spySaveGame = spyOn(component, 'saveGame');
    const stats = {
      moves: 10,
      misses: 10,
      gameOver: true,
    };

    component['newStats'](stats);

    expect(spySaveGame).toHaveBeenCalled();
  });

  it('should call the save() method of the GameDBService', () => {
    const spySave = spyOn(gameDBService, 'saveGame');

    component['saveGame']();

    expect(spySave).toHaveBeenCalled();
  });

  it('should set the gameGoalMessage and gameOverMessage properties correctly', () => {
    component['setProperties'](texts);

    expect(component.gameGoalMessage).toBe(texts.GAME_GOAL);
    expect(component.gameOverMessage).toBe(texts.GAME_OVER);
  });

  it('should set the dictionary subscription', () => {
    component.ngOnInit();

    expect(component['subscription']).not.toBeUndefined();
  });

  it('should call the getTexts() method', () => {
    const spyGetTexts = spyOn<any>(dictionaryService, 'getTexts').and.callFake(
      () => ({ subscribe() {} })
    );

    component.ngOnInit();

    expect(spyGetTexts).toHaveBeenCalled();
  });

  it('should call the setProperties() method', () => {
    const spySetProperties = spyOn<any>(component, 'setProperties');
    component.ngOnInit();

    dictionaryService.emit(texts);

    expect(spySetProperties).toHaveBeenCalledWith(texts);
  });

  it('should detect changes', () => {
    component.ngAfterContentChecked();

    expect(cdRefMock.detectChanges).toHaveBeenCalled();
  });

  it('should call the unsubscribe method()', () => {
    component['subscription'] = new Subscription();
    spyOn(component['subscription'], 'unsubscribe');

    component.ngOnDestroy();

    expect(component['subscription'].unsubscribe).toHaveBeenCalled();
  });
});
