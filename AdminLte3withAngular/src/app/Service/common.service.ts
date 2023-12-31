import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observer, Observable, forkJoin } from 'rxjs';
import { CompanyModel, UserModel } from '../_Model/userModel';
import { VendorOrWhModel } from '../_Model/purchaseOrderModel';
import { WebAPIConfig, DropdownModel, CompanyStateVendorItemModel, EmailSendTotalDataModel, ApprovelStatusModel, WebErrorLogModel, MRNOAutoModel, MailSenderModel, SearchItemLineTypeModel } from '../_Model/commonModel';
import { GlobalErrorHandlerServiceService } from './global-error-handler-service.service';
import { map, mergeMap } from 'rxjs/operators';
import { DispatchTrackingModel, SearchMaterialRequisitionModel } from '../_Model/DispatchModel';

const headers = new HttpHeaders({
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Methods': 'GET, POST, PATCH, PUT, DELETE, OPTIONS'
});
const options = { headers: headers, crossDomain: true, withCredentials: false };

@Injectable({
  providedIn: 'root'
})
export class CommonService {
  Para: string;
  UserId: any;
  private baseUrl: WebAPIConfig;
  constructor(
    private httpclient: HttpClient,
    private _GlobalErrorHandlerService: GlobalErrorHandlerServiceService) {
    this.baseUrl = new WebAPIConfig();
  }

  getScmReport(state: string, wh: string, CompanyId: any) {
    let params = new HttpParams().set("state", state).set("wh", wh).set("CompanyId", CompanyId);
    var objBaseUrl = new WebAPIConfig();
    return this.httpclient.get<any>(objBaseUrl.ApIUrl + 'Get/getScmReport', { params: params })
      .pipe(map(report => {
        return report;
      }));
  }

  getUserMenu(para: any): Observable<any> {
    let params = new HttpParams().set("para", para);
    var objBaseUrl = new WebAPIConfig();
    return this.httpclient.get(objBaseUrl.ApIUrl + "User/Menu", { params: params });
  }

  getUatLogin(para: any): Observable<any> {
    let params = new HttpParams().set("Token", para.Token);
    var objBaseUrl = new WebAPIConfig();
    return this.httpclient.get(objBaseUrl.ApIUrl + "User/ValidateToken", { params: params });
  }

  getdropdown(objParameter: DropdownModel): Observable<any> {
    objParameter.User_Id = JSON.parse(sessionStorage.getItem("UserSession")).User_Id;;
    let Para = JSON.stringify(objParameter);
    let params = new HttpParams().set("para", Para);
    var objBaseUrl = new WebAPIConfig();
    return this.httpclient.get(objBaseUrl.ApIUrl + "Get/dropdown", { params: params });
  }

  getPOStatusAndVoucherTypedropdown(objParameter: DropdownModel): Observable<any> {
    let Para = JSON.stringify(objParameter);
    let params = new HttpParams().set("para", Para);
    var objBaseUrl = new WebAPIConfig();
    return this.httpclient.get(objBaseUrl.ApIUrl + "Get/POStatusAndVoucherTypedropdown", { params: params });
  }

  // Hemant 30/3/2021
  getVendorOrWh(objVendorOrWh: VendorOrWhModel): Observable<any> {
    let Para = JSON.stringify(objVendorOrWh);
    let params = new HttpParams().set("para", Para);
    var objBaseUrl = new WebAPIConfig();
    return this.httpclient.get(objBaseUrl.ApIUrl + "Get/VendorOrWhDetail", { params: params });
  }

  getSrnRecivedVendorOrWh(objVendorOrWh: VendorOrWhModel): Observable<any> {
    let Para = JSON.stringify(objVendorOrWh);
    let params = new HttpParams().set("para", Para);
    var objBaseUrl = new WebAPIConfig();
    return this.httpclient.get(objBaseUrl.ApIUrl + "Get/VendorOrWhDetail", { params: params });
  }
  GetVendorGstAndVendorAddress(objVendorOrWh: VendorOrWhModel): Observable<any> {
    let Para = JSON.stringify(objVendorOrWh);
    let params = new HttpParams().set("para", Para);
    var objBaseUrl = new WebAPIConfig();
    return this.httpclient.get(objBaseUrl.ApIUrl + "Get/GetVendorGstAndVendorAddress", { params: params });
  }

  SaveUserLoginHistory(objDropdownModel: DropdownModel): Observable<any> {
    let Para = JSON.stringify(objDropdownModel);
    let params = new HttpParams().set("para", Para);
    var objBaseUrl = new WebAPIConfig();
    return this.httpclient.post(objBaseUrl.ApIUrl + "SaveUserLoginHistory", objDropdownModel, options);
  }

  async getdropdown2(objParameter: DropdownModel) {
    objParameter.User_Id = JSON.parse(sessionStorage.getItem("UserSession")).User_Id;
    let Para = JSON.stringify(objParameter);
    let params = new HttpParams().set("para", Para);
    var objBaseUrl = new WebAPIConfig();
    return await this.httpclient.get(objBaseUrl.ApIUrl + "Get/dropdown", { params: params }).toPromise();
  }

  async getCompanyStateVendorItem(CompanyStateVendorItemModel: CompanyStateVendorItemModel): Promise<any> {
    CompanyStateVendorItemModel.User_Id = JSON.parse(sessionStorage.getItem("UserSession")).User_Id;
    let Para = JSON.stringify(CompanyStateVendorItemModel);
    let params = new HttpParams().set("para", Para);
    var objBaseUrl = new WebAPIConfig();
    return await this.httpclient.get(objBaseUrl.ApIUrl + "Get/CompanyStateVendorItem", { params: params }).toPromise();
  }

  GettApprovalStatusAndReasondropdown(objVendorOrWh: VendorOrWhModel): Observable<any> {
    var value = localStorage.getItem('grnApprovedResion');//1460
    if (value == '2574') {
      objVendorOrWh.flag = '2574'
    } else {
      objVendorOrWh.flag = '1460'
    }
    let Para = JSON.stringify(objVendorOrWh);
    let params = new HttpParams().set("para", Para);
    var objBaseUrl = new WebAPIConfig();
    localStorage.setItem('grnApprovedResion', '1460');
    return this.httpclient.get(objBaseUrl.ApIUrl + "Get/GettApprovalStatusAndReasondropdown", { params: params });
  }

  SaveApprovalStatusHistory(objApprovelStatusModel: ApprovelStatusModel): Observable<any> {
    var objBaseUrl = new WebAPIConfig();
    return this.httpclient.post(objBaseUrl.ApIUrl + "SaveApprovalStatusHistory", objApprovelStatusModel, options);
  }

  async GetItemCodeAndItemDescription(objParameter: DropdownModel) {
    var objBaseUrl = new WebAPIConfig();
    return await this.httpclient.post(objBaseUrl.ApIUrl + "Get/ItemCodeAndItemDescription", objParameter, options).toPromise();
  }

  async NewGetItemCodeAndItemDescription(objParameter: SearchItemLineTypeModel) {
    var objBaseUrl = new WebAPIConfig();
    return await this.httpclient.post(objBaseUrl.ApIUrl + "Common/NewItemCodeAndItemDescription", objParameter, options).toPromise();
  }


  EmailSendDeatil(formdata: FormData): Observable<any> {
    var objBaseUrl = new WebAPIConfig();
    return this.httpclient.post(objBaseUrl.ApIUrl + "Common/EmailSendDeatil", formdata);
  }

  DownloadFileZip(formdata: FormData): Observable<any> {
    var objBaseUrl = new WebAPIConfig();
    return this.httpclient.post(objBaseUrl.ApIUrl + "Common/DownLoadZipFile", formdata);
  }

  UserChangePassword(objChangePasswordModel: any): Observable<any> {
    var objBaseUrl = new WebAPIConfig();
    return this.httpclient.post(objBaseUrl.ApIUrl + "UserChangePassword/UpdatePwd", objChangePasswordModel, options);
  }
  ForgetPassword(objChangePasswordModel: any): Observable<any> {
    var objBaseUrl = new WebAPIConfig();
    return this.httpclient.post(objBaseUrl.ApIUrl + "Common/ForgetPassword", objChangePasswordModel, options);
  }

  GetAutoCompleteMRNO(objMRNOAutoModel: MRNOAutoModel): Observable<any> {
    let Para = JSON.stringify(objMRNOAutoModel);
    let params = new HttpParams().set("para", Para);
    var objBaseUrl = new WebAPIConfig();
    return this.httpclient.get(objBaseUrl.ApIUrl + "Common/GetAutoCompleteMRNO/List", { params: params });
  }

  GetAllMRDetailByMRNo(objSearchMaterialRequisitionModel: SearchMaterialRequisitionModel): Observable<any> {
    let Para = JSON.stringify(objSearchMaterialRequisitionModel);
    let params = new HttpParams().set("para", Para);
    var objBaseUrl = new WebAPIConfig();
    return this.httpclient.get(objBaseUrl.ApIUrl + "Common/GetAllMRDetailByMRNo", { params: params });
  }

  checkUndefined(x: any) {
    if (typeof x === "undefined") {
      x = '';
    } else if (typeof x === null) {
      x = '';
    } else if (x == null) {
      x = '';
    }
    return x;
  }

  thousands_separators(num) {
    // return (num).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'); 
    var parts = num.toLocaleString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, '$&,');
    return parts.join(".");
  }

  valueInWords(value) {
    let ones = ['', 'one', 'two', 'three', 'four',
      'five', 'six', 'seven', 'eight', 'nine',
      'ten', 'eleven', 'twelve', 'thirteen', 'fourteen',
      'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
    let tens = ['twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
    let digit = 0;
    if (value < 20) return ones[value];
    if (value < 100) {
      digit = value % 10; //remainder     
      return tens[Math.floor(value / 10) - 2] + " " + (digit > 0 ? ones[digit] : "");
    }
    if (value < 1000) {
      return ones[Math.floor(value / 100)] + " hundred " + (value % 100 > 0 ? this.valueInWords(value % 100) : "");
    }
    if (value < 100000) {
      return this.valueInWords(Math.floor(value / 1000)) + " thousand " + (value % 1000 > 0 ? this.valueInWords(value % 1000) : "");
    }
    if (value < 10000000) {
      return this.valueInWords(Math.floor(value / 100000)) + " lakh " + (value % 100000 > 0 ? this.valueInWords(value % 100000) : "");
    }
    return this.valueInWords(Math.floor(value / 10000000)) + " crore " + (value % 10000000 > 0 ? this.valueInWords(value % 10000000) : "");
  }

  ErrorFunction(ErrorBy: string, ErrorMsg: any, ErrorFunction: string, ErrorPage: string) {
    var objWebErrorLogModel = new WebErrorLogModel();
    objWebErrorLogModel.ErrorBy = ErrorBy;
    objWebErrorLogModel.ErrorMsg = ErrorMsg;
    objWebErrorLogModel.ErrorFunction = ErrorFunction;
    objWebErrorLogModel.ErrorPage = ErrorPage;
    this._GlobalErrorHandlerService.handleError(objWebErrorLogModel);
  }
  ConvertDateFormat(DateValue: any) {
    var val = this.checkUndefined(DateValue);
    if (val != '') {
      return val.day + '/' + val.month + '/' + val.year;
    } else {
      return '';
    }
  }

  ConvertDateMMYY(DateValue: any) {
    var val = this.checkUndefined(DateValue);
    if (val != '') {
      var Value = val.split('/')
      // this.model.EndDateModel = { day: parseInt(Value.split('/')[2]), month: parseInt(toDate.split('/')[1]), year: parseInt(toDate.split('/')[0]) };
      return Value[2] + '/' + Value[1] + '/' + Value[0];
    } else {
      return '';
    }
  }

  UpdateCostDetail(formdata: FormData): Observable<any> {
    var objBaseUrl = new WebAPIConfig();
    return this.httpclient.post(objBaseUrl.ApIUrl + "Common/UpdateCostDetail", formdata);
  }

  GettAllProjectTypeandOther(objDropdownModel: DropdownModel): Observable<any> {
    var objBaseUrl = new WebAPIConfig();
    return this.httpclient.post(objBaseUrl.ApIUrl + "Common/GettAllProjectandOther", objDropdownModel, options);
  }

  GetEmailSenderDeatil(objModel: MailSenderModel): Observable<any> {
    var objBaseUrl = new WebAPIConfig();
    return this.httpclient.post(objBaseUrl.ApIUrl + "Common/GetEmailSenderDetail", objModel, options);
  }

  GetUserPageRight(userId: number, menuId: number): Observable<any> {
    var objBaseUrl = new WebAPIConfig();
    var objModel = { User_Id: userId, Menu_Id: menuId };
    return this.httpclient.post(objBaseUrl.ApIUrl + "User/PageRight", objModel, options);
  }


  getdropdown3(objParameter: DropdownModel): Observable<any> {
    objParameter.User_Id = JSON.parse(sessionStorage.getItem("UserSession")).User_Id;;
    let Para = JSON.stringify(objParameter);
    let params = new HttpParams().set("para", Para);
    var objBaseUrl = new WebAPIConfig();
    return this.httpclient.get(objBaseUrl.ApIUrl + "Get/dropdown", { params: params });
  }

 async CallMultipleApiGetAndPost(action: [action1: string, action2: string], param: HttpParams, model: any): Promise<any> {
    return await forkJoin([this.httpclient.get(this.baseUrl.ApIUrl + action[0], { params: param }),
    this.httpclient.post(this.baseUrl.ApIUrl + action[1], model, options)]).toPromise();
  }

  GetCompanySession() {
    let objCompanyModel = new CompanyModel();
    objCompanyModel = JSON.parse(sessionStorage.getItem("CompanyIdSession"));
    return objCompanyModel;
  }

  GetUserSession() {
    let objUserModel = new UserModel();
    objUserModel = JSON.parse(sessionStorage.getItem("UserSession"));
    return objUserModel;
  }

  UpdateSingleItemEntrybyId(objdata: DispatchTrackingModel): Observable<any> {
    var objBaseUrl = new WebAPIConfig();
    return this.httpclient.post(objBaseUrl.ApIUrl + "Dispatch/UpdateSingleItemEntrybyId", objdata, options);
  }
}