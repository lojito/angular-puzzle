/* tslint:disable:no-string-literal */
import { SimpleChange } from '@angular/core';
import { BoardComponent } from './board.component';

describe('BoardComponent', () => {
  let component: BoardComponent;

  class BoardServiceStub {
    reset() {}

    get moves() {
      return 0;
    }

    get misses() {
      return 0;
    }

    get gameOver() {
      return 0;
    }

    dragAndDrop() {}
  }

  let boardService = new BoardServiceStub();

  beforeEach(() => {
    boardService = new BoardServiceStub();
    component = new BoardComponent(boardService as any);
  });

  it('should call the reset() method', () => {
    const spyReset = spyOn<any>(boardService, 'reset');

    component.ngOnInit();

    expect(spyReset).toHaveBeenCalled();
  });

  it('should call the reset() method when the folder changes', () => {
    const spyReset = spyOn<any>(boardService, 'reset');
    const changes = {
      folder: new SimpleChange(null, 'habana', true),
      image: new SimpleChange(null, 3, true),
    };

    component.ngOnChanges(changes);

    expect(spyReset).toHaveBeenCalled();
  });

  it('should call the reset() method when the folder does not change but the image does', () => {
    const spyReset = spyOn<any>(boardService, 'reset');
    const changes = {
      image: new SimpleChange(null, 3, true),
    };

    component.ngOnChanges(changes);

    expect(spyReset).toHaveBeenCalled();
  });

  it('should not call the reset() method when neither the folder nor the image changes', () => {
    const spyReset = spyOn<any>(boardService, 'reset');
    const changes = {};

    component.ngOnChanges(changes);

    expect(spyReset).not.toHaveBeenCalled();
  });

  it('should call the setData() method', () => {
    const event = {
      dataTransfer: {
        setData() {
          return null;
        },
      },
      target: {
        id: 0,
      },
    };
    const spySetData = spyOn<any>(event.dataTransfer, 'setData');

    component.onDrag(event);

    expect(spySetData).toHaveBeenCalledWith('index', 0);
  });

  it('should call the dragAndDrop() and the emit() methods', () => {
    const spyNewStatsEmit = spyOn(component.newStats, 'emit');
    const spyDragAndDrop = spyOn<any>(component.boardService, 'dragAndDrop');
    const event = {
      dataTransfer: {
        getData() {
          return '0';
        },
      },
      target: {
        id: 1,
      },
      preventDefault() {
        return null;
      },
    };

    component.onDrop(event);

    expect(spyDragAndDrop).toHaveBeenCalled();
    expect(spyNewStatsEmit).toHaveBeenCalled();
  });

  it('should call the preventDefault() method', () => {
    const event = {
      preventDefault() {
        return null;
      },
    };
    const spyPreventDefault = spyOn<any>(event, 'preventDefault');

    component.onDragOver(event);

    expect(spyPreventDefault).toHaveBeenCalled();
  });
});
