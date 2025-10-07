import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RoadTagPage } from './road-tag.page';

const routes: Routes = [
  {
    path: '',
    component: RoadTagPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RoadTagPageRoutingModule {}
