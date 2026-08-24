import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, of } from 'rxjs';

type Post = {
  title: string;
};

@Injectable({ providedIn: 'root' })
export class TipsService {
  constructor(private http: HttpClient) {}

  loadTips() {
    return this.http.get<Post[]>('https://jsonplaceholder.typicode.com/posts?_limit=4').pipe(
      map((posts) => posts.map((post) => post.title)),
      catchError(() => of([
        'Do not push boxes into corners.',
        'Plan two moves before pushing.',
        'Restart early when a box is stuck.',
        'Targets are more important than speed.'
      ]))
    );
  }
}
