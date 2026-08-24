import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ScoreRecord, ScoreService } from '../../core/score.service';

@Component({
  selector: 'app-leaderboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './leaderboard.component.html'
})
export class LeaderboardComponent implements OnInit {
  scores: ScoreRecord[] = [];
  page = 1;
  pageSize = 5;

  constructor(private scoreService: ScoreService) {}

  ngOnInit() {
    this.scores = this.scoreService.getScores();
  }

  get pages() {
    return Array.from({ length: Math.max(1, Math.ceil(this.scores.length / this.pageSize)) }, (_, index) => index + 1);
  }

  get visibleScores() {
    const start = (this.page - 1) * this.pageSize;
    return this.scores.slice(start, start + this.pageSize);
  }

  clear() {
    this.scoreService.clearScores();
    this.scores = [];
    this.page = 1;
  }
}
