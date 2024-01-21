/* tslint:disable:no-string-literal */
import { GameDBService } from './gamedb.service';

describe('GameService', () => {
  const mockGame = {
    categoryId: 9,
    folder: 'puppies',
    image: '3',
    moves: 31,
    misses: 46,
    time: '1m 20s',
    id: 0,
  };
  let gameDBService: GameDBService;

  it('should not find the Storage function', () => {
    const STORAGE = Storage;
    Storage = undefined;
    gameDBService = new GameDBService();

    gameDBService.loadGames();

    expect(Storage).toBeUndefined();
    Storage = STORAGE;
  });

  it('should not find any game in the local storage', () => {
    spyOn(localStorage, 'getItem').and.returnValue(undefined);
    gameDBService = new GameDBService();

    gameDBService.loadGames();

    expect(gameDBService['games']).toEqual([]);
  });

  it('should find at least one game in the local storage', () => {
    const games =
      '[{"categoryId":9,"folder":"puppies","image":3,"moves":31,"misses":46,"time":"1m 20s","id":0}]';
    spyOn(localStorage, 'getItem').and.returnValue(games);
    gameDBService = new GameDBService();

    gameDBService.loadGames();

    expect(gameDBService['games']).toEqual(JSON.parse(games));
  });

  it('should not call localStorage.item() method', () => {
    const spyLocalStorageGetItem = spyOn(localStorage, 'getItem');
    gameDBService = new GameDBService();
    gameDBService['isLoaded'] = true;

    gameDBService.loadGames();

    expect(spyLocalStorageGetItem).not.toHaveBeenCalled();
  });

  it('should get the games when there is at least one game in the local storage', () => {
    gameDBService = new GameDBService();
    gameDBService['isLoaded'] = true;
    gameDBService['games'] = [mockGame];
    const spyLoadGames = spyOn(gameDBService, 'loadGames');

    const games = gameDBService.getGames();

    expect(games).toEqual([mockGame]);
    expect(spyLoadGames).toHaveBeenCalled();
  });

  it('should save a new game when the local storage is empty', () => {
    const spySetItem = spyOn(localStorage, 'setItem');
    gameDBService = new GameDBService();
    const spyLoadGames = spyOn(gameDBService, 'loadGames');

    gameDBService['saveGame'](mockGame);

    expect(gameDBService['games']).toEqual([mockGame]);
    expect(spySetItem).toHaveBeenCalled();
    expect(spyLoadGames).toHaveBeenCalled();
  });

  it('should save a new game when the local storage is not empty', () => {
    const spySetItem = spyOn(localStorage, 'setItem');
    gameDBService = new GameDBService();
    gameDBService['games'] = [mockGame];
    const newGame = {
      categoryId: 9,
      folder: 'puppies',
      image: '4',
      moves: 21,
      misses: 26,
      time: '2m 15s',
    };
    const spyLoadGames = spyOn(gameDBService, 'loadGames');

    gameDBService['saveGame'](newGame);

    expect(gameDBService['games'].length).toBe(2);
    expect(spySetItem).toHaveBeenCalled();
    expect(spyLoadGames).toHaveBeenCalled();
  });

  it('should delete a game', () => {
    const gameId = 0;
    spyOn(localStorage, 'setItem');
    gameDBService = new GameDBService();
    gameDBService['games'] = [mockGame];
    gameDBService['isLoaded'] = true;

    gameDBService['deleteGame'](gameId);

    expect(gameDBService['games'].length).toBe(0);
  });
});
