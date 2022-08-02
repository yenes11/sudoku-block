import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Platform } from '@ionic/angular';
import { DataService } from '../data.service';
import { StorageService } from '../storage.service';
import { Device } from '@ionic-native/device/ngx';
import { ChangeDetectorRef } from '@angular/core';
import { languages } from '../language';
import { Howl, Howler } from 'howler';

@Component({
  selector: 'app-gameover',
  templateUrl: './gameover.page.html',
  styleUrls: ['./gameover.page.scss'],
})
export class GameoverPage implements OnInit {
  score = 0;
  daily = 0;
  weekly = 0;
  overall = 0;
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

  constructor(private router: Router, private platform: Platform, private dataService: DataService, private storageService: StorageService, private device: Device, private detector: ChangeDetectorRef) {
    this.platform.backButton.subscribeWithPriority(10, () => {
      this.router.navigate(['home'])
    });    
  }

  ngOnInit() {
    this.storageService.getData().subscribe(res => {
      this.score = res.score;
      this.daily = res.today.score;
      this.weekly = res.weekly.score;
      this.overall = res.overall;
      this.detector.detectChanges();
      this.selectedLanguage = res.language;
      this.sounds = res.sounds;
      this.languageTexts = languages[this.selectedLanguage];
      
      var name = res.name;
      
      this.dataService.getDailyById("fq4PWpFAW6JOsBZlKlJR").subscribe(response => {
        var dailyScore = response.score;
        if(this.score > dailyScore) {
          this.dataService.createDaily({ id: "this.device.uuid", name: name, score: this.score })
        }
      })

      this.dataService.getWeeklyById("h00A513alcGrZDleubOE").subscribe(response => {
        var weeklyScore = response.score;
        if(this.score > weeklyScore) {
          this.dataService.createWeekly({ id: "this.device.uuid", name: name, score: this.score })
        }
      })
    })
  }

  routeRanking() {
    if(this.sounds) this.playSound("one");
    this.router.navigate(['ranking']);
  }

  routeNewGame() {
    if(this.sounds) this.playSound("one");
    this.router.navigateByUrl('game',{
      replaceUrl: true,
      state: {' preserveFragment': false}
      });
    
  }

  routeHome() {
    if(this.sounds) this.playSound("one");
    this.router.navigate(['home']);
  }

  playSound(num) {
    var sound = new Howl({
      src: [this.soundList[num]]
    });
    sound.play();
  }
}
