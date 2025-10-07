import { Component, NgZone, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

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

  constructor(private modalCtrl: ModalController, private zone: NgZone) { }

  ngOnInit() {
    setTimeout(() => {
      this.initMap();
      // this.autocompleteService = new google.maps.places.AutocompleteService();
      if (typeof google !== 'undefined' && google.maps && google.maps.places) {
        this.autocompleteService = new google.maps.places.AutocompleteService();
      } else {
        console.error('Google Maps JS not loaded yet!');
      }
      this.geocoder = new google.maps.Geocoder();
    }, 1000);    
  }

  initMap() {
    const defaultCenter = { lat: 19.076, lng: 72.8777 };
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

  closeModal() {
    console.log(this.startLatLng);
    console.log(this.endLatLng);
    return
    this.modalCtrl.dismiss({
      start: this.startLatLng,
      end: this.endLatLng
    });
  }
}
