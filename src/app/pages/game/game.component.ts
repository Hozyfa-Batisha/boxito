import { CommonModule } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AuthService } from '../../core/auth.service';
import { Level, LevelService } from '../../core/level.service';
import { ScoreService } from '../../core/score.service';
import { BoardCell } from './board-cell';
import { TileComponent } from './tile/tile.component';

type Point = {
  row: number;
  col: number;
};

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [CommonModule, RouterLink, TileComponent],
  templateUrl: './game.component.html',
  styleUrl: './game.component.css'
})
export class GameComponent implements OnInit {
  levels: Level[] = [];
  level!: Level;
  board: BoardCell[][] = [];
  player: Point = { row: 0, col: 0 };
  boxes: Point[] = [];
  targets: Point[] = [];
  moves = 0;
  won = false;
  message = 'Choose a level and push boxes to targets.';

  constructor(
    private levelService: LevelService,
    private scoreService: ScoreService,
    private auth: AuthService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.levels = this.levelService.getLevels();
    const id = Number(this.route.snapshot.paramMap.get('id') || 1);
    this.loadLevel(id);
  }

  @HostListener('window:keydown', ['$event'])
  handleKey(event: KeyboardEvent) {
    const keyMap: Record<string, Point> = {
      ArrowUp: { row: -1, col: 0 },
      ArrowDown: { row: 1, col: 0 },
      ArrowLeft: { row: 0, col: -1 },
      ArrowRight: { row: 0, col: 1 }
    };

    const move = keyMap[event.key];

    if (move) {
      event.preventDefault();
      this.move(move.row, move.col);
    }
  }

  loadLevel(id: number) {
    this.level = this.levelService.getLevel(id);
    this.moves = 0;
    this.won = false;
    this.message = `${this.level.name}: solve it in few moves.`;
    this.parseMap();
  }

  restart() {
    this.loadLevel(this.level.id);
  }

  nextLevel() {
    const next = this.levels.find((level) => level.id === this.level.id + 1) || this.levels[0];
    this.loadLevel(next.id);
  }

  move(rowChange: number, colChange: number) {
    if (this.won) {
      return;
    }

    const next = { row: this.player.row + rowChange, col: this.player.col + colChange };
    const afterNext = { row: next.row + rowChange, col: next.col + colChange };

    if (this.isWall(next)) {
      return;
    }

    const boxIndex = this.boxes.findIndex((box) => this.same(box, next));

    if (boxIndex >= 0) {
      if (this.isWall(afterNext) || this.hasBox(afterNext)) {
        return;
      }

      this.boxes[boxIndex] = afterNext;
    }

    this.player = next;
    this.moves++;
    this.renderBoard();
    this.checkWin();
  }

  tileClicked(cell: BoardCell) {
    if (cell.player || cell.wall) {
      return;
    }

    const rowDiff = cell.row - this.player.row;
    const colDiff = cell.col - this.player.col;

    if (Math.abs(rowDiff) + Math.abs(colDiff) === 1) {
      this.move(rowDiff, colDiff);
    }
  }

  boxesOnTargets() {
    return this.boxes.filter((box) => this.targets.some((target) => this.same(target, box))).length;
  }

  private parseMap() {
    this.boxes = [];
    this.targets = [];

    this.level.map.forEach((line, row) => {
      line.split('').forEach((char, col) => {
        if (char === '@') {
          this.player = { row, col };
        }

        if (char === '$') {
          this.boxes.push({ row, col });
        }

        if (char === '.') {
          this.targets.push({ row, col });
        }
      });
    });

    this.renderBoard();
  }

  private renderBoard() {
    this.board = this.level.map.map((line, row) => line.split('').map((char, col) => {
      const point = { row, col };

      return {
        row,
        col,
        wall: char === '#',
        target: this.targets.some((target) => this.same(target, point)),
        box: this.hasBox(point),
        player: this.same(this.player, point)
      };
    }));
  }

  private checkWin() {
    const allDone = this.boxes.every((box) => this.targets.some((target) => this.same(target, box)));

    if (!allDone) {
      return;
    }

    this.won = true;
    this.message = `You solved ${this.level.name} in ${this.moves} moves.`;
    const player = this.auth.currentPlayer();

    this.scoreService.saveScore({
      player: player?.name || 'Player',
      level: this.level.name,
      moves: this.moves,
      date: new Date().toLocaleDateString()
    });
  }

  private isWall(point: Point) {
    return this.level.map[point.row]?.[point.col] === '#';
  }

  private hasBox(point: Point) {
    return this.boxes.some((box) => this.same(box, point));
  }

  private same(a: Point, b: Point) {
    return a.row === b.row && a.col === b.col;
  }
}
