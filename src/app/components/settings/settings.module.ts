import { NgModule } from '@angular/core';
import { SettingsComponent } from './settings.component';
import { ButtonModule } from '../button/button.module';
import { IconModule } from '../icon/icon.module';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { ThemeComponent } from '../theme/theme.component';

@NgModule({
  declarations: [
    SettingsComponent
  ],
  imports: [CommonModule, ButtonModule, IconModule, IonicModule],
  exports: [
    SettingsModule.component,
  ],
})
export class SettingsModule {
    static component = SettingsComponent
 }
