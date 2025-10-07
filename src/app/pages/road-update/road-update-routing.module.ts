import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RoadUpdatePage } from './road-update.page';

const routes: Routes = [
  {
    path: '',
    component: RoadUpdatePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RoadUpdatePageRoutingModule {}
