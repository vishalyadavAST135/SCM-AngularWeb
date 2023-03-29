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
export class MasterservicesService {
  private httpOptions: any;
  constructor(private httpclient: HttpClient) {

  }

  SaveVendorBasicDetial(jsonStr: any): Observable<any> {
    var objBaseUrl = new WebAPIConfig();
    return this.httpclient.post(objBaseUrl.ApIUrl + "AddUpDateVendorMasterDetial/Basic", jsonStr, options);
  }

  SaveVendorAddressDetial(jsonStr: any): Observable<any> {
    var objBaseUrl = new WebAPIConfig();
    return this.httpclient.post(objBaseUrl.ApIUrl + "AddUpDateVendorMasterDetial/Address", jsonStr, options);
  }

  GetAllVendotMasterDeatilById(objdata: VendorModel): Observable<any> {
    let Para = JSON.stringify(objdata);
    let params = new HttpParams().set("para", Para);
    var objBaseUrl = new WebAPIConfig();
    return this.httpclient.get(objBaseUrl.ApIUrl + "GetAllVendotMasterDeatilById", { params: params })
      .pipe(map(user => {
        return user;
      }));
  }

  GetVendorMasterList(objdata: VendorModel): Observable<any> {
    let Para = JSON.stringify(objdata);
    let params = new HttpParams().set("para", Para);
    var objBaseUrl = new WebAPIConfig();
    return this.httpclient.get(objBaseUrl.ApIUrl + "GetVendorMasterList", { params: params });
  }

  GetAllVendorandVendorcodeByComId(objdata: VendorModel): Observable<any> {
    let Para = JSON.stringify(objdata);
    let params = new HttpParams().set("para", Para);
    var objBaseUrl = new WebAPIConfig();
    return this.httpclient.get(objBaseUrl.ApIUrl + "GetAllVendorandVendorcodeByComId", { params: params });
  }

  AddUpdateItemMasterDetial(objItemNameModel: ItemNameModel): Observable<any> {
    var objBaseUrl = new WebAPIConfig();
    return this.httpclient.post(objBaseUrl.ApIUrl + "AddUpdateItemMasterDetail", objItemNameModel, options);
  }

  GetAllItemMasterList(objdata: ItemNameModel): Observable<any> {
    let Para = JSON.stringify(objdata);
    let params = new HttpParams().set("para", Para);
    var objBaseUrl = new WebAPIConfig();
    return this.httpclient.get(objBaseUrl.ApIUrl + "GetAllItemMasterList", { params: params });
  }

  GetAllItemMasterDeatilById(objdata: ItemNameModel): Observable<any> {
    let Para = JSON.stringify(objdata);
    let params = new HttpParams().set("para", Para);
    var objBaseUrl = new WebAPIConfig();
    return this.httpclient.get(objBaseUrl.ApIUrl + "GetAllItemNameandUniteandMakeMasterDeatilById", { params: params });
  }

  GetAllMakeMasterList(objdata: MakeModel): Observable<any> {
    let Para = JSON.stringify(objdata);
    let params = new HttpParams().set("para", Para);
    var objBaseUrl = new WebAPIConfig();
    return this.httpclient.get(objBaseUrl.ApIUrl + "GetAllMakeMasterList", { params: params });
  }
  GetAllUnitMasterList(objdata: MakeModel): Observable<any> {
    let Para = JSON.stringify(objdata);
    let params = new HttpParams().set("para", Para);
    var objBaseUrl = new WebAPIConfig();
    return this.httpclient.get(objBaseUrl.ApIUrl + "GetAllUnitMasterList", { params: params });
  }

  GetAllItemMakeUnitList(): Observable<any> {
    // let Para =JSON.stringify(objdata);
    // let params = new HttpParams().set("para",Para);
    var objBaseUrl = new WebAPIConfig();
    return this.httpclient.get(objBaseUrl.ApIUrl + "GetAllItemMakeUnitList");
  }

  GetAllEquipmentMasterList(objItemEquipmentModel: ItemEquipmentDetail): Observable<any> {
    let Para = JSON.stringify(objItemEquipmentModel);
    let params = new HttpParams().set("para", Para);
    var objBaseUrl = new WebAPIConfig();
    return this.httpclient.get(objBaseUrl.ApIUrl + "GetAllEquipmentMasterList", { params: params });
  }
  AddUpdateItemEquipmentDetial(objItemEquipmentDetail: ItemEquipmentDetail): Observable<any> {
    var objBaseUrl = new WebAPIConfig();
    return this.httpclient.post(objBaseUrl.ApIUrl + "AddUpdateItemEquipmentDetial", objItemEquipmentDetail, options);
  }
  // brahamjot kaur 13/06/2022
  AddUpdateCapacityMasterDetail(objCapacityMasterDetail: CapacityMasterDetail): Observable<any> {
    var objBaseUrl = new WebAPIConfig();
    return this.httpclient.post(objBaseUrl.ApIUrl + "AddUpdateCapacityMasterDetail", objCapacityMasterDetail, options);
  }
  // brahamjot kaur 14/06/2022
  GetAllCapacityMasterList(objCapacityMasterDetail: CapacityMasterDetail): Observable<any> {
    // let Para =JSON.stringify(objCapacityMasterDetail);
    // let params = new HttpParams().set("para",Para);
    var objBaseUrl = new WebAPIConfig();
    return this.httpclient.post(objBaseUrl.ApIUrl + "GetAllCapacityMasterList", objCapacityMasterDetail);
  }
  ChangeItemGetUnitNameList(objItemEquipmentModel: ItemEquipmentDetail): Observable<any> {
    let Para = JSON.stringify(objItemEquipmentModel);
    let params = new HttpParams().set("para", Para);
    var objBaseUrl = new WebAPIConfig();
    return this.httpclient.get(objBaseUrl.ApIUrl + "Master/ChangeItemGetUnitNameList", { params: params });
  }

  GetWHMasterList(objdata: WHModel): Observable<any> {
    var objBaseUrl = new WebAPIConfig();
    return this.httpclient.post(objBaseUrl.ApIUrl + "Master/GetWHMasterList", objdata, options);
  }
  SaveWHBasicDetial(jsonStr: any): Observable<any> {
    var objBaseUrl = new WebAPIConfig();
    return this.httpclient.post(objBaseUrl.ApIUrl + "Master/AddUpDateWHBasicDetail/Basic", jsonStr, options);
  }

  SaveWHAddressDetail(jsonStr: any): Observable<any> {
    var objBaseUrl = new WebAPIConfig();
    return this.httpclient.post(objBaseUrl.ApIUrl + "Master/AddUpDateWHMasterDetail/Address", jsonStr, options);
  }

  GetAllWHMasterDeatilById(objdata: WHModel): Observable<any> {
    var objBaseUrl = new WebAPIConfig();
    return this.httpclient.post(objBaseUrl.ApIUrl + "Master/GetAllWHMasterDeatilById", objdata, options);
  }

  // GetAllItemMakeUnitList():Observable<any>{   
  //   // let Para =JSON.stringify(objdata);
  //   // let params = new HttpParams().set("para",Para);
  //   var objBaseUrl=new WebAPIConfig();    
  //   return this.httpclient.get(objBaseUrl.ApIUrl+"GetAllItemMakeUnitList"); 
  // }

  GetAllCapacityItemList(): Observable<any> {
    // let Para =JSON.stringify(objdata);
    // let params = new HttpParams().set("para",Para);
    var objBaseUrl = new WebAPIConfig();
    return this.httpclient.get(objBaseUrl.ApIUrl + "GetAllCapacityItemList");
  }

  //vishal yadav 08-09-2022

  GetWHCircleMappingList(objdata: SearchWHCircleMappingModel): Observable<any> {
    var objBaseUrl = new WebAPIConfig();
    return this.httpclient.post(objBaseUrl.ApIUrl + "Master/GetWHCircleMappingList", objdata, options)
  }


  AddUpdateWhCircleMasterDetail(objCircleModel: WHCircleMappingModel): Observable<any> {
    var objBaseUrl = new WebAPIConfig();
    return this.httpclient.post(objBaseUrl.ApIUrl + "Master/SaveWHCircleMapping", objCircleModel, options);
  }

  //vishal yadav 15-11-2022
  SaveEmployeeToolKit(objToolkitModel: EmpToolkitModel): Observable<any> {
    let objBaseUrl = new WebAPIConfig();
    return this.httpclient.post(objBaseUrl.ApIUrl + "Toolkit/SaveEmployeeToolKit", objToolkitModel);
  }

 
  GetToolkitItemList(objToolkitModel: EmpToolkitModel): Observable<any> {
    let objBaseUrl = new WebAPIConfig();
    return this.httpclient.post(objBaseUrl.ApIUrl + "Toolkit/GetToolkitList", objToolkitModel);
  }

  EditToolkitDetail(objToolkitModel: EmpToolkitModel): Observable<any> {
    let objBaseUrl = new WebAPIConfig();
    return this.httpclient.post(objBaseUrl.ApIUrl + "Toolkit/GetToolKitEditById", objToolkitModel);
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

}
