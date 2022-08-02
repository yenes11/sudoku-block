import { Component, OnInit, DoCheck } from '@angular/core';
import { IonToggle, ModalController } from '@ionic/angular';
import { ThemeComponent } from '../theme/theme.component';
import { ProfileNameComponent } from '../profile-name/profile-name.component';
import { languages } from 'src/app/language';
import { IonSelect } from '@ionic/angular';
import { StorageService } from 'src/app/storage.service';
import { Router } from '@angular/router';
import { Howl, Howler } from 'howler';
import { ChangeDetectorRef } from '@angular/core';


@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent implements OnInit {
  selectedLanguage;
  languages = languages;
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
  
  constructor(private modalCtrl: ModalController, private storageService: StorageService, private router: Router, private detector: ChangeDetectorRef) {
   }

  async close() {
    if(this.sounds) this.playSound("one");
    await this.modalCtrl.dismiss();
  }

  ngOnInit() {
    this.storageService.getData().subscribe(res => {
      this.selectedLanguage = res.language;
      this.languageTexts = this.languages[this.selectedLanguage];
      this.sounds = res.sounds;
      this.detector.detectChanges();
    })
  }

  async presentSelect() {
    if(this.sounds) this.playSound("one");
    const select = document.getElementById("customActionSheetSelect") as unknown as IonSelect;
    await select.open();
  }

  changeLanguage() {
    if(this.sounds) this.playSound("one");
    const select = document.getElementById("customActionSheetSelect") as unknown as IonSelect;
    this.selectedLanguage = select.value;
    console.log(this.selectedLanguage);
    this.storageService.getData().subscribe(res => {
      var data = res;
      this.storageService.setData({
        ...data,
        language: this.selectedLanguage
      })
      this.languageTexts = this.languages[this.selectedLanguage];
    })
  }

  async themeModal(){
    console.log(this.sounds);
    
    if(this.sounds) this.playSound("one");
    const modal = await this.modalCtrl.create({
      component: ThemeComponent,
      cssClass: 'theme-modal-css',
    })
    await modal.present();
  }

  async profileNameModal() {
    if(this.sounds) this.playSound("one");
    const modal = await this.modalCtrl.create({
      component: ProfileNameComponent,
      cssClass: 'profile-modal-css',
      mode: 'ios'
    })
    await modal.present();
  }

  routeRankings() {
    if(this.sounds) this.playSound("one");
    this.router.navigate(['ranking']);
    this.modalCtrl.dismiss(); 
  }

  routeLogic() {
    if(this.sounds) this.playSound("one");
    this.router.navigate(['logic']);
    this.modalCtrl.dismiss(); 
  }

  playSound(num) {
    var sound = new Howl({
      src: [this.soundList[num]]
    });
    sound.play();
  }

  toggleSounds(ev) {
    const soundsToggle = document.getElementById('sounds') as unknown as IonToggle;
    if (soundsToggle.checked == this.sounds) {
      return;
    }
    this.sounds = !this.sounds;
    this.storageService.getData().subscribe(res => {
      var data = res;
      this.storageService.setData({
        ...data,
        sounds: this.sounds
      })
    })
  }
}
