import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LogicPage } from './logic.page';

const routes: Routes = [
  {
    path: '',
    component: LogicPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LogicPageRoutingModule {}
