import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { Device } from '@ionic-native/device/ngx';

@Component({
  selector: 'app-new-game',
  templateUrl: './new-game.component.html',
  styleUrls: ['./new-game.component.scss'],
})
export class NewGameComponent implements OnInit {
  userData = {
    id: this.device.uuid,
    name: this.device.model,
    weekly: 0,
    monthly: 0,
    overall: 0,
    isSaved: false,
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


  constructor(private modalCtrl: ModalController, private router: Router, private device: Device) { }

  async close() {
    await this.modalCtrl.dismiss();
  }

  async routeGame() {
    await this.writeSecretFile();
    this.modalCtrl.dismiss();
    this.router.navigate(['game']);
  }

  writeSecretFile = async () => {
    await Filesystem.writeFile({
      path: 'user/info.txt',
      data: JSON.stringify(this.userData),
      directory: Directory.Data,
      encoding: Encoding.UTF8,
    });
  };

  ngOnInit() {}
}
