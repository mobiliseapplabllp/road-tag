import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RoadUpdatePage } from './road-update.page';
import { CameraComponent } from '../camera/camera.component';

const routes: Routes = [
  {
    path: '',
    component: RoadUpdatePage
  },
  {
    path: 'camera',
    component: CameraComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RoadUpdatePageRoutingModule {}
