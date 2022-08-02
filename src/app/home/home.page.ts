import { Component, ChangeDetectorRef, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { NewGameComponent } from '../components/new-game/new-game.component';
import { SettingsModule } from '../components/settings/settings.module';
import { ProfileNameModule } from '../components/profile-name/profile-name.module';
import { DataService } from '../data.service';
import { Router } from '@angular/router';
import { Device } from '@ionic-native/device/ngx';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { ComponentRef } from '@angular/core';
import { StorageService } from '../storage.service';
import { UserInfo } from '../userinfo';
import { NewGameModule } from '../components/new-game/new-game.module';
import { languages } from '../language';
import { Howl, Howler } from 'howler';

var randomName = 'Name-' + Math.floor(Math.random() * 1000000);

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  bestScore: number;
  isExist: boolean = false;
  isSaved: boolean;
  userData = {
    ...UserInfo,
    id: this.device.uuid,
    name: randomName
  }
  userInfo = {};
  overall: number;
  weekly;
  monthly;
  daily;

  sounds = true;

  selectedLanguage;
  languages = languages;
  languageTexts = "";

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

  constructor(private modalCtrl: ModalController, private dataService: DataService,
    private router: Router, private device: Device, private detector: ChangeDetectorRef,
    private storageService: StorageService
  ) {
    this.loadData();
  }


  loadData() {
    this.storageService.getData().subscribe(res => {
      if (res == null) {
        this.storageService.setData(this.userData);
        this.loadData();
        this.detector.detectChanges();
      }
      else {
        this.userInfo = res;
        this.bestScore = this.userInfo['overall'];
        this.isSaved = this.userInfo['isSaved'];
        this.weekly = this.userInfo['weekly'];
        this.selectedLanguage = this.userInfo['language'];
        this.languageTexts = this.languages[this.selectedLanguage];
        // this.monthly = this.userInfo['monthly'];
        this.daily = this.userInfo['today'];
        this.sounds = this.userInfo['sounds'];
        this.detector.detectChanges();
        if(this.daily.date != (new Date()).toLocaleDateString('en-GB')) this.daily = { date: (new Date()).toLocaleDateString('en-GB'), score: 0 };
        if(this.weekly.week != this.getCurrentWeek()) this.weekly = { week: this.getCurrentWeek(), score: 0 };
        // if(this.monthly.month != this.getCurrentMonth()) this.monthly = { month: this.getCurrentMonth(), score: 0 };

        this.dataService.getWeeklyById(this.device.uuid).subscribe(res => {
          if (res === undefined) {
            this.dataService.createWeekly({ id: "this.device.uuid", name: "this.device.model", score: this.weekly.score });
          }
        });

        this.dataService.getDailyById(this.device.uuid).subscribe(res => {
          if (res === undefined) {
            this.dataService.createDaily({ id: "this.device.uuid", name: "this.device.model", score: this.daily.score })
          }
        })
      }
    })
  }

  ngOnInit() {
    
  }

  async newGameModal() {
    if(this.sounds) this.playSound("one");
    const modal = await this.modalCtrl.create({
      component: NewGameModule.component,
      cssClass: 'new-game-modal-css',
      mode: 'ios'
    })
    await modal.present();
    await modal.onDidDismiss();
  }

  async settingsModal() {
    if(this.sounds) this.playSound("one");
    const modal = await this.modalCtrl.create({
      component: SettingsModule.component,
      cssClass: 'settings-modal-css'
    })
    await modal.present();
    const data = await modal.onWillDismiss();
    this.storageService.getData().subscribe(res => {
      this.selectedLanguage = res.language;
      this.languageTexts = languages[this.selectedLanguage];
      this.sounds = res.sounds;
      this.detector.detectChanges();
    })
  }

  routeGame() {
    if(this.sounds) this.playSound("one");
    this.router.navigateByUrl('game',{
      replaceUrl : true,
      });
  }

  getCurrentWeek() {
    var currentdate: any = new Date();
    var oneJan: any = new Date(currentdate.getFullYear(), 0, 1);
    var numberOfDays = Math.floor((currentdate - oneJan) / (24 * 60 * 60 * 1000));
    var result = Math.ceil((currentdate.getDay() + 1 + numberOfDays) / 7);
    return result;
  }

  getCurrentMonth() {
    var date = new Date();
    return date.getMonth();
  }

  playSound(num) {
    var sound = new Howl({
      src: [this.soundList[num]]
    });
    sound.play();
  }

}
