import { ViewChild } from '@angular/core';
import { TemplateRef } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as JSZip from 'jszip';
import { NgxSpinnerService } from 'ngx-spinner';
import { ApprovalrendererComponent } from 'src/app/renderer/approvalrenderer/approvalrenderer.component';
import { approvalTooltipComponent } from 'src/app/renderer/Approvaltooltip.component';
import { ButtonRendererComponent } from 'src/app/renderer/button-renderer.component';
import { CustomTooltipComponent } from 'src/app/renderer/customtooltip.component';
import { FileRendererComponent } from 'src/app/renderer/file-renderer.component';
import { CommonService } from 'src/app/Service/common.service';
import { GlobalErrorHandlerServiceService } from 'src/app/Service/global-error-handler-service.service';
import { GrncrnService } from 'src/app/Service/grncrn.service';
import { MasterservicesService } from 'src/app/Service/masterservices.service';
import { MaterialMovementService } from 'src/app/Service/material-movement.service';
import { PurchaseOrderService } from 'src/app/Service/purchase-order.service';
import { SiteServiceService } from 'src/app/Service/site-service.service';
import { TimePeriodService } from 'src/app/Service/time-period.service';
import { CommonImageUrlModel, CompanyStateVendorItemModel, DropdownModel, MenuName, WebErrorLogModel } from 'src/app/_Model/commonModel';
import { AddUpdateInstallation, DownloadAllTabTypeData, InstallationMetrialDetial, NewEqupArr, NewInstallation, OldInstallation, SearchMaterialInstallationModel } from 'src/app/_Model/DispatchModel';
import { DownLoadZipFileDetial } from 'src/app/_Model/purchaseOrderModel';
import { CompanyModel } from 'src/app/_Model/userModel';
import { UserPageRight } from 'src/app/_Model/UserRoleButtonModel';
declare var require: any
const FileSaver = require('file-saver');
@Component({
  selector: 'app-material-installation',
  templateUrl: './material-installation.component.html',
  styleUrls: ['./material-installation.component.sass']
})
export class MaterialInstallationComponent implements OnInit {
  model: any = {};
  InstallationdynamicArray: Array<InstallationMetrialDetial> = [];
  ExixtingdynamicArray: Array<InstallationMetrialDetial> = [];
  OldInstallationArray: Array<OldInstallation> = [];
  NewInstallationArray: Array<NewInstallation> = [];
  objDownloadAllTabTypeData: Array<DownloadAllTabTypeData> = [];
  Downloadfile: Array<DownLoadZipFileDetial> = [];
  public isShownList: boolean; // Grid List
  public isShownEdit: boolean; // Form Edit
  public MultidropdownSettings = {};
  public MultidropdownSettings1 = {};
  public multiSortKey: string;
  public columnDefs = [];
  rowData = [];
  CompanyData = [];
  SearchItemNameList = [];
  SaveItemNameList = [];
  SearchMakeNameList = [];
  SaveMakeNameList = [];
  SearchUnitNameList = [];
  SaveUnitNameList = [];
  UserId: any;
  CompanyId: any;
  tooltipShowDelay: any;
  frameworkComponents: any;
  ItemAddrowhideshow: boolean;
  IsApprovalTab: boolean;
  closeResult: string;
  Editdata: any;
  SelectedStatusList = [];
  SearchStatusList = [];
  SearchddlItem = [];
  SearchddlMake = [];
  SearchddlUnit = [];
  apiCSVIData: any = {};
  OldInstallationItem = [];
  NewInstallationItem = [];

  CustomerSitekeyword = 'CustomerSiteId';
  AutoCompleteCustomerSiteIdList = [];
  CustomerSiteNamekeyword = 'SiteName';
  AutoCompleteCustomerSiteNameList = [];
  PendingCount: any;
  @ViewChild("content") modalContent: TemplateRef<any>;
  UnitList: any;
  MakeList: any;
  TabDataList: any;
  DispatchDataList: any;
  DispatchGridDataList: any;
  InstallationDataList: any;
  StatusItem: string;
  CommonSearchPanelData: any;
  WHStateList: any;
  WHNameList: any;
  public Pdfurl: SafeResourceUrl;
  DownloadAllFile: any;
  SearchSitesPanelData: any;
  ApprovalList: any;
  HistoryCountData: any;
  TabSearchData: any;
  gridApi: any;
  IsInstallCertificate: boolean;
  TabSearchPendingData: any;
  public loadingTemplate;
  withMismatchCount: number;
  withnoMismatchCount: number;
  ApprovedCount: number;
  RejectCount: number;
  ImageUrlPath: string;
  IndexValue: any;
  StatusValue: any;
  CertificateImageData: string;
  IsDownloadAllPdfZip: boolean;
  WareHouseId: any;
  Exportloading: boolean;
  ObjUserPageRight = new UserPageRight();
  Save: any;
  constructor(private router: Router, private _Commonservices: CommonService,
    private _PurchaseOrderService: PurchaseOrderService,
    private Loader: NgxSpinnerService,
    private _GlobalErrorHandlerService: GlobalErrorHandlerServiceService,
    private modalService: NgbModal, private _objSearchpanelService: TimePeriodService,
    private _GrncrnService: GrncrnService, private _MasterService: MasterservicesService,
    private _MaterialService: MaterialMovementService, private sanitizer: DomSanitizer,
    private _SiteServiceService: SiteServiceService
  ) {
    this.tooltipShowDelay = 0;
    this.frameworkComponents = {
      buttonRenderer: ButtonRendererComponent,
      fileRenderer: FileRendererComponent,
      customtooltip: CustomTooltipComponent,
      approvalTooltip: approvalTooltipComponent
    }
    this._objSearchpanelService.SearchTimePeriodPanelSubject.subscribe(data => {
      this.CommonSearchPanelData = data;
    });
    this._SiteServiceService.SearchSitesPanelSubject.subscribe(data => {
      this.SearchSitesPanelData = data;
    });
  }

  ngOnInit(): void {
    var objCommonImageUrlModel = new CommonImageUrlModel();
    this.ImageUrlPath = objCommonImageUrlModel.ImageUrl;
    this.isShownList = true;
    this.isShownEdit = false;
    this.IsApprovalTab = false;
    this.model.WHStateStateId = "0";
    this.model.WHNameId = "0";
    this.model.ddlItem = "0";
    this.model.SearchddlItem = "0";
    this.model.TimeSelection = "1";
    var objUserModel = JSON.parse(sessionStorage.getItem("UserSession"));
    this.UserId = objUserModel.User_Id;
    if (objUserModel == null || objUserModel == "null") {
      this.router.navigate(['']);
    }
    var objCompanyModel = new CompanyModel();
    objCompanyModel = JSON.parse(sessionStorage.getItem("CompanyIdSession"));
    this.CompanyId = objCompanyModel.Company_Id;
     this.BindCompanyStateVendorItem();
    // if(sessionStorage.getItem("CompStatVenItmSession")==null||sessionStorage.getItem("CompStatVenItmSession")=="null"){ 
    //   this.BindCompanyStateVendorItem();
    // }else{
    //   var objCSVTdata=new CompanyStateVendorItemModel();  
    //   objCSVTdata =JSON.parse(sessionStorage.getItem("CompStatVenItmSession"));
    //   this.CompanyData=objCSVTdata.CompanyArray;
    //   this.WHStateList=objCSVTdata.StateArray;
    // }



    this.columnDefs = [
      {
        headerName: 'Action',
        cellRenderer: 'buttonRenderer',
        cellRendererParams: {
          onClick: this.ShowDispatcTrackerDetail.bind(this),
          label: 'edit'
        }, pinned: 'left',
        width: 90,
        filter: false
      },
      {
        headerName: 'Approval Status',
        cellRendererFramework: ApprovalrendererComponent,
        pinned: 'left',
        width: 100,
        filter: false,
        resizable: true,
        field: 'DispatchId',
        tooltipField: 'DispatchId', tooltipComponent: 'approvalTooltip',
      },
      { headerName: 'Site Id ', field: 'Site_Id', width: 120, resizable: true, filter: true, },
      { headerName: 'Site Name ', field: 'SiteName', width: 160, resizable: true, filter: true, },
      { headerName: 'Dispatch No ', field: 'DispatchedNo', width: 150, resizable: true, filter: true, },
      { headerName: 'Dispatch Date', field: 'DispatchDate', width: 150, resizable: true, filter: true, },
      { headerName: 'Dispatch Qty ', field: 'DispatchQty', width: 150, resizable: true, filter: true, },
      { headerName: 'Delivered On ', field: 'DeliveredOn', width: 150, resizable: true, filter: true, },
      { headerName: 'Received By', field: 'ReceivedBy', width: 150 },
      { headerName: 'Installed Qty', field: 'InstallationQty', width: 150 },
      { headerName: 'Installed Date', field: 'InstallationDate', width: 150 },
    ];
    this.loadingTemplate =
      `<span class="ag-overlay-loading-center">loading...</span>`;
    this.multiSortKey = 'ctrl';


    this.MultidropdownSettings1 = {
      singleSelection: false,
      text: "Select",
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      enableSearchFilter: true,
      badgeShowLimit: 1,
    };


    try {
      this._MasterService.GetAllItemMakeUnitList().subscribe(data => {
        if (data.Status == 1) {
          if (data.ItemData != null && data.ItemData != '') {
            this.SearchItemNameList = data.ItemData;
            this.SaveItemNameList = data.ItemData;
          }
          if (data.UnitData != null && data.UnitData != '') {
            this.SearchUnitNameList = data.UnitData;
            this.SaveUnitNameList = data.UnitData;
          }
          if (data.MakeData != null && data.MakeData != '') {
            this.SearchMakeNameList = data.MakeData;
            this.SaveMakeNameList = data.MakeData;
          }
        }
      });
    } catch (Error) {
      var objWebErrorLogModel = new WebErrorLogModel();
      objWebErrorLogModel.ErrorBy = this.UserId;
      objWebErrorLogModel.ErrorMsg = Error.message;
      objWebErrorLogModel.ErrorFunction = "GetAllItemMakeUnitList";
      objWebErrorLogModel.ErrorPage = "ItemEquipment";
      this._GlobalErrorHandlerService.handleError(objWebErrorLogModel);
    }

    //brahamjot kaur 31/10/2022
    this.GetUserPageRight();
  }

  //brahamjot kaur 31/10/2022
  async GetUserPageRight() {
    this._Commonservices.GetUserPageRight(this.UserId, MenuName.MaterialInstallation).subscribe(data => {
      if (data.Status == 1) {
        console.log(data);
        this.ObjUserPageRight.IsSearch = data.Data[0].IsSearch;
        this.ObjUserPageRight.IsExport = data.Data[0].IsExport;
        // this.ObjUserPageRight.IsCreate = data.Data[0].IsCreate;
        // this.ObjUserPageRight.IsEdit = data.Data[0].IsEdit;
        // if(this.ObjUserPageRight.IsCreate == 1){
        //   this.Save = 1;
        // }else if(this.ObjUserPageRight.IsEdit == 1){
        //   this.Save = 1;
        // }else{
        //   this.Save = 0
        // }
      }
    })
  }
  BindEditWHList(StateId: any) {
    ////debugger
    try {
      $("#txtToSiteStateId").css('border-color', '');
      $("#txtTOWHStateId").css('border-color', '');
      var objdropdownmodel = new DropdownModel();
      objdropdownmodel.User_Id = 0;
      objdropdownmodel.Parent_Id = this.CompanyId;
      if (StateId != '') {
        objdropdownmodel.Other_Id = StateId;
      } else {
        objdropdownmodel.Other_Id = "0";
      }
      objdropdownmodel.Flag = 'WHMaster';
      this.WHNameList = [];
      ////// //////debugger
      this._Commonservices.getdropdown(objdropdownmodel).subscribe(wh => {
        if (wh.Data != null && wh.Data != "") {
          this.WHNameList = wh.Data;
        }
      });
    } catch (Error) {
      var objWebErrorLogModel = new WebErrorLogModel();
      objWebErrorLogModel.ErrorBy = this.UserId;
      objWebErrorLogModel.ErrorMsg = Error.message;
      objWebErrorLogModel.ErrorFunction = "BindEditWHList";
      objWebErrorLogModel.ErrorPage = "MaterialInstallation";
      this._GlobalErrorHandlerService.handleError(objWebErrorLogModel);

    }
  }
  async BindCompanyStateVendorItem() {
    var objCSVTdata = new CompanyStateVendorItemModel();
    objCSVTdata.Company_Id = parseInt(this.CompanyId);
    this.apiCSVIData = await this._Commonservices.getCompanyStateVendorItem(objCSVTdata);
    if (this.apiCSVIData.Status == 1) {
      objCSVTdata.CompanyArray = this.apiCSVIData.CompanyArray;
      objCSVTdata.StateArray = this.apiCSVIData.StateArray;
      objCSVTdata.EquipmentArray = this.apiCSVIData.EquipmentArray;
      this.WareHouseId = this.apiCSVIData.WHId;
      this.CompanyData = objCSVTdata.CompanyArray;
      this.WHStateList = objCSVTdata.StateArray;
      ///this.EquipmentTypeList=objCSVTdata.EquipmentArray;
      //sessionStorage.setItem("CompStatVenItmSession", JSON.stringify(objCSVTdata)); 
    }
  }

  onGridReady(params) {
    this.gridApi = params.api;
  }
  BackPage() {
    this.isShownList = true;
    this.isShownEdit = false;
  }
  CreateNew() {
    this.isShownEdit = true;
    this.isShownList = false; // Grid List
  }


  ConfirmmationClick(ivalue: any, StatusId: any) {
    this.IndexValue = ivalue;
    this.StatusValue = StatusId;
    var y = 'Cross click'
    this.getDismissReason(y);
    //  this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    this.modalService.open(this.modalContent, { size: <any>'sm', ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      // this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }
  getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  DownloadAllPdfZip() {
    ////debugger
    var value = '';
    var formdata = new FormData();
    if (this.DispatchGridDataList.length > 0) {
      if (this.DispatchGridDataList[0].EwayBillDocument != "" && this.DispatchGridDataList[0].EwayBillDocument != null) {
        value += this.DispatchGridDataList[0].EwayBillDocument + ',';
      }
      if (this.DispatchGridDataList[0].GRFile != "" && this.DispatchGridDataList[0].GRFile != null) {
        value += this.DispatchGridDataList[0].GRFile + ',';
      }
      if (this.DispatchGridDataList[0].DocumentFile != "" && this.DispatchGridDataList[0].DocumentFile != null) {
        value += this.DispatchGridDataList[0].DocumentFile + ',';
      }
      if (this.DispatchGridDataList[0].TaxInvoiceFile != "" && this.DispatchGridDataList[0].TaxInvoiceFile != null) {
        value += this.DispatchGridDataList[0].TaxInvoiceFile + ',';
      }
      formdata.append("SendDownloadFile", JSON.stringify(value));
      this._Commonservices.DownloadFileZip(formdata).subscribe(data => {
        var zip = new JSZip();
        var imgFolder = zip.folder("images");
        for (let i = 0; i < data.lstUrlDetail.length; i++) {
          const byteArray = new Uint8Array(atob(data.lstUrlDetail[i].base64Value).split("").map(char => char.charCodeAt(0)));
          // const newBlob = new Blob([byteArray], {type: 'application/pdf'}); 
          imgFolder.file(this.GetFilename(data.lstUrlDetail[i].Url), byteArray, { base64: true });
        }
        zip.generateAsync({ type: "blob" })
          .then(function (content) {
            FileSaver.saveAs(content, "DispatchDocument.zip");
          });
      });
    }
  }
  GetFilename(url) {
    var m = url.substring(url.lastIndexOf('/') + 1);
    return m;
  }


  SearchChangeItem(event) {
    var itemId = this.SearchddlItem.map(o => o.id).join();
    this.StatusItem = itemId;
  }
  SearchGetAllMaterialInstallationList(para: string) {
    try {
      this.gridApi.showLoadingOverlay();
      var objSearchMaterialInstallationModel = new SearchMaterialInstallationModel();
      objSearchMaterialInstallationModel.UserId = this.UserId;
      objSearchMaterialInstallationModel.Company_Id = this.CompanyId;
      objSearchMaterialInstallationModel.WH_Id = this.model.WHNameId;
      objSearchMaterialInstallationModel.Approval_Id = parseInt(this.model.TimeSelection);
      objSearchMaterialInstallationModel.Item_Id = this.StatusItem;
      if (this._Commonservices.checkUndefined(this.model.DispatchNo) == '') {
        objSearchMaterialInstallationModel.DocumentNo = 0;
      } else {
        objSearchMaterialInstallationModel.DocumentNo = this.model.DispatchNo;
      }
      if (this._Commonservices.checkUndefined(this.SearchSitesPanelData) == '') {
        objSearchMaterialInstallationModel.Site_Id = 0;
      } else {
        objSearchMaterialInstallationModel.Site_Id = this.SearchSitesPanelData.SiteId;
      }
      objSearchMaterialInstallationModel.Startdate = this.CommonSearchPanelData.Startdate;
      objSearchMaterialInstallationModel.Enddate = this.CommonSearchPanelData.Enddate;
      objSearchMaterialInstallationModel.Flag = para;
      if (para == "Export") {
        this.Exportloading = true;
      }
      this._MaterialService.GetAllMaterialInstallationList(objSearchMaterialInstallationModel).subscribe(data => {
        this.gridApi.hideOverlay();
        this.Exportloading = false;
        if (data.Status == 1) {
          this.IsApprovalTab = true;
          if (para == "List") {
            this.PendingCount = 0;
            this.withMismatchCount = 0;
            this.withnoMismatchCount = 0;
            this.ApprovedCount = 0;
            this.RejectCount = 0;
            if (data.Data != null) {
              this.rowData = data.Data;
              const filterValue = null;
              const Pending = this.rowData.filter(element => {
                return element.MaterialInstallationFlag === filterValue;
              });
              this.PendingCount = Pending.length;

              const result = this.rowData.filter(element => {
                return element.MaterialInstallationFlag === 1474;
              });
              this.withMismatchCount = result.length;

              const result1 = this.rowData.filter(element => {
                return element.MaterialInstallationFlag === 1473;
              });
              this.withnoMismatchCount = result1.length;

              const result2 = this.rowData.filter(element => {
                return element.MaterialInstallationFlag === 1472;
              });
              this.ApprovedCount = result2.length;
              const result3 = this.rowData.filter(element => {
                return element.MaterialInstallationFlag === 1471;
              });
              this.RejectCount = result3.length;

              this.TabSearchData = data.Data;
              this.TabSearchPendingData = data.Data;
            } else {
              this.rowData = null;
            }

          }
          else if (para == "Export") {
            if (data.Data != null) {
              //var CurrentDate = this.datePipe.transform(Date(), "dd/MM/yyyy");
              this._PurchaseOrderService.exportAsExcelFile(data.Data, 'MaterialInstallation');
            } else {

            }
          }
        }
      });
    } catch (Error) {
      var objWebErrorLogModel = new WebErrorLogModel();
      objWebErrorLogModel.ErrorBy = this.UserId;
      objWebErrorLogModel.ErrorMsg = Error.message;
      objWebErrorLogModel.ErrorFunction = "GetAllMaterialInstallationList";
      objWebErrorLogModel.ErrorPage = "MetrailInstllation";
      this._GlobalErrorHandlerService.handleError(objWebErrorLogModel);
      //console.log(Error.message)
    }
  }

  SearchPARNOMatchMatch(Id: any) {
    if (Id == 1470) {
      var FilterTabGridData = this.TabSearchData.filter(
        m => m.MaterialInstallationFlag === null);
      this.rowData = FilterTabGridData;
    } else {
      var FilterTabGridData = this.TabSearchData.filter(
        m => m.MaterialInstallationFlag === parseInt(Id));
      this.rowData = FilterTabGridData;
    }
  }

  ShowDispatcTrackerDetail(e) {
    this.CreateNew();
    this.SearchMaterialInstallationId(e.rowData.DispatchId);
  }

  SearchMaterialInstallationId(Id: any) {
    try {
      var objModel = new SearchMaterialInstallationModel();
      objModel.MaterialInstallationId = Id;
      this._MaterialService.GetMaterialInstallationId(objModel).subscribe(data => {
        if (data.Status == 1) {
          if (data.Data != null && data.Data != "") {
            this.DispatchGridDataList = data.Data;
            if (this.DispatchGridDataList[0].EwayBillDocument != "" && this.DispatchGridDataList[0].EwayBillDocument != null
              || this.DispatchGridDataList[0].GRFile != "" && this.DispatchGridDataList[0].GRFile != null
              || this.DispatchGridDataList[0].DocumentFile != "" && this.DispatchGridDataList[0].DocumentFile != null
              || this.DispatchGridDataList[0].TaxInvoiceFile != "" && this.DispatchGridDataList[0].TaxInvoiceFile != null) {
              this.IsDownloadAllPdfZip = true;
            }
            else {
              this.IsDownloadAllPdfZip = false;
            }
          }
          if (data.TabData != null && data.TabData != "") {
            this.TabDataList = data.TabData;
            this.ClickItemName(this.TabDataList[0].ItemId, this.TabDataList[0].DispatchId)
          }
        }
      });
    } catch (Error) {
      var objWebErrorLogModel = new WebErrorLogModel();
      objWebErrorLogModel.ErrorBy = this.UserId;
      objWebErrorLogModel.ErrorMsg = Error.message;
      objWebErrorLogModel.ErrorFunction = "SearchDispatchTrackerEditListByDispatchId";
      objWebErrorLogModel.ErrorPage = "MaterialInstallation";
      this._GlobalErrorHandlerService.handleError(objWebErrorLogModel);
    }
  }
  //#region Click Open All File
  ClickEwayBill(url: string) {
    window.open(url);
  }

  ClickOldEquipmentImage(url: string) {
    window.open(url);
  }
  ClickOldSelfiImage(url: string) {
    window.open(url);
  }
  ClickNewEquipmentImage(url: string) {
    window.open(url);
  }
  ClickNewSelfiImage(url: string) {
    window.open(url);
  }
  //#endregion
  //#region Download All Tab Section
  DownloadAllTabTypeData(TabId: any) {
    if (TabId == 1470) {
      var FilterTabGridData = this.TabSearchData.filter(
        m => m.MaterialInstallationFlag === null);
      this.rowData = FilterTabGridData;
    } else {
      var FilterTabGridData = this.TabSearchData.filter(
        m => m.MaterialInstallationFlag === parseInt(TabId));
      this.rowData = FilterTabGridData;
    }
    if (this.rowData.length > 0) {
      for (var i = 0, len = this.rowData.length; i < len; i++) {
        var objDownloadAlltab = new DownloadAllTabTypeData
        objDownloadAlltab.SiteId = this.rowData[i].Site_Id;
        objDownloadAlltab.SiteName = this.rowData[i].SiteName;
        objDownloadAlltab.DispatchedNo = this.rowData[i].DispatchedNo;
        objDownloadAlltab.DispatchQty = this.rowData[i].DispatchQty;
        objDownloadAlltab.DispatchDate = this.rowData[i].DispatchDate;
        objDownloadAlltab.NewQuantity = this.rowData[i].InstallationQty;
        objDownloadAlltab.DeliveredOn = this.rowData[i].DeliveredOn;
        objDownloadAlltab.ReceivedBy = this.rowData[i].ReceivedBy;
        objDownloadAlltab.Installationby = this.rowData[i].Installationby;
        objDownloadAlltab.Circle = this.rowData[i].Circle;
        objDownloadAlltab.Customer = this.rowData[i].Customer;
        objDownloadAlltab.Make = this.rowData[i].Make;
        objDownloadAlltab.Capacity = this.rowData[i].Capacity;
        objDownloadAlltab.SerialNo = this.rowData[i].SerialNo;
        objDownloadAlltab.InstallationDate = this.rowData[i].InstallationDate;
        objDownloadAlltab.Make = this.rowData[i].InstallMake;
        objDownloadAlltab.Capacity = this.rowData[i].InstallCapacity;
        objDownloadAlltab.ExistingEquipmentStatus = this.rowData[i].ExistingEquipmentStatus;
        objDownloadAlltab.MaterialInstallationType = this.rowData[i].MaterialInstallationType;
        objDownloadAlltab.ItemClass = this.rowData[i].ItemClass;
        objDownloadAlltab.ExistingEquipmentMovementStatus = this.rowData[i].ExistingEquipmentMovementStatus;
        this.objDownloadAllTabTypeData.push(objDownloadAlltab);
      }
      this._PurchaseOrderService.exportAsExcelFile(this.objDownloadAllTabTypeData, 'MaterialInstallationTabData');
    } else {
      alert('No Data')
    }
  }
  //#endregion



  ClickItemName(Id: any, DispatchId: any) {
    try {
      this.DispatchDataList = null;
      this.InstallationDataList = null;
      var objModel = new SearchMaterialInstallationModel();
      objModel.Item_Id = Id;
      objModel.MaterialInstallationId = DispatchId;
      this._MaterialService.SearchAllDetailMaterialInstallationByItemId(objModel).subscribe(data => {
        if (data.Status == 1) {
          this.IsInstallCertificate = false;
          if (data.DispatchData != null && data.DispatchData != "") {
            this.DispatchDataList = data.DispatchData;
          }
          if (data.InstallationData != null && data.InstallationData != "") {
            this.InstallationDataList = data.InstallationData;
            if (Id == 4 || Id == 12) {
              this.IsInstallCertificate = true;
              if (this.InstallationDataList.length > 0) {
                this.CertificateImageData = '';
                for (var i = 0, len = this.InstallationDataList.length; i < len; i++) {
                  if (this.InstallationDataList[i].CertificateImage != "") {
                    this.CertificateImageData += this.InstallationDataList[i].CertificateImage + ',';
                  }
                }
              }
            } else {
              this.IsInstallCertificate = false;
            }
            this.ApprovalList = data.InstallationData.ApprovalList
          }
        }
      });
    } catch (Error) {
      var objWebErrorLogModel = new WebErrorLogModel();
      objWebErrorLogModel.ErrorBy = this.UserId;
      objWebErrorLogModel.ErrorMsg = Error.message;
      objWebErrorLogModel.ErrorFunction = "SearchAllDetailMaterialInstallationByItemId";
      objWebErrorLogModel.ErrorPage = "MaterialInstallation";
      this._GlobalErrorHandlerService.handleError(objWebErrorLogModel);
    }
  }
  DownloadInstallCertificate() {
    var formdata = new FormData();
    if (this.CertificateImageData != "") {
      formdata.append("SendDownloadFile", JSON.stringify(this.CertificateImageData));
    } else {
      alert('Installation Certificate Not Uploaded');
      return false
    }

    this._Commonservices.DownloadFileZip(formdata).subscribe(data => {
      var zip = new JSZip();
      var imgFolder = zip.folder("images");
      for (let i = 0; i < data.lstUrlDetail.length; i++) {
        const byteArray = new Uint8Array(atob(data.lstUrlDetail[i].base64Value).split("").map(char => char.charCodeAt(0)));
        // const newBlob = new Blob([byteArray], {type: 'application/pdf'}); 
        imgFolder.file(i.toString() + '_' + this.GetFilename(data.lstUrlDetail[i].Url), byteArray, { base64: true });

      }
      zip.generateAsync({ type: "blob" })
        .then(function (content) {
          FileSaver.saveAs(content, "MaterialInstallation.zip");
        });



    });
  }


  onSearchCommonDeSelectAll(item: any) {
    if (item == 1) {
      this.SearchddlItem = [];
    }
  }

  ClearItemEquipmentMasterForm() {
    this.model.ddlItem = "0";
    this.model.ddlMake = "0";
    this.model.ddlUnit = "0";
    this.model.itemSpecs = "";
    this.model.itemCode = "";
    this.model.itemDescription = "";
    this.model.IsActive = "";
  }
  addRow(Index: any, flag: any) {
    var objNewItemGrid = new NewEqupArr();
    objNewItemGrid.BarCodeStatusId = "1";
    objNewItemGrid.BarCode = "";
    objNewItemGrid.Img = "";
    if (flag == 1) {
      this.InstallationDataList[Index].NewEqupArr.push(objNewItemGrid);
    } else {
      this.InstallationDataList[Index].OldEqupArr.push(objNewItemGrid);
    }
    return true;
  }

  deleteRow(index: any, k: any, flag: any) {
    ////debugger
    if (flag == 1) {
      if (this.InstallationDataList[index].NewEqupArr.length == 1) {
        return false;
      } else {
        this.InstallationDataList[index].NewEqupArr.splice(k, 1);
        return true;
      }
    } else {
      if (this.InstallationDataList[index].OldEqupArr.length == 1) {
        return false;
      } else {
        this.InstallationDataList[index].OldEqupArr.splice(k, 1);
        return true;
      }
    }


  }
  //#region  Approval Reject Function
  ClickApprovalReject(index: any, Status: any) {
    if (Status == 1458) {
      if (this.ValidationBasic(index) == 1) {
        return false;
      }
    }
    var objAddUpdateInstallation = new AddUpdateInstallation();
    objAddUpdateInstallation.MatId = this.InstallationDataList[index].Id;
    objAddUpdateInstallation.UserId = this.UserId;
    objAddUpdateInstallation.AppStatus = Status;
    objAddUpdateInstallation.CompanyId = this.CompanyId;
    objAddUpdateInstallation.OldQty = this.InstallationDataList[index].OldQuantity;
    objAddUpdateInstallation.NewQty = this.InstallationDataList[index].NewQuantity;
    for (var i = 0, len = this.InstallationDataList[index].NewEqupArr.length; i < len; i++) {
      var objNewInstallation = new NewInstallation();
      objNewInstallation.NewId = this.InstallationDataList[index].NewEqupArr[i].Id;
      objNewInstallation.BarCodeStatusId = this.InstallationDataList[index].NewEqupArr[i].BarCodeStatusId;
      objNewInstallation.SerialNo = this.InstallationDataList[index].NewEqupArr[i].BarCode;
      this.NewInstallationItem.push(objNewInstallation)
    }
    for (var i = 0, len = this.InstallationDataList[index].OldEqupArr.length; i < len; i++) {
      var objOldInstallation = new OldInstallation();
      objOldInstallation.OldId = this.InstallationDataList[index].OldEqupArr[i].Id;
      objOldInstallation.BarCodeStatusId = this.InstallationDataList[index].OldEqupArr[i].BarCodeStatusId;
      objOldInstallation.SerialNo = this.InstallationDataList[index].OldEqupArr[i].BarCode;
      this.OldInstallationItem.push(objOldInstallation)
    }
    objAddUpdateInstallation.OldInstallation = this.OldInstallationItem;
    objAddUpdateInstallation.NewInstallation = this.NewInstallationItem
    this._MaterialService.ClickApprovalReject(JSON.stringify(objAddUpdateInstallation)).subscribe(data => {
      if (data.Status == 1 && Status == 1458) {
        alert('your date has been Succesfully Approve');
      } else if (data.Status == 1 && Status == 1459) {
        alert('your data update successfully Reject');
      } else if (data.Status == 0) {
        alert('DataBase Error');
      }
    });
  }
  //#endregion



  //#region  validation


  ChangeItemName() {
    $("#txtddlItem").css('border-color', '')
  }

  ValidationBasic(index) {
    //debugger
    var flag = 0;
    if (this.InstallationDataList[index].InstalltionTypeId != 1465) {
      if (parseInt(this.InstallationDataList[index].NewQuantity) != this.InstallationDataList[index].OldQuantity) {
        alert('Your NewQuantity Qty and OldQty  no match');
        flag = 1;
      }
      else if (this.InstallationDataList[index].IsSerialReq == true) {
        if (this.InstallationDataList[index].NewEqupArr.length != parseInt(this.InstallationDataList[index].NewQuantity)) {
          alert('Your New Qty  and New SerialNo length no match ');
          flag = 1;
        }
        if (this.InstallationDataList[index].OldEqupArr.length != parseInt(this.InstallationDataList[index].OldQuantity)) {
          alert('Old Qty and Old SerialNo length no match');
          flag = 1;
        }
      } else {
        flag = 0;
      }
    } else {
      if (this.InstallationDataList[index].NewEqupArr.length != parseInt(this.InstallationDataList[index].NewQuantity)) {
        alert('Your New Qty  and New SerialNo length no match ');
        flag = 1;
      }
    }
    return flag;
  }

  //#endregion
}

