import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PoSeriesDetailModel } from '../_Model/purchaseOrderModel';
import { WebAPIConfig } from '../_Model/commonModel'


const headers = new HttpHeaders({
  'Content-Type': 'application/json',

  'Access-Control-Allow-Origin': '*',
  'Methods': 'POST'
});
const options = { headers: headers, crossDomain: true, withCredentials: false };
@Injectable({
  providedIn: 'root'
})
export class PoConfigSeriesService {
  private httpOptions: any;
  private objBaseUrl: WebAPIConfig; 

  constructor(private httpclient: HttpClient) {
    this.objBaseUrl = new WebAPIConfig();
   }

   //by: vishal, 03/03/2023

  AddUpdatePoSeriesDetail(objPoSeriesModel: PoSeriesDetailModel): Observable<any> {
    let objBaseUrl = new WebAPIConfig();
    return this.httpclient.post(objBaseUrl.ApIUrl + "PoConfig/AddUpdatePoSeriesDetail", objPoSeriesModel, options);
  }

  GetPoSeriesConfigList(objSearchPoSeriesModel: PoSeriesDetailModel): Observable<any> {
    let objBaseUrl = new WebAPIConfig();
    return this.httpclient.post(objBaseUrl.ApIUrl + "PoConfig/GetPoSeriesConfigList", objSearchPoSeriesModel);
  }

  EditPoSeriesConfigDetail(objPoSeriesModel: PoSeriesDetailModel): Observable<any> {
    let objBaseUrl = new WebAPIConfig();
    return this.httpclient.post(objBaseUrl.ApIUrl + "PoConfig/GetPOSeriesConfigDetId", objPoSeriesModel);
  }
  
}
