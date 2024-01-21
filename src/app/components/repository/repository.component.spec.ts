/* tslint:disable:no-string-literal */
import { GameService } from '../../services/game.service';
import { RepositoryComponent } from './repository.component';

describe('RepositoryComponent', () => {
  let gameService: GameService;
  let component: RepositoryComponent;

  beforeEach(() => {
    gameService = new GameService();
    Object.defineProperty(gameService, 'imagesPerCategory', {
      value: 3,
      writable: true,
      configurable: true,
      enumerable: true,
    });
    component = new RepositoryComponent();
  });

  it('should set the paths property correctly', () => {
    component.folder = 'soccer';

    component.setProperties();

    for (let i = 0; i < component.imagesPerCategory; i++) {
      expect(component.paths[i]).toBe(
        `assets/images/${component.folder}/${i}.jpg?alt=media`
      );
    }
  });

  it('should call the setProperties() method', () => {
    const spySetProperties = spyOn(component, 'setProperties');
    const category = { folder: 'soccer' };

    component.newCategory(category);

    expect(spySetProperties).toHaveBeenCalled();
  });

  it('should set the folder property', () => {
    const category = { folder: 'soccer' };

    component.newCategory(category);

    expect(component.folder).toBe(category.folder);
  });
});
