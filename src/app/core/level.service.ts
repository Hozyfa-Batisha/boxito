import { Injectable } from '@angular/core';

export type Level = {
  id: number;
  name: string;
  difficulty: string;
  bestMoves: number;
  map: string[];
};

@Injectable({ providedIn: 'root' })
export class LevelService {
  private levels: Level[] = [
    {
      id: 1,
      name: 'First Push',
      difficulty: 'Easy',
      bestMoves: 18,
      map: [
        '########',
        '#      #',
        '#  $ . #',
        '#  @   #',
        '#      #',
        '########'
      ]
    },
    {
      id: 2,
      name: 'Two Crates',
      difficulty: 'Normal',
      bestMoves: 34,
      map: [
        '#########',
        '#   .   #',
        '#  $$   #',
        '#   @ . #',
        '#       #',
        '#########'
      ]
    },
    {
      id: 3,
      name: 'Corner Lesson',
      difficulty: 'Hard',
      bestMoves: 42,
      map: [
        '##########',
        '#   .    #',
        '#  ###   #',
        '#  $@$ . #',
        '#        #',
        '##########'
      ]
    }
  ];

  getLevels() {
    return this.levels;
  }

  getLevel(id: number) {
    return this.levels.find((level) => level.id === id) || this.levels[0];
  }
}
