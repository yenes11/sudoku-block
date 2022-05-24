import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GameoverPage } from './gameover.page';

const routes: Routes = [
  {
    path: '',
    component: GameoverPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GameoverPageRoutingModule {}
