import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { NewGameComponent } from '../components/new-game/new-game.component';
import { SettingsModule } from '../components/settings/settings.module';
import { ProfileNameModule } from '../components/profile-name/profile-name.module';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  constructor(private modalCtrl: ModalController) {}

  async newGameModal(){
    const modal = await this.modalCtrl.create({
      component: NewGameComponent,
      cssClass: 'new-game-modal-css',
      mode: 'ios'
    })
    await modal.present();
  }

  async settingsModal(){
    const modal = await this.modalCtrl.create({
      component: SettingsModule.component,
      cssClass: 'settings-modal-css',
    })
    await modal.present();
  }


}
