import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

export type Player = {
  name: string;
  email: string;
  password: string;
};

@Injectable({ providedIn: 'root' })
export class AuthService {
  private usersKey = 'box_puzzle_users';
  private tokenKey = 'box_puzzle_token';
  private playerKey = 'box_puzzle_player';

  constructor(private router: Router) {}

  register(player: Player) {
    const users = this.getUsers();

    if (users.some((user) => user.email === player.email)) {
      return { ok: false, message: 'Email already exists.' };
    }

    users.push(player);
    localStorage.setItem(this.usersKey, JSON.stringify(users));
    return { ok: true, message: 'Account created. You can login now.' };
  }

  login(email: string, password: string) {
    const user = this.getUsers().find((item) => item.email === email && item.password === password);

    if (!user) {
      return { ok: false, message: 'Wrong email or password.' };
    }

    localStorage.setItem(this.tokenKey, `box-${Date.now()}`);
    localStorage.setItem(this.playerKey, JSON.stringify({ name: user.name, email: user.email }));
    return { ok: true, message: 'Login success.' };
  }

  logout() {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.playerKey);
    this.router.navigateByUrl('/');
  }

  isLoggedIn() {
    return !!localStorage.getItem(this.tokenKey);
  }

  currentPlayer() {
    const player = localStorage.getItem(this.playerKey);
    return player ? JSON.parse(player) as Pick<Player, 'name' | 'email'> : null;
  }

  private getUsers() {
    const users = localStorage.getItem(this.usersKey);
    return users ? JSON.parse(users) as Player[] : [];
  }
}
