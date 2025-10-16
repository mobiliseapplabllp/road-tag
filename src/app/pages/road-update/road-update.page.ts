import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { Router } from '@angular/router';
import { ModalComponent } from '../modal/modal.component';
import { Camera, CameraResultType } from '@capacitor/camera';
import { ToastController } from '@ionic/angular';
import { GMapsComponent } from 'src/app/g-maps/g-maps.component';
import { Api } from 'src/app/provider/api';
import { RoadTag } from 'src/app/provider/road-tag';

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
  tempObj: any = {};

  constructor(
    private formBuilder: FormBuilder,
    private modal: ModalController,
    private router: Router,
    private toast: ToastController,
    private modalCtrl: ModalController,
    private httpApi: Api,
    private httpRoad: RoadTag,
  ) { }

  ngOnInit() {
    this.initialForm();
    this.getApi();
  }

  getApi() {
    this.httpApi.getDirections('28.510543263855247, 77.29847171803526', '28.511042862603688, 77.29824246473908').subscribe();
  }

  initialForm() {
    this.updateRoadForm = this.formBuilder.group({
      road_iD: ['', [Validators.required]],
      road_name: [''],
      start_point_lat: [''],
      start_point_long: [''],
      start_address: [''],
      end_point_lat: [''],
      end_point_long: [''],
      end_address: [''],
      startPhoto: [''],
      endPhoto: [''],
    })
  }
  submitForm() {
    if (!this.updateRoadForm.valid) {
      console.log('invalid form')
      this.updateRoadForm.markAllAsTouched();
      this.showToast('Fill the required field', 'danger')
      return;
    }
    const formData = { ...this.updateRoadForm.value };
    console.log('Form Data:', formData);
    this.httpRoad.updateRoad(formData).subscribe({
      next: (res) => {
        console.log('API Response:', res);
        this.showToast('Road Updated Successfully', 'success');
        this.updateRoadForm.reset();
        this.startPhoto = '';
        this.endPhoto = '';
        this.tempObj = {};
      },
       error: (err) => {
        console.error('API Error:', err);
        this.showToast('Failed to update road','danger');
      },
      complete: () => {
        this.router.navigateByUrl('/road-tag');
      }
    });
  }

  async openModal() {
    const modal = await this.modalCtrl.create({
      component: GMapsComponent,
      cssClass: 'my-modal',
    });
    modal.onWillDismiss().then((disModal) => {
      if (disModal.role === 'confirm' && disModal.data) {
        const { startLatLng, endLatLng } = disModal.data;
        console.log('Received from GMaps:', startLatLng, endLatLng);
        this.updateRoadForm.patchValue({
          start_point_lat: startLatLng.lat,
          start_point_long: startLatLng.lng,
          end_point_lat: endLatLng.lat,
          end_point_long: endLatLng.lng,
          start_address: startLatLng.address,
          end_address: endLatLng.address,
        });
        this.tempObj.start = startLatLng;
        this.tempObj.end = endLatLng;
        console.log('Temporary Object:', this.tempObj);
      }
    });
    await modal.present();
  }

  async photo(type: 'start' | 'end') {
    try {
      const image = await Camera.getPhoto({
        quality: 60,
        allowEditing: false,
        width: 800,
        height: 600,
        resultType: CameraResultType.Uri
      });

      const response = await fetch(image.webPath!);
      const blob = await response.blob();
      const previewUrl = URL.createObjectURL(blob);

      if (type === 'start') {
        this.updateRoadForm.patchValue({ startPhoto: blob });
        this.startPhoto = previewUrl;
      } else {
        this.updateRoadForm.patchValue({ endPhoto: blob });
        this.endPhoto = previewUrl;
      }

      console.log('Photo captured:', type, blob);
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
