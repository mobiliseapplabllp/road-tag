import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { RoadTagPageRoutingModule } from './road-tag-routing.module';

import { RoadTagPage } from './road-tag.page';
import { ModalComponent } from '../modal/modal.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    RoadTagPageRoutingModule,
  ],
  declarations: [RoadTagPage,ModalComponent]
})
export class RoadTagPageModule {}
