/* tslint:disable:no-string-literal */
import { BoardService, Piece } from './board.service';

describe('BoardService', () => {
  let boardService: BoardService;

  beforeEach(() => {
    boardService = new BoardService();
  });

  it('should get the moves property', () => {
    const moves = boardService.moves;

    expect(moves).toEqual(boardService['movesCounter']);
  });

  it('should get the misses property', () => {
    const misses = boardService.misses;

    expect(misses).toEqual(boardService['missesCounter']);
  });

  it('should get the pieces property', () => {
    const pieces = boardService.pieces;

    expect(pieces).toEqual(boardService['imagePieces']);
  });

  it('should return the right number of pieces in place', () => {
    const pieces: Array<Piece> = [
      {
        index: 0,
        id: 0,
        misplaced: false,
        path: 'url(assets/images/soccer/17/0.jpg?alt=media)',
      },
      {
        index: 1,
        id: 1,
        misplaced: false,
        path: 'url(assets/images/soccer/17/1.jpg?alt=media)',
      },
      {
        index: 2,
        id: 12,
        misplaced: true,
        path: 'url(assets/images/soccer/17/12.jpg?alt=media)',
      },
      {
        index: 3,
        id: 8,
        misplaced: true,
        path: 'url(assets/images/soccer/17/8.jpg?alt=media)',
      },
      {
        index: 4,
        id: 4,
        misplaced: false,
        path: 'url(assets/images/soccer/17/4.jpg?alt=media)',
      },
      {
        index: 5,
        id: 5,
        misplaced: false,
        path: 'url(assets/images/soccer/17/5.jpg?alt=media)',
      },
      {
        index: 6,
        id: 15,
        misplaced: true,
        path: 'url(assets/images/soccer/17/15.jpg?alt=media)',
      },
      {
        index: 7,
        id: 6,
        misplaced: true,
        path: 'url(assets/images/soccer/17/6.jpg?alt=media)',
      },
      {
        index: 8,
        id: 13,
        misplaced: true,
        path: 'url(assets/images/soccer/17/13.jpg?alt=media)',
      },
      {
        index: 9,
        id: 10,
        misplaced: true,
        path: 'url(assets/images/soccer/17/10.jpg?alt=media)',
      },
      {
        index: 10,
        id: 14,
        misplaced: true,
        path: 'url(assets/images/soccer/17/14.jpg?alt=media)',
      },
      {
        index: 11,
        id: 9,
        misplaced: true,
        path: 'url(assets/images/soccer/17/9.jpg?alt=media)',
      },
      {
        index: 12,
        id: 3,
        misplaced: true,
        path: 'url(assets/images/soccer/17/3.jpg?alt=media)',
      },
      {
        index: 13,
        id: 2,
        misplaced: true,
        path: 'url(assets/images/soccer/17/2.jpg?alt=media)',
      },
      {
        index: 14,
        id: 11,
        misplaced: true,
        path: 'url(assets/images/soccer/17/11.jpg?alt=media)',
      },
      {
        index: 15,
        id: 7,
        misplaced: true,
        path: 'url(assets/images/soccer/17/7.jpg?alt=media)',
      },
    ];
    boardService['imagePieces'] = pieces;

    const numberOfPiecesInPlace = boardService.numberOfPiecesInPlace;

    expect(numberOfPiecesInPlace).toBe(4);
  });

  it('should get the gameOver property', () => {
    spyOnProperty(boardService, 'numberOfPiecesInPlace', 'get');
    const gameOver = boardService.gameOver;

    expect(gameOver).toEqual(
      boardService.numberOfPiecesInPlace === boardService.numberOfPieces
    );
  });

  it('should shuffle all the pieces', () => {
    const spyRandom = spyOn(Math, 'random').and.callThrough();

    boardService['shufflePieces']();

    expect(boardService['imagePieces'].length).toBe(
      boardService.numberOfPieces
    );
    expect(spyRandom).toHaveBeenCalled();
  });

  it('should set the movesCounter and missesCounter properties and call the shufflePieces() method', () => {
    const spyShufflePieces = spyOn<any>(boardService, 'shufflePieces');
    spyOnProperty(
      boardService,
      'numberOfPiecesInPlace',
      'get'
    ).and.returnValues(boardService.numberOfPieces, 0);

    boardService['reset']({ image: 0, folder: 'habana' });

    expect(boardService['movesCounter']).toBe(0);
    expect(boardService['missesCounter']).toBe(0);
    expect(spyShufflePieces).toHaveBeenCalled();
  });

  it('should set the properties and call the shufflePieces() method when only the folder property changed', () => {
    const spyShufflePieces = spyOn<any>(boardService, 'shufflePieces');
    spyOnProperty(
      boardService,
      'numberOfPiecesInPlace',
      'get'
    ).and.returnValues(boardService.numberOfPieces, 0);

    boardService['reset']({ folder: 'soccer' });

    expect(boardService['movesCounter']).toBe(0);
    expect(boardService['missesCounter']).toBe(0);
    expect(spyShufflePieces).toHaveBeenCalled();
  });

  it('should set the properties and call the shufflePieces() method when only the image property changed', () => {
    const spyShufflePieces = spyOn<any>(boardService, 'shufflePieces');
    spyOnProperty(
      boardService,
      'numberOfPiecesInPlace',
      'get'
    ).and.returnValues(boardService.numberOfPieces, 0);

    boardService['reset']({ image: 0 });

    expect(boardService['movesCounter']).toBe(0);
    expect(boardService['missesCounter']).toBe(0);
    expect(spyShufflePieces).toHaveBeenCalled();
  });

  it('should swap the two pieces', () => {
    const dragPieceId = 12;
    const dragPiecePath = 'url(assets/images/soccer/17/12.jpg?alt=media)';
    const dropPieceId = 8;
    const dropPiecePath = 'url(assets/images/soccer/17/8.jpg?alt=media)';
    const dragPiece: Piece = {
      index: 2,
      id: dragPieceId,
      misplaced: true,
      path: dragPiecePath,
    };
    const dropPiece: Piece = {
      index: 3,
      id: dropPieceId,
      misplaced: true,
      path: dropPiecePath,
    };

    boardService['swapPieces'](dragPiece, dropPiece);

    expect(dragPiece.id).toBe(dropPieceId);
    expect(dragPiece.path).toBe(dropPiecePath);
    expect(dropPiece.id).toBe(dragPieceId);
    expect(dropPiece.path).toBe(dragPiecePath);
  });

  it('should increment the number of misses if one of the two pieces was misplaced', () => {
    const piece: Piece = {
      index: 0,
      id: 1,
      misplaced: true,
      path: './assets/images/habana/0/1.jpg',
    };
    const misses = boardService['missesCounter'];

    boardService['misplacedCheck'](piece);

    expect(boardService['missesCounter']).toBe(misses + 1);
  });

  it('should not increment the number misses if none of the two pieces was misplaced', () => {
    const piece: Piece = {
      index: 0,
      id: 0,
      misplaced: false,
      path: './assets/images/habana/0/0.jpg',
    };
    const misses = boardService['missesCounter'];

    boardService['misplacedCheck'](piece);

    expect(boardService['missesCounter']).not.toBe(misses + 1);
  });

  it('should call the misplacedCheck() method twice once for each piece', () => {
    const dragPiece: Piece = {
      index: 2,
      id: 12,
      misplaced: true,
      path: 'url(assets/images/soccer/17/12.jpg?alt=media)',
    };
    const dropPiece: Piece = {
      index: 3,
      id: 8,
      misplaced: true,
      path: 'url(assets/images/soccer/17/8.jpg?alt=media)',
    };
    const spyMisplacedCheck = spyOn<any>(boardService, 'misplacedCheck');

    boardService['misplacedPiecesCheck'](dragPiece, dropPiece);

    expect(spyMisplacedCheck).toHaveBeenCalledTimes(2);
  });

  it('should call the methods swapPieces(), misplacedPiecesCheck() when numberOfPiecesInPlace <> numberOfPieces', () => {
    const spySwapPieces = spyOn<any>(boardService, 'swapPieces');
    const spyMisplacedPiecesCheck = spyOn<any>(
      boardService,
      'misplacedPiecesCheck'
    );
    spyOnProperty(boardService, 'numberOfPiecesInPlace', 'get').and.returnValue(
      10
    );
    const dragged: Piece = {
      index: 0,
      id: 1,
      misplaced: true,
      path: './assets/images/habana/0/1.jpg',
    };
    const dropped: Piece = {
      index: 1,
      id: 0,
      misplaced: true,
      path: './assets/images/habana/0/0.jpg',
    };
    boardService['imagePieces'] = new Array(boardService.numberOfPieces);
    boardService['imagePieces'][0] = dragged;
    boardService['imagePieces'][1] = dropped;

    boardService['dragAndDrop'](dragged.index, dropped.index);

    expect(spySwapPieces).toHaveBeenCalled();
    expect(spyMisplacedPiecesCheck).toHaveBeenCalled();
  });

  it('should not call the methods swapPieces(), misplacedPiecesCheck() when numberOfPiecesInPlace = numberOfPieces', () => {
    const spySwapPieces = spyOn<any>(boardService, 'swapPieces');
    const spyMisplacedPiecesCheck = spyOn<any>(
      boardService,
      'misplacedPiecesCheck'
    );
    spyOnProperty(boardService, 'numberOfPiecesInPlace', 'get').and.returnValue(
      boardService.numberOfPieces
    );
    const dragged: Piece = {
      index: 0,
      id: 1,
      misplaced: true,
      path: './assets/images/habana/0/1.jpg',
    };
    const dropped: Piece = {
      index: 1,
      id: 0,
      misplaced: true,
      path: './assets/images/habana/0/0.jpg',
    };
    boardService['imagePieces'] = new Array(boardService.numberOfPieces);
    boardService['imagePieces'][0] = dragged;
    boardService['imagePieces'][1] = dropped;

    boardService['dragAndDrop'](dragged.index, dropped.index);

    expect(spySwapPieces).not.toHaveBeenCalled();
    expect(spyMisplacedPiecesCheck).not.toHaveBeenCalled();
  });
});
