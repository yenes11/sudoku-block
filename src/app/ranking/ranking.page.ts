import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { Router } from '@angular/router';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-ranking',
  templateUrl: './ranking.page.html',
  styleUrls: ['./ranking.page.scss'],
})
export class RankingPage implements OnInit {
  rankings = 'weekly';
  weekly;
  daily;
  myWeeklyScore;
  myDailyScore;
  myWeeklyPlace;
  myDailyPlace;
  myName;
  segmentValue = "weekly";

  constructor(private dataService: DataService, private router: Router, private detector: ChangeDetectorRef) {
    
  }

  segmentChanged(ev){
    this.segmentValue = ev.target.value;
    if(this.segmentValue == "weekly") {
      this.rankings = 'weekly';
    }
    else {
      this.rankings = 'daily';
    }
    this.detector.detectChanges();
  }

  routeHome() {
    this.router.navigate(['home']);
  }
  ngOnInit() {
    this.dataService.getWeekly().subscribe(res => {
      var weekly = res;
      weekly.sort((a,b) => b.score - a.score);
      this.weekly = weekly.slice(0, 10);
      this.myWeeklyPlace = weekly.findIndex((e) => e.id == "h00A513alcGrZDleubOE") + 1;
      if (this.myWeeklyPlace > 99) this.myWeeklyPlace = '+99';
      var me = weekly[this.myWeeklyPlace - 1];
      this.myWeeklyScore = me.score;
      this.myName = me.name;
    });

    this.dataService.getDaily().subscribe(res => {
      var daily = res;
      daily.sort((a,b) => b.score - a.score);
      this.daily = daily.slice(0, 10);
      this.myDailyPlace = daily.findIndex((e) => e.id == "fq4PWpFAW6JOsBZlKlJR") + 1;
      if (this.myDailyPlace > 99) this.myDailyPlace = '+99';
      var me = daily[this.myDailyPlace - 1];
      this.myDailyScore = me.score;
    })  
  }

}
