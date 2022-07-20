import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { HomePage } from './home.page';
import { ThemeComponent } from '../components/theme/theme.component';
import { ModalComponent } from '../components/modal/modal.component';
import { PopupComponent } from '../components/popup/popup.component';
import { IconModule } from '../components/icon/icon.module';
import { ButtonModule } from '../components/button/button.module';
import { ButtonComponent } from '../components/button/button.component';
import { NewGameModule } from '../components/new-game/new-game.module';
import { SettingsModule } from '../components/settings/settings.module';
import { HomePageRoutingModule } from './home-routing.module';
import { ProfileNameComponent } from '../components/profile-name/profile-name.component';
import { ProfileNameModule } from '../components/profile-name/profile-name.module';
import { initializeApp,provideFirebaseApp } from '@angular/fire/app';
import { environment } from '../../environments/environment';
import { provideDatabase,getDatabase } from '@angular/fire/database';
import { Firestore, collectionData, collection, provideFirestore } from '@angular/fire/firestore';
import { getFirestore } from 'firebase/firestore';



@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule,
    IconModule,
    ButtonModule,
    NewGameModule,
    SettingsModule,
    ProfileNameModule,
    provideFirebaseApp(() => initializeApp(environment.firebase))
   //
  ],
  declarations: [HomePage, ModalComponent, PopupComponent, ThemeComponent]
})
export class HomePageModule { }
