import { Component, ChangeDetectorRef } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { NewGameComponent } from '../components/new-game/new-game.component';
import { SettingsModule } from '../components/settings/settings.module';
import { ProfileNameModule } from '../components/profile-name/profile-name.module';
import { DataService } from '../data.service';
import { Router } from '@angular/router';
import { Device } from '@ionic-native/device/ngx';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { ComponentRef } from '@angular/core';



@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {


  bestScore: number;
  isExist: boolean;
  isSaved: boolean;

  userData = {
    id: this.device.uuid,
    name: this.device.model,
    weekly: 0,
    monthly: 0,
    overall: 0,
    isSaved: true,
    delete: 1,
    add: 2,
    undo: 1,
    moves: 3,
    firstObject: {
      id: 30,
      block: [[1, 0], [1, 0], [1, 1]],
      rotate: 31
    },
    secondObject: {
      id: 34,
      block: [[1, 1], [1, 0], [1, 0]],
      rotate: 35
    },
    thirdObject: {
      id: 42,
      block: [[1, 1], [1, 0], [1, 1]],
      rotate: 43
    },
    nextFirst: {
      id: 20,
      block: [[1, 0], [1, 1], [1, 0]],
      rotate: 21
    },
    nextSecond: {
      id: 16,
      block: [[1, 0, 0], [0, 1, 0], [0, 0, 1]],
      rotate: 17
    },
    nextThird: {
      id: 21,
      block: [[0, 1, 0], [1, 1, 1]],
      rotate: 22
    },
    lastSnapshot: [
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 1, 0, 0, 0, 0],
      [0, 0, 0, 0, 1, 0, 0, 0, 0],
      [0, 0, 0, 0, 1, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0]
    ]
  }

  constructor(private modalCtrl: ModalController, private dataService: DataService,
    private router: Router, private device: Device, private detector: ChangeDetectorRef) {

    // this.dataService.getWeekly().subscribe(res => {
    //   console.log(res);
    // });

    this.dataService.getWeeklyById(this.device.uuid).subscribe(res => {
      if (res === undefined) {
        this.dataService.createWeekly({ id: "this.device.uuid", name: "this.device.model" });
      }
    });

    this.isFileExist()
    if(this.isExist) {
      this.writeSecretFile();
    }
    this.readSecretFile();
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

  isFileExist = async () => {
    const output = await Filesystem.readdir({
      path: 'user',
      directory: Directory.Data
    });

    this.isExist = output.files.length == 0 ? false : true;
  }

  writeSecretFile = async () => {
    await Filesystem.writeFile({
      path: 'user/info.txt',
      data: JSON.stringify(this.userData),
      directory: Directory.Data,
      encoding: Encoding.UTF8,
    });
  };

  readSecretFile = async () => {
    const contents = await Filesystem.readFile({
      path: 'user/info.txt',
      directory: Directory.Data,
      encoding: Encoding.UTF8,
    });
    var data = JSON.parse(contents.data)
    console.log(data);
    this.bestScore = data['overall'];
    this.isSaved = data['isSaved'];
    this.detector.detectChanges();
  };

  logg() {

  }

}
