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



@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {


  bestScore: number;
  isExist: boolean = false        ;
  isSaved: boolean;
  x;
  userData = {
    id: this.device.uuid,
    name: this.device.model,
    weekly: 0,
    monthly: 0,
    overall: 0,
    isSaved: false,
    score: 0,
    delete: 3,
    add: 3,
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
    playground: [
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0]
    ],
    lastSnapshot: [
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
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



  }

  refresh() {
    document.getElementById('info').innerHTML = this.isSaved.toString()
    this.detector.detectChanges();
  }

  ngOnInit() {
    this.isFileExist()
    if(!this.isExist) {
      this.writeSecretFile();
    }
    this.readSecretFile();
    setTimeout(() => {
      this.detector.detectChanges();

    }, 2000)
    // this.getUri()
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
      path: 'info',
      directory: Directory.Documents
    });
    console.log(output.files);
    for (var file of output.files) {
      if (file == 'user.txt') this.isExist = true;
    }
  }

  writeSecretFile = async () => {
    await Filesystem.writeFile({
      path: 'info/user.txt',
      data: JSON.stringify(this.userData),
      directory: Directory.Documents,
      encoding: Encoding.UTF8,
    });
    this.detector.detectChanges();
  };

  getUri = async () => {
    await Filesystem.deleteFile({
      path: 'info/user.txt',
      directory:Directory.Documents
    })
  }

  readSecretFile = async () => {
    const contents = await Filesystem.readFile({
      path: 'info/user.txt',
      directory: Directory.Documents,
      encoding: Encoding.UTF8,
    });
    this.x = contents.data
    var data = JSON.parse(contents.data)
    console.log(data);
    this.bestScore = data['overall'];
    this.isSaved = data['isSaved'];
    this.detector.detectChanges();
  };

  logg() {

  }

}
