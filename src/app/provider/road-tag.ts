import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RoadTag {

  private apiUrl = 'https://api.restful-api.dev/objects12';

  constructor(private http: HttpClient) { }

  // updateRoad(data: any): Observable<any> {
  //   const formData = new FormData();
  //   Object.keys(data).forEach(key => {
  //     const value = data[key];
  //     if (value instanceof Blob) {
  //       formData.append(key, value, `${key}.jpg`);
  //     } else {
  //       formData.append(key, value);
  //     }
  //   });

  //   return this.http.post(this.apiUrl, formData);
  // }


  updateRoad(formData: any): Observable<any> {
    return this.http.post(this.apiUrl, formData);
  }
}
