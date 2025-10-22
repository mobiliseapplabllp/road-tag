import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TagRoadPageRoutingModule } from './tag-road-routing.module';

import { TagRoadPage } from './tag-road.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TagRoadPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [TagRoadPage]
})
export class TagRoadPageModule {}
