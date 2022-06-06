import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IconModule } from '../components/icon/icon.module';
import { ButtonModule } from '../components/button/button.module';

import { IonicModule } from '@ionic/angular';

import { RankingPageRoutingModule } from './ranking-routing.module';

import { RankingPage } from './ranking.page';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { environment } from 'src/environments/environment';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RankingPageRoutingModule,
    IconModule,
    ButtonModule,
    provideFirebaseApp(() => initializeApp(environment.firebase))
  ],
  declarations: [RankingPage]
})
export class RankingPageModule {}
