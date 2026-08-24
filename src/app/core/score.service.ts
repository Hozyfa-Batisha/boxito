import { Injectable } from '@angular/core';

export type ScoreRecord = {
  player: string;
  level: string;
  moves: number;
  date: string;
};

@Injectable({ providedIn: 'root' })
export class ScoreService {
  private key = 'box_puzzle_scores';

  getScores() {
    const value = localStorage.getItem(this.key);
    const scores = value ? JSON.parse(value) as ScoreRecord[] : [];
    return scores.sort((a, b) => a.moves - b.moves);
  }

  saveScore(score: ScoreRecord) {
    const scores = this.getScores();
    scores.push(score);
    localStorage.setItem(this.key, JSON.stringify(scores));
  }

  clearScores() {
    localStorage.removeItem(this.key);
  }
}
