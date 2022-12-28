import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpParams, HttpClient, HttpHeaders } from '@angular/common/http';
import { DropdownModel, WebAPIConfig } from '../_Model/commonModel';
import { SaveGRNCRNModelDetail, SearchGRNCRNPoModel, SiteCustomerAutoModel } from '../_Model/grncrnModel';
import { PoSearchModel, VendorOrWhModel } from '../_Model/purchaseOrderModel';
import { SearchDispatchTrackerModel } from '../_Model/DispatchModel';
const headers = new HttpHeaders({  'Content-Type': 'application/json', 
                                   'Access-Control-Allow-Origin': '*',
                                   'Methods': 'GET, POST, PATCH, PUT, DELETE, OPTIONS'
                                   });
                                   
const options = { headers: headers, crossDomain: true, withCredentials: false };
@Injectable({
  providedIn: 'root'
})
export class GrncrnService {

  constructor(private httpclient: HttpClient) { }


  // GetSearchGRNCRNPoList(objPoSearchModel:PoSearchModel):Observable<any>{     
  //   let Para =JSON.stringify(objPoSearchModel);
  //   let params = new HttpParams().set("para",Para);
  //   // let params = new HttpParams().set("para",Para);
  //   var objBaseUrl=new WebAPIConfig();    
  //   return this.httpclient.get(objBaseUrl.ApIUrl+"GetPoListandOtherDataByPoId",{params: params}); 
  // }  

  PostGRNCRNDetail(formdata: FormData): Observable<any> {
    var objBaseUrl = new WebAPIConfig();
    return this.httpclient.post(objBaseUrl.ApIUrl + "PostGRNCRNDetail/Post", formdata);

  }
  GetAutoCompleteSiteAndCustomer(objSiteCustomerAutoModel: SiteCustomerAutoModel): Observable<any> {
    let Para = JSON.stringify(objSiteCustomerAutoModel);
    let params = new HttpParams().set("para", Para);
    var objBaseUrl = new WebAPIConfig();
    return this.httpclient.get(objBaseUrl.ApIUrl + "AutoAutoCompleteSiteAndCustomer/List", { params: params });
  }


  //#region  change krna h
  GetGrncrnSearchList(objobjSearchGRNCRNPoModel: SearchGRNCRNPoModel): Observable<any> {
    let Para = JSON.stringify(objobjSearchGRNCRNPoModel);
    let params = new HttpParams().set("para", Para);
    var objBaseUrl = new WebAPIConfig();
    return this.httpclient.get(objBaseUrl.ApIUrl + "GetGrnCrnSearchList/List", { params: params });
  }

  GetAllInvoiceOtherDataById(objDropdownModel: DropdownModel): Observable<any> {
    let Para = JSON.stringify(objDropdownModel);
    let params = new HttpParams().set("para", Para);
    var objBaseUrl = new WebAPIConfig();
    return this.httpclient.get(objBaseUrl.ApIUrl + "GetAllInvoiceOtherDataById/List", { params: params });
  }

  GetCreatePdfGRNDetailItemByGRNId(objDropdownModel: DropdownModel): Observable<any> {
    let Para = JSON.stringify(objDropdownModel);
    let params = new HttpParams().set("para", Para);
    var objBaseUrl = new WebAPIConfig();
    return this.httpclient.get(objBaseUrl.ApIUrl + "GetCreatePdfGRNDetailItemByGRNId", { params: params });
  }

  GetGRNHistoryCountList(objdata: PoSearchModel): Observable<any> {
    let Para = JSON.stringify(objdata);
    let params = new HttpParams().set("para", Para);
    var objBaseUrl = new WebAPIConfig();
    return this.httpclient.get(objBaseUrl.ApIUrl + "GetGRNCountHistory", { params: params });
  }
  GetAutoCompleteDocumentNo(objDropdownModel: DropdownModel): Observable<any> {
    let Para = JSON.stringify(objDropdownModel);
    let params = new HttpParams().set("para", Para);
    var objBaseUrl = new WebAPIConfig();
    return this.httpclient.get(objBaseUrl.ApIUrl + "GetAutoCompleteDocumentNo", { params: params });
  }
  GetDispatchDetailForSTNByDocumentId(objdata: SearchDispatchTrackerModel): Observable<any> {
    let Para = JSON.stringify(objdata);
    let params = new HttpParams().set("para", Para);
    var objBaseUrl = new WebAPIConfig();
    return this.httpclient.get(objBaseUrl.ApIUrl + "GetDispatchDetailForSTNByDocumentId", { params: params });
  }
  SaveUpadteSTNDetail(formdata: FormData): Observable<any> {
    var objBaseUrl = new WebAPIConfig();
    return this.httpclient.post(objBaseUrl.ApIUrl + "SaveUpadteSTNDetail", formdata);
  }

  AddUpdateCRNDetail(formdata: FormData): Observable<any> {
    var objBaseUrl = new WebAPIConfig();
    return this.httpclient.post(objBaseUrl.ApIUrl + "GRN/AddUpdateCRNDetail", formdata);
  }

  GetCRNList(objSearchGRNCRNPoModel: SearchGRNCRNPoModel): Observable<any> {
    let Para = JSON.stringify(objSearchGRNCRNPoModel);
    let params = new HttpParams().set("para", Para);
    var objBaseUrl = new WebAPIConfig();
    return this.httpclient.get(objBaseUrl.ApIUrl + "GRN/GetCRNList", { params: params });
  }

  GetCRNEditListById(objSearchGRNCRNPoModel: SaveGRNCRNModelDetail): Observable<any> {
    let Para = JSON.stringify(objSearchGRNCRNPoModel);
    let params = new HttpParams().set("para", Para);
    var objBaseUrl = new WebAPIConfig();
    return this.httpclient.get(objBaseUrl.ApIUrl + "GRN/GetCRNEditListById", { params: params });
  }

  GetCRNPdfDetailByCRNId(objDropdownModel: DropdownModel): Observable<any> {
    let Para = JSON.stringify(objDropdownModel);
    let params = new HttpParams().set("para", Para);
    var objBaseUrl = new WebAPIConfig();
    return this.httpclient.get(objBaseUrl.ApIUrl + "GRN/GetCRNPdfDetailByCRNId", { params: params });
  }

  SaveGRNDocumentPDF(objPOPdfModel:SaveGRNCRNModelDetail):Observable<any>{ 
    var objBaseUrl=new WebAPIConfig();    
    return this.httpclient.post(objBaseUrl.ApIUrl+"GRN/SaveGRNDocumentPDF",objPOPdfModel,options);
  }
  UpdateCorrectionEntryGRNDetail(formdata: FormData): Observable<any> {
    var objBaseUrl = new WebAPIConfig();
    return this.httpclient.post(objBaseUrl.ApIUrl + "GRN/UpdateCorrectionEntryGRNDetail/Post", formdata);
  }
  SearchEditSTNDetailBySTNId(objdata: SearchDispatchTrackerModel): Observable<any> {
    let Para = JSON.stringify(objdata);
    let params = new HttpParams().set("para", Para);
    var objBaseUrl = new WebAPIConfig();
    return this.httpclient.get(objBaseUrl.ApIUrl + "GRN/SearchEditSTNDetailBySTNId", { params: params });
  }
  UpdateCorrectionEntrySTNDetail(formdata: FormData): Observable<any> {
    var objBaseUrl = new WebAPIConfig();
    return this.httpclient.post(objBaseUrl.ApIUrl + "GRN/UpdateCorrectionEntrySTNDetail", formdata);
  }
}
