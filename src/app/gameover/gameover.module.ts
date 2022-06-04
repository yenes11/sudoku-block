import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { GameoverPageRoutingModule } from './gameover-routing.module';

import { GameoverPage } from './gameover.page';

import { IconModule } from '../components/icon/icon.module';
import { ButtonModule } from '../components/button/button.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GameoverPageRoutingModule,
    IconModule,
    ButtonModule
  ],
  declarations: [GameoverPage]
})
export class GameoverPageModule {}
