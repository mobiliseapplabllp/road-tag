import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RoadUpdatePageRoutingModule } from './road-update-routing.module';

import { RoadUpdatePage } from './road-update.page';
import { CameraComponent } from '../camera/camera.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    RoadUpdatePageRoutingModule
  ],
  declarations: [
    RoadUpdatePage,
    CameraComponent
  ]
})
export class RoadUpdatePageModule {}
