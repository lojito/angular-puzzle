/* tslint:disable:no-string-literal */
import { GameService } from './game.service';

describe('GameService', () => {
  let gameService: GameService;

  beforeEach(() => {
    gameService = new GameService();
  });

  it('should get the time property', () => {
    const time = gameService.time;

    expect(time).toBe(gameService.time);
  });

  it('should get the gameOver property', () => {
    const over = false;

    gameService.over = over;

    expect(gameService.over).toBe(over);
  });

  it('should set the gameOver property', () => {
    const over = false;

    gameService.over = over;

    expect(gameService.over).toBe(over);
  });

  it('should call the window.clearInterval() method', () => {
    gameService['over'] = true;
    const spyClearInterval = spyOn(window, 'clearInterval');

    gameService.internalCallback();

    expect(spyClearInterval).toHaveBeenCalled();
  });

  it('should set the time property with minutes', () => {
    gameService['over'] = false;
    spyOn(Math, 'floor').and.returnValue(1);

    gameService.internalCallback();

    expect(gameService.time.indexOf('m ')).toBeGreaterThan(0);
  });

  it('should set the time property without minutes', () => {
    gameService['over'] = false;
    gameService.internalCallback();

    expect(gameService.time.indexOf('m ')).toBe(-1);
  });

  it('should call setInterval() method', () => {
    const spySetInterval = spyOn(window, 'setInterval');

    gameService.refreshTimer();

    expect(spySetInterval).toHaveBeenCalled();
  });

  it('should call the callback', (done) => {
    spyOn(gameService, 'internalCallback').and.callFake(() => {
      expect(gameService['intervalId']).not.toBeUndefined();
      clearInterval(gameService['intervalId']);
      done();
    });

    gameService.refreshTimer();
  });

  it('should reset the properties', () => {
    const spyClearInterval = spyOn(window, 'clearInterval');
    const spyRefreshTimer = spyOn(gameService, 'refreshTimer');

    gameService.reset();

    expect(gameService['seconds']).toBe(0);
    expect(gameService.time).toBe('');
    expect(gameService.over).toBe(false);
    expect(spyClearInterval).not.toHaveBeenCalled();
    expect(spyRefreshTimer).toHaveBeenCalled();
  });

  it('should reset the properties when the intervalId has a non-zero value', () => {
    const spyRefreshTimer = spyOn(gameService, 'refreshTimer');
    const spyClearInterval = spyOn(window, 'clearInterval');
    gameService['intervalId'] = 2;

    gameService.reset();

    expect(gameService['seconds']).toBe(0);
    expect(gameService.time).toBe('');
    expect(gameService.over).toBe(false);
    expect(spyClearInterval).toHaveBeenCalled();
    expect(spyRefreshTimer).toHaveBeenCalled();
  });
});
