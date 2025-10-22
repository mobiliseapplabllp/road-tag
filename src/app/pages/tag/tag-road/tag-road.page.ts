import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-tag-road',
  templateUrl: './tag-road.page.html',
  styleUrls: ['./tag-road.page.scss'],
  standalone:false
})
export class TagRoadPage implements OnInit {

  // addForm!: FormGroup;

  constructor(
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
  }
  // initialForm() {
  //   this.addForm = this.formBuilder.group({
  //     last_treatment_date: [''],
  //     dlp_expiry_date: [''],
  //     next_treatment_due: [''],
  //     startPhoto: [''],
  //     endPhoto: [''],
  //     road_id: ['', Validators.required],
  //     ur_id: ['', Validators.required],
  //     road_name: [''],
  //     source: ['', Validators.required],
  //     start_point_lat: [''],
  //     start_point_long: [''],
  //     end_point_lat: [''],
  //     end_point_long: [''],
  //     gis_length: [''],
  //     length: [''],
  //     length_doc: [''],
  //     department_ulb: [''],
  //     location_locality: [''],
  //     ward: [''],
  //     circle: [''],
  //     division: [''],
  //     district: [''],
  //   });
  // }
  // submitForm() {
  //   if (this.addForm.valid) {
  //     console.log('Form Data:', this.addForm.value);
  //     // You can perform further actions here, such as sending the data to a server.
  //   } else {
  //     console.log('Form is invalid');
  //   }
  // }

}
