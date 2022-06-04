import { NgModule } from '@angular/core';
import { ProfileNameComponent } from './profile-name.component';
import { ButtonModule } from '../button/button.module';
import { IconModule } from '../icon/icon.module';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [
    ProfileNameComponent,
  ],
  imports: [CommonModule, ButtonModule, IconModule],
  exports: [
    ProfileNameComponent,
  ],
})
export class ProfileNameModule { }
