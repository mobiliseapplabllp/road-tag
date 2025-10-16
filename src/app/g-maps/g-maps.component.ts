import { Component, NgZone, OnInit } from '@angular/core';
import { ModalController,Platform } from '@ionic/angular';
import { NativeGeocoder, NativeGeocoderResult, NativeGeocoderOptions } from '@awesome-cordova-plugins/native-geocoder/ngx';
import { Geolocation } from '@awesome-cordova-plugins/geolocation/ngx';

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
  startAddress: any = [];
  endAddress: any = [];
  latitude: number = 19.076;  
  longitude: number = 72.8777;

  constructor(
    private modalCtrl: ModalController,
    private zone: NgZone,
    private nativeGeocoder: NativeGeocoder,
    private geolocation: Geolocation,
    private platform: Platform,  
  ) { }

 
  ngOnInit() {
    setTimeout(() => {
      if (this.platform.is('capacitor')) {
        this.getLocation();  
      } else {
        this.initMap(this.latitude, this.longitude);  
      }
      
      if (typeof google !== 'undefined' && google.maps && google.maps.places) {
        this.autocompleteService = new google.maps.places.AutocompleteService();
      } else {
        console.error('Google Maps JS not loaded yet!');
      }
      this.geocoder = new google.maps.Geocoder();
    }, 1000);
  }
  async getLocation() {
    await this.geolocation.getCurrentPosition({enableHighAccuracy: true}).then((res: any) => {
      this.latitude = res.coords.latitude;
      this.longitude = res.coords.longitude;
      this.initMap(this.latitude, this.longitude);
    }, (err: any) => {
      alert(JSON.stringify(err) + ' Err');
    });
  }

  initMap(lat: number, lng: number) {
    const defaultCenter = { lat: lat, lng: lng };
    this.map = new google.maps.Map(document.getElementById('map1') as HTMLElement, {
      center: defaultCenter,
      zoom: 10,
    });

    this.polyline = new google.maps.Polyline({ path: [], strokeColor: '#0000FF', strokeWeight: 4 });
    this.polyline.setMap(this.map);

    this.map.addListener('click', (event: any) => this.addMarker(event.latLng));
  }

  addMarker(latLng: any) {
    if (this.mode === 'start') {
      if (this.startMarker) this.startMarker.setMap(null);
      this.startMarker = new google.maps.Marker({
        position: latLng,
        map: this.map,
        label: 'Start',
        icon: 'assets/green-dot.png'
      });
      this.startLatLng = latLng.toJSON();
    } else {
      if (this.endMarker) this.endMarker.setMap(null);
      this.endMarker = new google.maps.Marker({
        position: latLng,
        map: this.map,
        label: 'End',
        icon: 'assets/red-dot.png'
      });
      this.endLatLng = latLng.toJSON();
    }

    const path = [];
    if (this.startLatLng) path.push(this.startLatLng);
    if (this.endLatLng) path.push(this.endLatLng);
    this.polyline.setPath(path);
  }

  setStartMode() { this.mode = 'start'; }
  setEndMode() { this.mode = 'end'; }

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

  confirmModal() {
    console.log(this.startLatLng);
    console.log(this.endLatLng);
    if (!this.startLatLng) {
      alert('Please Select Start Location');
      return;
    }
    if (!this.endLatLng) {
      alert('Please Select End Location');
      return;
    }
    this.getAddress();
    this.isModalOpen = true;
  }
  onWillDismiss() {
    this.isModalOpen = false;
  }
  closeModal(data: any, status: any) {
    this.modalCtrl.dismiss(data, status);
  }
  async getAddress() {
    const options: NativeGeocoderOptions = {
      useLocale: true,
      maxResults: 5
    };

    try {
      if (this.startLatLng) {
        const startResults = await this.nativeGeocoder.reverseGeocode(this.startLatLng.lat, this.startLatLng.lng, options);
        this.startAddress = startResults[0];
        this.startLatLng.address = this.startAddress?.addressLines;
        console.log('Start Address:', startResults[0]);
      }

      if (this.endLatLng) {
        const endResults = await this.nativeGeocoder.reverseGeocode(this.endLatLng.lat, this.endLatLng.lng, options);
        this.endAddress = endResults[0];
        this.endLatLng.address = this.endAddress?.addressLines;
        console.log('End Address:', endResults[0]);
      }
    }
    catch (error) {
      console.error('Error getting address', error);
    }
  }

  saveLocation(){
    if (!this.startLatLng) {
      alert('Please Select Start Location');
      return;
    }
    if (!this.endLatLng) {
      alert('Please Select End Location');
      return;
    }
    this.getAddress().then(() => {
      this.modalCtrl.dismiss();
    });
    setTimeout(() => {
      this.closeModal({ startLatLng: this.startLatLng, endLatLng: this.endLatLng }, 'confirm');
    },1000);
  }
}


