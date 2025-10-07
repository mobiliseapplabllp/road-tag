import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { Router } from '@angular/router';
import { ModalComponent } from '../modal/modal.component';
import { Camera, CameraResultType } from '@capacitor/camera';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-road-update',
  templateUrl: './road-update.page.html',
  styleUrls: ['./road-update.page.scss'],
  standalone: false
})
export class RoadUpdatePage implements OnInit {
  updateRoadForm!: FormGroup
  photos: { start?: string; end?: string } = {};
  startPhoto: any = '';
  endPhoto: any = '';
  constructor(
    private formBuilder: FormBuilder,
    private modal: ModalController,
    private router: Router,
    private toast: ToastController
  ) { }

  ngOnInit() {
    this.initialForm();
  }

  initialForm() {
    this.updateRoadForm = this.formBuilder.group({
      road_iD: ['', [Validators.required]],
      start_point_lat: [''],
      start_point_long: [''],
      start_address: [''], 
      end_point_lat: [''],
      end_point_long: [''],
      startPhoto: [''],
      endPhoto: [''],
      end_address: [''], 
      road_name: [''],
     
    })
  }
  submitForm() {
    if (!this.updateRoadForm.valid) {
      console.log('invalid form')
      this.updateRoadForm.markAllAsTouched();
      this.showToast('Fill the required field', 'danger')
      return;
    }
    const formData = this.updateRoadForm.value;
    formData.road_id = formData.road_iD;
    delete formData.road_iD;
    localStorage.setItem('updatedFormData', JSON.stringify(formData));
    console.log('Form data saved in local storage');
  }

  async openMap(pointType: 'start' | 'end') {
    const currentLat = pointType === 'start'
      ? this.updateRoadForm.get('start_point_lat')?.value
      : this.updateRoadForm.get('end_point_lat')?.value
    
    const currentLng = pointType === 'start'
      ? this.updateRoadForm.get('start_point_long')?.value
      : this.updateRoadForm.get('end_point_long')?.value

    const currentAdd = this.updateRoadForm.get('address')?.value;  
    const modal = await this.modal.create({
      component: ModalComponent,
      componentProps: {
        pointType: pointType,
        lat: currentLat,
        lng: currentLng,
        address:currentAdd,
      }
    });
    await modal.present();
    const { data } = await modal.onWillDismiss();
    if (data) {
      if (pointType === 'start') {
        this.updateRoadForm.patchValue({
          start_point_lat: data.lat,
          start_point_long: data.lng,
          start_address: data.address
        });
      } else {
        this.updateRoadForm.patchValue({
          end_point_lat: data.lat,
          end_point_long: data.lng,
          end_address: data.address
        });
      }
    }
  }
  async photo(type: 'start' | 'end') {
    try {
      const image = await Camera.getPhoto({
        quality: 60,
        allowEditing: true,
        width: 800,
        height: 600,
        resultType: CameraResultType.DataUrl
      });
      const photoData = image.dataUrl;
      if (type === 'start') {
        this.updateRoadForm.patchValue({ startPhoto: photoData });
        this.startPhoto = true
      } else {
        this.updateRoadForm.patchValue({ endPhoto: photoData });
        this.endPhoto = true
      }
      console.log('Photo captured:', type);
    } catch (err) {
      console.error('Camera error:', err);
    }
  }

  async showToast(message: string, color: 'success' | 'danger') {
    const toast = await this.toast.create({
      message,
      color,
      duration: 3000,
      position: 'bottom',
    });
    await toast.present();
  }
}
