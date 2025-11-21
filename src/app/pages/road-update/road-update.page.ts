import { Component, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';
import { BackgroundGeolocation } from "@capgo/background-geolocation";
import { Geolocation } from '@capacitor/geolocation';

declare var google: any;
@Component({
  selector: 'app-road-update',
  templateUrl: './road-update.page.html',
  styleUrls: ['./road-update.page.scss'],
  standalone: false
})
export class RoadUpdatePage implements OnInit {
  map: any;
  polyline: any;

  allPoints: any[] = [{
    lat: 28.452409465547913, 
    lng: 77.04256236082655
  }, {
    lat: 28.45644668400078, 
    lng: 77.04636036879019
  }, {
    lat: 28.46035169725649, 
    lng: 77.05017983442617
  }];
  startPoint: any = null;
  endPoint: any = null;

  markers: any[] = [];
  circles: any[] = [];

  currentStatus = '';

  constructor(private platform: Platform) {}

  ngOnInit(): void {
    if (this.platform.is('capacitor')) {
      this.getLocation();
    } else {
      this.initMap(28.446189750840446, 77.30811111326851);
      this.addInitialMarker(28.446189750840446, 77.30811111326851);                  
    }
  }

  // ============================
  // 1️⃣ App Open → Initial Location Marker (BLUE)
  // ============================
  async getLocation() {
    const current = await Geolocation.getCurrentPosition({
      enableHighAccuracy: true
    });

    this.initMap(current.coords.latitude, current.coords.longitude);

    // BLUE marker = Initial
    this.addInitialMarker(current.coords.latitude, current.coords.longitude);
  }

  initMap(lat: any, lng: any) {
    this.map = new google.maps.Map(document.getElementById("map"), {
      zoom: 16,
      center: { lat, lng },
      mapTypeId: "roadmap"
    });

    this.polyline = new google.maps.Polyline({
      path: [],
      geodesic: true,
      strokeColor: "#0000FF",
      strokeOpacity: 1.0,
      strokeWeight: 3
    });

    this.polyline.setMap(this.map);
  }

  // BLUE MARKER (initial)
  addInitialMarker(lat: any, lng: any) {
    const marker = new google.maps.Marker({
      position: { lat, lng },
      map: this.map,
      icon: "https://maps.gstatic.com/mapfiles/ms2/micons/blue-dot.png",
      title: "Current Location"
    });

    this.markers.push(marker);
  }

  // GREEN START MARKER
  addStartMarker(point: any) {
    const marker = new google.maps.Marker({
      position: point,
      map: this.map,
      label: "S",
      icon: {
        url: "http://maps.google.com/mapfiles/ms/icons/green-dot.png"
      }
    });

    this.markers.push(marker);
  }

  // RED END MARKER
  addEndMarker(point: any) {
    const marker = new google.maps.Marker({
      position: point,
      map: this.map,
      label: "E",
      icon: {
        url: "http://maps.google.com/mapfiles/ms/icons/red-dot.png"
      }
    });

    this.markers.push(marker);
  }

  // RED SMALL DOT for each live update
  addLiveDot(lat: any, lng: any) {
    const circle = new google.maps.Circle({
      strokeWeight: 1,
      fillColor: "red",
      fillOpacity: 1,
      map: this.map,
      center: { lat, lng },
      radius: 2
    });

    this.circles.push(circle);
  }

  // ============================
  // 2️⃣ START TRACKING
  // ============================
  async startTracking() {

    this.allPoints = [];

    const current = await Geolocation.getCurrentPosition({
      enableHighAccuracy: true
    });

    this.startPoint = {
      lat: current.coords.latitude,
      lng: current.coords.longitude,
      timestamp: new Date().toISOString()
    };

    this.currentStatus = 'start';

    this.allPoints.push(this.startPoint);

    // GREEN Start Marker
    this.addStartMarker(this.startPoint);

    // Background tracking
    BackgroundGeolocation.start(
      {
        backgroundMessage: "Tracking you...",
        backgroundTitle: "Road Tagging Active",
        requestPermissions: true,
        distanceFilter: 5
      },
      (location: any, error: any) => {
        if (error) return;

        const point = {
          lat: location.latitude,
          lng: location.longitude,
          timestamp: new Date().toISOString()
        };

        this.allPoints.push(point);

        // RED DOT on map
        this.addLiveDot(point.lat, point.lng);

        console.log("BG Point:", point);
      }
    );
  }

  // ============================
  // 3️⃣ STOP TRACKING → END MARKER + POLYLINE
  // ============================
  async stopTracking() {
    BackgroundGeolocation.stop();

    const last = await Geolocation.getCurrentPosition({
      enableHighAccuracy: true
    });

    this.endPoint = {
      lat: last.coords.latitude,
      lng: last.coords.longitude,
      timestamp: new Date().toISOString()
    };

    this.allPoints.push(this.endPoint);

    // RED END marker
    this.addEndMarker(this.endPoint);

    // Polyline
    this.drawPolyline();
  }

  // ============================
  // 4️⃣ Draw Polyline + adjust map
  // ============================
  drawPolyline() {
    const path = this.allPoints.map((p) => ({ lat: p.lat, lng: p.lng }));

    this.polyline.setPath(path);

    const bounds = new google.maps.LatLngBounds();
    path.forEach((p) => bounds.extend(p));
    this.map.fitBounds(bounds);
  }
}
