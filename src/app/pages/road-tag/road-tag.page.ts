import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { GMapsComponent } from 'src/app/g-maps/g-maps.component';
import { Api } from 'src/app/provider/api';
import { Common } from 'src/app/provider/common/common';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-road-tag',
  templateUrl: './road-tag.page.html',
  styleUrls: ['./road-tag.page.scss'],
  standalone: false
})
export class RoadTagPage implements OnInit {
  addForm!: FormGroup;  
  isModalCount = 0;
  districtArr: any = [];
  divisionArr: any = [];
  wardArr: any = [];
  subDivisionArr: any = [];
  departArr: any = [];
  widthCatArr: any = [];
  sourceArr: any = [];
  roadCatArr: any = [];
  lastTreatArr: any = [];

  formData = new FormData();
  constructor(
    private formBuilder: FormBuilder,
    private modalCtrl: ModalController,
    private router: Router,
    private httpApi: Api,
    private common: Common
  ) {}
  ngOnInit() {
    this.initialForm();    
    this.getDistrict();    
    this.getDivision();
    // this.getSubDivision();
    this.getDepartment();
    this.getWidthCat();
    this.getTechnology();
    this.getRoadCat();
    this.getLastTreatment();
  }

  initialForm() {
    this.addForm = this.formBuilder.group({
      dist_id: [''],
      devsn_id: [''],
      ward_id: [''],
      sub_devsn_id: [''],
      area: [''],
      sub_area: [''],
      circle_road: [''],
      lok_sabha: [''],
      vidhan_sabha: [''],
      dept_id: [''],
      rdw: [''],
      carriageway_width: [''],
      with_category: [''],
      width: [''],
      exist_road_crust: [''],
      source: [''],
      road_name: [''],
      road_id: [''],
      road_category: [''],
      technology_area: [''],  
      start_pnt_current_location: [''],
      // start_pnt_picture_1: [''],
      // start_pnt_picture_2: [''],
      // start_pnt_picture_3: [''],
      // start_pnt_picture_4: [''],
      end_pnt_current_location: [''],
      // end_pnt_picture_1: [''],
      // end_pnt_picture_2: [''],
      // end_pnt_picture_3: [''],
      // end_pnt_picture_4: [''],
      last_treatment_type: [''],   
      length_doc_status: [''],   
      last_treatment_date: [''],
      dlp_expiry: [''],
      next_treatment_date: [''],
      next_treatment_due: [''],
      verification_status: [''],
      remark: [''],     
    });
  }

  getDistrict() {
    this.common.presentLoading().then(preLoad => {
      this.httpApi.getDistrict().subscribe({
        next:(data: any) => {
          if(data.status) {
            this.districtArr = data.data
          } else {
            this.common.presentToast(data.msg, 'warning');
          }
        },
        error:() => {
          this.common.dismissloading();
          this.common.presentToast(environment.errMsg, 'danger');
        },
        complete:() => {
          this.common.dismissloading();
        }
      });  
    })
    
  }

  getDivision() {
    this.httpApi.getDivision().subscribe({
      next:(data: any) => {
        if (data.status) {
          this.divisionArr = data.data;
        } else {
          this.common.presentToast(data.msg, 'warning');
        }
      },
      error:() => {

      },
      complete:() => {

      }
    });
  }

  changeDivision(ev: any) {
    console.log(ev.target.value);
    this.getWard(ev.target.value);
  }

  getWard(val: string) {
    this.common.presentLoading().then(preLoad => {
      this.httpApi.getWard(val).subscribe({
        next:(data: any) => {
          if (data.status) {
            this.wardArr = data.data;
          }
        },
        error:() => {
          this.common.dismissloading();
          this.common.presentToast(environment.errMsg, 'danger');
        },
        complete:() => {
          this.common.dismissloading();
        }
      });
    })    
  }

  getSubDivision() {
    this.httpApi.getSubDivision().subscribe({
      next:(data: any) => {
        if (data.status) {
          this.subDivisionArr = data.data;
        } else {
          this.common.presentToast(data.msg, 'warning');
        }
      },
      error:() => {
        
      },
      complete:() => {

      }
    });
  }

  getDepartment() {
    this.httpApi.getDepartment().subscribe({
      next:(data: any) => {
        if (data.status) {
          this.departArr = data.data;
        } else {
          this.common.presentToast(data.msg, 'warning');
        }
      },
      error:() => {

      },
      complete:() => {

      }
    });
  }

  getWidthCat() {
    this.httpApi.getWidthCat().subscribe({
      next:(data: any) => {
        if (data.status) {
          this.widthCatArr = data.data;
        }
      },
      error:() => {

      },
      complete:() => {

      }
    });
  }

  getTechnology() {
    this.httpApi.getTechnology().subscribe({
      next:(data: any) => {
        if (data.status) {
          this.sourceArr = data.data;
        } else {
          this.common.presentToast(data.msg, 'warning');
        }
      },
      error:() => {

      },
      complete:() => {

      }
    })
  }
  
  getRoadCat() {
    this.httpApi.getRoadCat().subscribe({
      next:(data: any) => {
        if (data.status) {
          this.roadCatArr = data.data;
        } else {
          this.common.presentToast(data.msg, 'warning');
        }
      },
      error:() => {

      },
      complete:() => {

      }
    });
  }

  getLastTreatment() {
    this.httpApi.getLastTreatment().subscribe({
      next:(data: any) => {
        if (data.status) {
          this.lastTreatArr = data.data;
        } else {
          this.common.presentToast(data.msg, 'warning');
        }
      },
      error:() => {

      },
      complete:() => {

      }
    });
  }

  submitForm() {
    console.log(this.addForm.value);
  }

  updateRoad(url: any) {
    this.router.navigateByUrl(url);
  }

  async openModal(type: string) {
    this.isModalCount = this.isModalCount + 1;
    if (this.isModalCount > 2) {     
      this.isModalCount = 0; 
      return;
    }
    setTimeout(() => {
      this.isModalCount = 0
    }, 500);

    const modal = await this.modalCtrl.create({
      component: GMapsComponent,
      cssClass: 'my-modal',      
    });
    modal.onWillDismiss().then(disModal => {
      if (disModal.role === 'true') {
        console.log(disModal);
        if (type === 'start') {                    
          this.formData.delete('start_pnt_picture_1');
          this.formData.delete('start_pnt_picture_2');
          this.formData.delete('start_pnt_picture_3');
          this.formData.delete('start_pnt_picture_4');
          let latlng = (disModal.data.startLatLng.lat + ',' + disModal.data.startLatLng.lng).toString();
          this.addForm.get('start_pnt_current_location')?.setValue(latlng);          
          this.formData.append('start_pnt_picture_1', disModal.data.image1, disModal.data.image1Name);
          this.formData.append('start_pnt_picture_2', disModal.data.image2, disModal.data.image2Name);
          this.formData.append('start_pnt_picture_3', disModal.data.image3, disModal.data.image3Name);
          this.formData.append('start_pnt_picture_4', disModal.data.image4, disModal.data.image4Name);
        } else if (type === 'end') {          
          this.formData.delete('end_pnt_picture_1');
          this.formData.delete('end_pnt_picture_2');
          this.formData.delete('end_pnt_picture_3');
          this.formData.delete('end_pnt_picture_4');
          let latlng = (disModal.data.startLatLng.lat + ',' + disModal.data.startLatLng.lng).toString();          
          this.addForm.get('end_pnt_current_location')?.setValue(latlng);
          this.formData.append('end_pnt_picture_1', disModal.data.image1, disModal.data.image1Name);
          this.formData.append('end_pnt_picture_2', disModal.data.image2, disModal.data.image2Name);
          this.formData.append('end_pnt_picture_3', disModal.data.image3, disModal.data.image3Name);
          this.formData.append('end_pnt_picture_4', disModal.data.image4, disModal.data.image4Name);
        }      
      }
    });
    modal.present();
  }

  submit() {
    const dateKeys = ['last_treatment_date', 'dlp_expiry', 'next_treatment_date'];
    for (const key in this.addForm.value) {
      this.formData.delete(key);
      let val = this.addForm.value[key] ?? '';
      if (dateKeys.includes(key) && typeof val === 'string' && val.includes('T')) {
        val = val.split('T')[0];
      }
      this.formData.append(key, val);
    }
    // for (var key in this.addForm.value) {     
    //   this.formData.delete(key); 
    //   if (key === 'last_treatment_date' || key === 'dlp_expiry' || key === 'next_treatment_date') {        
    //     let val = this.addForm.value[key];
    //     if (val) {
    //       this.formData.append(key, val.split('T')[0] || '');        
    //     } else {
    //       this.formData.append(key, '');        
    //     }
        
    //   } else {
    //     this.formData.append(key, this.addForm.value[key]);
    //   }            
    // }
    this.common.presentLoading().then(preLoad => {
      this.httpApi.addRoad(this.formData).subscribe({
        next:(data: any) => {
          if (data.status) {
            this.common.presentToast(data.msg, 'success');
            this.formData = new FormData();
            this.addForm.reset();
          } else {
            this.common.presentToast(data.msg, 'warning');            
          }
        },
        error:() => {
          this.common.dismissloading();
          this.common.presentToast(environment.errMsg, 'danger');
        },
        complete:() => {
          this.common.dismissloading();
        }
      });  
    });    
  }

  pickImage() {
    this.common.selectImage(['document'], (blob: Blob | File) => {
      let extension = 'bin';
      if ('name' in blob && blob.name) {
        const parts = blob.name.split('.');
        extension = parts.length > 1 ? parts.pop()!.toLowerCase() : 'bin';
      } else if (blob.type) {
        const mimeToExtMap: Record<string, string> = {
          'image/jpeg': 'jpg',
          'image/png': 'png',
          'image/tiff': 'tiff',
          'image/webp': 'webp',
          'application/pdf': 'pdf',
          'application/vnd.ms-excel': 'xls',
          'application/msword': 'doc',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'xlsx',
        };
        extension = mimeToExtMap[blob.type] || 'bin';
      }
      const randomFilename = `${Date.now()}_${Math.floor(10000 + Math.random() * 90000)}.${extension}`;
      console.log(randomFilename);
      console.log(blob);
      this.addForm.get('length_doc_status')?.setValue('1');
      this.formData.delete('length_document');
      this.formData.append('length_document', blob, randomFilename);
    });
  }
  
}