import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TagRoadPage } from './tag-road.page';

const routes: Routes = [
  {
    path: '',
    component: TagRoadPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TagRoadPageRoutingModule {}
