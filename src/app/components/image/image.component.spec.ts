/* tslint:disable:no-string-literal */
import { SimpleChange } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { ImageComponent } from './image.component';

describe('ImageComponent', () => {
  let component: ImageComponent;

  const texts = {
    IMAGE: 'Image:',
  };

  class DictionaryServiceStub {
    private getTextsSource = new Subject();

    getTexts() {
      return this.getTextsSource.asObservable();
    }

    emit(imageTexts) {
      this.getTextsSource.next(imageTexts);
    }
  }

  let dictionaryServiceStub: DictionaryServiceStub;

  beforeEach(() => {
    dictionaryServiceStub = new DictionaryServiceStub();
    component = new ImageComponent(dictionaryServiceStub as any);
  });

  it('should set the imageText property correctly', () => {
    component['setProperties'](texts);

    expect(component.imageText).toBe(texts.IMAGE);
  });

  it('should call the setProperties method', () => {
    const spySetProperties = spyOn<any>(component, 'setProperties');
    component.ngOnInit();

    dictionaryServiceStub.emit(texts);

    expect(spySetProperties).toHaveBeenCalled();
  });

  it('should update the path and the pathMobile properties', () => {
    const folder = 'soccer';
    const image = 4;
    component.image = image;

    component['setPath'](folder);

    expect(component.path).toBe(
      `assets/images/${folder}/${image}.jpg?alt=media`
    );
    expect(component.pathMobile).toBe(
      `assets/images/${folder}/mobile/${image}.jpg?alt=media`
    );
  });

  it('should update the current image with a random one', () => {
    const oldImage = 10;
    component.image = oldImage;
    const newImage = 8;
    const spyRandomImage = spyOn<any>(component, 'randomImage').and.returnValue(
      newImage
    );
    spyOn<any>(component, 'setPath');
    const spyOnNewImageEmit = spyOn(component.newImage, 'emit');

    component.refreshImage();

    expect(spyRandomImage).toHaveBeenCalled();
    expect(component.image).toBe(newImage);
    expect(spyOnNewImageEmit).toHaveBeenCalledWith(newImage);
  });

  it('should not update the current image with a random one if the component is in historical mode', () => {
    const oldImage = 10;
    const newImage = 8;
    const spyRandomImage = spyOn<any>(component, 'randomImage').and.returnValue(
      newImage
    );
    spyOn<any>(component, 'setPath');
    const spyOnNewImageEmit = spyOn(component.newImage, 'emit');
    component.image = oldImage;
    component.historical = true;

    component.refreshImage();

    expect(spyRandomImage).not.toHaveBeenCalled();
    expect(component.image).toBe(oldImage);
    expect(spyOnNewImageEmit).not.toHaveBeenCalled();
  });

  it('should return a random image', () => {
    const oldImage = 10;
    component.image = oldImage;
    const mySpy = spyOn(Math, 'random').and.returnValues(0.5, 0.9);

    const newImage = component['randomImage']();
    mySpy.calls.reset();

    expect(newImage).not.toBe(oldImage);
  });

  it('should call the unsubscribe method()', () => {
    component['subscription'] = new Subscription();
    spyOn(component['subscription'], 'unsubscribe');

    component.ngOnDestroy();

    expect(component['subscription'].unsubscribe).toHaveBeenCalled();
  });

  it('should call the setPath() method when the folder changes', () => {
    const changes = {
      folder: new SimpleChange(null, 'habana', true),
    };
    const spySetPath = spyOn<any>(component, 'setPath');

    component.ngOnChanges(changes);

    expect(spySetPath).toHaveBeenCalledWith(changes.folder.currentValue);
  });

  it('should not call the setPath() method if the folder does not change', () => {
    const changes = {};
    const spySetPath = spyOn<any>(component, 'setPath');

    component.ngOnChanges(changes);

    expect(spySetPath).not.toHaveBeenCalled();
  });
});
