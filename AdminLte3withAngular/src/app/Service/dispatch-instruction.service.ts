import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BOQModel, BOQNOListModel, BOQReqModel, SearchDIRequestModel } from '../_Model/BOQRequestModel';
import { JsonModel, WebAPIConfig } from '../_Model/commonModel';
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
export class DispatchInstructionService {
  UserId: any;
  constructor(private httpclient: HttpClient) {
    var objUserModel = JSON.parse(sessionStorage.getItem("UserSession"));
    if (objUserModel != null) {
      this.UserId = objUserModel.User_Id;
    }
  }


  GetDIRequestList(objSearchDIRequestModel: SearchDIRequestModel): Observable<any> {
    var objBaseUrl = new WebAPIConfig();
    return this.httpclient.post(objBaseUrl.ApIUrl + "BOQRequestController/GetMRRequestList", objSearchDIRequestModel, options);
  }

  GetDINo(objModel: BOQNOListModel): Observable<any> {
    var objBaseUrl = new WebAPIConfig();
    return this.httpclient.post(objBaseUrl.ApIUrl + "BOQMasterController/GetBOQNoORBOQRequestNo", objModel, options);
  }

  GetDIRequestPdfDetail(objModel: SearchDIRequestModel): Observable<any> {
    var objBaseUrl = new WebAPIConfig();
    return this.httpclient.post(objBaseUrl.ApIUrl + "BOQRequestController/GetMRRequestListByMRReqId", objModel, options);
  }

  UpdateDISRNStatus(objJson: JsonModel): Observable<any> {
    var objBaseUrl = new WebAPIConfig();
    return this.httpclient.post(objBaseUrl.ApIUrl + "BOQRequestController/UpdateDISRNStatus", objJson, options);
  } 

  UploadSRNDoc(formdata:FormData):Observable<any>{
    var objBaseUrl=new WebAPIConfig();    
    return this.httpclient.post(objBaseUrl.ApIUrl+"BOQRequestController/UploadDISRNDoc",formdata);  
  }

}