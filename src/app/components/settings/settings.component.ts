import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ThemeComponent } from '../theme/theme.component';
import { ProfileNameComponent } from '../profile-name/profile-name.component';

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

  async profileNameModal() {
    const modal = await this.modalCtrl.create({
      component: ProfileNameComponent,
      cssClass: 'profile-modal-css',
      mode: 'ios'
    })
    await modal.present();
  }

}
