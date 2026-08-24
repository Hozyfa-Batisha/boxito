import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Level, LevelService } from '../../core/level.service';

@Component({
  selector: 'app-levels',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './levels.component.html'
})
export class LevelsComponent implements OnInit {
  levels: Level[] = [];

  constructor(private levelService: LevelService) {}

  ngOnInit() {
    this.levels = this.levelService.getLevels();
  }
}
