import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { EmailDetailReqModel, WebAPIConfig } from '../_Model/commonModel';
import { Observable } from 'rxjs';

const headers = new HttpHeaders({
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Methods': 'GET, POST, PATCH, PUT, DELETE, OPTIONS'
});

const options = { headers: headers, crossDomain: true, withCredentials: false };
@Injectable({
  providedIn: 'root'
})
export class SendmailService {
  UserId: any;
  constructor(private httpclient: HttpClient) {

    var objUserModel = JSON.parse(sessionStorage.getItem("UserSession"));
    if (objUserModel != null) {
      this.UserId = objUserModel.User_Id;
    }
  }

   GetMailHistory(objPara: EmailDetailReqModel): Observable<any> {
    var objBaseUrl = new WebAPIConfig();
    return  this.httpclient.post(objBaseUrl.ApIUrl + "Email/GetMailHistory", objPara, options);
  }
}
