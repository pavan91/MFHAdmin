import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CommonService {
  public API_URL: string = environment.adminAPIURL;
  public API_IMAGE_URL: string = environment.adminAPIURL + '/img/';

  constructor(
    private http: HttpClient
  ) { }

}
