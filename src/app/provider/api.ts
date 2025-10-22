import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoadingController, ToastController } from '@ionic/angular';
import { map, Observable, switchMap } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class Api {
  private apiUrl = 'https://api.olamaps.io/routing/v1/directions';
  private apiKey = 'uBPx8fB0UjYb2SfipXNXYX9wn7eKzeAsFDCpA85y';
  private clientId = 'e5cd7189-0d65-4bfe-b2e3-57cc405450fd'; 
  private clientSecret = 'E6R1dxPnDB8O3CO2GYkHf6B9xQT7yJ0V';
  private tokenUrl = 'https://account.olamaps.io/realms/olamaps/protocol/openid-connect/token';
  loading: any;
  constructor(
    private https: HttpClient,
    private loadingController: LoadingController,
    private toastController: ToastController
  ) { }

  loginAuth(obj: any): Observable<any> {
    return this.https.post(environment.url + 'login_with_otp' , obj);
  }
  
  verifyOtp(formData: any): Observable<any> {
    return this.https.post(environment.url + 'verify_login_otp', formData);
  }

  getDistrict(): Observable<any> {
    return this.https.get(environment.url + 'assets/settings/sel_ownership');
  }
  
  getDivision(): Observable<any> {
    return this.https.get(environment.url + 'assets/settings/sel_asset_group');
  }

  getSubDivision(): Observable<any> {
    return this.https.get(environment.url + 'assets/settings/get_assets_subgrp');    
  }

  getWard(grp_id: any): Observable<any> {
    return this.https.get(environment.url + 'assets/settings/sel_asset_fsclass?grp_id=' + grp_id);
  }

  getDepartment(): Observable<any> {
    return this.https.get(environment.url + 'assets/settings/get_department?status=1');
  }

  getWidthCat(): Observable<any> {
    return this.https.get(environment.url + 'assets/settings/dropdown_for_asset_status');
  }

  getTechnology(): Observable<any> {
    return this.https.get(environment.url + 'assets/settings/sel_technology');
  }

  getRoadCat(): Observable<any> {
    return this.https.get(environment.url + 'assets/settings/get_manufacturer?status=1');
  }

  getLastTreatment(): Observable<any> {
    return this.https.get(environment.url + 'assets/settings/get_warranty?status=1');
  }

  addRoad(formData: any): Observable<any> {
    return this.https.post(environment.url + 'assets/settings/add_road',  formData);
  }

  getAccessToken(): Observable<string> {
    const body = new HttpParams()
      .set('grant_type', 'client_credentials')
      .set('scope', 'openid')
      .set('client_id', this.clientId)
      .set('client_secret', this.clientSecret);
 
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    });
 
    return this.https.post<any>(this.tokenUrl, body, { headers }).pipe(map(response => response.access_token));
  }

  getDirections(origin: string, destination: string,requestId?: string): Observable<any> {
    return this.getAccessToken().pipe(switchMap(token => {
        const headers = new HttpHeaders({
          'Authorization': `Bearer ${token}`,
 
        });
        let options = { headers: headers };
 
        const params = new HttpParams()
          .set('origin', origin)
          .set('destination', destination)
          .set('api_key', this.apiKey)
 
        return this.https.post<any>(this.apiUrl + `?origin=${origin}&destination=${destination}&api_key=${this.apiKey}`,null,options);
      })
    );
  }

  async presentLoading(msg?: string) {    
    this.loading = await this.loadingController.create({
      message: msg ? msg: 'Please wait' ,
    });
    await this.loading.present();
  }

  dismissloading() {
    if (this.loading) {
      this.loading.dismiss();
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

