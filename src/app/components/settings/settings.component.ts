import { Component, OnInit, DoCheck } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ThemeComponent } from '../theme/theme.component';
import { ProfileNameComponent } from '../profile-name/profile-name.component';
import { languages } from 'src/app/language';
import { IonSelect } from '@ionic/angular';
import { StorageService } from 'src/app/storage.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent implements OnInit {
  selectedLanguage;
  languages = languages;
  languageTexts = "";
  

  constructor(private modalCtrl: ModalController, private storageService: StorageService, private router: Router) {
   }

  async close() {
    await this.modalCtrl.dismiss();
  }

  ngOnInit() {
    this.storageService.getData().subscribe(res => {
      this.selectedLanguage = res.language;
      this.languageTexts = this.languages[this.selectedLanguage];
    })
  }


  async presentSelect() {
    const select = document.getElementById("customActionSheetSelect") as unknown as IonSelect;
    await select.open();
  }

  cl() {
    var x = "english";
    console.log(this.languageTexts);
  }

  changeLanguage() {
    const select = document.getElementById("customActionSheetSelect") as unknown as IonSelect;
    this.selectedLanguage = select.value;
    console.log(this.selectedLanguage);
    this.storageService.getData().subscribe(res => {
      var data = res;
      this.storageService.setData({
        ...data,
        language: this.selectedLanguage
      })
      this.languageTexts = this.languages[this.selectedLanguage];
    })
  }

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

  routeRankings() {
    this.router.navigate(['ranking']);
    this.modalCtrl.dismiss(); 
  }

  routeLogic() {
    this.router.navigate(['logic']);
    this.modalCtrl.dismiss(); 
  }
}
