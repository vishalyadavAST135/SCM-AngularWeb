import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observer, Observable } from 'rxjs';
import { UserModel } from '../_Model/userModel';
import { VendorOrWhModel } from '../_Model/purchaseOrderModel';
import { WebAPIConfig, DropdownModel, CompanyStateVendorItemModel, EmailSendTotalDataModel, ApprovelStatusModel, WebErrorLogModel, MRNOAutoModel, MailSenderModel, SearchItemLineTypeModel } from '../_Model/commonModel';
import { GlobalErrorHandlerServiceService } from './global-error-handler-service.service';
import { map } from 'rxjs/operators';
import { SearchMaterialRequisitionModel } from '../_Model/DispatchModel';

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

  constructor(private httpclient: HttpClient,
    private _GlobalErrorHandlerService: GlobalErrorHandlerServiceService) { }

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

  // testing by Hemant Tyagi

  GetOlympic() {
    let data = [
      { "athlete": "Natalie Coughlin", "age": 25, "country": "United States", "year": 2008, "date": "24/08/2008", "sport": "Swimming", "gold": 1, "silver": 2, "bronze": 3, "total": 6 },
      { "athlete": "Aleksey Nemov", "age": 24, "country": null, "year": 2000, "date": null, "sport": "Gymnastics", "gold": 2, "silver": 1, "bronze": 3, "total": 6 },
      { "athlete": "Alicia Coutts", "age": 24, "country": "Australia", "year": 2012, "date": "12/08/2012", "sport": "Swimming", "gold": 1, "silver": 3, "bronze": 1, "total": 5 },
      { "athlete": "Missy Franklin", "age": 17, "country": null, "year": 2012, "date": "12/08/2012", "sport": "Swimming", "gold": 4, "silver": 0, "bronze": 1, "total": 5 },
      { "athlete": "Ryan Lochte", "age": null, "country": "United States", "year": 2012, "date": null, "sport": "Swimming", "gold": 2, "silver": 2, "bronze": 1, "total": 5 },
      { "athlete": "Allison Schmitt", "age": 22, "country": "United States", "year": 2012, "date": "12/08/2012", "sport": "Swimming", "gold": 3, "silver": 1, "bronze": 1, "total": 5 },
      { "athlete": "Natalie Coughlin", "age": 21, "country": "United States", "year": 2004, "date": "29/08/2004", "sport": "Swimming", "gold": 2, "silver": 2, "bronze": 1, "total": 5 },
      { "athlete": "Dara Torres", "age": 33, "country": "United States", "year": 2000, "date": "01/10/2000", "sport": "Swimming", "gold": 2, "silver": 0, "bronze": 3, "total": 5 },
      { "athlete": "Cindy Klassen", "age": null, "country": "Canada", "year": 2006, "date": "26/02/2006", "sport": "Speed Skating", "gold": 1, "silver": 2, "bronze": 2, "total": 5 },
      { "athlete": "Nastia Liukin", "age": 18, "country": null, "year": 2008, "date": "24/08/2008", "sport": "Gymnastics", "gold": 1, "silver": 3, "bronze": 1, "total": 5 },
      { "athlete": "Marit Bjørgen", "age": 29, "country": "Norway", "year": 2010, "date": null, "sport": "Cross Country Skiing", "gold": 3, "silver": 1, "bronze": 1, "total": 5 },
      { "athlete": "Sun Yang", "age": null, "country": "China", "year": 2012, "date": "12/08/2012", "sport": "Swimming", "gold": 2, "silver": 1, "bronze": 1, "total": 4 },
      { "athlete": "Kirsty Coventry", "age": 24, "country": "Zimbabwe", "year": 2008, "date": "24/08/2008", "sport": "Swimming", "gold": 1, "silver": 3, "bronze": 0, "total": 4 },
      { "athlete": "Libby Lenton-Trickett", "age": 23, "country": "Australia", "year": 2008, "date": "24/08/2008", "sport": "Swimming", "gold": 2, "silver": 1, "bronze": 1, "total": 4 },
      { "athlete": "Ryan Lochte", "age": 24, "country": null, "year": 2008, "date": null, "sport": "Swimming", "gold": 2, "silver": 0, "bronze": 2, "total": 4 },
      { "athlete": "Inge de Bruijn", "age": null, "country": "Netherlands", "year": 2004, "date": "29/08/2004", "sport": "Swimming", "gold": 1, "silver": 1, "bronze": 2, "total": 4 },
      { "athlete": "Petria Thomas", "age": 28, "country": "Australia", "year": 2004, "date": "29/08/2004", "sport": "Swimming", "gold": 3, "silver": 1, "bronze": 0, "total": 4 },
      { "athlete": "Ian Thorpe", "age": 21, "country": "Australia", "year": 2004, "date": "29/08/2004", "sport": "Swimming", "gold": 2, "silver": 1, "bronze": 1, "total": 4 },
      { "athlete": "Inge de Bruijn", "age": 27, "country": "Netherlands", "year": 2000, "date": "01/10/2000", "sport": "Swimming", "gold": 3, "silver": 1, "bronze": 0, "total": 4 },
      { "athlete": "Gary Hall Jr.", "age": 25, "country": "United States", "year": 2000, "date": null, "sport": "Swimming", "gold": 2, "silver": 1, "bronze": 1, "total": 4 },
      { "athlete": "Michael Klim", "age": 23, "country": "Australia", "year": 2000, "date": "01/10/2000", "sport": "Swimming", "gold": 2, "silver": 2, "bronze": 0, "total": 4 },
      { "athlete": "Susie O'Neill", "age": 27, "country": "Australia", "year": 2000, "date": "01/10/2000", "sport": "Swimming", "gold": 1, "silver": 3, "bronze": 0, "total": 4 },
      { "athlete": "Jenny Thompson", "age": 27, "country": "United States", "year": 2000, "date": "01/10/2000", "sport": "Swimming", "gold": 3, "silver": 0, "bronze": 1, "total": 4 },
      { "athlete": "Pieter van den Hoogenband", "age": 22, "country": "Netherlands", "year": 2000, "date": "01/10/2000", "sport": "Swimming", "gold": 2, "silver": 0, "bronze": 2, "total": 4 },
      { "athlete": "An Hyeon-Su", "age": 20, "country": "South Korea", "year": 2006, "date": "26/02/2006", "sport": "Short-Track Speed Skating", "gold": 3, "silver": 0, "bronze": 1, "total": 4 },
      { "athlete": "Aliya Mustafina", "age": 17, "country": "Russia", "year": 2012, "date": "12/08/2012", "sport": "Gymnastics", "gold": 1, "silver": 1, "bronze": 2, "total": 4 },
      { "athlete": "Shawn Johnson", "age": 16, "country": "United States", "year": 2008, "date": "24/08/2008", "sport": "Gymnastics", "gold": 1, "silver": 3, "bronze": 0, "total": 4 },
      { "athlete": "Dmitry Sautin", "age": 26, "country": "Russia", "year": 2000, "date": "01/10/2000", "sport": "Diving", "gold": 1, "silver": 1, "bronze": 2, "total": 4 },
      { "athlete": "Leontien Zijlaard-van Moorsel", "age": 30, "country": "Netherlands", "year": 2000, "date": "01/10/2000", "sport": "Cycling", "gold": 3, "silver": 1, "bronze": 0, "total": 4 },
      { "athlete": "Petter Northug Jr.", "age": 24, "country": "Norway", "year": 2010, "date": "28/02/2010", "sport": "Cross Country Skiing", "gold": 2, "silver": 1, "bronze": 1, "total": 4 },
      { "athlete": "Ole Einar Bjørndalen", "age": 28, "country": "Norway", "year": 2002, "date": "24/02/2002", "sport": "Biathlon", "gold": 4, "silver": 0, "bronze": 0, "total": 4 }
    ]
    return data;
  }
}