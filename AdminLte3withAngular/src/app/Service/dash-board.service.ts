import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { WebAPIConfig } from '../_Model/commonModel';
import { Observable } from 'rxjs';

const headers = new HttpHeaders({  'Content-Type': 'application/json', 
                                   'Access-Control-Allow-Origin': '*',
                                   'Methods': 'GET, POST, PATCH, PUT, DELETE, OPTIONS'
                                   });
                                   
const options = { headers: headers, crossDomain: true, withCredentials: false };
@Injectable({
  providedIn: 'root'
})

export class DashBoardService {
  UserId: any;
  constructor(private httpclient: HttpClient) {
    var objUserModel = JSON.parse(sessionStorage.getItem("UserSession"));
    if (objUserModel != null) {
      this.UserId = objUserModel.User_Id;
    }
  }

  GetDashboardMasterdet(para: any): Observable<any> {
    var objBaseUrl = new WebAPIConfig();
    return this.httpclient.post(objBaseUrl.ApIUrl + "DashBoard/GetDashboardMasterDet", para, options);
  }
}
