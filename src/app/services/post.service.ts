import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  API_URL = environment.adminAPIURL;
  httpOptions = {
    Headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Access-Control-Allow-Headers': 'Content-Type'
    })
  }
  // private url = 'https://run.mocky.io/v3/2c112d6b-8006-4a35-969f-86d526d08843';
  // private DOMIntUrl = 'https://run.mocky.io/v3/0d48c0f0-39fe-4ec3-9158-b4e87d75d2e1';
  constructor(private http: HttpClient) {}

  getDOMInt() {
    // return this.http.get(this.DOMIntUrl)
    return this.http.get(`${this.API_URL}/menu/dom-intr`);
  }

  /**
   * This method can be removed while deploying to production
   */
  getPackages(item: any): Observable<any> {
    const url = "https://run.mocky.io/v3/254175a5-0cdc-49f7-8d54-e0528b02f695";
    return this.http.get<any>(url);
  }

  getPackageDetailsById(item: any): Observable<any> {
    // console.log('Selected item Edit Package :: ', item)
    const url = "https://run.mocky.io/v3/8b612358-e834-4a0c-a58f-d28c81dbe7f6";
    return this.http.get<any>(url);
  }

  getStatesByDomInt(item: any): Observable<any> {
    const url = `${this.API_URL}/menu/packages-by-category`;
    const data = {
      'categoryId': item
    };
    return this.http.post(url, data); //packages-by-category
  }
  getItinerariesByDomInt(item: any): Observable<any> {
    const url = `${this.API_URL}/menu/itineraries`;
    const data = {
      'categoryId': item.category,
      'packageId': item.package
    };
    console.log('item from service :: ', data);
    return this.http.post(url, data); //packages-by-category
  }

  createPackageByDOM(payload: any, url: string) {
    const headers = new HttpHeaders();
    headers.append('Content-Type', 'application/json');
    return this.http.post(`${this.API_URL}/${url}`, payload, {headers: headers} );
  }
  updatePackage(url: string, payload: any) {
    const headers = new HttpHeaders();
    headers.append('Content-Type', 'application/json');
    return this.http.post(`${this.API_URL}/${url}`, payload, {headers: headers} );
  }

  // path: 'edit-package/:CategoryID/:SubCatID',
  abcd(payload: any): Observable<any> {
    const headers = new HttpHeaders();
    headers.append('Content-Type', 'application/json');
    const url = `menu/edit-package`;
    return this.http.post(`${this.API_URL}/${url}`, payload, {headers: headers} );
  }

  /**
   * This method is for Creating an Itinerary
   * @param payload which data goes and store in DB
   * @param url call the endpoint
   * @returns 
   */
  createItinerary(payload: any, url: string) {
    const headers = new HttpHeaders();
    headers.append('Content-Type', 'application/json');
    return this.http.post(`${this.API_URL}/${url}`, payload, {headers: headers} );
  }

  /**
   * This method is for retrieving all the itineraries which are active
   */
  getAllItineraries(payload: any, url: string) {
    const headers = new HttpHeaders();
    headers.append('Content-Type', 'application/json');
    return this.http.post(`${this.API_URL}/${url}`, payload, {headers: headers} );
  }

  /**
   * This method invokes for FormData which has form data with file..
   */
  sendFormData(url: any, formData: any) {
    return this.http.post(`${this.API_URL}/${url}`, formData, {
      reportProgress: true,
      observe: 'events'
    });
  }

  getSlider(): Observable<any> {
    const url = `${this.API_URL}/menu/get-slider`;
    const data = {
      'active': 1
    };
    return this.http.post(url, data); //packages-by-category
  }

  getContact(): Observable<any> {
    const url = `${this.API_URL}/menu/get-enquiry`;
    const data = {
      'active': 1
    };
    return this.http.post(url, data); //packages-by-category
  }
  getData(url: any) {
    return this.http.get(`${this.API_URL}/${url}`);
  }
  getItinerariesById(dataId: any): Observable<any> {
    const url = `${this.API_URL}/menu/itinerary-details`;
    const data = {
      'itinerary_id': dataId
    };
    return this.http.post(url, data);
  }

}
