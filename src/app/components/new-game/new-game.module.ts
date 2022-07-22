import { NgModule } from '@angular/core';
import { NewGameComponent } from './new-game.component';
import { ButtonModule } from '../button/button.module';
import { IconModule } from '../icon/icon.module';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [
    NewGameComponent,
  ],
  imports: [CommonModule, ButtonModule, IconModule],
  exports: [
    NewGameModule.component,
  ],
})
export class NewGameModule { 
  static component = NewGameComponent
}
