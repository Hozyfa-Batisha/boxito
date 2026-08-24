import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TipsService } from '../../core/tips.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  tips: string[] = [];
  loading = true;

  constructor(private tipsService: TipsService) {}

  ngOnInit() {
    this.tipsService.loadTips().subscribe((tips) => {
      this.tips = tips;
      this.loading = false;
    });
  }
}
