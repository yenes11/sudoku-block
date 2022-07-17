import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { Device } from '@ionic-native/device/ngx';
import { StorageService } from 'src/app/storage.service';
import { UserInfo } from 'src/app/userinfo';

@Component({
  selector: 'app-new-game',
  templateUrl: './new-game.component.html',
  styleUrls: ['./new-game.component.scss'],
})
export class NewGameComponent implements OnInit {
  userData = UserInfo;


  constructor(private modalCtrl: ModalController, private router: Router, private device: Device,
    private storageService: StorageService) { }

  async close() {
    await this.modalCtrl.dismiss();
  }

  async routeGame() {
    this.storageService.getData().subscribe(res => {
      var data = res;
      data = {
        ...data,
        ...this.userData
      }
      this.storageService.setData(data);
    })
    // await this.writeSecretFile();
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
