import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ThemeComponent } from '../theme/theme.component';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent implements OnInit {

  constructor(private modalCtrl: ModalController) { }

  async close() {
    await this.modalCtrl.dismiss();
  }

  ngOnInit() {}

  async themeModal(){
    const modal = await this.modalCtrl.create({
      component: ThemeComponent,
      cssClass: 'theme-modal-css',
    })
    await modal.present();
  }

}
