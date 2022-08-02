import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { StorageService } from 'src/app/storage.service';
import { UserInfo } from 'src/app/userinfo';
import { Device } from '@ionic-native/device/ngx';
import { DataService } from 'src/app/data.service';
import { ToastController } from '@ionic/angular';
import { Howl, Howler } from 'howler';

@Component({
  selector: 'app-profile-name',
  templateUrl: './profile-name.component.html',
  styleUrls: ['./profile-name.component.scss'],
})
export class ProfileNameComponent implements OnInit {
  userInfo = UserInfo;
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

  constructor(private modalCtrl: ModalController, private device: Device, private dataService: DataService,
    private storageService: StorageService, private toastController: ToastController) { }

  async close() {
    if(this.sounds) this.playSound("one");
    await this.modalCtrl.dismiss();
  }

  async presentToast(message) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      mode: 'ios',
      translucent: true,
    });
    toast.present();
  }

  save() {
    if(this.sounds) this.playSound("one");
    const element = document.getElementById('name') as HTMLInputElement;
    var name = element.value;
    if(name.length < 3) {
      this.presentToast("İsminiz en az 3 karakter içermelidir.");
    }
    else {
      var userInfo = {
        ...this.userInfo,
        name: name
      }
      this.storageService.setData(userInfo);
      var myDailyData;
      this.dataService.getDailyById("fq4PWpFAW6JOsBZlKlJR").subscribe(res => {
        myDailyData = res;
        this.dataService.createDaily({id: "fq4PWpFAW6JOsBZlKlJR", name: name, score: myDailyData.score});
      });

      var myWeeklyData;
      this.dataService.getWeeklyById("h00A513alcGrZDleubOE").subscribe(res => {
        myWeeklyData = res;
        this.dataService.createWeekly({id: "h00A513alcGrZDleubOE", name: name, score: myWeeklyData.score});
      })

      this.close();
    }
  }

  ngOnInit() {

    this.storageService.getData().subscribe(res => { 
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
