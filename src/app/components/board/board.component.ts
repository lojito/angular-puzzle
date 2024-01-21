import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { BoardService, Changes } from '../../services/board.service';
import { Stats } from '../game/game.component';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css'],
})
export class BoardComponent implements OnInit, OnChanges {
  @Input() folder: string;
  @Input() image: number;
  @Output() newStats = new EventEmitter<Stats>();

  constructor(public boardService: BoardService) {}

  ngOnInit(): void {
    const changes: Changes = { image: this.image, folder: this.folder };

    this.boardService.reset(changes);
  }

  ngOnChanges(simpleChanges: SimpleChanges) {
    const changes: Changes = {};

    if (simpleChanges.folder && simpleChanges.folder.currentValue) {
      changes.folder = simpleChanges.folder.currentValue;
    }

    if (simpleChanges.image) {
      changes.image = simpleChanges.image.currentValue;
    }

    if ('folder' in changes || 'image' in changes) {
      this.boardService.reset(changes);
    }
  }

  onDrag(event) {
    event.dataTransfer.setData('index', event.target.id);
  }

  onDrop(event) {
    event.preventDefault();

    this.boardService.dragAndDrop(
      event.dataTransfer.getData('index'),
      event.target.id
    );

    this.newStats.emit({
      moves: this.boardService.moves,
      misses: this.boardService.misses,
      gameOver: this.boardService.gameOver,
    });
  }

  onDragOver(event) {
    event.preventDefault();
  }
}
