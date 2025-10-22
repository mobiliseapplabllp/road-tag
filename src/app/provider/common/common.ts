import { Injectable } from '@angular/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { ActionSheetController, LoadingController, ModalController, Platform, ToastController } from '@ionic/angular';
import { CameraComponent } from 'src/app/pages/camera/camera.component';

type ImagePickerOption = 'camera' | 'gallery' | 'outer' | 'document';
@Injectable({
  providedIn: 'root'
})
export class Common {
  loading: any;
  private activeRequests = 0;
  constructor(
    private platform: Platform,
    private actionSheetCtrl: ActionSheetController,
    private modalCtrl: ModalController,
    private loadingController: LoadingController,
    private toastController: ToastController
  ) {}

  async selectImage(options: ImagePickerOption[], callback: (blob: Blob) => void) {        
    const permissions = await Camera.checkPermissions();
    if (permissions.camera === 'denied') {
      alert('Camera permission was denied. Please open the app settings and allow camera access.');
      return;
    }
    if (this.platform.is('android')) {
      options = options.map(item => (item === 'camera' ? 'outer' : item));
    } else {
      options = options.filter(item => item !== 'outer');
    }
    if (options.length === 1) {
      const option = options[0];
      if (option === 'camera') {
        return this.openCamera(CameraSource.Camera, callback);
      } else if (option === 'gallery') {
        return this.openCamera(CameraSource.Photos, callback);
      } else if (option === 'outer') {
        return this.openOuterCamera(callback);
      } else if (option === 'document') {
        return this.openFilePicker(callback);
      }
    }

    const actionButtons = [];
    if (options.includes('camera')) {
      actionButtons.push({
        text: 'Camera',
        handler: () => this.openCamera(CameraSource.Camera, callback)
      });
    }
    if (options.includes('outer')) {
      actionButtons.push({
        text: 'Camera',
        handler: () => this.openOuterCamera(callback)
      });
    }
    if (options.includes('gallery')) {
      actionButtons.push({
        text: 'Gallery',
        handler: () => this.openCamera(CameraSource.Photos, callback)
      });
    }

    if (options.includes('document')) {
      actionButtons.push({
        text: 'Document',
        handler: () => this.openFilePicker(callback)
      });
    }

    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Pick Option',
      buttons: actionButtons
    });

    await actionSheet.present();
  }

  private async openCamera(source: CameraSource, callback: (blob: Blob) => void) {
    const image = await Camera.getPhoto({
      quality: 80,
      allowEditing: false,
      resultType: CameraResultType.Uri,
      source: source
    });
    const blob = await this.convertToBlob(image);
    callback(blob);
  }

  private async convertToBlob(photo: any): Promise<Blob> {
    const response = await fetch(photo.webPath);
    return await response.blob();
  }

  private async openOuterCamera(callback: (blob: Blob) => void) {
    const cameramodal = await this.modalCtrl.create({
      component: CameraComponent,
      backdropDismiss: false
    });

    cameramodal.onWillDismiss().then(disModal => {
      if (disModal.data) {
        callback(disModal.data);
      }
    });

    await cameramodal.present();
  }

  private openFilePicker(callback: (blob: Blob) => void) {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '*/*';
    input.style.display = 'none';

    input.onchange = (event: any) => {
      const file = event.target.files[0];
      if (file) {
        callback(file);
      }
    };

    document.body.appendChild(input);
    input.click();

    setTimeout(() => {
      document.body.removeChild(input);
    }, 1000);
  }

  async presentLoading() {        
    this.activeRequests++;    
    if (this.activeRequests === 1) {
      this.loading = await this.loadingController.create({
        message: 'Please wait' ,
      });
      this.loading.onDidDismiss().then(() => {                      
        this.activeRequests--;            
        if (this.activeRequests < 0) {
          this.activeRequests = 0;
        }        
      });
      await this.loading.present();
    }
  }

  dismissloading() {        
    if (this.activeRequests > 0) {
      this.activeRequests--;
    }    
    if (this.activeRequests === 0 && this.loading) {
      this.loading.dismiss();
      this.loading = null;
    }
  }

  async presentToast(msg: any, clr: any) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 3000,
      color: clr
    });
    toast.present();
  }

}
