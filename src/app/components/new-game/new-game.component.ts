import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController, LoadingController } from '@ionic/angular';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { Device } from '@ionic-native/device/ngx';
import { StorageService } from 'src/app/storage.service';
import { UserInfo } from 'src/app/userinfo';
import { languages } from 'src/app/language';
import { Howl, Howler } from 'howler';

export var isNewGame = false;

export function makeFalse() {
  isNewGame = false;
}

@Component({
  selector: 'app-new-game',
  templateUrl: './new-game.component.html',
  styleUrls: ['./new-game.component.scss'],
})
export class NewGameComponent implements OnInit {
  userData = UserInfo;
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

  isNewGame = false;
  

  constructor(private modalCtrl: ModalController, private router: Router, private device: Device,
    private storageService: StorageService, public loadingController: LoadingController) { }

  async close() {
    if(this.sounds) this.playSound("one");
    await this.modalCtrl.dismiss();
  }

  async presentLoading() {
    const loading = await this.loadingController.create({
      mode: 'ios',
      spinner: 'circular',
      message: 'Hazırlanıyor',
      duration: 30
    });
    await loading.present();

    const { role, data } = await loading.onDidDismiss();

    console.log('Loading dismissed!');
  }

  async routeGame() {
    isNewGame = true;
    if(this.sounds) this.playSound("one");
    this.storageService.getData().subscribe(res => {
      var data = res;
      data = {
        ...data,
        isSaved: false
      }
      this.storageService.setData(data);
    })
    this.modalCtrl.dismiss();
    setTimeout(() => {
      this.router.navigateByUrl('/game',{
        replaceUrl : true,
        });
    }, 300)
  }

  ngOnInit() {
    this.storageService.getData().subscribe(res => {
      this.selectedLanguage = res.language;
      this.languageTexts = languages[this.selectedLanguage];
      this.sounds = res.sounds;
    })
  }

  playSound(num) {
    var sound = new Howl({
      src: [this.soundList[num]]
    });
    sound.play();
  }
}
