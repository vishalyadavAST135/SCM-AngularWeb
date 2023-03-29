import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { WebAPIConfig } from '../_Model/commonModel'
import { StockMasterModel } from '../_Model/MastersModel';

const headers = new HttpHeaders({
  'Content-Type': 'application/json',

  'Access-Control-Allow-Origin': '*',
  'Methods': 'POST'
});
const options = { headers: headers, crossDomain: true, withCredentials: false };

@Injectable({
  providedIn: 'root'
})
export class StockMasterService {
  private httpOptions: any;
  private objBaseUrl: WebAPIConfig;

  constructor(private httpclient: HttpClient) {
    this.objBaseUrl = new WebAPIConfig();
   }

 //by: vishal, 14/03/2023
 AddUpdateStockMaster(objStockMasterModel: StockMasterModel): Observable<any> {
    let objBaseUrl = new WebAPIConfig();
    return this.httpclient.post(objBaseUrl.ApIUrl + "StockMaster/AddUpdateStockMasterName", objStockMasterModel, options);
  }
  GetStockReportList(objStockMasterModel: StockMasterModel): Observable<any> {
    let objBaseUrl = new WebAPIConfig();
    return this.httpclient.post(objBaseUrl.ApIUrl + "StockMaster/GetStockReportList", objStockMasterModel);
  }
  EditStockReportDetail(objStockMasterModel: StockMasterModel): Observable<any> {
    let objBaseUrl = new WebAPIConfig();
    return this.httpclient.post(objBaseUrl.ApIUrl + "StockMaster/GetStockReportDetId", objStockMasterModel);
  }
}
