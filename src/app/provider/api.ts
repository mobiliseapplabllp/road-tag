import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Api {
  private apiUrl = 'https://api.olamaps.io/routing/v1/directions';
  private apiKey = 'uBPx8fB0UjYb2SfipXNXYX9wn7eKzeAsFDCpA85y';
  private clientId = 'e5cd7189-0d65-4bfe-b2e3-57cc405450fd'; // Replace with your client ID
  private clientSecret = 'E6R1dxPnDB8O3CO2GYkHf6B9xQT7yJ0V'; // Replace with your client secret
  private tokenUrl = 'https://account.olamaps.io/realms/olamaps/protocol/openid-connect/token';

  constructor(
    public https: HttpClient,
  ) { }
  
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
}
