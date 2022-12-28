import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BOQModel, BOQNOListModel, BOQReqModel, IBOQRequestequestService } from '../_Model/BOQRequestModel';
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

export class BOQRequestequestService implements IBOQRequestequestService{
  UserId:any;
  constructor(private httpclient: HttpClient) { 
    var objUserModel=JSON.parse(sessionStorage.getItem("UserSession"));
    if(objUserModel!=null)
    {
    this.UserId=objUserModel.User_Id;
    }
  }  

  GetBOQRequestList(objBOQReqModel:BOQReqModel):Observable<any>{
    var objBaseUrl=new WebAPIConfig();
    return  this.httpclient.post(objBaseUrl.ApIUrl+"BOQRequestController/GetBOQRequestList",objBOQReqModel,options);
  }
  
  GetBOQNoORBOQRequestNo(objModel: BOQNOListModel): Observable<any> {
    var objBaseUrl = new WebAPIConfig();
    return this.httpclient.post(objBaseUrl.ApIUrl + "BOQMasterController/GetBOQNoORBOQRequestNo", objModel, options);
  }

  GetBOQRequestPdfDetail(objBOQReqModel:BOQModel):Observable<any>{
    var objBaseUrl=new WebAPIConfig();
    return  this.httpclient.post(objBaseUrl.ApIUrl+"BOQRequestController/GetBOQRequestPdfDetailById",objBOQReqModel,options);
  }
}
