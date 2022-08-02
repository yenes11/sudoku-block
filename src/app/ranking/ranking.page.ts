import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { Router } from '@angular/router';
import { ChangeDetectorRef } from '@angular/core';
import { languages } from '../language';
import { StorageService } from '../storage.service';
import { Howl, Howler } from 'howler';

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
  selectedLanguage = "english";
  languageTexts = "";
  sounds = true;
  soundList = {
    "one": "/assets/sounds/1.wav",
    "two": "/assets/sounds/2.wav",
    "three": "/assets/sounds/3.wav",
    "four": "/assets/sounds/4.wav",
    "five": "/assets/sounds/5.wav",
    "six": "/assets/sounds/6.wav",
    "seven": "/assets/sounds/7.wav",
    "eight": "/assets/sounds/8.wav",
    "nine": "/assets/sounds/9.wav",
  }

  constructor(private dataService: DataService, private router: Router, private detector: ChangeDetectorRef, private storageService: StorageService) {
    
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
    if(this.sounds) this.playSound("one");
    this.router.navigate(['home']);
  }
  ngOnInit() {
    this.storageService.getData().subscribe(res => {
      this.selectedLanguage = res.language;
      this.languageTexts = languages[this.selectedLanguage];
    })

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

  playSound(num) {
    var sound = new Howl({
      src: [this.soundList[num]]
    });
    sound.play();
  }
}
