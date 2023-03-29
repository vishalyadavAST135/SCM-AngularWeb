import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { WebAPIConfig } from '../_Model/commonModel';
import { map } from 'rxjs/operators';
import { CapacityMasterDetail, EmpToolkitModel, ItemEquipmentDetail, ItemNameModel, MakeModel, ReportItemMappingModel, SearchWHCircleMappingModel, VendorModel, WHCircleMappingModel, WHModel } from '../_Model/MastersModel';
import { data } from 'jquery';
const headers = new HttpHeaders({
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Methods': 'POST'
});
const options = { headers: headers, crossDomain: true, withCredentials: false };
@Injectable({
  providedIn: 'root'
})
export class ReportItemNameMappingService {
  private httpOptions: any;
  constructor(private httpclient: HttpClient) {

  }
  //By: Vishal, 17/03/2023


  AddUpdateReportMappingDetail(objReportModel: ReportItemMappingModel): Observable<any> {
    let objBaseUrl = new WebAPIConfig();
    return this.httpclient.post(objBaseUrl.ApIUrl + "ReportItemMapping/AddUpdateReportItemMappingDet", objReportModel, options);
  }

  GetReportItemMappedList(objReportModel: ReportItemMappingModel): Observable<any> {
    let objBaseUrl = new WebAPIConfig();
    return this.httpclient.post(objBaseUrl.ApIUrl + "ReportItemMapping/GetReportItemMappingDet", objReportModel);
  }

  EditReportAndItemMappingDetail(objReportModel: ReportItemMappingModel): Observable<any> {
    let objBaseUrl = new WebAPIConfig();
    return this.httpclient.post(objBaseUrl.ApIUrl + "ReportItemMapping/GetReportItemMappingDetEditById", objReportModel);
  }

  GetItemNameMapwithReportName(objReportModel: ReportItemMappingModel): Observable<any> {
    let objBaseUrl = new WebAPIConfig();
    return this.httpclient.post(objBaseUrl.ApIUrl + "ReportItemMapping/GetItemNameByRptId", objReportModel);
  }

}

