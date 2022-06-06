import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-ranking',
  templateUrl: './ranking.page.html',
  styleUrls: ['./ranking.page.scss'],
})
export class RankingPage implements OnInit {
  weekly;
  myScore = { name: null, score: null};
  myPlace;

  constructor(private dataService: DataService, private router: Router) {
    this.dataService.getWeekly().subscribe(res => {
      this.weekly = res;
      this.weekly.sort((a,b) => b.score - a.score).slice(0,10);
      this.myPlace = this.weekly.findIndex((e) => e.id == "h00A513alcGrZDleubOE") + 1;
      this.myScore = this.weekly[this.myPlace - 1];
    });
  }

  routeHome() {
    this.router.navigate(['home']);
  }
  ngOnInit() {
  }

}
