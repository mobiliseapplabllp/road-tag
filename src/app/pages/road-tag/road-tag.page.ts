import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Router } from '@angular/router';
import { ModalComponent } from '../modal/modal.component'; 

@Component({
  selector: 'app-road-tag',
  templateUrl: './road-tag.page.html',
  styleUrls: ['./road-tag.page.scss'],
  standalone: false
})
export class RoadTagPage implements OnInit {
  addForm!: FormGroup;
  popover!: any;
  startPhoto : any = null;
  endPhoto : any = null;
  updatedFormData: any;
  constructor(
    private formBuilder: FormBuilder,
    private modal: ModalController,
    private router: Router
  ) {}
  ngOnInit() {
    this.initialForm();
    
    const storedDataStr = localStorage.getItem('updatedFormData');
    if (storedDataStr) {
      this.updatedFormData = JSON.parse(storedDataStr);
      console.log('Stored Data:', this.updatedFormData);
  
      this.verifyId(); 
    }
  }
  

  initialForm() {
    this.addForm = this.formBuilder.group({
      last_treatment_date: [''],
      dlp_expiry_date: [''],
      next_treatment_due: [''],
      startPhoto: [''],
      endPhoto: [''],
      road_id: ['', Validators.required],
      ur_id: ['', Validators.required],
      road_name: [''],
      source: ['', Validators.required],
      start_point_lat: [''],
      start_point_long: [''],
      end_point_lat: [''],
      end_point_long: [''],
      gis_length: [''],
      length: [''],
      length_doc: [''],
      department_ulb: [''],
      location_locality: [''],
      ward: [''],
      circle: [''],
      division: [''],
      district: [''],
      lok_sabha_cons: [''],
      vidhan_sabha_cons: [''],
      right_way_rd_wise: [''],
      carriageway_width_rd_wise: [''],
      dimension_width: [''],
      dimension_width_cat: [''],
      road_crust: [''],
      road_category: [''],
      area_topology: [''],
      last_treatment_type: [''],
      varification_sts: [''],
      remark: ['']
    });
  }

  changeDate(type: string) {
    console.log('Date changed:', type);
    console.log('Selected Date:', this.addForm.value.last_treatment_date);
    setTimeout(() => {
      this.popover?.dismiss();
    }, 100);
  }


  submitForm() {
    console.log(this.addForm.value);
  }

  updateRoad(url: any) {
    this.router.navigateByUrl(url);
  }

  verifyId() {
    const enteredRoadId = this.addForm.get('road_id')?.value;
    if (this.updatedFormData.road_id === enteredRoadId) {
      this.addForm.patchValue({
        ...this.updatedFormData
      });
      console.log('Form patched with stored data');
    } else {
      console.log('No matching road data found');
    }

  }
}