import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MaterialMovementModel, SearchMaterialModel } from '../_Model/MaterialMovementTracker';
import { ApprovelStatusModel, DropdownModel, WebAPIConfig } from '../_Model/commonModel'
import { PoSearchModel, VendorOrWhModel } from '../_Model/purchaseOrderModel';
import { DISearchModel, DispatchTrackingItemDetialModel, DispatchTrackingModel, SearchDispatchTrackerModel, SearchMaterialInstallationModel, SearchMaterialRequisitionModel, SearchSRNUsesModel, SRNInstructionSearchModel } from '../_Model/DispatchModel';
import { ItemEquipmentDetail } from '../_Model/MastersModel';

const headers = new HttpHeaders({
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Methods': 'GET, POST, PATCH, PUT, DELETE, OPTIONS'
});

const options = { headers: headers, crossDomain: true, withCredentials: false };
@Injectable({
  providedIn: 'root'
})
export class MaterialMovementService {
  UserId: any;
  constructor(private httpclient: HttpClient) {

    var objUserModel = JSON.parse(sessionStorage.getItem("UserSession"));
    if (objUserModel != null) {
      this.UserId = objUserModel.User_Id;
    }
  }
  GetMaterialMovementDetailbyTrackerId(objdata: MaterialMovementModel): Observable<any> {
    let Para = JSON.stringify(objdata);
    let params = new HttpParams().set("para", Para);
    var objBaseUrl = new WebAPIConfig();
    return this.httpclient.get(objBaseUrl.ApIUrl + "GetMaterialMovementDetailById", { params: params });
  }
  GetMaterialMovementCountHistory(objdata: PoSearchModel): Observable<any> {
    let Para = JSON.stringify(objdata);
    let params = new HttpParams().set("para", Para);
    var objBaseUrl = new WebAPIConfig();
    return this.httpclient.get(objBaseUrl.ApIUrl + "GetMaterialMovementCountHistory", { params: params });
  }
  GetMaterialTrackerList(objdata: SearchMaterialModel): Observable<any> {
    let Para = JSON.stringify(objdata);
    let params = new HttpParams().set("para", Para);
    var objBaseUrl = new WebAPIConfig();
    return this.httpclient.get(objBaseUrl.ApIUrl + "GetMaterialTrackerList", { params: params });
  }

  AddUpdateMaterialTrackerDetail(formdata: FormData): Observable<any> {
    var objBaseUrl = new WebAPIConfig();
    return this.httpclient.post(objBaseUrl.ApIUrl + "MaterialMovement/AddUpdate", formdata);
  }

  GetWHAddressAndWHListByStId(objParameter: DropdownModel): Observable<any> {
    objParameter.User_Id = this.UserId;
    let Para = JSON.stringify(objParameter);
    let params = new HttpParams().set("para", Para);
    var objBaseUrl = new WebAPIConfig();
    return this.httpclient.get(objBaseUrl.ApIUrl + "Get/GetWHAddressAndWHListByStId", { params: params });
  }

  SaveUpadteDispatchTracking(formdata: FormData): Observable<any> {
    var objBaseUrl = new WebAPIConfig();
    return this.httpclient.post(objBaseUrl.ApIUrl + "SaveUpadteDispatchTracking", formdata);
  }
  UpadteReceivedDispatch(formdata: FormData): Observable<any> {
    var objBaseUrl = new WebAPIConfig();
    return this.httpclient.post(objBaseUrl.ApIUrl + "UpadteReceivedDispatch", formdata);
  }


  GetDispatchTrackerList(objdata: SearchDispatchTrackerModel): Observable<any> {
    let Para = JSON.stringify(objdata);
    let params = new HttpParams().set("para", Para);
    var objBaseUrl = new WebAPIConfig();
    return this.httpclient.get(objBaseUrl.ApIUrl + "GetDispatchTrackerList", { params: params });
  }
  GetDispatchTrackerEditListByDispatchId(objdata: SearchDispatchTrackerModel): Observable<any> {
    let Para = JSON.stringify(objdata);
    let params = new HttpParams().set("para", Para);
    var objBaseUrl = new WebAPIConfig();
    return this.httpclient.get(objBaseUrl.ApIUrl + "GetDispatchTrackerEditListById", { params: params });
  }
  GenerateDispatchTrackerPdfListById(objdata: SearchDispatchTrackerModel): Observable<any> {
    let Para = JSON.stringify(objdata);
    let params = new HttpParams().set("para", Para);
    var objBaseUrl = new WebAPIConfig();
    return this.httpclient.get(objBaseUrl.ApIUrl + "GenerateDispatchTrackerPdfListById", { params: params });
  }

  SaveDispatchPDF(objPOPdfModel: DispatchTrackingModel): Observable<any> {
    var objBaseUrl = new WebAPIConfig();
    return this.httpclient.post(objBaseUrl.ApIUrl + "SaveDispatchPDF", objPOPdfModel, options);
  }

  GetAllState(objVendorOrWh: VendorOrWhModel): Observable<any> {
    let Para = JSON.stringify(objVendorOrWh);
    let params = new HttpParams().set("para", Para);
    var objBaseUrl = new WebAPIConfig();
    return this.httpclient.get(objBaseUrl.ApIUrl + "GetAllState", { params: params });
  }
  GetVechileTypeAndTransPortMode(): Observable<any> {
    var objBaseUrl = new WebAPIConfig();
    return this.httpclient.get(objBaseUrl.ApIUrl + "GetVechileTypeAndTransPortMode", options);
  }
  AddUpadteSRNDeatil(formdata: FormData): Observable<any> {
    var objBaseUrl = new WebAPIConfig();
    return this.httpclient.post(objBaseUrl.ApIUrl + "GRNCRNSRN/AddUpadteSRNDeatil", formdata);
  }
  GetSRNList(objdata: SearchDispatchTrackerModel): Observable<any> {
    let Para = JSON.stringify(objdata);
    let params = new HttpParams().set("para", Para);
    var objBaseUrl = new WebAPIConfig();
    return this.httpclient.get(objBaseUrl.ApIUrl + "GetSRNList", { params: params });
  }
  GetSRNEditListById(objdata: SearchDispatchTrackerModel): Observable<any> {
    let Para = JSON.stringify(objdata);
    let params = new HttpParams().set("para", Para);
    var objBaseUrl = new WebAPIConfig();
    return this.httpclient.get(objBaseUrl.ApIUrl + "GetSRNEditListById", { params: params });
  }
  GenerateSRNPdfListById(objdata: SearchDispatchTrackerModel): Observable<any> {
    let Para = JSON.stringify(objdata);
    let params = new HttpParams().set("para", Para);
    var objBaseUrl = new WebAPIConfig();
    return this.httpclient.get(objBaseUrl.ApIUrl + "GenerateSRNPdfListById", { params: params });
  }
  SaveUpdateSRNPdf(objPOPdfModel: DispatchTrackingModel): Observable<any> {
    var objBaseUrl = new WebAPIConfig();
    return this.httpclient.post(objBaseUrl.ApIUrl + "SaveUpdateSRNPdf", objPOPdfModel, options);
  }

  GetAllMaterialInstallationList(objSearchMaterialInstallationModel: SearchMaterialInstallationModel): Observable<any> {
    let Para = JSON.stringify(objSearchMaterialInstallationModel);
    let params = new HttpParams().set("para", Para);
    var objBaseUrl = new WebAPIConfig();
    return this.httpclient.get(objBaseUrl.ApIUrl + "GetAllMaterialInstallationList", { params: params });
  }

  GetMaterialInstallationId(objdata: SearchMaterialInstallationModel): Observable<any> {
    let Para = JSON.stringify(objdata);
    let params = new HttpParams().set("para", Para);
    var objBaseUrl = new WebAPIConfig();
    return this.httpclient.get(objBaseUrl.ApIUrl + "GetMaterialInstallationId", { params: params });
  }

  SearchAllDetailMaterialInstallationByItemId(objdata: SearchMaterialInstallationModel): Observable<any> {
    let Para = JSON.stringify(objdata);
    let params = new HttpParams().set("para", Para);
    var objBaseUrl = new WebAPIConfig();
    return this.httpclient.get(objBaseUrl.ApIUrl + "SearchAllDetailMaterialInstallationByItemId", { params: params });
  }

  ClickApprovalReject(jsonStr: any): Observable<any> {
    var objBaseUrl = new WebAPIConfig();
    return this.httpclient.post(objBaseUrl.ApIUrl + "ApprovalRejectMaterialINstallations", jsonStr, options);
  }

  GetAllEmployeeNameListBySiteId(objParameter: DropdownModel): Observable<any> {
    let Para = JSON.stringify(objParameter);
    let params = new HttpParams().set("para", Para);
    var objBaseUrl = new WebAPIConfig();
    return this.httpclient.get(objBaseUrl.ApIUrl + "Get/GetAllEmployeeNameListBySiteId", { params: params });
  }
  UpadateCancelDispatch(objApprovelStatusModel: ApprovelStatusModel): Observable<any> {
    var objBaseUrl = new WebAPIConfig();
    return this.httpclient.post(objBaseUrl.ApIUrl + "MaterialMovment/UpadateCancelDispatch", objApprovelStatusModel, options);
  }
  CommonDeleteItemRowinSerialNo(objApprovelStatusModel: ApprovelStatusModel): Observable<any> {
    var objBaseUrl = new WebAPIConfig();
    return this.httpclient.post(objBaseUrl.ApIUrl + "MaterialMovment/CommonDeleteItemRowinSerialNo", objApprovelStatusModel, options);
  }

  GetAllApprovalMRStatusList(objSearchMaterialRequisitionModel: SearchMaterialRequisitionModel): Observable<any> {
    let Para = JSON.stringify(objSearchMaterialRequisitionModel);
    let params = new HttpParams().set("para", Para);
    var objBaseUrl = new WebAPIConfig();
    return this.httpclient.get(objBaseUrl.ApIUrl + "MaterialMovment/GetAllApprovalMRStatusList", { params: params });
  }

  GetAllPreviousDataBySiteId(objParameter: DropdownModel): Observable<any> {
    let Para = JSON.stringify(objParameter);
    let params = new HttpParams().set("para", Para);
    var objBaseUrl = new WebAPIConfig();
    return this.httpclient.post(objBaseUrl.ApIUrl + "Common/GetAllPreviousDataBySiteId", objParameter, options);
  }

  UpadteCorrectionEntrySRNReceivedDetail(formdata: FormData): Observable<any> {
    var objBaseUrl = new WebAPIConfig();
    return this.httpclient.post(objBaseUrl.ApIUrl + "GRN/UpadteCorrectionEntrySRNReceivedDetail", formdata);
  }

  UpadteCorrectionEntryDispatchDetail(formdata: FormData): Observable<any> {
    var objBaseUrl = new WebAPIConfig();
    return this.httpclient.post(objBaseUrl.ApIUrl + "Dispatch/UpadteCorrectionEntryDispatchDetail", formdata);
  }

  DispatchCheckMultiSite(formdata: FormData): Observable<any> {
    var objBaseUrl = new WebAPIConfig();
    return this.httpclient.post(objBaseUrl.ApIUrl + "Dispatch/DispatchCheckMultiSite", formdata);
  }

  SearchDispatchInstallApprovalReport(objdata: SearchDispatchTrackerModel): Observable<any> {
    var objBaseUrl = new WebAPIConfig();
    return this.httpclient.post(objBaseUrl.ApIUrl + "MaterialMovementTracker/SearchDispatchInstallApprovalReportList", objdata, options);
  }
  // Brahamjot kaur 22/6/2022
  SearchSRNUsesReport(objdata: SearchSRNUsesModel): Observable<any> {
    var objBaseUrl = new WebAPIConfig();
    return this.httpclient.post(objBaseUrl.ApIUrl + "MaterialMovementTracker/SearchSRNPortalUsageList", objdata, options);
  }

  PartialUpadteDispatchTrackingDetail(formdata: FormData): Observable<any> {
    var objBaseUrl = new WebAPIConfig();
    return this.httpclient.post(objBaseUrl.ApIUrl + "Dispatch/PartialUpadteDispatchTrackingDetail", formdata);
  }

  PartialUpadteSRNDetail(formdata: FormData): Observable<any> {
    var objBaseUrl = new WebAPIConfig();
    return this.httpclient.post(objBaseUrl.ApIUrl + "GRNCRNSRN/PartialUpadteSRNDetail", formdata);
  }

  SearchDispatchInstructionListByDIId(objdata: DISearchModel): Observable<any> {
    var objBaseUrl = new WebAPIConfig();
    return this.httpclient.post(objBaseUrl.ApIUrl + "Dispatch/SearchDispatchInstructionListByDIId", objdata, options);
  }

  AutoFillDispatchDetailByDIId(objdata: DISearchModel): Observable<any> {
    var objBaseUrl = new WebAPIConfig();
    return this.httpclient.post(objBaseUrl.ApIUrl + "Dispatch/AutoFillDispatchDetailByDIId", objdata, options);
  }

  //brahamjot kaur 26/sep/2022
  GetSRNInstructionListByDIId(objdata: SRNInstructionSearchModel): Observable<any> {
    var objBaseUrl = new WebAPIConfig();
    return this.httpclient.post(objBaseUrl.ApIUrl + "SRN/GetSRNInstructionListByDIId", objdata, options);
  }
 
}
