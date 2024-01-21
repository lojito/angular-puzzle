import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class BoardService {
  readonly rows = 4;
  readonly columns = 4;
  readonly numberOfPieces = this.rows * this.columns;
  private movesCounter = 0;
  private missesCounter = 0;
  private folder = 'habana';
  private image = 0;
  private imagePieces: Array<Piece> = [];

  get moves() {
    return this.movesCounter;
  }

  get misses() {
    return this.missesCounter;
  }

  get pieces() {
    return this.imagePieces.slice();
  }

  get numberOfPiecesInPlace(): number {
    return this.imagePieces.reduce((inPlace, piece, i) => {
      return piece.id === i ? inPlace + 1 : inPlace;
    }, 0);
  }

  get gameOver() {
    return this.numberOfPiecesInPlace === this.numberOfPieces;
  }

  private shufflePieces() {
    const pieces: Array<Piece> = new Array(this.numberOfPieces);
    const visited: Array<number> = [];
    let pieceId: number;
    let path = '';

    for (let i = 0; i < this.numberOfPieces; i++) {
      pieceId = Math.floor(Math.random() * this.numberOfPieces);
      while (visited.indexOf(pieceId) !== -1) {
        pieceId = Math.floor(Math.random() * this.numberOfPieces);
      }
      visited.push(pieceId);

      path = `url(assets/images/${this.folder}/${this.image}/${pieceId}.jpg?alt=media)`;
      pieces[i] = { index: i, id: pieceId, misplaced: true, path };
    }

    this.imagePieces = pieces;
  }

  reset({ image, folder }: { image?: number; folder?: string }) {
    this.movesCounter = 0;
    this.missesCounter = 0;

    if (folder) {
      this.folder = folder;
    }

    if (image >= 0) {
      this.image = image;
    }

    this.shufflePieces();
    while (this.numberOfPiecesInPlace > 0) {
      this.shufflePieces();
    }
  }

  private swapPieces(dragged: Piece, dropped: Piece) {
    const tempId = dragged.id;
    dragged.id = dropped.id;
    dropped.id = tempId;

    const tempPath = dragged.path;
    dragged.path = dropped.path;
    dropped.path = tempPath;

    this.movesCounter++;
  }

  private misplacedCheck(piece: Piece) {
    piece.misplaced = !(piece.id === piece.index);
    if (piece.misplaced) {
      this.missesCounter++;
    }
  }

  private misplacedPiecesCheck(dragged: Piece, dropped: Piece) {
    this.misplacedCheck(dragged);
    this.misplacedCheck(dropped);
  }

  dragAndDrop(draggedIndex: number, droppedIndex: number) {
    const dragged = this.imagePieces[draggedIndex];
    const dropped = this.imagePieces[droppedIndex];

    if (
      this.numberOfPiecesInPlace !== this.numberOfPieces &&
      dragged !== dropped
    ) {
      this.swapPieces(dragged, dropped);
      this.misplacedPiecesCheck(dragged, dropped);
    }
  }
}

export type Piece = {
  index: number;
  id: number;
  misplaced: boolean;
  path: string;
};

export type Changes = { image?: number; folder?: string };
