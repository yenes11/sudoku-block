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

  constructor(private modalCtrl: ModalController, private dataService: DataService,
    private router: Router, private device: Device, private detector: ChangeDetectorRef,
    private storageService: StorageService
  ) {

    this.dataService.getWeeklyById(this.device.uuid).subscribe(res => {
      if (res === undefined) {
        this.dataService.createWeekly({ id: "this.device.uuid", name: "this.device.model" });
      }
    });

    this.loadData();
  }

  loadData() {
    this.storageService.getData().subscribe(res => {
      if(res == null) {
        this.storageService.setData(this.userData);
        this.loadData();
      }
      else {
        this.userInfo = res;
        console.log(this.userInfo);
        this.bestScore = this.userInfo['overall'];
        this.isSaved = this.userInfo['isSaved'];
        this.detector.detectChanges();
      }
    })
  }


  ngOnInit() {

  }

  async newGameModal() {
    const modal = await this.modalCtrl.create({
      component: NewGameComponent,
      cssClass: 'new-game-modal-css',
      mode: 'ios'
    })
    await modal.present();
  }

  async settingsModal() {
    const modal = await this.modalCtrl.create({
      component: SettingsModule.component,
      cssClass: 'settings-modal-css'
    })
    await modal.present();
  }

  routeGame() {
    this.router.navigate(['game']);
  }
}
