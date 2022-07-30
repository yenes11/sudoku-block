import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LogicPageRoutingModule } from './logic-routing.module';

import { LogicPage } from './logic.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LogicPageRoutingModule
  ],
  declarations: [LogicPage]
})
export class LogicPageModule {}
