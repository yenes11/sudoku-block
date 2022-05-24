import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IconComponent } from '../components/icon/icon.component';
import { IonicModule } from '@ionic/angular';

import { GameoverPageRoutingModule } from './gameover-routing.module';

import { GameoverPage } from './gameover.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GameoverPageRoutingModule
  ],
  declarations: [GameoverPage, IconComponent]
})
export class GameoverPageModule {}
