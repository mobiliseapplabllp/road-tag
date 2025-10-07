import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RoadTagPage } from './road-tag.page';
import { GMapsComponent } from 'src/app/g-maps/g-maps.component';

const routes: Routes = [
  {
    path: '',
    component: RoadTagPage
  }, {
    path: 'g-maps',
    component: GMapsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RoadTagPageRoutingModule {}
