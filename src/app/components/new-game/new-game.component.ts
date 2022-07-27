import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController, LoadingController } from '@ionic/angular';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { Device } from '@ionic-native/device/ngx';
import { StorageService } from 'src/app/storage.service';
import { UserInfo } from 'src/app/userinfo';
import { languages } from 'src/app/language';


@Component({
  selector: 'app-new-game',
  templateUrl: './new-game.component.html',
  styleUrls: ['./new-game.component.scss'],
})
export class NewGameComponent implements OnInit {
  userData = UserInfo;
  selectedLanguage = "english";
  languageTexts = "";


  constructor(private modalCtrl: ModalController, private router: Router, private device: Device,
    private storageService: StorageService, public loadingController: LoadingController) { }

  async close() {
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
      this.router.navigate(['game']);
    }, 100)
  }

  ngOnInit() {
    this.storageService.getData().subscribe(res => {
      this.selectedLanguage = res.language;
      this.languageTexts = languages[this.selectedLanguage];
    })
  }
}
