import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GamePageRoutingModule } from './game-routing.module';

import { GamePage } from './game.page';

import { ButtonModule } from '../components/button/button.module';

import { IconModule } from '../components/icon/icon.module';

import { LottieModule } from 'ngx-lottie';
import player from 'lottie-web';

export function playerFactory(){
  return player;
}

@NgModule({
  imports: [
    LottieModule.forRoot({player: playerFactory}),
    CommonModule,
    FormsModule,
    IonicModule,
    GamePageRoutingModule,
    IconModule,
    ButtonModule
  ],
  declarations: [GamePage]
})
export class GamePageModule {}
