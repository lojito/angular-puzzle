import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { Subscription } from 'rxjs';
import {
  DictionaryEntry,
  DictionaryService,
} from '../../services/dictionary.service';

@Component({
  selector: 'app-image',
  templateUrl: './image.component.html',
  styleUrls: ['./image.component.css'],
})
export class ImageComponent implements OnInit, OnDestroy, OnChanges {
  private subscription: Subscription;
  @Input() folder: string;
  @Output() newImage = new EventEmitter<number>();
  @Input() historical = false;
  @Input() image = 0;
  imageText: string;
  path = '';
  pathMobile = '';

  constructor(private dictionaryService: DictionaryService) {}

  setProperties(texts: DictionaryEntry) {
    this.imageText = texts.IMAGE;
  }

  private setPath(folder: string) {
    this.path = `assets/images/${folder}/${this.image}.jpg?alt=media`;
    this.pathMobile = `assets/images/${folder}/mobile/${this.image}.jpg?alt=media`;
  }

  refreshImage() {
    if (!this.historical) {
      const image = this.randomImage();
      this.image = image;
      this.setPath(this.folder);
      this.newImage.emit(image);
    }
  }

  private randomImage() {
    const imagesPerCategory = 20;

    let image = Math.floor(Math.random() * imagesPerCategory);
    while (image === this.image) {
      image = Math.floor(Math.random() * imagesPerCategory);
    }

    return image;
  }

  ngOnInit() {
    this.refreshImage();
    this.subscription = this.dictionaryService
      .getTexts()
      .subscribe((texts: DictionaryEntry) => {
        this.setProperties(texts);
      });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.folder && changes.folder.currentValue) {
      this.setPath(changes.folder.currentValue);
    }
  }
}
