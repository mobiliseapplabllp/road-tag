import { Component, NgZone, OnInit } from '@angular/core';
import { ModalController, Platform } from '@ionic/angular';
import { Geolocation } from '@capacitor/geolocation';
import { Api } from '../provider/api';
import { environment } from 'src/environments/environment';
import { Common } from '../provider/common/common';

declare var google: any;

@Component({
  selector: 'app-g-maps',
  templateUrl: './g-maps.component.html',
  styleUrls: ['./g-maps.component.scss'],
  standalone: false
})
export class GMapsComponent implements OnInit {
  map: any;
  startMarker: any;
  endMarker: any;
  polyline: any;
  startLatLng: any;
  endLatLng: any;
  mode: 'start' | 'end' = 'start';
  autocompleteService: any;
  geocoder: any;
  isModalOpen = false;
  distanceArr: any = {};
  finalData: any = {};
  constructor(
    private modalCtrl: ModalController, 
    private zone: NgZone,
    private httpApi: Api,
    private platform: Platform,
    private common: Common
  ) { }

  ngOnInit() {
    setTimeout(() => {               
      if (typeof google !== 'undefined' && google.maps && google.maps.places) {
        this.autocompleteService = new google.maps.places.AutocompleteService();
      } else {
        console.error('Google Maps JS not loaded yet!');
      }
      this.geocoder = new google.maps.Geocoder();
    }, 1000);    
    if (this.platform.is('capacitor')) {
      this.getLocation();
    } else {      
      let lat, lng
      lat = 28.385628931475292;
      lng = 77.26940318293042;
      this.initMap(lat, lng);
    }
  }

  async getLocation() {
    await Geolocation.getCurrentPosition({enableHighAccuracy: true}).then((res: any) => {
      let lat, lng;
      // console.log(lat, lng);
      lat = res.coords.latitude;
      lng = res.coords.longitude;
      this.initMap(lat, lng);
    }, (err: any) => {
      alert(JSON.stringify(err) + ' Err');
    });
  }

  initMap(lat: any, lng: any) {
    const defaultCenter = { lat: lat, lng: lng };
    this.map = new google.maps.Map(document.getElementById('map1') as HTMLElement, {
      center: defaultCenter,
      zoom: 18,
    });

    this.polyline = new google.maps.Polyline({ path: [], strokeColor: '#0000FF', strokeWeight: 4 });
    this.polyline.setMap(this.map);

    this.map.addListener('click', (event: any) => this.addMarker(event.latLng));
    // this.setMarker(lat, lng);
  }

  setMarker(lat: any , long: any) {
    const position = new google.maps.LatLng(lat, long);
    const marker = new google.maps.Marker({ position, title: 'Mobilise' });
    marker.setMap(this.map);
  }

  addMarker(latLng: any) {
    if (this.startMarker) this.startMarker.setMap(null);
    this.startMarker = new google.maps.Marker({
      position: latLng,
      map: this.map,
      label: 'Start',
      icon: 'assets/green-dot.png'
    });
    this.startLatLng = latLng.toJSON();
    // this.startLatLng = latLng.toJSON();
    // if (this.mode === 'start') {
    //   if (this.startMarker) this.startMarker.setMap(null);
    //   this.startMarker = new google.maps.Marker({
    //     position: latLng,
    //     map: this.map,
    //     label: 'Start',
    //     icon: 'assets/green-dot.png'
    //   });
    //   this.startLatLng = latLng.toJSON();
    // } else {
    //   if (this.endMarker) this.endMarker.setMap(null);
    //   this.endMarker = new google.maps.Marker({
    //     position: latLng,
    //     map: this.map,
    //     label: 'End',
    //     icon: 'assets/red-dot.png'
    //   });
    //   this.endLatLng = latLng.toJSON();
    // }

    // const path = [];
    // if (this.startLatLng) path.push(this.startLatLng);
    // if (this.endLatLng) path.push(this.endLatLng);
    // this.polyline.setPath(path);
  }

  // setStartMode() { 
  //   this.mode = 'start'; 
  // }

  // setEndMode() { 
  //   this.mode = 'end'; 
  // }

  onSearch(event: any) {
    const query = event.target.value;
    if (!query) return;
    this.autocompleteService.getPlacePredictions({ input: query, types: ['geocode'] }, (predictions: any, status: any) => {
      if (status === google.maps.places.PlacesServiceStatus.OK && predictions.length) {
        this.geocoder.geocode({ placeId: predictions[0].place_id }, (results: any, status: any) => {
          if (status === 'OK' && results[0]) {
            this.zone.run(() => {
              this.map.setCenter(results[0].geometry.location);
              this.map.setZoom(14);
            });
          }
        });
      }
    });
  }

  save() {    
    if (!this.finalData.image1) {
      this.common.presentToast('Please Upload Image 1', 'warning');
    } else if (!this.finalData.image2) {
      this.common.presentToast('Please Upload Image 2', 'warning');
    } else if (!this.finalData.image3) {
      this.common.presentToast('Please Upload Image 3', 'warning');
    } else if (!this.finalData.image4) {
      this.common.presentToast('Please Upload Image 4', 'warning');
    } else if (!this.startLatLng) {
      this.common.presentToast('Please Select Location', 'warning');
    } else {
      this.finalData.startLatLng = this.startLatLng;
      console.log(this.finalData);
      this.closeModal(this.finalData, 'true');
    }
    
  }

  pickImage(val: any) {
    this.common.selectImage(['camera', 'outer', 'gallery'], (blob: Blob | File) => {
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
      if (val == 1) {
        this.finalData.image1 = blob;
        this.finalData.image1Name = randomFilename;
      } else if (val == 2) {
        this.finalData.image2 = blob;
        this.finalData.image2Name = randomFilename;
      } else if (val == 3) {
        this.finalData.image3 = blob;
        this.finalData.image3Name = randomFilename;
      } else if (val == 4) {
        this.finalData.image4 = blob;
        this.finalData.image4Name = randomFilename;
      }
      console.log(this.finalData);
    });
  }

  confirmModal() {    
    if (!this.startLatLng) {
      alert('Please Select Start Location');      
      return;
    }
    if (!this.endLatLng) {
      alert('Please Select End Location');
      return;
    }    
    let startLatLng, endLatLng; 
    startLatLng = this.startLatLng.lat + ',' + this.startLatLng.lng;
    endLatLng = this.endLatLng.lat + ',' + this.endLatLng.lng;
    this.getApi(startLatLng, endLatLng);
    this.isModalOpen = true;
  }

  getApi(startLatLng: string, endLatLng: string) {    
    this.httpApi.presentLoading().then(preLoad => {
      this.httpApi.getDirections(startLatLng, endLatLng).subscribe({
        next:(data: any) => {
          if (data.status === 'SUCCESS') {
            this.distanceArr = data.routes[0].legs[0];                        
          }
        },
        error:() => {
          this.httpApi.dismissloading();
          this.httpApi.presentToast(environment.errMsg, 'danger');
        },
        complete:() => {
          this.httpApi.dismissloading();
        }
      });
    })
    
  }


  closeModal(data: any, status: any) {
    this.modalCtrl.dismiss(data, status);
    // console.log(this.startLatLng);
    // console.log(this.endLatLng);
    // return
    // this.modalCtrl.dismiss({
    //   start: this.startLatLng,
    //   end: this.endLatLng
    // });
  }
  
  onWillDismiss() {
    this.isModalOpen = false; 
  }

  submit() {
    console.log(this.startLatLng);
    console.log(this.endLatLng);
    console.log(this.distanceArr);
    let finalSubmit = {
      start_lat: this.startLatLng.lat,
      start_lng: this.startLatLng.lng,
      end_lat: this.endLatLng.lat,
      end_lng: this.endLatLng.lng,
      readable_distance: this.distanceArr.readable_distance,
      readable_duration: this.distanceArr.readable_duration,      
    }
    console.log(finalSubmit);
    this.isModalOpen = false;
    setTimeout(() => {
      this.closeModal(finalSubmit, 'true');
    }, 300);
  }
}
