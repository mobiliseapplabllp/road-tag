import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
declare var google: any;

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
  standalone : false
})
export class ModalComponent implements OnInit {
  @ViewChild('mapContainer', { static: false }) mapContainer!: ElementRef;
  
  currentPointType: 'start' | 'end' = 'start';
  selectedLat: number | null = null;
  selectedLng: number | null = null;
  selectedAddress : string | null = null;
  map: any;
  marker: any;

  constructor(
    private modalCtrl: ModalController,
    private navParams: NavParams
  ) {}

  ngOnInit() {
    this.currentPointType = this.navParams.get('pointType');
    this.selectedLat = this.navParams.get('lat');
    this.selectedLng = this.navParams.get('lng');
    
    setTimeout(() => {
      if (this.mapContainer && this.mapContainer.nativeElement) {
        this.initializeMap();
      }
    }, 500);
  }

  initializeMap() {
    if (typeof google === 'undefined') {
      console.error('Google Maps not loaded');
      return;
    }

    const center = {
      lat: this.selectedLat ? parseFloat(String(this.selectedLat)) : 28.6139,
      lng: this.selectedLng ? parseFloat(String(this.selectedLng)) : 77.2090
    };

    try {
      this.map = new google.maps.Map(this.mapContainer.nativeElement, {
        center: center,
        zoom: 12,
        mapTypeControl: false,
      });

      this.marker = new google.maps.Marker({
        position: center,
        map: this.map,
        draggable: true,
      });

      this.map.addListener('click', (event: any) => {
        this.selectedLat = event.latLng.lat();
        this.selectedLng = event.latLng.lng();
        this.marker.setPosition(event.latLng);
      });

      this.marker.addListener('dragend', (event: any) => {
        this.selectedLat = event.latLng.lat();
        this.selectedLng = event.latLng.lng();
      });
    } catch (error) {
      console.error('Error initializing map:', error);
    }
  }

  closeModal() {
    this.modalCtrl.dismiss();
  }

  confirmLocation() {
    if (this.selectedLat && this.selectedLng) {
      this.modalCtrl.dismiss({
        lat: this.selectedLat.toFixed(6),
        lng: this.selectedLng.toFixed(6)
      });
    }
  }
}