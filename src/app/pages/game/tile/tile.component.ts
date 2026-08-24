import { Component, EventEmitter, Input, Output } from '@angular/core';
import { BoardCell } from '../board-cell';

@Component({
  selector: 'app-tile',
  standalone: true,
  templateUrl: './tile.component.html',
  styleUrl: './tile.component.css'
})
export class TileComponent {
  @Input({ required: true }) cell!: BoardCell;
  @Output() selected = new EventEmitter<BoardCell>();

  get label() {
    if (this.cell.player) {
      return '@';
    }

    if (this.cell.box) {
      return 'B';
    }

    if (this.cell.target) {
      return 'X';
    }

    return '';
  }
}
