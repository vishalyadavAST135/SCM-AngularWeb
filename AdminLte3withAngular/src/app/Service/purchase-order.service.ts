import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PoSearchModel, PoOtherDetial, PoItemDetial, UpdatePoItemDetial, VendorOrWhModel, SCMJobModel, POPdfModel, MakePOSeriesModel } from '../_Model/purchaseOrderModel';
import { DropdownModel, WebAPIConfig } from '../_Model/commonModel'
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';

const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';

const headers = new HttpHeaders({
  'Content-Type': 'application/json',

  'Access-Control-Allow-Origin': '*',
  'Methods': 'POST'
});
// const headers1 = { 'Content-Type': 'application/json', 
//                    'content-length': '500' };

const options = { headers: headers, crossDomain: true, withCredentials: false, };

@Injectable({
  providedIn: 'root'
})
export class PurchaseOrderService {
  private httpOptions: any;
  private objBaseUrl: WebAPIConfig;
  constructor(private httpclient: HttpClient) {
    this.objBaseUrl = new WebAPIConfig();
  }

  async SCMJObStart2(objSCMJobModel: SCMJobModel) {
    return await this.httpclient.post(this.objBaseUrl.ApIUrl + "SCMJobStart", objSCMJobModel).toPromise();
  }

  GetPurchaseOrderList(objPoSearchModel: PoSearchModel): Observable<any> {
    let Para = JSON.stringify(objPoSearchModel);
    let params = new HttpParams().set("para", Para);
    return this.httpclient.get(this.objBaseUrl.ApIUrl + "PurchaseOrder/List", { params: params });
  }

  PostPoBasicDetail(formdata: FormData): Observable<any> {
    return this.httpclient.post(this.objBaseUrl.ApIUrl + "PurchaseOrder/Basic", formdata);
  }

  PoOtherDetial(objPoOtherDetial: PoOtherDetial): Observable<any> {
    return this.httpclient.post(this.objBaseUrl.ApIUrl + "PurchaseOrder/Others", objPoOtherDetial, options);
  }

  PoItemDetial(jsonStr: any): Observable<any> {
    return this.httpclient.post(this.objBaseUrl.ApIUrl + "PurchaseOrder/Items", jsonStr, options);
  }

  PostUpdateDocumentDetail(formdata: FormData): Observable<any> {
    return this.httpclient.post(this.objBaseUrl.ApIUrl + "PurchaseOrder/DocumentDetail", formdata);
  }

  SavePoItemByExcel(jsonStr: any): Observable<any> {
    return this.httpclient.post(this.objBaseUrl.ApIUrl + "PurchaseOrder/UpdatePoExcelItemDetail", jsonStr, options);
  }

  SavePoPDF(objPOPdfModel: POPdfModel): Observable<any> {
    return this.httpclient.post(this.objBaseUrl.ApIUrl + "PurchaseOrder/SavePoPDF", objPOPdfModel, options);
  }

  GetPOItemSaveExcelListByPoId(objdata: VendorOrWhModel): Observable<any> {
    let Para = JSON.stringify(objdata);
    let params = new HttpParams().set("para", Para);
    return this.httpclient.get(this.objBaseUrl.ApIUrl + "PurchaseOrder/GetPOItemSaveExcelListByPoId", { params: params });
  }

  GetPOCancelOpenCloseHistory(objdata: PoSearchModel): Observable<any> {
    let Para = JSON.stringify(objdata);
    let params = new HttpParams().set("para", Para);
    return this.httpclient.get(this.objBaseUrl.ApIUrl + "PurchaseOrder/GetPOCancelOpenCloseHistory", { params: params });
  }

  public exportAsExcelFile(json: any[], excelFileName: string): void {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    this.saveAsExcelFile(excelBuffer, excelFileName);
  }

  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], { type: EXCEL_TYPE });
    FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
  }

  async GetPurchaseOrderList2(objPoSearchModel: PoSearchModel) {
    let Para = JSON.stringify(objPoSearchModel);
    let params = new HttpParams().set("para", Para);
    return await this.httpclient.get(this.objBaseUrl.ApIUrl + "PurchaseOrder/List", { params: params }).toPromise();
  }

  async GetCreatePurchaseOrderPdf(objPoSearchModel: PoSearchModel) {
    let Para = JSON.stringify(objPoSearchModel);
    let params = new HttpParams().set("para", Para);
    return await this.httpclient.get(this.objBaseUrl.ApIUrl + "PurchaseOrder/GetCreatePurchaseOrderPdf", { params: params }).toPromise();
  }

  GetAutoCompletePurchaseOrder(objDropdownModel: DropdownModel): Observable<any> {
    let Para = JSON.stringify(objDropdownModel);
    let params = new HttpParams().set("para", Para);
    return this.httpclient.get(this.objBaseUrl.ApIUrl + "PurchaseOrder/AutoCompletePurchaseOrderList", { params: params });
  }

  GetPoListandOtherDetailByPoId(objdata: PoSearchModel): Observable<any> {
    let Para = JSON.stringify(objdata);
    let params = new HttpParams().set("para", Para);
    return this.httpclient.get(this.objBaseUrl.ApIUrl + "PurchaseOrder/GetPoListandOtherDataByPoId", { params: params });
  }

  getMissedPODetail(objVendorOrWh: VendorOrWhModel): Observable<any> {
    let Para = JSON.stringify(objVendorOrWh);
    let params = new HttpParams().set("para", Para);
    return this.httpclient.get(this.objBaseUrl.ApIUrl + "Get/GetAllMissedPODetail", { params: params });
  }

  GetGrnCrnPODetialandItemListByPoId(objdata: PoSearchModel): Observable<any> {
    let Para = JSON.stringify(objdata);
    let params = new HttpParams().set("para", Para);
    return this.httpclient.get(this.objBaseUrl.ApIUrl + "GetGrnCrnPODetialandItemListByPoId", { params: params });
  }

  GetPOSeriesRelatedMasterData(objdata: PoSearchModel): Observable<any> {
    return this.httpclient.post(this.objBaseUrl.ApIUrl + "PurchaseOrder/GetPOSeriesRelatedMasterData", objdata, options);
  }

  GetMakePoSeries(objdata: MakePOSeriesModel): Observable<any> {
    return this.httpclient.post(this.objBaseUrl.ApIUrl + "PurchaseOrder/GetMakePoSeries", objdata, options);
  }

  // brahamjot kaur 07-06-2022
  CopyPOID(DuplicatePODetial: PoOtherDetial): Observable<any> {
    return this.httpclient.post(this.objBaseUrl.ApIUrl + "PurchaseOrder/DuplicatePO", DuplicatePODetial, options);
  }
}
