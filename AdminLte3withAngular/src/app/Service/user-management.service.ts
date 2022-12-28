import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { WebAPIConfig } from '../_Model/commonModel';
import { newUser, SearchUserModel } from '../_Model/UserManagementModel';

const headers = new HttpHeaders({
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Methods': 'GET, POST, PATCH, PUT, DELETE, OPTIONS'
});

const options = { headers: headers, crossDomain: true, withCredentials: false };
@Injectable({
  providedIn: 'root'
})
export class UserManagementService {
  disabledSaveButtons =new BehaviorSubject({disabledSaveButton:false});
  GenNewUserId = new BehaviorSubject<any>(0);
  UserId: any;
  EditData = new Subject<any>();
  constructor(private httpclient: HttpClient) {

    var objUserModel = JSON.parse(sessionStorage.getItem("UserSession"));
    if (objUserModel != null) {
      this.UserId = objUserModel.User_Id;
    }
  }

  GetAllRoleCompanyWH(){
    var objBaseUrl = new WebAPIConfig();
    return this.httpclient.get(objBaseUrl.ApIUrl + "Common/GetAllRoleCompanyWH");
  }

  GetUserRoleCompanyWH(objdata: SearchUserModel): Observable<any> {
    var objBaseUrl = new WebAPIConfig();
    return this.httpclient.post(objBaseUrl.ApIUrl + "User/GetUserRoleCompanyWH", objdata, options);
  }

  SaveUpadteUserRoleCompanyWH(params: newUser): Observable<any> {
    var objBaseUrl = new WebAPIConfig();
    return this.httpclient.post(objBaseUrl.ApIUrl + "User/AddUpdateUserRoleCompanyWH", params);
  }
}
