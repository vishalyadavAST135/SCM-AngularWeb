//Upadated by ravinder 26/03/2021 /
//update by Hemant Tyagi 30/3/2021 Add Po Serial No
import { Component, OnInit, ViewChild, Injectable, ElementRef } from '@angular/core';
import { ButtonRendererComponent } from 'src/app/renderer/button-renderer.component';
import { FileRendererComponent } from 'src/app/renderer/file-renderer.component';
import { PurchaseOrderService } from 'src/app/Service/purchase-order.service';
import { CommonService } from 'src/app/Service/common.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { PoSearchModel, DynamicItemGrid, VendorOrWhModel, PoOtherDetial, PoBasicDetial, PoItemDetial, UpdatePoItemDetial, SCMJobModel, POPdfModel, DynamicAnxHeaderItemGrid, DownLoadZipFileDetial, PODropDownModel, MakePOSeriesModel } from 'src/app/_Model/purchaseOrderModel';
import { DropdownModel, EmailModel, EmailSendTotalDataModel, CompanyStateVendorItemModel, ApprovelStatusModel, WebErrorLogModel, UserRole, MenuName } from 'src/app/_Model/commonModel';
import { NgbDateStruct, NgbDateAdapter, NgbCalendar, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';
import { DatePipe, formatDate } from '@angular/common';
import * as $ from 'jquery';
import { NgbModal, ModalDismissReasons, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { CustomTooltipComponent } from 'src/app/renderer/customtooltip.component';
import { CompanyModel } from 'src/app/_Model/userModel';
import { SearchpanelService } from 'src/app/Service/searchpanel.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { SiteCustomerAutoModel } from 'src/app/_Model/grncrnModel';
import { GrncrnService } from 'src/app/Service/grncrn.service';
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
pdfMake.vfs = pdfFonts.pdfMake.vfs;
import * as XLSX from 'xlsx';
import { GlobalErrorHandlerServiceService } from 'src/app/Service/global-error-handler-service.service';
import { ApprovalrendererComponent } from 'src/app/renderer/approvalrenderer/approvalrenderer.component';
import { CheckBoxRendererComponent } from 'src/app/renderer/CheckBoxrenderer.component';
import * as JSZip from 'jszip';
import { approvalTooltipComponent } from 'src/app/renderer/Approvaltooltip.component';
import { BOQModel } from 'src/app/_Model/BOQRequestModel';
import { BOQRequestequestService } from 'src/app/Service/boqrequestequest.service';
import { CommonpdfService } from 'src/app/Service/commonpdf.service';
import { MaterialMovementService } from 'src/app/Service/material-movement.service';
import { UserPageRight } from 'src/app/_Model/UserRoleButtonModel';

type AOA = any[][];
declare var jQuery: any;
var PDFdata = null;
declare var require: any
const FileSaver = require('file-saver');


@Component({
  selector: 'app-podetail',
  templateUrl: './podetail.component.html',
  styleUrls: ['./podetail.component.sass'],
  providers: [DatePipe],
  template: `<app-action-renderer [count]=ApprovalCount></app-action-renderer>`,
})

export class PodetailComponent implements OnInit {

  //#region  Page Hide And Show 
  public isShownPOList: boolean; // Po List
  public isShownPOEdit: boolean; // Po Edit
  public EmailPopupMadel: boolean;
  //#endregion

  model: any = {};//get Data

  //#region Item List
  dynamicArray: Array<DynamicItemGrid> = [];  // Bind Item list
  dynamicArrayPOPdf: Array<DynamicItemGrid> = [];
  dynamicArrayAnnexureItemPOPdf: Array<DynamicItemGrid> = [];
  AnxHeaderData: Array<DynamicAnxHeaderItemGrid> = [];
  Downloadfile: Array<DownLoadZipFileDetial> = [];


  objPoItemDetialList: Array<PoItemDetial> = [];// save Item list
  objExeclPoItemDetialList: Array<PoItemDetial> = [];
  //#endregion

  PoStartDateModel: NgbDateStruct;// Po date
  totalAmount: number;  // gross total
  // rowDataClicked1 = {};
  frameworkComponents: any;  ///btn rendereder

  //#region  grid 
  public columnDefs = [];  //grid column
  public rowData = [];  //  grid data
  public multiSortKey: string; //grid multy sort key
  //#endregion

  //#region dropdowns Settings
  public MultidropdownSettings = {};
  public SingledropdownSettings = {};
  public MultidropdownSettings1 = {};
  //#endregion

  //#region Search dropdown varibles
  StartDateModel: NgbDateStruct; // start date
  EndDateModel: NgbDateStruct;// end date
  StateList: any;
  VendorDetail: any;
  ItemNameData: any;
  //#endregion
  VendorEditList: any;
  selectedEditVendorItems: any;
  StateEditList: any;
  selectedEditStateItem: any;
  WHEditList: any;
  public selectedEditWHItems = [];
  //#region  search dropdwnlist
  apiCSVIData: any = {};
  CompanyData = [];
  SearchWHList = [];
  SelectedSearchWHList = [];
  //SearchVendorList=[];
  SearchItemNameList = [];
  //#endregion
  SiteArrayData: any;
  keyword = 'SiteName';
  CustomerSitekeyword = 'CustomerSiteId';
  AutoCompleteSiteCustomerList = [];
  AutoCompleteCustomerSiteIdList = [];

  PoId: number = 0;
  PoNo: string;
  VendorName: string;
  DespatchThrough: string;
  GrossTotal: string;
  ItemDescription: string;
  Narration: string;
  PlaceofReceiptbyShipper: string;
  PoStatus: string;
  Podate: NgbDateStruct;
  PortofDischarge: string;
  PortofLoading: string;
  TermsofDelivery: string;
  TermsofPayment: string;
  VendorAddress: string;
  VendorCode: string;
  VendorPanNo: string;
  VesselFlightNo: string;
  WHAddress: string;
  WHGSTIN: string;
  WHLocation: string;
  VendorGST: string;
  OtherReferences: string;
  DivPOEdit: boolean;
  ItemCode: string;
  UnitName: string;
  Rate: number;
  Qty: number;
  TotalAmount: string;
  VendorGSTList: any;
  uplodfile: File = null;
  AttchMent: File = null;
  public Pdfurl: SafeResourceUrl;
  public PdfEmailurl: string;
  OtherReference: string;
  result: any;
  VoucherTypeDetail: any;
  VoucherTypeId: number;
  WHDataDetail1: any;
  ItemNameDetailData: any;
  FilterItemNameDetailData: any;
  rowdatalength: number = 0;
  rowdatacurrentindex: number = 0;
  IsDisableNext: boolean;
  IsDisablePrevious: boolean;
  ExcelData: any;
  PoEditDetailData: any[];
  ExeclImportData: any[];
  EditCompanyId: number;
  ItemEditData: any;
  PurchaseListData: any;
  ItemMakeListLoadData: any;
  ItemCodeLoadData: any;
  closeResult: string;
  AdditionalRemarks: any;
  tooltipShowDelay: any;
  gridApi: any;
  gridColumnApi: any;
  MailFile: any = [];
  AmountChargeable: string;
  totalSumAmount: any;
  totalQuantity: any;
  totalSumQuantity: any;
  urls: any = [];
  SearchPokeyword = 'PoName';
  AutoCompleteSearchPOList = [];
  SearchPOId: any;
  loading = false;
  EditPoId: any;
  SignedPoPath: any;
  EmailData: any;
  ItemMasterData: any;
  IsSignedPoTrueFile: boolean;
  IsSignedPoFalseFile: boolean;
  IsAmendedDisabled: boolean;
  MissedPOData: any;
  MissedPO: any;
  AmendedDate: any;
  CompanyId: any;
  CompanyFullName: string;
  CommonSearchPanelData: any;
  objSCMJObStart: any;
  StatusDataList: any;
  StatusEditDataList: any;
  //VoucherTypeEditDetail: any;
  PurchaseOrderPdfData: any;
  UserId: any;
  PoItemDetailByExcelData: any;
  IsExcelMsgHideShow: boolean;
  IsExcelSaveDataTaleHideShow: boolean;
  ItemSaveExcelData: any[];
  ErrorMessage: any;
  POCOCHistoryData: any;
  OpenPO: any;
  ClosePO: any;
  CancelPO: any;
  AmendedPO: any;
  SignedPO: any;
  SampleExcel: any = [{
    Qty: '',
    Rate: '',
    TotalAmount: '',
    SubDescription: '',
    ReasonCode: '',
    ItemCode: '',
    CustomerSiteId: '',
    SiteName: '',
    OverHeadExpenses: ''
  }];
  //VoucherTypeFilterData: any;
  IsVoucherDisabled: boolean;
  IsCreatePOPdf: boolean;
  IsPoItemDetialSave: boolean;
  NarrationDataDetail: any[];
  ItemPdfEditData: any[];
  WhareAddress: any;
  OfficeAddress: any;
  InVoiceToAddress: any;
  ConsigneeAddress: any;
  Consignee: any;
  CompanyConsigneeAddress: any;
  NarrData: any;
  EquipmentTypeList: any;
  VendorAddressList: any;
  VenAdressDataList: any;
  VenderFilterAddress: any;
  VendorEditGSTList: any;
  VendorEditFilterAddressList: any;
  WHList: any;
  PdfAnnexureItemData: any[];
  TableHeight: any;

  @ViewChild('inputFile') myInputVariable: ElementRef;
  ApprovalStatusDetail: any;
  ReasonDataList: any;
  ApproveStatusDataList: any;
  ApprovalList: any;
  ApprovalCount: any;
  FileData: any = 0;
  DownloadFileData = [];
  public loadingTemplate;
  ManueId: number;
  CreateName: any;
  CreatedDate: any;
  ModifiedName: any;
  ModifiedDate: any;
  TableId: any;
  public overlayNoRowsTemplate;
  PageMenuId: any = 4;
  ArrayRoleId: any;
  ApprovalLevel: any;
  IsApprovalstatusbtnhideShow: boolean;
  fileName: string;
  filePreview: string;
  PODropDownClass: PODropDownModel;
  isBasicEdit: boolean = false;
  WareHouseId: any;
  UnitList: any;
  button: string = 'Generate PO Pdf';
  Exportloading: boolean;
  ProjectTypeList: any;
  BOQIdentList: any;
  PreviewIndent: boolean = false;
  DocumentFile: any;
  DocumentTypelist: any;
  DocumentTypeDatalist: any;
  DispatchTypeList: any;
  TypeList: any;
  IsCopyPoID: boolean = false;
  @ViewChild('inputDocumentFile', { static: false })
  inputDocumentFile: ElementRef;
  IsDocumentTypeButtonShowHide: boolean = false;
  IsDisabledAllPoCretionButton: boolean = false;
  IsEnableAllPoCretionButton: boolean = false;
  POSearchCategoryList: any = [];
  SearchPOCategoryId: any;
  ObjUserPageRight = new UserPageRight();
  Save: any;
  constructor(private router: Router, private modalService: NgbModal, private _PurchaseOrderService: PurchaseOrderService, private _Commonservices: CommonService, private sanitizer: DomSanitizer,
    private datePipe: DatePipe, private _objSearchpanelService: SearchpanelService, private _GlobalErrorHandlerService: GlobalErrorHandlerServiceService,
    private Loader: NgxSpinnerService, private _BOQService: BOQRequestequestService,
    private _CommonpdfService: CommonpdfService, private _GrncrnService: GrncrnService,
    private httpclient: HttpClient, private _MaterialMovementService: MaterialMovementService,) {
    this.tooltipShowDelay = 0;
    this.frameworkComponents = {
      buttonRenderer: ButtonRendererComponent,
      fileRenderer: FileRendererComponent,
      customtooltip: CustomTooltipComponent,
      CheckBoxRenderer: CheckBoxRendererComponent,
      approvalTooltip: approvalTooltipComponent

    }

    this._objSearchpanelService.SearchPanelSubject.subscribe(data => {
      this.CommonSearchPanelData = data;
    });

    var objPODropDownModel = new PODropDownModel();
    this.PODropDownClass = objPODropDownModel;

  };


  ngOnInit() {
    this.isShownPOList = true;
    this.isShownPOEdit = false;
    this.model.CustomerId = "0";
    this.model.CurrencyType = "1";
    this.columnDefs = [
      {
        headerName: 'Edit',
        cellRenderer: 'buttonRenderer',
        cellRendererParams: {
          onClick: this.onEditBtnClick.bind(this),
          label: 'edit'
        }, pinned: 'left',
        width: 58,
        filter: false
      },
      {
        headerName: 'Approval',
        cellRendererFramework: ApprovalrendererComponent,
        pinned: 'left',
        width: 100,
        filter: false,
        resizable: true,
        field: 'PoId',
        tooltipField: 'PoId', tooltipComponent: 'approvalTooltip',
      },
      {
        headerName: 'File',
        cellRendererSelector: function (params) {
          var ShowFile = {
            component: 'fileRenderer'
          };
          var HideFile = {
            component: ''
          };
          if (params.data.PdfSrc == null || params.data.PdfSrc == '') {
            return HideFile
          }
          else {
            return ShowFile;
          }
        },
        cellRendererParams: {
          onClick: this.onfiledownload.bind(this),
          label: 'File'
        }, pinned: 'left',
        width: 56,
        filter: false
      },

      {
        headerName: 'Signed PO',
        cellRendererSelector: function (params) {
          var ShowSigned = {
            component: 'fileRenderer'
          };
          var HideSigned = {
            component: ''
          };
          if (params.data.SignedPoPath == null || params.data.SignedPoPath == "") {
            return HideSigned
          }
          else {
            return ShowSigned;
          }
        },
        cellRendererParams: {
          onClick: this.SignedPOfiledownload.bind(this),
          label: 'File'
        }, pinned: 'left',
        width: 95,
        filter: false
      },
      { headerName: 'PO Date', field: 'Podate', pinned: 'left', width: 110, resizable: true, filter: false, },
      { headerName: 'PO No', field: 'PoNo', width: 180, pinned: 'left', resizable: true, filter: false },
      // { headerName: 'Voucher Type', field: 'VoucherType', width: 180, pinned: 'left', resizable: true, filter: false },
      { headerName: 'Vendor Name', field: 'VendorName', width: 150, filter: false, resizable: true },
      {
        headerName: 'Item Name', field: 'ItemCodes',
        width: 170, filter: false, resizable: true
      },
      {
        headerName: 'Item Description', field: 'ItemDescription', tooltipField: 'ItemDescription',
        tooltipComponent: 'customtooltip', width: 170, filter: false, resizable: true
      },
      { headerName: 'Qty', field: 'Quantity', width: 60, filter: false, },
      { headerName: 'Gross Amount', field: 'GrossTotal', width: 150, filter: false, },
      { headerName: 'PO Status', field: 'PoStatus', width: 120, filter: false, },
      { headerName: 'WH Location', field: 'WHLocation', width: 150, filter: false, },
      { headerName: 'Amended Date', field: 'AmendedDate', width: 130, filter: false, }
    ];
    this.multiSortKey = 'ctrl';
    this.MultidropdownSettings = {
      singleSelection: false,
      text: "Select",
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      enableSearchFilter: true,
      // limitSelection:1
      badgeShowLimit: 1,
    };

    this.MultidropdownSettings1 = {
      singleSelection: false,
      text: "Select",
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      enableSearchFilter: true,
      labelKey: 'Name',
      primaryKey: 'Id',
      // limitSelection:1
      badgeShowLimit: 1,
    };
    this.SingledropdownSettings = {
      singleSelection: true,
      text: "Select",
      unSelectAllText: 'UnSelect All',
      enableSearchFilter: true,
      badgeShowLimit: 1,

    };
    this.model.SearchIsAmended = "0"
    this.model.IsAnnexure = "0"
    this.loadingTemplate = `<span class="ag-overlay-loading-center">loading...</span>`;

    var objCompanyModel = new CompanyModel();
    objCompanyModel = JSON.parse(sessionStorage.getItem("CompanyIdSession"));
    this.CompanyId = objCompanyModel.Company_Id;
    var objUserModel = JSON.parse(sessionStorage.getItem("UserSession"));
    this.UserId = objUserModel.User_Id;
    this.IsApprovalstatusbtnhideShow = false;
    this.ArrayRoleId = objUserModel.Role_Id.split(',');
    if (objUserModel == null) {
      this.router.navigate(['']);
    }


    ////#region  Search load Bind
    if (sessionStorage.getItem("CompStatVenItmSession") != null
      && sessionStorage.getItem("CompStatVenItmSession") != "null") {
      var objCSVTdata = new CompanyStateVendorItemModel();
      objCSVTdata = JSON.parse(sessionStorage.getItem("CompStatVenItmSession"));
      this.CompanyData = objCSVTdata.CompanyArray;
      this.StateEditList = objCSVTdata.StateArray;
      this.VendorEditList = objCSVTdata.VendorArray;
      this.ItemNameDetailData = objCSVTdata.ItemArray;
      //console.log(this.ItemNameDetailData);
      this.EquipmentTypeList = objCSVTdata.EquipmentArray;
      this.WareHouseId = this.apiCSVIData.WHId;
    } else {
      this.BindCompanyStateVendorItem();
    }
    //#endregion



    //change by Hemant Tyagi
    setTimeout(() => {
      this.SearchPOCancelOpenCloseHistoryCountList();
    }, 300);

    ////#region  Search load Bind Document Load
    var objdropdownmodel = new DropdownModel();
    objdropdownmodel.User_Id = 0;
    objdropdownmodel.Parent_Id = "0";
    objdropdownmodel.Company_Id = this.CompanyId;
    objdropdownmodel.Flag = 'DocumentType';
    this.model.TypeId = "0";
    this.model.DocumentTypeId = "0";
    this._Commonservices.getPOStatusAndVoucherTypedropdown(objdropdownmodel).subscribe(st => {
      if (st.Status == 1 && st.Data != null) {
        this.DispatchTypeList = st.Data;
      }
      if (st.Status == 1 && st.VouCherData != null) {
        this.TypeList = st.VouCherData;
      }
    });
    //#endregion

    var objPOSModel = new PoSearchModel();
    objPOSModel.CompanyId = this.CompanyId;
    this.model.PoStatus = "0";
    this.model.POClientId = "0";
    this.model.EMITypeId = "0";
    this.model.PoCategoryId = null;
    this.model.PurchaseTypeId = "0";
    this.model.ExpenseTypeId = "0";
    this.model.POStatusId = "0";
    this._PurchaseOrderService.GetPOSeriesRelatedMasterData(objPOSModel).subscribe(st => {
      if (st.Status == 1) {
        var objPO = new PODropDownModel();
        objPO.ClientList = st.ClientList;
        objPO.SearchClientList = st.ClientList;
        objPO.EMIList = st.EMIList;
        objPO.POCategoryList = st.POCategoryList;
        objPO.POSearchCategoryList = st.POCategoryList;
        objPO.PurchaseTypeList = st.PurchaseTypeList;
        objPO.ExpenseTypeList = st.ExpenseTypeList;
        objPO.SearchPOStatusList = st.POStatusList;
        objPO.POStatusList = st.POStatusList;
        if (st.NarrationTypeList.length == 1) {
          this.NarrationDataDetail = st.NarrationTypeList;
          this.ChangeNarrationType(st.NarrationTypeList[0].Id);
          this.model.NarrationTypeId = st.NarrationTypeList[0].Id;
        } else {
          this.NarrationDataDetail = st.NarrationTypeList;
          this.Narration = "";
        }
        this.PODropDownClass = objPO;
        console.log(this.PODropDownClass.POSearchCategoryList);
        this.POSearchCategoryList = this.PODropDownClass.POSearchCategoryList;
      }
    });



    var objVendormodel = new VendorOrWhModel();
    objVendormodel.Id = '0';
    objVendormodel.flag = '1460';
    this.model.ApprovalStatus = "0";
    this.model.ApprovalReason = "0";
    this._Commonservices.GettApprovalStatusAndReasondropdown(objVendormodel).subscribe(st1 => {
      if (st1.Status == 1 && st1.ReasonData != null) {
        this.ReasonDataList = st1.ReasonData;
      }
      if (st1.Status == 1 && st1.ApprovalStatusData != null) {
        this.ApprovalStatusDetail = st1.ApprovalStatusData;
      }
    });

    setTimeout(() => {
      this.SearchPOList();
    }, 700);

    this.GetMissedPo();
    // this.CreatePurchaseOrderPdf();
    //brahamjot kaur 31/10/2022
    this.GetUserPageRight(this.PoId);
  }

  //brahamjot kaur 31/10/2022
  async GetUserPageRight(id: number) {
    this._Commonservices.GetUserPageRight(this.UserId, MenuName.PurchaseOrder).subscribe(data => {
      if (data.Status == 1) {
        console.log(data);
        this.ObjUserPageRight.IsSearch = data.Data[0].IsSearch;
        this.ObjUserPageRight.IsExport = data.Data[0].IsExport;
        this.ObjUserPageRight.IsCreate = data.Data[0].IsCreate;
        this.ObjUserPageRight.IsEdit = data.Data[0].IsEdit;
        this.ObjUserPageRight.IsBulkPdfDwnload = data.Data[0].IsBulkPdfDwnload;
        this.ObjUserPageRight.IsGenPdf = data.Data[0].IsGenPdf;
        this.ObjUserPageRight.IsUploadDoc = data.Data[0].IsUploadDoc;

        if (this.ObjUserPageRight.IsCreate == 1 && id == 0) {
          this.Save = 1;
        } else if (this.ObjUserPageRight.IsEdit == 1 && id != 0) {
          this.Save = 1;
        } else {
          this.Save = 0
        }
      }
    })
  }


  async BindCompanyStateVendorItem() {
    var objCSVTdata = new CompanyStateVendorItemModel();
    objCSVTdata.Company_Id = parseInt(this.CompanyId);
    this.apiCSVIData = await this._Commonservices.getCompanyStateVendorItem(objCSVTdata);
    if (this.apiCSVIData.Status == 1) {
      objCSVTdata.CompanyArray = this.apiCSVIData.CompanyArray;
      objCSVTdata.StateArray = this.apiCSVIData.StateArray;
      objCSVTdata.VendorArray = this.apiCSVIData.VendorArray;
      objCSVTdata.ItemArray = this.apiCSVIData.ItemArray;
      objCSVTdata.EquipmentArray = this.apiCSVIData.EquipmentArray;
      objCSVTdata.WHId = this.apiCSVIData.WHId;
      this.CompanyData = objCSVTdata.CompanyArray;
      this.StateEditList = objCSVTdata.StateArray;
      this.VendorEditList = objCSVTdata.VendorArray;
      this.ItemNameDetailData = objCSVTdata.ItemArray;
      this.EquipmentTypeList = objCSVTdata.EquipmentArray;
      this.WareHouseId = this.apiCSVIData.WHId;
      sessionStorage.setItem("CompStatVenItmSession", JSON.stringify(objCSVTdata));
    }
  }
  //#region Open for popup 
  open(content) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }
  public getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      this.model.MailTo = "";
      this.model.MailCc = "";
      this.model.MailBcc = "";
      this.model.MailSubject = "";
      this.model.MailMessage = "";
      return `with: ${reason}`;
    }

  }
  //#endregion
  SearchPOCancelOpenCloseHistoryCountList() {
    try {
      //this.Loader.show();
      var objPoSearchModel = new PoSearchModel();
      objPoSearchModel.CompanyId = this.CompanyId;
      objPoSearchModel.UserId = this.UserId;
      objPoSearchModel.VendorId = this.CommonSearchPanelData.VendorId;
      objPoSearchModel.WHId = this.CommonSearchPanelData.WHId;
      objPoSearchModel.ItemId = this.CommonSearchPanelData.ItemId;
      objPoSearchModel.Startdate = this.CommonSearchPanelData.Startdate;
      objPoSearchModel.Enddate = this.CommonSearchPanelData.Enddate;
      objPoSearchModel.State_Id = this.CommonSearchPanelData.State_Id;
      objPoSearchModel.MakeId = this.CommonSearchPanelData.MakeId;
      objPoSearchModel.ItemCodeId = this.CommonSearchPanelData.ItemCodeId;
      objPoSearchModel.CapacityId = this.CommonSearchPanelData.CapacityId;
      this._PurchaseOrderService.GetPOCancelOpenCloseHistory(objPoSearchModel).subscribe(data => {
        if (data.Status == 1 && data.Data != null) {
          this.POCOCHistoryData = data.Data;
          this.OpenPO = data.Data[0].OpenPO;
          this.ClosePO = data.Data[0].ClosePO;
          this.CancelPO = data.Data[0].CancelPO;
          this.AmendedPO = data.Data[0].AmendedPO;
          this.SignedPO = data.Data[0].SignedPO;
        }
      });
    } catch (Error) {
      var objWebErrorLogModel = new WebErrorLogModel();
      objWebErrorLogModel.ErrorBy = this.UserId;
      objWebErrorLogModel.ErrorMsg = Error.message;
      objWebErrorLogModel.ErrorFunction = "GetPOCancelOpenCloseHistory";
      objWebErrorLogModel.ErrorPage = "Podetail";
      this._GlobalErrorHandlerService.handleError(objWebErrorLogModel);
    }

  }

  async GetSCMJObStart() {
    //this.Loader.show();
    alert('Please Wait Five Minutes');
    // setTimeout(() => {
    //   this.Loader.hide(); 
    // }, 500);
    var objSCMJobModel = new SCMJobModel();
    objSCMJobModel.jobstart = "1";
    objSCMJobModel.name = "scmpo"
    objSCMJobModel.url = "";
    this.VoucherTypeDetail =
      await this._PurchaseOrderService.SCMJObStart2(objSCMJobModel)
    if (this.VoucherTypeDetail.Data.Remarks == 'success') {
    }
  }


  //#region search Company State Vendor Item
  onSearchWHDeSelectAll(items: any) {
    this.SelectedSearchWHList = [];
  }
  //#endregion

  ChangeNarrationType(NarrId: any) {
    this.Narration = null;
    $('#txtNarration').css('border-color', '')
    this.NarrData = this.NarrationDataDetail.filter(m => m.Id === parseInt(NarrId));
    if (this.NarrData.length > 0) {
      this.Narration = this.NarrData[0].Narration;
    }
  }

  CreatePoSeries() {
    //$("#txtVoucher").css('border-color', '');
    if (this.model.POClientId == 'null' || this.model.POClientId == '0') {
      $('#ddlPOClient').css('border-color', 'red');
      $('#ddlPOClient').focus();
      //alert("Please select ClientName");
      return false;
    } else {
      $("#ddlPOClient").css('border-color', '');
    }

    if (this.model.EMITypeId == 'null' || this.model.EMITypeId == '0') {
      $('#ddlEMIType').css('border-color', 'red');
      $('#ddlEMIType').focus();
      //alert("Please select EMIType");
      return false;
    } else {
      $("#ddlEMIType").css('border-color', '');
    }

    if (this.model.PoCategoryId == 'null' || this.model.PoCategoryId == '0') {
      $('#ddlPoCategory').css('border-color', 'red');
      $('#ddlPoCategory').focus();
      // alert("Please select PoCategory");
      return false;
    } else {
      $("#ddlPoCategory").css('border-color', '');
    }

    var makePOSeriesModel = new MakePOSeriesModel()
    makePOSeriesModel.ClientId = this.model.POClientId;
    makePOSeriesModel.CompanyId = this.CompanyId;
    makePOSeriesModel.EMITypeId = this.model.EMITypeId;
    makePOSeriesModel.POCategoryId = this.model.PoCategoryId;
    this._PurchaseOrderService.GetMakePoSeries(makePOSeriesModel).subscribe(data => {
      if (data.Status == 1 && data.Data != null) {
        this.PoNo = data.Data;
      }
    });


    // call api and bind pono procedure Name on production database usp_GetPoNumberSeries
    //GetMakePoSeries
    //this.PoNo=this.VoucherTypeFilterData[0].PoNoSeries;
  }

  //#region  OnChange Fn Company,State,EditState, EditVendor, EditItemName,EditItemCode,EditWH

  async onChangeEditState(event) {
    // $('#txtStateEdit .selected-list .c-btn').attr('style', 'border-color: ');
    $("#txtStateEdit").css('border-color', '')
    this.model.selectedEditWHItems = "0";
    var companyid = this._Commonservices.checkUndefined(this.EditCompanyId);
    var objdropdownmodel = new DropdownModel();
    objdropdownmodel.User_Id = 0;
    var State = this._Commonservices.checkUndefined(this.model.selectedEditStateItem);
    var StateId = '';
    for (var i = 0, len = State.length; i < len; i++) {
      StateId += State[i].id + ',';
    };
    objdropdownmodel.Other_Id = this.model.selectedEditStateItem//StateId;
    objdropdownmodel.Parent_Id = this.CompanyId;
    objdropdownmodel.Flag = 'WHMaster';
    //this.selectedEditWHItems=[];
    this._Commonservices.getdropdown(objdropdownmodel).subscribe(wh => {
      if (wh.Data.length == 1) {
        this.WHEditList = wh.Data;
        this.ngModelChangeWH(wh.Data[0].id);
        this.model.selectedEditWHItems = wh.Data[0].id;
      } else {
        this.WHEditList = wh.Data;
        this.model.selectedEditWHItems = "0";
        this.WHGSTIN = "";
        this.WHAddress = "";
      }
    });
  }
  ngModelChangeVendor(): void {
    try {
      $("#txtVendorName").css('border-color', '');
      // $('#TxtVendorEdit .selected-list .c-btn').attr('style', 'border-color: ');
      var objVendormodel = new VendorOrWhModel();
      objVendormodel.Id = this.model.selectedEditVendorItems;
      objVendormodel.flag = 'VendorGST';
      this._Commonservices.GetVendorGstAndVendorAddress(objVendormodel).subscribe(data => {
        this.VendorGSTList = [];
        this.model.VendorGST = "";
        this.VendorName = "";
        this.VendorAddress = "";
        if (data.Data != null) {
          if (data.Data.length == 1) {
            this.VendorGSTList = data.Data;
            this.model.VendorGST = this.VendorGSTList[0].GSTINNo;
            this.VendorName = this.VendorGSTList[0].VendorCode;
          } else {
            this.VendorGSTList = data.Data;
            this.VendorName = this.VendorGSTList[0].VendorCode;
          }
        } else {
          this.model.VendorGST = "0";
          this.VenderFilterAddress = [];
        }
        if (data.VenAdressData != null) {
          if (data.VenAdressData.length == 1) {
            this.VenAdressDataList = data.VenAdressData;
            this.model.VendorAddressId = data.VenAdressData[0].Id;
            this.VendorAddress = data.VenAdressData[0].VenAddress;
          } else {
            this.VenAdressDataList = data.VenAdressData;
          }
        }
      });
    } catch (Error) {
      var objWebErrorLogModel = new WebErrorLogModel();
      objWebErrorLogModel.ErrorBy = this.UserId;
      objWebErrorLogModel.ErrorMsg = Error.message;
      objWebErrorLogModel.ErrorFunction = "ngModelChangeVendor";
      objWebErrorLogModel.ErrorPage = "Podetail";
      this._GlobalErrorHandlerService.handleError(objWebErrorLogModel);
    }
  }

  ChangeVendorGST(Id: any) {
    $("#txtVendorGST").css('border-color', '');
    this.VenderFilterAddress = [];
    this.VendorAddress = null;
    this.model.RadioId = null;
    var VenderAddress = this.VenAdressDataList.filter(
      m => m.GSTINNo === Id);
    if (VenderAddress.length == 1) {
      this.VendorAddress = VenderAddress[0].VenAddress;
      this.model.VendorAddressId = VenderAddress[0].Id;
    } else {
      this.VenderFilterAddress = VenderAddress;
    }
  }

  ChangeVendorAddress(Id: any) {
    var VenderFilterAddressData = this.VenderFilterAddress.filter(
      m => m.Id === parseInt(Id));
    this.VendorAddress = VenderFilterAddressData[0].VenAddress;
    this.model.VendorAddressId = VenderFilterAddressData[0].Id;
  }


  ChangeEditItemName(ItemNameId: any, index: any) {
    $('#tblOne > tbody  > tr').each(function () {
      var valueItem = $(this).find('.ItemName').val();
      if (valueItem != '0') {
        $(this).find('.ItemName').css('border-color', '');
      }
    });
    const result = this.ItemNameDetailData.filter(element => {
      return element.id === parseInt(ItemNameId);
    });
    this.dynamicArray[index].IsWarrantyReq = result[0].IsWarrantyReq;
    this.dynamicArray[index].EditItemMake = null;
    var objdropdownmodel = new DropdownModel();
    objdropdownmodel.User_Id = 0;
    objdropdownmodel.Parent_Id = ItemNameId;
    objdropdownmodel.Company_Id = this.CompanyId;
    objdropdownmodel.Other_Id = "0";
    objdropdownmodel.Flag = 'ItemMake';
    this._Commonservices.getdropdown(objdropdownmodel).subscribe(item => {
      this.dynamicArray[index].ItemMakeId = "0";
      this.dynamicArray[index].EditItemMake = item.Data
    });

  }

  async ChangeEditItemMake(ItemMakeId: any, ItemNameId: any, index: any) {
    try {
      $('#tblOne > tbody  > tr').each(function () {
        var valueMake = $(this).find('.ItemMake').val();
        if (valueMake == '0') {
          $(this).find('.ItemMake').css('border-color', '');
        }
      });
      var objdropdownmodel = new DropdownModel();
      objdropdownmodel.User_Id = 0;
      objdropdownmodel.Parent_Id = ItemNameId;
      objdropdownmodel.Other_Id = ItemMakeId;
      objdropdownmodel.Company_Id = this.CompanyId;
      objdropdownmodel.Flag = 'ItemCode';
      this.dynamicArray[index].EditItemCode = null;
      this.ItemCodeLoadData = null;
      this.ItemCodeLoadData = await
        this._Commonservices.getdropdown2(objdropdownmodel);
      if (this.ItemCodeLoadData.Data != null) {
        this.dynamicArray[index].ItemId = "0";
        this.dynamicArray[index].EditItemCode = this.ItemCodeLoadData.Data
      }

    } catch (Error) {
      var objWebErrorLogModel = new WebErrorLogModel();
      objWebErrorLogModel.ErrorBy = this.UserId;
      objWebErrorLogModel.ErrorMsg = Error.message;
      objWebErrorLogModel.ErrorFunction = "ChangeEditItemMake";
      objWebErrorLogModel.ErrorPage = "Podetail";
      this._GlobalErrorHandlerService.handleError(objWebErrorLogModel);
    }


  }

  ChangeEditItemCode(ItemId: any, index: any) {
    $('#tblOne > tbody  > tr').each(function () {
      var valueItem = $(this).find('.ItemCode').val();
      if (valueItem != '0') {
        $(this).find('.ItemCode').css('border-color', '');
      }
    });
    var objVendormodel = new VendorOrWhModel();
    objVendormodel.Id = ItemId;
    objVendormodel.flag = 'ItemMaster';
    this._Commonservices.getVendorOrWh(objVendormodel).subscribe(data => {
      var UnitData = data.Data;
      if (data.Data[0].UnitList.length == 1) {
        this.dynamicArray[index].UnitList = data.Data[0].UnitList;
        this.dynamicArray[index].UnitName = this.dynamicArray[index].UnitList[0].Id;
      } else {
        this.dynamicArray[index].UnitName = "0";
        this.dynamicArray[index].UnitList = data.Data[0].UnitList;
      }
      // this.dynamicArray[index].UnitName = data.Data[0].UnitName;
      this.dynamicArray[index].ItemDescription = data.Data[0].ItemDescription;
    });
  }
  ngModelChangeWH(Id: any) {
    $("#txtWH").css('border-color', '');
    var objVendormodel = new VendorOrWhModel();
    objVendormodel.Id = Id;
    objVendormodel.flag = 'WHMaster';
    this._Commonservices.getVendorOrWh(objVendormodel).subscribe(Wh => {
      this.WHDataDetail1 = Wh.Data;
      this.WHGSTIN = Wh.Data[0].WHGSTINNo;
      this.WHAddress = Wh.Data[0].WHAddress;
    });
  }

  //#endregion 
  //#region auto complete Site Name and Customer Site ID
  onChangeSiteNameSearch(val: string, index: any) {
    try {
      this.dynamicArray[index].SiteId = 0;
      this.dynamicArray[index].CustomerSiteId = "";
      this.dynamicArray[index].SiteName = "";
      this.dynamicArray[index].ValueCustomerSite = "";
      this.dynamicArray[index].ValueSiteName = "";
      this.dynamicArray[index].CustomerId = 0;
      this.dynamicArray[index].CustomerCode = "";
      this.AutoCompleteSiteCustomerList = [];
      var objSiteCustomerAutoModel = new SiteCustomerAutoModel();
      objSiteCustomerAutoModel.SCNo = val;
      objSiteCustomerAutoModel.CompanyId = this.CompanyId;
      objSiteCustomerAutoModel.flag = "Site";
      this._GrncrnService.GetAutoCompleteSiteAndCustomer(objSiteCustomerAutoModel).subscribe((data) => {
        this.AutoCompleteSiteCustomerList = data.Data;
      })
    } catch (Error) {
      console.log(Error.message)
    }
  }



  searchCleared(index: any) {
    this.AutoCompleteSiteCustomerList = [];
    this.dynamicArray[index].SiteId = 0;
    this.dynamicArray[index].CustomerSiteId = "";
    this.dynamicArray[index].SiteName = "";
    this.dynamicArray[index].ValueCustomerSite = "";
    this.dynamicArray[index].CustomerId = 0;
    this.dynamicArray[index].CustomerCode = "";
  }

  SelectSiteName(item, index: any) {
    this.dynamicArray[index].ValueCustomerSite = item.CustomerSiteId;
    this.dynamicArray[index].SiteId = item.Id;
    //this.dynamicArray[index].ValueSiteName=item.SiteName;
    this.dynamicArray[index].SiteName = item.SiteName;
    this.dynamicArray[index].CustomerSiteId = item.CustomerSiteId;
    this.dynamicArray[index].CustomerId = item.ClientId;
    this.dynamicArray[index].CustomerCode = item.ClientCode;
  }

  onFocused(e) {
  }

  onChangeSearchCustomerSiteId(val: string, index: any) {
    try {
      this.dynamicArray[index].SiteId = 0;
      this.dynamicArray[index].CustomerSiteId = "";
      this.dynamicArray[index].SiteName = "";
      this.dynamicArray[index].ValueCustomerSite = "";
      this.dynamicArray[index].ValueSiteName = "";
      this.dynamicArray[index].CustomerId = 0;
      this.dynamicArray[index].CustomerCode = "";

      this.AutoCompleteCustomerSiteIdList = [];
      var objSiteCustomerAutoModel = new SiteCustomerAutoModel();
      objSiteCustomerAutoModel.SCNo = val;
      objSiteCustomerAutoModel.CompanyId = this.CompanyId;
      objSiteCustomerAutoModel.flag = "CustomerSiteId";
      this._GrncrnService.GetAutoCompleteSiteAndCustomer(objSiteCustomerAutoModel).subscribe((data) => {
        this.AutoCompleteCustomerSiteIdList = data.Data;
      })
    } catch (Error) {
      var objWebErrorLogModel = new WebErrorLogModel();
      objWebErrorLogModel.ErrorBy = this.UserId;
      objWebErrorLogModel.ErrorMsg = Error.message;
      objWebErrorLogModel.ErrorFunction = "onChangeSearchCustomerSiteId";
      objWebErrorLogModel.ErrorPage = "Podetail";
      this._GlobalErrorHandlerService.handleError(objWebErrorLogModel);
    }
  }

  SelectCustomerSiteId(items, i: any) {
    //this.AutoCompleteCustomerSiteIdList=[];
    this.dynamicArray[i].CustomerSiteId = items.CustomerSiteId;
    this.dynamicArray[i].SiteId = items.Id;
    this.dynamicArray[i].ValueSiteName = items.SiteName;
    this.dynamicArray[i].SiteName = items.SiteName;
    this.dynamicArray[i].CustomerId = items.ClientId;
    this.dynamicArray[i].CustomerCode = items.ClientCode;

  }

  ClearedCustomerSiteId(index: any) {
    this.dynamicArray[index].SiteId = 0;
    this.dynamicArray[index].CustomerSiteId = "";
    this.dynamicArray[index].SiteName = "";
    this.dynamicArray[index].ValueSiteName = "";
    this.dynamicArray[index].ValueCustomerSite = "";
    this.dynamicArray[index].CustomerId = 0;
    this.dynamicArray[index].CustomerCode = "";
    this.AutoCompleteCustomerSiteIdList = [];
  }

  //#endregion

  //#region  auto complete PO
  SearchPoCleared() {
    this.SearchPOId = 0;
    this.AutoCompleteSearchPOList = [];
  }

  SearchPoSelectEvent(item) {
    this.SearchPOId = item.id;
  }
  onSearchPoChange(val: string, FlagId: any) {
    try {
      this.SearchPOId = 0;
      var objdropdownmodel = new DropdownModel();
      objdropdownmodel.User_Id = this.UserId;
      objdropdownmodel.Parent_Id = val;
      objdropdownmodel.Company_Id = this.CompanyId;
      objdropdownmodel.Flag = FlagId;
      this._PurchaseOrderService.GetAutoCompletePurchaseOrder(objdropdownmodel).subscribe((data) => {
        this.AutoCompleteSearchPOList = data.Data;
      })
    } catch (Error) {
      console.log(Error.message)
    }
  }

  //#endregion

  //#region Select and deselect value WH, State, Vendor, ItemName
  onItemSelect(item: any) {
    //console.log(item);

  }
  onSelectAll(items: any) {
    //console.log(items);
  }
  OnItemDeSelect(items: any) {
    //console.log(items);
  }
  onDeSelectAll(items: any) {
    //console.log(items);
  }

  OnEditVenItemDeSelect(item: any) {
    this.selectedEditVendorItems = [];
  }
  onEditVenDeSelectAll(items: any) {
    this.selectedEditVendorItems = [];
  }
  // OnEditStateDeSelect(items: any){
  //   this.selectedEditStateItem =[];
  //   this.WHEditList=null;
  //   this.model.selectedEditWHItems="0";
  // }
  // onEditStateDeSelectAll(items: any){
  //     this.selectedEditStateItem =[];
  //     this.WHEditList=null;
  //     this.model.selectedEditWHItems="0";
  //  }
  //#endregion

  onfiledownload(e) {
    window.open(e.rowData.PdfSrc);
  }
  SignedPOfiledownload(e) {
    window.open(e.rowData.SignedPoPath);
  }
  SignedPOClick() {
    window.open(this.SignedPoPath);
  }


  //#region  Search PoList On Click detail and Get Item  and next Previous
  SearchPOList() {
    try {
      //this.Loader.show();
      this.gridApi.showLoadingOverlay();
      var objPoSearchModel = new PoSearchModel();
      objPoSearchModel.CompanyId = this.CompanyId;
      objPoSearchModel.VendorId = this.CommonSearchPanelData.VendorId;
      //objPoSearchModel.WHId = this.CommonSearchPanelData.WHId;
      if (this.CommonSearchPanelData.WHId != "") {
        objPoSearchModel.WHId = this.CommonSearchPanelData.WHId;
      } else {
        if (this.WareHouseId == "0") {
          objPoSearchModel.WHId = "";
        } else {
          objPoSearchModel.WHId = this.WareHouseId;
        }
      }
      objPoSearchModel.ItemClassId = this.CommonSearchPanelData.ItemClassId;
      objPoSearchModel.ItemId = this.CommonSearchPanelData.ItemId;
      objPoSearchModel.Startdate = this.CommonSearchPanelData.Startdate;
      objPoSearchModel.Enddate = this.CommonSearchPanelData.Enddate;
      var Searchpoid = this._Commonservices.checkUndefined(this.SearchPOId);
      if (Searchpoid != '') {
        objPoSearchModel.PoId = this.SearchPOId;
      } else {
        objPoSearchModel.PoId = 0;
      }
      objPoSearchModel.State_Id = this.CommonSearchPanelData.State_Id;
      var statusid = this._Commonservices.checkUndefined(this.model.PoStatus);
      if (statusid != '') {
        objPoSearchModel.PoStatusId = this.model.PoStatus;
      } else {
        objPoSearchModel.PoStatusId = 0;
      }
      objPoSearchModel.MakeId = this.CommonSearchPanelData.MakeId;
      objPoSearchModel.ItemCodeId = this.CommonSearchPanelData.ItemCodeId;
      objPoSearchModel.CapacityId = this.CommonSearchPanelData.CapacityId;
      objPoSearchModel.DescriptionId = this.CommonSearchPanelData.DescriptionId;
      var PoCategoryid = this._Commonservices.checkUndefined(this.model.PoCategoryId);
      if (PoCategoryid != '') {
        //brahamjot kaur 7/8/2022
        //objPoSearchModel.VoucherTypeId = parseInt(this.model.PoCategoryId);
        objPoSearchModel.VoucherTypeId = this.SearchPOCategoryId;
      } else {
        objPoSearchModel.VoucherTypeId = "0";
      }
      objPoSearchModel.SearchIsAmended = this.model.SearchIsAmended
      objPoSearchModel.Flag = 'all';
      if (this.model.CustomerId != '') {
        objPoSearchModel.CustomerId = parseInt(this.model.CustomerId);
      } else {
        objPoSearchModel.CustomerId = 0;
      }
      this._PurchaseOrderService.GetPurchaseOrderList(objPoSearchModel).subscribe(data => {
        if (data.Status == 1) {
          this.gridApi.hideOverlay();
          this.rowData = data.Data;
        } else if (data.Status == 2) {
          this.gridApi.hideOverlay();
          this.rowData = [];
        }
      });
    } catch (Error) {
      var objWebErrorLogModel = new WebErrorLogModel();
      objWebErrorLogModel.ErrorBy = this.UserId;
      objWebErrorLogModel.ErrorMsg = Error.message;
      objWebErrorLogModel.ErrorFunction = "SearchPOList";
      objWebErrorLogModel.ErrorPage = "Podetail";
      this._GlobalErrorHandlerService.handleError(objWebErrorLogModel);
    }

  }

  ExcelExport() {
    try {
      var objPoSearchModel = new PoSearchModel();
      objPoSearchModel.UserId = this.UserId;
      objPoSearchModel.CompanyId = this.CompanyId;
      objPoSearchModel.VendorId = this.CommonSearchPanelData.VendorId;
      if (this.CommonSearchPanelData.WHId != "") {
        objPoSearchModel.WHId = this.CommonSearchPanelData.WHId;
      } else {
        if (this.WareHouseId == "0") {
          objPoSearchModel.WHId = "";
        } else {
          objPoSearchModel.WHId = this.WareHouseId;
        }
      }
      objPoSearchModel.ItemClassId = this.CommonSearchPanelData.ItemClassId;
      objPoSearchModel.ItemId = this.CommonSearchPanelData.ItemId;
      objPoSearchModel.Startdate = this.CommonSearchPanelData.Startdate;
      objPoSearchModel.Enddate = this.CommonSearchPanelData.Enddate;

      var Searchpoid = this._Commonservices.checkUndefined(this.SearchPOId);
      if (Searchpoid != '') {
        objPoSearchModel.PoId = this.SearchPOId;
      } else {
        objPoSearchModel.PoId = 0;
      }

      objPoSearchModel.State_Id = this.CommonSearchPanelData.State_Id;
      var statusid = this._Commonservices.checkUndefined(this.model.PoStatus);
      if (statusid != '') {
        objPoSearchModel.PoStatusId = this.model.PoStatus;
      } else {
        objPoSearchModel.PoStatusId = 0;
      }

      objPoSearchModel.MakeId = this.CommonSearchPanelData.MakeId;
      objPoSearchModel.ItemCodeId = this.CommonSearchPanelData.ItemCodeId;
      objPoSearchModel.CapacityId = this.CommonSearchPanelData.CapacityId;
      objPoSearchModel.DescriptionId = this.CommonSearchPanelData.DescriptionId;
      var PoCategoryid = this._Commonservices.checkUndefined(this.model.PoCategoryId);
      if (PoCategoryid != '') {
        objPoSearchModel.VoucherTypeId = this.SearchPOCategoryId;
      } else {
        objPoSearchModel.VoucherTypeId = "0";
      }

      objPoSearchModel.Flag = 'export';
      if (this.CommonSearchPanelData.CustomerId != '') {
        objPoSearchModel.CustomerId = parseInt(this.CommonSearchPanelData.CustomerId);
      } else {
        objPoSearchModel.CustomerId = 0;
      }
      objPoSearchModel.IsAnnexure = this.model.IsAnnexure;
      this.Exportloading = true;
      this._PurchaseOrderService.GetPurchaseOrderList(objPoSearchModel).subscribe(data => {
        this.Exportloading = false;;
        if (data.Status == 1) {
          if (data.Data != null && data.Data != "") {
            this.ExcelData = data.Data;
            var CurrentDate = this.datePipe.transform(Date(), "dd/MM/yyyy");
            this._PurchaseOrderService.exportAsExcelFile(this.ExcelData, 'PODetail' + CurrentDate);
          } else {
            alert('Not Data Found');
          }
        }
      });
    } catch (Error) {
      console.log(Error.message)
    }
  }

  DownloadAllPdfZip() {
    var objDownLoadZipFileDetial = new DownLoadZipFileDetial();
    var value = '';
    var formdata = new FormData();
    this.Downloadfile = [];
    if (this.rowData.length > 0) {
      for (let i = 0; i < this.rowData?.length; i++) {
        if (this.rowData[i].PdfSrc != "" && this.rowData[i].PdfSrc != null) {
          objDownLoadZipFileDetial.DownloadFileData.push(this.rowData[i].PdfSrc) + ',';
          value += this.rowData[i].PdfSrc + ',';
        }
      }
      this.Downloadfile.push(objDownLoadZipFileDetial);
      formdata.append("SendDownloadFile", JSON.stringify(value));
      this._Commonservices.DownloadFileZip(formdata).subscribe(data => {
        var zip = new JSZip();
        var imgFolder = zip.folder("images");
        for (let i = 0; i < data.lstUrlDetail.length; i++) {
          const byteArray = new Uint8Array(atob(data.lstUrlDetail[i].base64Value).split("").map(char => char.charCodeAt(0)));
          //const newBlob = new Blob([byteArray], {type: 'application/pdf'}); 
          imgFolder.file(this.GetFilename(data.lstUrlDetail[i].Url), byteArray, { base64: true });
        }
        zip.generateAsync({ type: "blob" })
          .then(function (content) {
            FileSaver.saveAs(content, "POFile.zip");
          });
      });
    }
  }

  GetFilename(url) {
    var m = url.substring(url.lastIndexOf('/') + 1);
    return m;
  }


  onEditBtnClick(e) {
    try {
      this.isShownPOList = false;
      this.isShownPOEdit = true;
      this.IsCopyPoID = true;
      this.PoEditDetailData = [];
      var PoDataRow = this.rowData.filter(m => m.PoId === e.rowData.PoId);
     
      this.rowdatalength = this.rowData.length;
      this.rowdatacurrentindex = this.rowData.findIndex(function (item, i) {
        return item.PoId === e.rowData.PoId
      });
      this.fnNextandPreviousDisable();
      this.BindEditDetails(PoDataRow);
    } catch (Error) {
      console.log(Error.message)
    }
  }

  // brahamjot kaur 07-060-2022
  copyPoID(id: any) {
    try {
      if (this.model.hiddenPoId == 0) {
        alert('Please Open PO.');
        return false;
      }
      var objPoOtherDetial = new PoOtherDetial();
      objPoOtherDetial.PoId = this.model.hiddenPoId;
      objPoOtherDetial.UserId = this.UserId;
      this._PurchaseOrderService.CopyPOID(objPoOtherDetial).subscribe(data => {
        if (data.Status == 1) {
          setTimeout(() => {
            alert('your data has been save successfully with PO No-' + data.Remarks)
          }, 300);
          this.ClearPODetail();
        } else if (data.Status == 0) {
          setTimeout(() => {
            alert("Contact to IT.")
          }, 300);
        }
      });

    } catch (Error) {
      var objWebErrorLogModel = new WebErrorLogModel();
      objWebErrorLogModel.ErrorBy = this.UserId;
      objWebErrorLogModel.ErrorMsg = Error.message;
      objWebErrorLogModel.ErrorFunction = "PoBasicdetailSave";
      objWebErrorLogModel.ErrorPage = "Podetail";
      this._GlobalErrorHandlerService.handleError(objWebErrorLogModel);
    }
  }

  BindEditDetails(NextPrevoiusData: any) {
    this.isBasicEdit = true;
    try {
      this.totalAmount = 0;
      this.totalQuantity = 0;
      this.model.ddlInvoiceTo = 1;
      this.model.ddlConsignee = 1;
      this.EditCompanyId = NextPrevoiusData[0].CompanyMaster_Id;
      this.isShownPOList = false;
      this.isShownPOEdit = true;
      this.IsCreatePOPdf = false;
      if (NextPrevoiusData[0].IsAmended == null) {
        this.model.IsAmended = "0";
      } else {
        this.model.IsAmended = NextPrevoiusData[0].IsAmended;
      }
      this.PoId = NextPrevoiusData[0].PoId;
      this.GetUserPageRight(this.PoId);
      this.model.hiddenPoId = NextPrevoiusData[0].PoId;
      this.model.CreateName = NextPrevoiusData[0].CreateName;
      this.model.CreatedDate = NextPrevoiusData[0].CreatedDate;
      this.model.ModifiedName = NextPrevoiusData[0].ModifiedName;
      this.model.ModifiedDate = NextPrevoiusData[0].ModifiedDate;
      //Change By Umesh

      this.model.POClientId = NextPrevoiusData[0].ClientListId;
      this.ChangeCulstomer();
      this.model.EMITypeId = NextPrevoiusData[0].EMIListId;
      this.model.PoCategoryId = NextPrevoiusData[0].POCategoryListId;

      if (NextPrevoiusData[0].ClientListId == 60 && NextPrevoiusData[0].EMIListId == 1476) {
        this.FilterItemNameDetailData = this.ItemNameDetailData.filter(m => m.id == 1 || m.id == 2 || m.id == 4
          || m.id == 11 || m.id == 12 || m.id == 25 || m.id == 29);
      }
      else if (NextPrevoiusData[0].ClientListId == 60 && NextPrevoiusData[0].EMIListId == 1477) {
        this.FilterItemNameDetailData = this.ItemNameDetailData.filter(m => m.id != 1 && m.id != 2 && m.id != 4
          && m.id != 11 && m.id != 12 && m.id != 25 && m.id != 29);
      }
      else {
        this.FilterItemNameDetailData = this.ItemNameDetailData;
      }

      //this.CreatePoSeries(this.model.PoCategoryId);
      this.model.PurchaseTypeId = NextPrevoiusData[0].PurchaseTypeListId;
      this.model.ExpenseTypeId = NextPrevoiusData[0].ExpenseTypeListId;
      if (NextPrevoiusData[0].ProjectTypeId != 0) {
        this.model.ProjectTypeId = NextPrevoiusData[0].ProjectTypeId;
      } else {
        this.model.ProjectTypeId = "0";
      }
      this.ChangeProjectType(this.model.ProjectTypeId);
      if (NextPrevoiusData[0].BOQRequestId != 0) {
        this.model.BOQRequestId = NextPrevoiusData[0].BOQRequestId;
      } else {
        this.model.BOQRequestId = "0";
      }
      this.IsVoucherDisabled = true;
      this.HideShowSaveButton();
      this.PoNo = NextPrevoiusData[0].PoNo;
      this.EditPoId = NextPrevoiusData[0].PoId;
      this.GetAllDocumentTypeByPoId(this.EditPoId)
      this.StatusEditDataList = null;
      var PoStatus = JSON.parse(NextPrevoiusData[0].StatusList);
      this.StatusEditDataList = PoStatus;
      if (NextPrevoiusData[0].POStatusId != null) {
        this.model.POStatusId = '' + NextPrevoiusData[0].POStatusId + '';
      } else {
        this.model.POStatusId = 0;
      }
      this.GetItemSaveExcelData();
      var PODate = NextPrevoiusData[0].Podate.split('/');
      this.model.Podate = { year: parseInt(PODate[2]), month: parseInt(PODate[1]), day: parseInt(PODate[0]) };
      this.VendorEditList = null;
      var JsonDataVendor = JSON.parse(NextPrevoiusData[0].VendorList);
      this.VendorEditList = JsonDataVendor;

      if (NextPrevoiusData[0].VendorMaster_Id != null) {
        this.model.selectedEditVendorItems = '' + NextPrevoiusData[0].VendorMaster_Id + '';
      } else {
        this.model.selectedEditVendorItems = "0";
      }
      //var PoPdfurl= this._Commonservices.checkUndefined(NextPrevoiusData[0].PdfSrc);
      this.Pdfurl = this.sanitizer.bypassSecurityTrustResourceUrl(NextPrevoiusData[0].PdfSrc);

      if (NextPrevoiusData[0].NarrationId == null || NextPrevoiusData[0].NarrationId == 0) {
        this.model.NarrationTypeId = 0;
      } else {
        this.model.NarrationTypeId = '' + NextPrevoiusData[0].NarrationId + '';
        this.Narration = NextPrevoiusData[0].Narration;
      }
      if (NextPrevoiusData[0].WHState_Id != null) {
        this.model.selectedEditStateItem = NextPrevoiusData[0].WHState_Id;
      } else {
        this.model.selectedEditStateItem = 0;
      }
      setTimeout(() => {
        this.GetPurchaseOrder();
      }, 1500);
      this.model.AmountChargeable = NextPrevoiusData[0].AmountChargeable;
      this.VendorName = NextPrevoiusData[0].VendorCode;
      this.VendorEditGSTList = null;
      this.VendorEditGSTList = JSON.parse(NextPrevoiusData[0].VendorGSTList);
      if (this.VendorEditGSTList != null) {
        if (this.VendorEditGSTList[0].GSTINNo != null && this.VendorEditGSTList[0].GSTINNo != "") {
          if (this.VendorEditGSTList.length == 1) {
            this.VendorGSTList = this.VendorEditGSTList
            this.model.VendorGST = this.VendorEditGSTList[0].GSTINNo;
          }
          else {
            this.VendorGSTList = this.VendorEditGSTList
            this.model.VendorGST = this.VendorEditGSTList[0].GSTINNo;
          }
        } else {
          this.model.VendorGST = 0;
        }
      } else {
        this.model.VendorGST = "0";
      }
      this.VenderFilterAddress = null;
      this.VendorEditFilterAddressList = JSON.parse(NextPrevoiusData[0].VenderFilterAddress);
      if (this.VendorEditFilterAddressList != null) {
        if (this.VendorEditFilterAddressList.length == 1) {
          this.VendorAddress = this.VendorEditFilterAddressList[0].VenAddress;
          this.VenderFilterAddress = this.VendorEditFilterAddressList;
          this.VenAdressDataList = this.VendorEditFilterAddressList;
          this.model.VendorAddressId = NextPrevoiusData[0].VendorAddress_Id;
          this.model.RadioId = this.VendorEditFilterAddressList[0].Id;
        } else {
          var VenderFilterAddressData = this.VendorEditFilterAddressList.filter(
            m => m.Id === parseInt(NextPrevoiusData[0].VendorAddress_Id));
          this.VendorAddress = VenderFilterAddressData[0].VenAddress;
          this.model.VendorAddressId = VenderFilterAddressData[0].Id;
          this.model.RadioId = VenderFilterAddressData[0].Id;
          // this.VenderFilterAddress=this.VendorEditFilterAddressList;
          this.VenAdressDataList = this.VendorEditFilterAddressList;
        }
      }

      this.PlaceofReceiptbyShipper = NextPrevoiusData[0].PlaceofReceiptbyShipper;
      this.VesselFlightNo = NextPrevoiusData[0].VesselFlightNo;
      this.PortofLoading = NextPrevoiusData[0].PortofLoading;
      this.PortofDischarge = NextPrevoiusData[0].PortofDischarge;
      this.AdditionalRemarks = NextPrevoiusData[0].AdditionalRemarks;
      this.model.ActivityDay = NextPrevoiusData[0].ActivityDay;
      this.AmendedDate = NextPrevoiusData[0].AmendedDate;
      this.model.CurrencyType = NextPrevoiusData[0].CurrencyType;
      this.model.CurrencyValue = NextPrevoiusData[0].CurrencyValue;

      this.WHList = null;
      this.WHList = JSON.parse(NextPrevoiusData[0].WHList);
      if (this.WHList != null) {
        this.WHEditList = [];
        this.WHEditList = this.WHList;
        this.model.selectedEditWHItems = '' + NextPrevoiusData[0].WH_Id + ''
        this.WHGSTIN = NextPrevoiusData[0].WHGSTIN;
        this.WHAddress = NextPrevoiusData[0].WHAddress;
      } else {
        this.model.selectedEditWHItems = 0;
      }
      this.model.ddlConsignee = "1",
        this.model.ddlInvoiceTo = "1",
        this.TermsofPayment = NextPrevoiusData[0].TermsofPayment;
      this.OtherReferences = NextPrevoiusData[0].OtherReferences;
      this.TermsofDelivery = NextPrevoiusData[0].TermsofDelivery;
      this.DespatchThrough = NextPrevoiusData[0].DespatchThrough;
      this.dynamicArray = [];
      this.ItemEditData = [];
      this.SignedPoPath = null;
      this.SignedPoPath = NextPrevoiusData[0].SignedPoPath;
      if (this.SignedPoPath != null && this.SignedPoPath != "") {
        this.IsAmendedDisabled = false;
        this.IsSignedPoTrueFile = true;
        this.IsSignedPoFalseFile = false;
      } else {
        this.IsAmendedDisabled = true;
        this.IsSignedPoTrueFile = false;
        this.IsSignedPoFalseFile = true;
      }
      this.TableId = NextPrevoiusData[0].PoId;
      this.ManueId = this.PageMenuId;
      this.CreateName = NextPrevoiusData[0].CreateName;
      this.CreatedDate = NextPrevoiusData[0].CreatedDate;
      this.ModifiedName = NextPrevoiusData[0].ModifiedName;
      this.ModifiedDate = NextPrevoiusData[0].ModifiedDate;
      this.ApprovalList = null;
      this.ApprovalList = JSON.parse(NextPrevoiusData[0].ApprovalStatusList);
      for (let i = 0; i < this.ArrayRoleId?.length; i++) {
        for (let j = 0; j < this.ApprovalList?.length; j++) {
          if (parseInt(this.ArrayRoleId[i]) == this.ApprovalList[j].RoleId) {
            this.IsApprovalstatusbtnhideShow = true;
          }
        }
      }
      if (this.ApprovalList != null) {
        this.ApproveStatusDataList = this.ApprovalList;
      } else {
        this.ApproveStatusDataList = null;
      }
      setTimeout(() => {
        this.GetSendMailDetail();
      }, 1500);
      this.PdfEmailurl = NextPrevoiusData[0].PdfSrc;
    } catch (Error) {
      var objWebErrorLogModel = new WebErrorLogModel();
      objWebErrorLogModel.ErrorBy = this.UserId;
      objWebErrorLogModel.ErrorMsg = Error.message;
      objWebErrorLogModel.ErrorFunction = "BindEditDetails";
      objWebErrorLogModel.ErrorPage = "Podetail";
      this._GlobalErrorHandlerService.handleError(objWebErrorLogModel);
    }
  }

  //#region  Create Purchase Order Pdf
  async CreatePurchaseOrderPdf() {
    try {
      this.ItemPdfEditData = [];
      this.PurchaseOrderPdfData = [];
      this.dynamicArrayAnnexureItemPOPdf = [];
      this.InVoiceToAddress = null;
      this.ConsigneeAddress = null;
      this.CompanyConsigneeAddress = null;
      this.Consignee = null;
      var objItemmodel = new PoSearchModel();
      objItemmodel.PoId = this.model.hiddenPoId// 41442//this.model.hiddenPoId;//37386; 
      objItemmodel.Flag = 'Pdf';
      this.PurchaseOrderPdfData = await
        this._PurchaseOrderService.GetCreatePurchaseOrderPdf(objItemmodel);
      if (this.PurchaseOrderPdfData.Status == 1) {
        if (this.PurchaseOrderPdfData.Data[0] != null && this.PurchaseOrderPdfData.Data[0] != "") {
          // this.model.ddlInvoiceTo = 1;
          // this.model.ddlConsignee = 1;
          if (this.model.ddlInvoiceTo == 1 && this.model.ddlConsignee == 1) {
            this.InVoiceToAddress = this.PurchaseOrderPdfData.Data[0].Consignee;
            this.ConsigneeAddress = this.PurchaseOrderPdfData.Data[0].Consignee;
            this.CompanyConsigneeAddress = this.PurchaseOrderPdfData.Data[0].CompanyWHAddress;
            this.Consignee = 'Consignee';
          } else if (this.model.ddlInvoiceTo == 2 && this.model.ddlConsignee == 2) {
            this.InVoiceToAddress = this.PurchaseOrderPdfData.Data[0].InVoiceTo;
            this.ConsigneeAddress = this.PurchaseOrderPdfData.Data[0].InVoiceTo;
            this.CompanyConsigneeAddress = this.PurchaseOrderPdfData.Data[0].CompanyWHAddress;
            this.Consignee = 'Consignee';
          }
          else if (this.model.ddlInvoiceTo == 1 && this.model.ddlConsignee == 2) {
            this.InVoiceToAddress = this.PurchaseOrderPdfData.Data[0].Consignee;
            this.ConsigneeAddress = this.PurchaseOrderPdfData.Data[0].InVoiceTo;
            this.CompanyConsigneeAddress = this.PurchaseOrderPdfData.Data[0].CompanyWHAddress;
            this.Consignee = 'Consignee';
          }
          else if (this.model.ddlInvoiceTo == 2 && this.model.ddlConsignee == 1) {
            this.InVoiceToAddress = this.PurchaseOrderPdfData.Data[0].InVoiceTo;
            this.ConsigneeAddress = this.PurchaseOrderPdfData.Data[0].Consignee;
            this.CompanyConsigneeAddress = this.PurchaseOrderPdfData.Data[0].CompanyWHAddress;
            this.Consignee = 'Consignee';
          }
          else if (this.model.ddlInvoiceTo == 1 && this.model.ddlConsignee == 3) {
            this.InVoiceToAddress = this.PurchaseOrderPdfData.Data[0].Consignee;
            this.CompanyConsigneeAddress = '';
            this.ConsigneeAddress = '';
            this.Consignee = '';
          }
          else if (this.model.ddlInvoiceTo == 2 && this.model.ddlConsignee == 3) {
            this.InVoiceToAddress = this.PurchaseOrderPdfData.Data[0].InVoiceTo;
            this.CompanyConsigneeAddress = '';
            this.ConsigneeAddress = '';
            this.Consignee = '';
          }
        }

        this.ItemPdfEditData = this.PurchaseOrderPdfData.ItemData;
        this.PdfAnnexureItemData = this.PurchaseOrderPdfData.AnnexureItemData;
        if (this.PurchaseOrderPdfData.ItemData == null) {
          alert('Please fill item  detail');
          return false;
        }
        if (this.ItemPdfEditData.length == 1) {
          this.TableHeight = [0, 240, 0, 0]
        } else if (this.ItemPdfEditData.length == 2) {
          this.TableHeight = [0, 210, 0, 0]
        } else if (this.ItemPdfEditData.length == 3) {
          this.TableHeight = [0, 180, 0, 0]
        } else if (this.ItemPdfEditData.length == 4) {
          this.TableHeight = [0, 150, 0, 0]
        } else if (this.ItemPdfEditData.length == 5) {
          this.TableHeight = [0, 120, 0, 0]
        } else if (this.ItemPdfEditData.length == 6) {
          this.TableHeight = [0, 90, 0, 0]
        } else if (this.ItemPdfEditData.length == 7) {
          this.TableHeight = [0, 60, 0, 0]
        } else if (this.ItemPdfEditData.length == 8) {
          this.TableHeight = [0, 30, 0, 0]
        } else if (this.ItemPdfEditData.length == 9) {
          this.TableHeight = [0, 0, 0, 0]
        } else if (this.ItemPdfEditData.length > 9) {
          this.TableHeight = [0, 500, 0, 0]
        }

        this.dynamicArrayPOPdf = [];
        for (var i = 0, len = this.ItemPdfEditData.length; i < len; i++) {
          var objdynamic = new DynamicItemGrid();
          objdynamic.RowId = this.ItemPdfEditData[i].RowId;
          objdynamic.ItemCode = this.ItemPdfEditData[i].ItemCode;
          objdynamic.ItemName = this.ItemPdfEditData[i].ItemName;
          objdynamic.UnitName = this.ItemPdfEditData[i].UnitName;
          objdynamic.Rate = parseFloat(this.ItemPdfEditData[i].Rate).toFixed(3);
          objdynamic.Qty = this.ItemPdfEditData[i].Qty;
          objdynamic.HSN = this.ItemPdfEditData[i].HSNCode;

          objdynamic.POQty = this.ItemPdfEditData[i].Qty;
          objdynamic.TotalAmount = parseFloat(this.ItemPdfEditData[i].TotalAmount).toFixed(3);
          objdynamic.ItemDescription = this.ItemPdfEditData[i].ItemDescription;
          objdynamic.SubDescription = this.ItemPdfEditData[i].SubDescription;
          this.dynamicArrayPOPdf.push(objdynamic);
        };

        //  if(this.PurchaseOrderPdfData.AnnexureItemData==null)
        //  {
        //  this.dynamicArrayAnnexureItemPOPdf=[];
        //  this.model.Anxpagebreak;
        //  var objDynamicAnxHeaderItemGrid=new DynamicAnxHeaderItemGrid();
        //  objDynamicAnxHeaderItemGrid.SNo;
        //  objDynamicAnxHeaderItemGrid.ItemName;
        //  objDynamicAnxHeaderItemGrid.MakeName;
        //  objDynamicAnxHeaderItemGrid.ItemCode;
        //  objDynamicAnxHeaderItemGrid.Qty;
        //  objDynamicAnxHeaderItemGrid.Rate;
        //  objDynamicAnxHeaderItemGrid.Amount;
        //  objDynamicAnxHeaderItemGrid.SubDescription;
        //  objDynamicAnxHeaderItemGrid.SiteId;
        //  objDynamicAnxHeaderItemGrid.SiteName;
        //  this.AnxHeaderData.push(objDynamicAnxHeaderItemGrid);

        //  }else{
        // var objDynamicAnxHeaderItemGrid=new DynamicAnxHeaderItemGrid();
        //  objDynamicAnxHeaderItemGrid.SNo='S.No';
        //  objDynamicAnxHeaderItemGrid.ItemName='Item Name';
        //  objDynamicAnxHeaderItemGrid.MakeName='Item Make';
        //  objDynamicAnxHeaderItemGrid.ItemCode='Item Code';
        //  objDynamicAnxHeaderItemGrid.Qty='Quantity';
        //  objDynamicAnxHeaderItemGrid.Rate='Rate';
        //  objDynamicAnxHeaderItemGrid.Amount='Amount';
        //  objDynamicAnxHeaderItemGrid.SubDescription='Sub Description';
        //  objDynamicAnxHeaderItemGrid.SiteId='Site Id';
        //  objDynamicAnxHeaderItemGrid.SiteName='Site Name';
        //  this.AnxHeaderData.push(objDynamicAnxHeaderItemGrid);
        //  this.model.Anxpagebreak='after';
        //  this.dynamicArrayAnnexureItemPOPdf=[];
        //  for (var i = 0, len = this.PdfAnnexureItemData.length; i < len; i++) 
        //  {
        //    var objdynamicAnnexure=new DynamicItemGrid();
        //    objdynamicAnnexure.RowId=this.PdfAnnexureItemData[i].RowId;
        //    objdynamicAnnexure.ItemCode=this.PdfAnnexureItemData[i].ItemCode;
        //    objdynamicAnnexure.ItemName=this.PdfAnnexureItemData[i].ItemName;
        //    objdynamicAnnexure.MakeName=this.PdfAnnexureItemData[i].MakeName;
        //    objdynamicAnnexure.Rate=parseFloat(this.PdfAnnexureItemData[i].Rate).toFixed(2);
        //    objdynamicAnnexure.Qty=this.PdfAnnexureItemData[i].Qty;
        //    objdynamicAnnexure.POQty=this.PdfAnnexureItemData[i].Qty;
        //    objdynamicAnnexure.TotalAmount=parseFloat(this.PdfAnnexureItemData[i].TotalAmount).toFixed(2);
        //    objdynamicAnnexure.ItemDescription=this.PdfAnnexureItemData[i].ItemDescription;
        //    objdynamicAnnexure.SubDescription=this.PdfAnnexureItemData[i].SubDescription;
        //    this.dynamicArrayAnnexureItemPOPdf.push(objdynamicAnnexure);
        //    };
        //   }
      }
      this.setHeight();
      //this.generatePDF('download');
    } catch (Error) {
      var objWebErrorLogModel = new WebErrorLogModel();
      objWebErrorLogModel.ErrorBy = this.UserId;
      objWebErrorLogModel.ErrorMsg = Error.message;
      objWebErrorLogModel.ErrorFunction = "CreatePurchaseOrderPdf";
      objWebErrorLogModel.ErrorPage = "Podetail";
      this._GlobalErrorHandlerService.handleError(objWebErrorLogModel);
    }
  }


  generatePDF(action = 'download') {
    var CompanyWHAddress = this.PurchaseOrderPdfData.Data[0].CompanyWHAddress;
    var InVoiceToAddres = this.InVoiceToAddress;
    var Consigne = this.Consignee;
    var CompanyConsigneeAddres = this.CompanyConsigneeAddress;
    var ConsigneeAddres = this.ConsigneeAddress;
    var pono = this.PurchaseOrderPdfData.Data[0].PoNo;
    var poDate = this.PurchaseOrderPdfData.Data[0].Podate;
    var termsofPayment = this.PurchaseOrderPdfData.Data[0].TermsofPayment;
    var despatchThrough = this.PurchaseOrderPdfData.Data[0].DespatchThrough;
    var destination = this.PurchaseOrderPdfData.Data[0].Destination;
    var termsofDelivery = this.PurchaseOrderPdfData.Data[0].TermsofDelivery;
    var vendorName = this.PurchaseOrderPdfData.Data[0].VendorName;
    var VendorAddre = this.PurchaseOrderPdfData.Data[0].VendorAddress;
    if (this.PurchaseOrderPdfData.Data[0].CurrencyType == 1) {
      var PdfCurranyType = '₹';
    } else if (this.PurchaseOrderPdfData.Data[0].CurrencyType == 2) {
      var PdfCurranyType = '$';
    }
    else if (this.PurchaseOrderPdfData.Data[0].CurrencyType == 3) {
      var PdfCurranyType = '€';
    }


    var test = 0;
    var mar = localStorage.getItem('height');
    if (mar != null) {
      mar = localStorage.getItem('height');
    }
    test = parseInt(mar);
    test = test - 30;
    localStorage.setItem('height', '0');
    try {
      var docDefinition = {
        pageSize: 'A4',
        pageMargins: [20, 10, 20, 20],
        defaultStyle: {
          //fontSize  : 12,
          // columnGap : 10
        },
        // Page Layout
        //margin: [0, -20, 0, 0],
        content: {

          // This table will contain ALL content
          table: {
            // Defining the top 2 rows as the "sticky" header rows
            headerRows: 2,
            // One column, full width
            widths: ['*'],
            body: [
              // Header Row One
              // An array with just one "cell"
              [
                {
                  columns: [
                    {
                      width: '100%',
                      text: [
                        { text: 'Purchase Order', fontSize: 12, alignment: 'center', bold: true },
                      ]
                    },
                  ]
                }
              ],
              [
                // Just because I only have one cell, doesn't mean I can't have
                // multiple columns!
                {
                  columns: [
                    {
                      width: 600,
                      table: {
                        body: [
                          [
                            {
                              border: [1, 1, 1, 0],
                              //width: 600,
                              table: {
                                heights: 50,
                                body: [
                                  [
                                    {
                                      border: [0, 0, 0, 0],
                                      columns: [
                                        {
                                          image: `snow`, width: 40,
                                        },
                                        {
                                          width: 219,
                                          fontSize: 9,
                                          text: [
                                            'Invoice To',
                                            '\n',
                                            { text: `${CompanyWHAddress}`, fontSize: 11, bold: true, },
                                            '\n',
                                            { text: `${InVoiceToAddres}`, fontSize: 10, },
                                            '\n',
                                          ]
                                        },
                                      ]
                                    },

                                  ],

                                  [
                                    {
                                      border: [0, 1, 0, 0],
                                      columns: [
                                        {
                                          width: 240,
                                          text: [
                                            { text: `${Consigne}`, fontSize: 9 },
                                            '\n',
                                            { text: `${CompanyConsigneeAddres}`, fontSize: 11, bold: true },
                                            '\n',
                                            { text: `${ConsigneeAddres}`, fontSize: 10, height: 500, },
                                            '\n',
                                          ]
                                        },
                                        {
                                          text: '', width: 0,
                                        },
                                      ]
                                    },
                                  ],
                                ]
                              }
                            },

                            {
                              border: [1, 1, 1, 0],
                              //width: 200,
                              table: {
                                body: [
                                  [
                                    {
                                      border: [0, 0, 0, 1],
                                      table: {
                                        body: [
                                          [
                                            {
                                              border: [0, 0, 1, 0],
                                              columns: [
                                                {
                                                  width: 120,
                                                  fontSize: 9,
                                                  text: [
                                                    'Purchase Order No',
                                                    '\n',
                                                    { text: `${pono}`, fontSize: 10, bold: true, },
                                                  ]
                                                },
                                              ]
                                            },

                                            {
                                              border: [0, 0, 0, 0],
                                              columns: [
                                                {
                                                  width: 110,
                                                  fontSize: 9,
                                                  text: [
                                                    'Purchase Order Date',
                                                    '\n',
                                                    { text: `${poDate}`, fontSize: 10, bold: true },
                                                  ]
                                                },
                                              ]
                                            },
                                          ],
                                        ]
                                      }
                                    },
                                  ],

                                  [
                                    {
                                      border: [0, 0, 0, 1],
                                      table: {
                                        body: [
                                          [
                                            {
                                              border: [0, 0, 1, 0],
                                              columns: [
                                                {
                                                  width: 120,
                                                  fontSize: 9,
                                                  text: [
                                                    'Payment Terms',
                                                    '\n',
                                                    { text: `${termsofPayment}`, fontSize: 10, bold: true },
                                                  ]
                                                },
                                              ]
                                            },

                                            {
                                              border: [0, 0, 0, 0],
                                              columns: [
                                                {
                                                  width: 110,
                                                  fontSize: 9,
                                                  text: [
                                                    'Dispatch Thru',
                                                    '\n',
                                                    { text: `${despatchThrough}`, fontSize: 10, bold: true, },
                                                  ]
                                                },
                                              ]
                                            },
                                          ],

                                        ]
                                      }
                                    },
                                  ],

                                  [
                                    {
                                      border: [0, 0, 0, 1],
                                      table: {
                                        body: [
                                          [
                                            {
                                              border: [0, 0, 1, 0],
                                              columns: [
                                                {
                                                  width: 120,
                                                  fontSize: 9,
                                                  text: [
                                                    'Destination',
                                                    '\n',
                                                    { text: `${destination}`, fontSize: 10, bold: true },
                                                  ]
                                                },
                                              ]
                                            },

                                            {
                                              border: [0, 0, 0, 0],
                                              columns: [
                                                {
                                                  width: 110,
                                                  fontSize: 9,
                                                  text: [
                                                    'Delivery Terms',
                                                    '\n',
                                                    { text: `${termsofDelivery}`, fontSize: 10, bold: true, },
                                                  ]
                                                },
                                              ]
                                            },
                                          ],

                                        ]
                                      }
                                    },
                                  ],

                                  [
                                    {
                                      border: [0, 0, 0, 0],
                                      table: {
                                        // heights:123,
                                        body: [
                                          [
                                            {
                                              border: [0, 0, 0, 0],
                                              columns: [
                                                {
                                                  width: 230,
                                                  fontSize: 9,
                                                  text: [
                                                    'Supplier',
                                                    '\n',
                                                    { text: `${vendorName}`, fontSize: 11, bold: true },
                                                    '\n',
                                                    { text: `${VendorAddre}`, alignment: 'justified', fontSize: 10, },
                                                    '\n',
                                                  ]
                                                },
                                              ]
                                            },

                                          ],
                                        ]
                                      }
                                    },
                                  ],
                                ]
                              }
                            },

                          ]
                        ]
                      }
                    }
                  ]
                },
              ],




              // Now you can break your content out into the remaining rows.
              // Or you could have one row with one cell that contains
              // all of your content

              // Content Row(s)

              [{
                stack: [
                  // Content
                  {


                    margin: [0, 0, 0, 0],
                    style: 'TableHeader',
                    table: {
                      headerRows: 1,
                      widths: ['auto', '*', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto'],
                      body: [
                        [{ text: 'S.No', bold: true }, { text: 'Description of Goods', bold: true, alignment: 'center' }, { text: 'HSN Code', bold: true, alignment: 'center' }, { text: 'Part No', bold: true, alignment: 'center' }, { text: 'UOM', bold: true, alignment: 'center' }, { text: 'Quantity', bold: true, alignment: 'center' }, { text: 'Rate', bold: true, alignment: 'center' }, { text: 'Amount', bold: true, alignment: 'center' }],
                        ...this.dynamicArrayPOPdf.map(p => ([{ text: p.RowId }, { text: [{ text: p.ItemDescription }, '\n', { text: p.SubDescription, italics: true }] }, { text: p.HSN, alignment: 'center' }, { text: p.ItemCode, alignment: 'center' }, { text: p.UnitName, alignment: 'center' }, { text: p.POQty, alignment: 'center' }, { text: this._Commonservices.thousands_separators(p.Rate), alignment: 'center' }, { text: this._Commonservices.thousands_separators(p.TotalAmount), alignment: 'center' }])),
                        [{}, { text: '\n\n', colSpan: 1, margin: [0, test, 0, 0] }, { text: '' }, { text: '' }, { text: '' }, { text: '' }, { text: '' }, { text: '' }],
                        [{}, { text: 'Total Amount', colSpan: 1, alignment: 'right', bold: true }, { text: '' }, { text: '' }, { text: '' }, { text: `${this.PurchaseOrderPdfData.Data[0].Quantity}`, alignment: 'center', bold: true }, { text: '' },
                        { text: this._Commonservices.thousands_separators(`${this.PurchaseOrderPdfData.Data[0].GrossTotal.toFixed(2)}`) + `${PdfCurranyType}`, bold: true }]
                      ]
                    }
                  },

                  {
                    //pageBreak: `${this.model.Anxpagebreak}`,

                    table: {
                      body: [
                        [
                          {
                            border: [1, 0, 1, 0],
                            table: {
                              body: [
                                [
                                  {
                                    border: [0, 0, 0, 0],
                                    columns: [
                                      {
                                        fontSize: 9,
                                        width: 408,
                                        text: [
                                          'Amount Chargeable (in words)',
                                          '\n',
                                          { text: `${this.PurchaseOrderPdfData.Data[0].AmountChargeable}`, fontSize: 10, bold: true, },
                                        ]
                                      },
                                    ]
                                  },

                                  {
                                    border: [0, 0, 0, 0],
                                    columns: [
                                      {
                                        fontSize: 9,
                                        width: 110,
                                        alignment: 'right', italics: true,
                                        text: [
                                          'E. & O.E',
                                          '\n',
                                          //  {text: `${this.PurchaseOrderPdfData.Data[0].AmountChargeable}`, fontSize:10, bold:true,},
                                        ]
                                      },
                                    ]
                                  },
                                ],
                              ]
                            }
                          },
                        ],

                        [

                          {
                            border: [1, 0, 1, 0],
                            table: {
                              body: [
                                [
                                  {
                                    border: [0, 0, 0, 0],
                                    columns: [
                                      {
                                        fontSize: 9,
                                        width: 515,
                                        text: [
                                          { text: 'Remarks:', bold: true, fontSize: 11, decoration: 'underline', italics: true, },
                                          '\n',
                                          { text: `${this.PurchaseOrderPdfData.Data[0].Narration}`, alignment: 'justified', fontSize: 10, },
                                        ]
                                      },
                                    ]
                                  },
                                ],
                              ]
                            }
                          },
                        ],

                        [
                          {
                            border: [1, 0, 1, 0],
                            table: {
                              body: [
                                [
                                  {
                                    border: [0, 0, 0, 0],
                                    columns: [
                                      {
                                        fontSize: 10,
                                        width: 246,
                                        bold: true,
                                        text: `Company’s PAN     :      ${this.PurchaseOrderPdfData.Data[0].PanNo}`,
                                      },
                                    ]
                                  },
                                ],
                              ]
                            }
                          },
                        ],



                        [
                          {
                            border: [1, 0, 1, 1],
                            table: {
                              body: [
                                [
                                  {
                                    border: [0, 0, 0, 0],
                                    columns: [
                                      {
                                        fontSize: 9,
                                        width: 320,
                                        text: [
                                          { text: 'Additional Information:', bold: true, fontSize: 11, decoration: 'underline', italics: true, },
                                          '\n',
                                          { text: `${this.PurchaseOrderPdfData.Data[0].AdditionalRemarks}`, alignment: 'justify', fontSize: 10, },
                                        ]
                                      },
                                    ]
                                  },

                                  {
                                    border: [1, 1, 0, 0],
                                    height: '-10',
                                    columns: [
                                      {
                                        fontSize: 10,
                                        width: 185,
                                        alignment: 'right',
                                        text: [
                                          { text: `for ${this.PurchaseOrderPdfData.Data[0].CompanyWHAddress}`, },
                                          // 'for AST Telecom Solar Pvt Ltd',
                                          '\n\n',
                                          { text: `Authorised Signatory`, fontSize: 8, },
                                        ]
                                      },
                                    ]
                                  },
                                ],
                              ]
                            }
                          },
                        ],
                      ]
                    }
                  },


                ]
              }],
            ]
          },



          // Table Styles

          layout: {
            hLineWidth: function (i, node) { return (i === 1 || i === 2) ? 1 : 0; },
            vLineWidth: function (i, node) { return 0; },
            hLineColor: function (i, node) { return (i === 1 || i === 2) ? 'white' : '#000'; },
            vLineColor: function (i, node) { return '#000' },
            paddingBottom: function (i, node) {
              switch (i) {
                case 0:
                  return 10;
                case 1:
                  return 0;
                default:
                  return 0;
              }
            },
            paddingTop: function (i, node) {
              switch (i) {
                case 0:
                  return 0;
                case 1:
                  return 0;
                default:
                  return 0;
              }
            },

          },



        },
        pageBreakBefore: function (currentNode, followingNodesOnPage, nodesOnNextPage, previousNodesOnPage) {

          var lnt = followingNodesOnPage.length;
          lnt = lnt - 1;
          //var space= followingNodesOnPage[lnt].startPosition.top;
          // var pageInnerHeight=followingNodesOnPage[lnt].startPosition.pageInnerHeight;
          // margs=400//-space;
          return ((currentNode.headlineLevel == 1 || currentNode.headlineLevel == 2) && followingNodesOnPage.length <= 2);
        },
        // pageBreakBefore: function(currentNode, followingNodesOnPage, nodesOnNextPage, previousNodesOnPage) {
        //   debugger;
        //   var pageInnerHeight = currentNode.startPosition.pageInnerHeight;
        //   var top = (currentNode.startPosition.top) ? currentNode.startPosition.top : 0;
        //   var footerHeight = 30;
        //   var nodeHeight = 0;
        //   if (followingNodesOnPage && followingNodesOnPage.length) {
        //     nodeHeight = followingNodesOnPage[0].startPosition.top - top;
        //   }

        //   if (currentNode.headlineLevel === 'footer') return false;

        //   return (currentNode.image && (top + nodeHeight + footerHeight > pageInnerHeight))
        //       || (currentNode.headlineLevel === 'longField' && (top + nodeHeight + footerHeight > pageInnerHeight))
        //       || currentNode.startPosition.verticalRatio >= 0.95;
        // },
        styles: {
          pageHeader: {
            fontSize: 9
          },
          header: {
            //margin: [25, 10, 25, 5]
          },
          TableHeader: {
            fontSize: 10,
            border: [0, 0, 0, 1],
          },

          TableHeight: {
          },

          AddInfo: {
            decoration: 'underline',
            fontSize: 9,
          }

        },
        images: {
          snow: `${this.PurchaseOrderPdfData.Data[0].Logo}`,
          //snow: 'http://localhost:4200/assets/logo.jpg',
          //snow: 'http://scm.astnoc.com/assets/logo.jpg'
        },

        // Page Footer

        footer: function (currentPage, pageCount) {
          return {
            alignment: 'center',
            text: currentPage.toString() + ' of ' + pageCount,
            fontSize: 8
          }
        },

      };


      if (action === 'open') {
        pdfMake.createPdf(docDefinition).download();
      } else if (action === 'print') {
        pdfMake.createPdf(docDefinition).print();
      } else {
        // pdfMake.createPdf(docDefinition).open();
        // //pdfMake.createPdf(docDefinition).download();
        pdfMake.createPdf(docDefinition).getDataUrl(function (dataURL) {
          PDFdata = dataURL;
        });
        setTimeout(() => {
          this.SavePOPdf();
        }, 1200);
      }


    } catch (Error) {
      this._GlobalErrorHandlerService.handleError(Error);
    }


  }

  setHeight() {
    this.button = 'Processing';
    this.IsCreatePOPdf = true;
    var CompanyWHAddress = this.PurchaseOrderPdfData.Data[0].CompanyWHAddress;
    var InVoiceToAddres = this.InVoiceToAddress;
    var Consigne = this.Consignee;
    var CompanyConsigneeAddres = this.CompanyConsigneeAddress;
    var ConsigneeAddres = this.ConsigneeAddress;
    var pono = this.PurchaseOrderPdfData.Data[0].PoNo;
    var poDate = this.PurchaseOrderPdfData.Data[0].Podate;
    var termsofPayment = this.PurchaseOrderPdfData.Data[0].TermsofPayment;
    var despatchThrough = this.PurchaseOrderPdfData.Data[0].DespatchThrough;
    var destination = this.PurchaseOrderPdfData.Data[0].Destination;
    var termsofDelivery = this.PurchaseOrderPdfData.Data[0].TermsofDelivery;
    var Warranty = this.PurchaseOrderPdfData.Data[0].IsWarranty;
    
    var vendorName = this.PurchaseOrderPdfData.Data[0].VendorName;
    var VendorAddre = this.PurchaseOrderPdfData.Data[0].VendorAddress
    if (this.PurchaseOrderPdfData.Data[0].CurrencyType == 1) {
      var PdfCurranyType = '₹';
    } else if (this.PurchaseOrderPdfData.Data[0].CurrencyType == 2) {
      var PdfCurranyType = '$';
    }
    else if (this.PurchaseOrderPdfData.Data[0].CurrencyType == 3) {
      var PdfCurranyType = '€';
    }
    var nodeHeights = 0;

    try {
      var docDefinition = {
        pageSize: 'A4',
        pageMargins: [20, 10, 20, 20],
        defaultStyle: {
          //fontSize  : 12,
          // columnGap : 10
        },
        // Page Layout
        //margin: [0, -20, 0, 0],
        content: {

          // This table will contain ALL content
          table: {
            // Defining the top 2 rows as the "sticky" header rows
            headerRows: 2,
            // One column, full width
            widths: ['*'],
            body: [
              // Header Row One
              // An array with just one "cell"
              [
                {
                  columns: [
                    {
                      width: '100%',
                      text: [
                        { text: 'Purchase Order', fontSize: 12, alignment: 'center', bold: true },
                      ]
                    },
                  ]
                }
              ],
              [
                // Just because I only have one cell, doesn't mean I can't have
                // multiple columns!
                {
                  columns: [
                    {
                      table: {
                        body: [
                          [
                            {
                              border: [1, 1, 1, 0],
                              //width: 600,
                              table: {
                                heights: 50,
                                body: [
                                  [
                                    {
                                      border: [0, 0, 0, 0],
                                      columns: [
                                        {
                                          image: `snow`, width: 40,
                                        },
                                        {
                                          fontSize: 9,
                                          text: [
                                            'Invoice To',
                                            '\n',
                                            { text: `${CompanyWHAddress}`, fontSize: 11, bold: true, width: 10, },
                                            '\n',
                                            { text: `${InVoiceToAddres}`, fontSize: 10, width: 10, },
                                            '\n',
                                          ]
                                        },
                                      ]
                                    },

                                  ],

                                  [
                                    {
                                      border: [0, 1, 0, 0],
                                      columns: [
                                        {
                                          text: [
                                            { text: `${Consigne}`, fontSize: 9 },
                                            '\n',
                                            { text: `${CompanyConsigneeAddres}`, fontSize: 11, bold: true },
                                            '\n',
                                            { text: `${ConsigneeAddres}`, fontSize: 10, width: 10, height: 500 },
                                            '\n',
                                          ]
                                        },
                                        {
                                          text: '', width: 0,
                                        },
                                      ]
                                    },
                                  ],
                                ]
                              }
                            },

                            {
                              border: [1, 1, 1, 0],
                              width: 200,
                              table: {

                                body: [
                                  [
                                    {
                                      border: [0, 0, 0, 1],
                                      table: {
                                        body: [
                                          [
                                            {
                                              border: [0, 0, 1, 0],
                                              columns: [
                                                {
                                                  width: 120,
                                                  fontSize: 9,
                                                  text: [
                                                    'Purchase Order No',
                                                    '\n',
                                                    { text: `${pono}`, fontSize: 10, bold: true, },
                                                  ]
                                                },
                                              ]
                                            },

                                            {
                                              border: [0, 0, 0, 0],
                                              columns: [
                                                {
                                                  width: 110,
                                                  fontSize: 9,
                                                  text: [
                                                    'Purchase Order Date',
                                                    '\n',
                                                    { text: `${poDate}`, fontSize: 10, bold: true },
                                                  ]
                                                },
                                              ]
                                            },
                                          ],
                                        ]
                                      }
                                    },
                                  ],

                                  [
                                    {
                                      border: [0, 0, 0, 1],
                                      table: {
                                        body: [
                                          [
                                            {
                                              border: [0, 0, 1, 0],
                                              columns: [
                                                {
                                                  width: 120,
                                                  fontSize: 9,
                                                  text: [
                                                    'Payment Terms',
                                                    '\n',
                                                    { text: `${termsofPayment}`, fontSize: 10, bold: true },
                                                  ]
                                                },
                                              ]
                                            },

                                            {
                                              border: [0, 0, 0, 0],
                                              columns: [
                                                {
                                                  width: 110,
                                                  fontSize: 9,
                                                  text: [
                                                    'Dispatch Thru',
                                                    '\n',
                                                    { text: `${despatchThrough}`, fontSize: 10, bold: true, },
                                                  ]
                                                },
                                              ]
                                            },
                                          ],

                                        ]
                                      }
                                    },
                                  ],

                                  [
                                    {
                                      border: [0, 0, 0, 1],
                                      table: {
                                        body: [
                                          [
                                            {
                                              border: [0, 0, 1, 0],
                                              columns: [
                                                {
                                                  width: 100,
                                                  fontSize: 9,
                                                  text: [
                                                    'Destination',
                                                    '\n',
                                                    { text: `${destination}`, fontSize: 10, bold: true },
                                                  ]
                                                },
                                              ]
                                            },

                                            {
                                              border: [0, 0, 0, 0],
                                              columns: [
                                                {
                                                  width: 90,
                                                  fontSize: 9,
                                                  text: [
                                                    'Delivery Terms',
                                                    '\n',
                                                    { text: `${termsofDelivery}`, fontSize: 10, bold: true, },
                                                  ]
                                                },
                                              ]
                                            },
                                            {
                                              border: [0, 0, 1, 0],
                                              columns: [
                                                {
                                                  width: 40,
                                                  fontSize: 9,
                                                  text: [
                                                    'Warranty',
                                                    '\n',
                                                    { text: `${Warranty}`, fontSize: 10, bold: true },
                                                  ]
                                                },
                                              ]
                                            },
                                          ],

                                        ]
                                      }
                                    },
                                  ],

                                  [
                                    {
                                      border: [0, 0, 0, 0],
                                      table: {
                                        // heights:123,
                                        body: [
                                          [
                                            {
                                              border: [0, 0, 0, 0],
                                              columns: [
                                                {
                                                  width: 230,
                                                  fontSize: 9,
                                                  text: [
                                                    'Supplier',
                                                    '\n',
                                                    { text: `${vendorName}`, fontSize: 11, bold: true },
                                                    '\n',
                                                    { text: `${VendorAddre}`, alignment: 'justified', fontSize: 10, },
                                                    '\n',
                                                  ]
                                                },
                                              ]
                                            },

                                          ],
                                        ]
                                      }
                                    },
                                  ],
                                ]
                              }
                            },
                          ]
                        ]
                      }
                    }
                  ]
                },
              ],




              // Now you can break your content out into the remaining rows.
              // Or you could have one row with one cell that contains
              // all of your content

              // Content Row(s)

              [{
                stack: [
                  // Content
                  {
                    margin: [0, 0, 0, 0],
                    style: 'TableHeader',
                    table: {
                      // heights: function (row,currentNode, followingNodesOnPage) {
                      //   return (row + 1) * 25;
                      // },
                      headerRows: 1,
                      widths: ['auto', '*', 'auto', 'auto', 'auto', 'auto', 'auto'],
                      body: [
                        [{ text: 'S.No', bold: true }, { text: 'Description of Goods', bold: true, alignment: 'center' }, { text: 'Part No', bold: true, alignment: 'center' }, { text: 'UOM', bold: true, alignment: 'center' }, { text: 'Quantity', bold: true, alignment: 'center' }, { text: 'Rate', bold: true, alignment: 'center' }, { text: 'Amount', bold: true, alignment: 'center' }],
                        ...this.dynamicArrayPOPdf.map(p => ([{ text: p.RowId }, { text: [{ text: p.ItemDescription }, '\n', { text: p.SubDescription, italics: true }] }, { text: p.ItemCode, alignment: 'center' }, { text: p.UnitName, alignment: 'center' }, { text: p.POQty, alignment: 'center' }, { text: this._Commonservices.thousands_separators(p.Rate), alignment: 'center' }, { text: this._Commonservices.thousands_separators(p.TotalAmount), alignment: 'center' }])),
                        [{}, { text: '\n\n', colSpan: 1 }, { text: '' }, { text: '' }, { text: '' }, { text: '' }, { text: '' }],
                        [{}, { text: 'Total Amount', colSpan: 1, alignment: 'right', bold: true }, { text: '' }, { text: '' }, { text: `${this.PurchaseOrderPdfData.Data[0].Quantity}`, alignment: 'center', bold: true }, { text: '' },
                        { text: this._Commonservices.thousands_separators(`${this.PurchaseOrderPdfData.Data[0].GrossTotal.toFixed(2)}`) + `${PdfCurranyType}`, bold: true }]
                      ]
                    }
                  },

                  {
                    //pageBreak: `${this.model.Anxpagebreak}`,

                    table: {
                      body: [
                        [
                          {
                            border: [1, 0, 1, 0],
                            table: {
                              body: [
                                [
                                  {
                                    border: [0, 0, 0, 0],
                                    columns: [
                                      {
                                        fontSize: 9,
                                        width: 408,
                                        text: [
                                          'Amount Chargeable (in words)',
                                          '\n',
                                          { text: `${this.PurchaseOrderPdfData.Data[0].AmountChargeable}`, fontSize: 10, bold: true, },
                                        ]
                                      },
                                    ]
                                  },

                                  {
                                    border: [0, 0, 0, 0],
                                    columns: [
                                      {
                                        fontSize: 9,
                                        width: 110,
                                        alignment: 'right', italics: true,
                                        text: [
                                          'E. & O.E',
                                          '\n',
                                          //  {text: `${this.PurchaseOrderPdfData.Data[0].AmountChargeable}`, fontSize:10, bold:true,},
                                        ]
                                      },
                                    ]
                                  },
                                ],
                              ]
                            }
                          },
                        ],

                        [

                          {
                            border: [1, 0, 1, 0],
                            table: {
                              body: [
                                [
                                  {
                                    border: [0, 0, 0, 0],
                                    columns: [
                                      {
                                        fontSize: 9,
                                        width: 515,
                                        text: [
                                          { text: 'Remarks:', bold: true, fontSize: 11, decoration: 'underline', italics: true, },
                                          '\n',
                                          { text: `${this.PurchaseOrderPdfData.Data[0].Narration}`, alignment: 'justified', fontSize: 10, },
                                        ]
                                      },
                                    ]
                                  },
                                ],
                              ]
                            }
                          },
                        ],

                        [
                          {
                            border: [1, 0, 1, 0],
                            table: {
                              body: [
                                [
                                  {
                                    border: [0, 0, 0, 0],
                                    columns: [
                                      {
                                        fontSize: 10,
                                        width: 246,
                                        bold: true,
                                        text: `Company’s PAN     :      ${this.PurchaseOrderPdfData.Data[0].PanNo}`,
                                      },
                                    ]
                                  },
                                ],
                              ]
                            }
                          },
                        ],



                        [
                          {
                            border: [1, 0, 1, 1],
                            table: {
                              body: [
                                [
                                  {
                                    border: [0, 0, 0, 0],
                                    columns: [
                                      {
                                        fontSize: 9,
                                        width: 320,
                                        text: [
                                          { text: 'Additional Information:', bold: true, fontSize: 11, decoration: 'underline', italics: true, },
                                          '\n',
                                          { text: `${this.PurchaseOrderPdfData.Data[0].AdditionalRemarks}`, alignment: 'justify', fontSize: 10, },
                                        ]
                                      },
                                    ]
                                  },

                                  {
                                    border: [1, 1, 0, 0],
                                    height: '-10',
                                    columns: [
                                      {
                                        fontSize: 10,
                                        width: 185,
                                        alignment: 'right',
                                        text: [
                                          { text: `for ${this.PurchaseOrderPdfData.Data[0].CompanyWHAddress}`, },
                                          // 'for AST Telecom Solar Pvt Ltd',
                                          '\n\n',
                                          { text: `Authorised Signatory`, fontSize: 8, },
                                        ]
                                      },
                                    ]
                                  },
                                ],
                              ]
                            }
                          },
                        ],
                      ]
                    }
                  },


                ]
              }],
            ]
          },



          // Table Styles

          layout: {
            hLineWidth: function (i, node) { return (i === 1 || i === 2) ? 1 : 0; },
            vLineWidth: function (i, node) { return 0; },
            hLineColor: function (i, node) { return (i === 1 || i === 2) ? 'white' : '#000'; },
            vLineColor: function (i, node) { return '#000' },
            paddingBottom: function (i, node) {
              switch (i) {
                case 0:
                  return 10;
                case 1:
                  return 0;
                default:
                  return 0;
              }
            },
            paddingTop: function (i, node) {
              switch (i) {
                case 0:
                  return 0;
                case 1:
                  return 0;
                default:
                  return 0;
              }
            },

          },
        },
        pageBreakBefore: function (currentNode, followingNodesOnPage, nodesOnNextPage, previousNodesOnPage) {
          var pageInnerHeight = currentNode.startPosition.pageInnerHeight;
          var top = (currentNode.startPosition.top);
          var footerHeight = 30;
          if (currentNode.hasOwnProperty('table')) {
          }
          if (followingNodesOnPage && followingNodesOnPage.length) {
            nodeHeights += followingNodesOnPage[0].startPosition.top - top;

            localStorage.setItem('height', (pageInnerHeight - nodeHeights).toString());
            console.log(pageInnerHeight - nodeHeights);
          }
          return ((currentNode.headlineLevel == 1 || currentNode.headlineLevel == 2) && followingNodesOnPage.length <= 2);
        },
        // pageBreakBefore: function(currentNode, followingNodesOnPage, nodesOnNextPage, previousNodesOnPage) {
        //   debugger;
        //   var pageInnerHeight = currentNode.startPosition.pageInnerHeight;
        //   var top = (currentNode.startPosition.top) ? currentNode.startPosition.top : 0;
        //   var footerHeight = 30;
        //   var nodeHeight = 0;
        //   if (followingNodesOnPage && followingNodesOnPage.length) {
        //     nodeHeight = followingNodesOnPage[0].startPosition.top - top;
        //   }

        //   if (currentNode.headlineLevel === 'footer') return false;

        //   return (currentNode.image && (top + nodeHeight + footerHeight > pageInnerHeight))
        //       || (currentNode.headlineLevel === 'longField' && (top + nodeHeight + footerHeight > pageInnerHeight))
        //       || currentNode.startPosition.verticalRatio >= 0.95;
        // },
        styles: {
          pageHeader: {
            fontSize: 9
          },
          header: {
            //margin: [25, 10, 25, 5]
          },
          TableHeader: {
            fontSize: 10,
            border: [0, 0, 0, 1],
          },

          TableHeight: {
          },

          AddInfo: {
            decoration: 'underline',
            fontSize: 9,
          }

        },
        images: {
          snow: `${this.PurchaseOrderPdfData.Data[0].Logo}`,
          // snow: 'http://localhost:4200/assets/logo.jpg',
          //snow: 'http://scm.astnoc.com/assets/logo.jpg'
        },

        // Page Footer

        footer: function (currentPage, pageCount) {
          return {
            alignments: 'center',
            text: currentPage.toString() + ' of ' + pageCount,
            fontSize: 8
          }
        },
      };
      setTimeout(() => {
        this.generatePDF();
        this.button = 'Generate PO Pdf';
        this.IsCreatePOPdf = false;
      }, 1000);
      var generatedDoc = pdfMake.createPdf(docDefinition);
      generatedDoc.getBuffer((buffer) => {
        //fs.writeFileSync('file.pdf',buffer)
      })
      //pdfMake.createPdf(docDefinition).download();
    } catch (Error) {
      this._GlobalErrorHandlerService.handleError(Error);
    }
  }

  SavePOPdf() {
    try {
      var objPOPdfModel = new POPdfModel();
      objPOPdfModel.UserId = this.UserId;
      objPOPdfModel.POId = this.model.hiddenPoId;
      objPOPdfModel.PONo = this.PurchaseOrderPdfData.Data[0].PoNo;
      objPOPdfModel.POPdf = PDFdata;
      this._PurchaseOrderService.SavePoPDF(objPOPdfModel).subscribe(data => {
        if (data.Status == 1) {
          alert('PO has been generated');
        } else if (data.Status == 2) {
          alert('PO does not generated');
        }
      });
    } catch (Error) {
      var objWebErrorLogModel = new WebErrorLogModel();
      objWebErrorLogModel.ErrorBy = this.UserId;
      objWebErrorLogModel.ErrorMsg = Error.message;
      objWebErrorLogModel.ErrorFunction = "CreatePurchaseOrderPdf";
      objWebErrorLogModel.ErrorPage = "Podetail";
      this._GlobalErrorHandlerService.handleError(objWebErrorLogModel);
    }
  }

  //////#endregion


  async GetPurchaseOrder() {
    try {
      this.ItemEditData = [];
      var objItemmodel = new PoSearchModel();
      objItemmodel.PoId = this.rowData[this.rowdatacurrentindex].PoId;
      objItemmodel.Flag = 'ItemDetail';
      this.PurchaseListData = await
        this._PurchaseOrderService.GetPurchaseOrderList2(objItemmodel);
      if (this.PurchaseListData.Status == 1) {
        if (this.PurchaseListData.Data != null && this.PurchaseListData.Data != "") {
          this.ItemEditData = this.PurchaseListData.Data;
          if (this.ItemEditData.length > 0 || this.ItemEditData.length != "") {
            this.dynamicArray = [];
            for (var i = 0, len = this.ItemEditData.length; i < len; i++) {
              var objdynamic = new DynamicItemGrid();
              objdynamic.ItemCode = this.ItemEditData[i].ItemCode;
              objdynamic.ItemId = this.ItemEditData[i].ItemId;
              objdynamic.ItemNameId = this.ItemEditData[i].ItemNameId;
              objdynamic.ItemName = this.ItemEditData[i].ItemName;
              // objdynamic.UnitName = this.ItemEditData[i].UnitName;
              objdynamic.IsWarrantyReq = this.ItemEditData[i].IsWarrantyReq;
              objdynamic.UnitList = JSON.parse(this.ItemEditData[i].UnitList)
              objdynamic.UnitName = this.ItemEditData[i].UnitMaster_Id;
              if (this.ItemEditData[i].IsWarranty != null) {
                objdynamic.IsWarranty = this.ItemEditData[i].IsWarranty;
              } else {
                objdynamic.IsWarranty = "2";
              }
              objdynamic.Month = this.ItemEditData[i].WarrantyMonth;
              objdynamic.Rate = parseFloat(this.ItemEditData[i].Rate).toFixed(3);
              objdynamic.Qty = this.ItemEditData[i].Qty;
              objdynamic.TotalAmount = parseFloat(this.ItemEditData[i].TotalAmount).toFixed(2);
              objdynamic.GetTotalAmount = this._Commonservices.thousands_separators(this.ItemEditData[i].TotalAmount.toFixed(2));
              objdynamic.ItemDescription = this.ItemEditData[i].ItemDescription;
              objdynamic.SubDescription = this.ItemEditData[i].SubDescription;
              objdynamic.ItemMakeId = this.ItemEditData[i].MakeMaster_Id;
              objdynamic.ValueSiteName = this.ItemEditData[i].SiteName;
              objdynamic.ValueCustomerSite = this.ItemEditData[i].CustomerSiteId;
              if (this.ItemEditData[i].SiteId != null || this.ItemEditData[i].SiteId != 0) {
                objdynamic.SiteId = this.ItemEditData[i].SiteId;
              }
              if (this.ItemEditData[i].CustomerId != null || this.ItemEditData[i].CustomerId != 0) {
                objdynamic.CustomerId = this.ItemEditData[i].CustomerId;
              }
              objdynamic.SiteName = this.ItemEditData[i].SiteName;
              objdynamic.CustomerSiteId = this.ItemEditData[i].CustomerSiteId;
              objdynamic.ReasonCode = this.ItemEditData[i].ReasonCode;
              objdynamic.CustomerCode = this.ItemEditData[i].CustomerCode;

              objdynamic.EditItemCode = [];
              objdynamic.EditItemMake = [];
              objdynamic.EditItemMake = JSON.parse(this.ItemEditData[i].ItemMakeList)
              objdynamic.EditItemCode = JSON.parse(this.ItemEditData[i].ItemCodeList)
              this.dynamicArray.push(objdynamic);
            };
            this.fnBindItemGrossToatl();
          }
        }
      }

    } catch (Error) {
      var objWebErrorLogModel = new WebErrorLogModel();
      objWebErrorLogModel.ErrorBy = this.UserId;
      objWebErrorLogModel.ErrorMsg = Error.message;
      objWebErrorLogModel.ErrorFunction = "GetPurchaseOrder";
      objWebErrorLogModel.ErrorPage = "Podetail";
      this._GlobalErrorHandlerService.handleError(objWebErrorLogModel);
    }
  }

  GetSendMailDetail() {
    debugger
    try {
      // this.Loader.show();  
      this.EmailData = [];
      var objVendormodel = new VendorOrWhModel();
      objVendormodel.Id = this.EditPoId;
      objVendormodel.flag = 'EmailMaster';
      this._Commonservices.getVendorOrWh(objVendormodel).subscribe(Email => {
        if (Email.Status == 1) {
          if (Email.Data != null || Email.Data != "") {
            this.Loader.hide();
            this.EmailData = Email.Data;
            $('#custom-tabs-three-outbox-tab').css('background-color', '#2196f3');
          }
        } else {
          this.Loader.hide();
          $('#custom-tabs-three-outbox-tab').css('background-color', '#F9F9F9');
        }

      });
    } catch (Error) {
      var objWebErrorLogModel = new WebErrorLogModel();
      objWebErrorLogModel.ErrorBy = this.UserId;
      objWebErrorLogModel.ErrorMsg = Error.message;
      objWebErrorLogModel.ErrorFunction = "GetSendMailDetail";
      objWebErrorLogModel.ErrorPage = "Podetail";
      this._GlobalErrorHandlerService.handleError(objWebErrorLogModel);
    }
  }
  fnNextPOList() {
    try {
      this.rowdatacurrentindex = this.rowdatacurrentindex + 1;
      var poId = this.rowData[this.rowdatacurrentindex].PoId;
      this.fnNextandPreviousDisable();
      var PoDataRow = this.rowData.filter(
        book => book.PoId === poId);
      this.BindEditDetails(PoDataRow);
    } catch (Error) {
      console.log(Error.message)
    }
  }

  fnPreviousPOList() {
    try {
      this.rowdatacurrentindex = this.rowdatacurrentindex - 1;
      var poId = this.rowData[this.rowdatacurrentindex].PoId;
      this.fnNextandPreviousDisable();
      var PoDataRow = this.rowData.filter(book => book.PoId === poId);
      this.BindEditDetails(PoDataRow);
    } catch (Error) {
      console.log(Error.message)
    }
  }

  fnBindItemGrossToatl() {
    this.totalAmount = 0;
    this.totalQuantity = 0;
    for (var i = 0, len = this.dynamicArray.length; i < len; i++) {
      this.totalQuantity += parseInt(this.dynamicArray[i].Qty);
      this.dynamicArray[i].TotalAmount = parseFloat(this.dynamicArray[i].Qty) * parseFloat(this.dynamicArray[i].Rate)
      this.dynamicArray[i].GetTotalAmount = this._Commonservices.thousands_separators(this.dynamicArray[i].TotalAmount.toFixed(2));
      this.totalAmount += parseFloat(this.dynamicArray[i].TotalAmount);
    }
    this.model.AmountChargeable = this._Commonservices.valueInWords(this.totalAmount.toFixed(2));
    this.totalSumAmount = this._Commonservices.thousands_separators(this.totalAmount.toFixed(2));
  }


  //#endregion


  QtyOnblur() {
    this.fnBindItemGrossToatl();
  }
  RateOnblur() {
    this.fnBindItemGrossToatl();
  }


  //#region Create New PO and Clear PO Detail
  CreateNewPO() {
    this.IsCopyPoID = false;
    this.isBasicEdit = false;
    this.isShownPOList = false;
    this.isShownPOEdit = true;
    this.IsAmendedDisabled = true;
    this.IsExcelMsgHideShow = false;
    this.IsExcelSaveDataTaleHideShow = false;
    this.model.hiddenPoId = 0;
    this.IsVoucherDisabled = false;
    this.IsCreatePOPdf = true;
    this.IsPoItemDetialSave = false;
    this.IsSignedPoFalseFile = true;
    this.IsSignedPoTrueFile = false;
    this.model.ddlInvoiceTo = 1;
    this.model.ddlConsignee = 1;
    //this.ChangeNarrationType(1);
    this.PageSlideBack();
    this.ClearPODetail();
    this.ClearPoItem();
    this.HideShowSaveButton();
    //this.addRow();
  }

  ClearPODetail() {
    try {
      var sfDate = new Date();
      var toDate = "";
      toDate = this.datePipe.transform(sfDate, "yyyy/MM/dd");
      this.model.Podate = { day: parseInt(toDate.split('/')[2]), month: parseInt(toDate.split('/')[1]), year: parseInt(toDate.split('/')[0]) };
      this.model.IsAmended = "0";
      this.model.selectedEditWHItems = "0";
      //this.model.VoucherTypeId="0";
      if (this.CompanyId == 4) {
        this.model.POClientId = "0";
      } else {
        this.model.POClientId = "99999";
      }

      this.model.EMITypeId = "0";
      this.model.PoCategoryId = "0";
      //this.model.PurchaseTypeId = "0";

      this.model.POStatusId = "1";
      this.PoNo = "";
      // this.selectedEditVendorItems=[];
      this.model.selectedEditVendorItems = "0";
      this.VendorName = "";
      this.model.VendorGST = "0";
      this.VendorAddress = "";
      this.model.selectedEditStateItem = "0";
      this.model.selectedEditWHItems = "0";
      this.WHGSTIN = "";
      this.WHAddress = "";
      this.model.NarrationTypeId = "0";
      this.Narration = "";
      this.TermsofPayment = "";
      this.OtherReferences = "";
      this.TermsofDelivery = "";
      this.DespatchThrough = "";
      this.model.AmountChargeable = "";
      this.PlaceofReceiptbyShipper = "";
      this.VesselFlightNo = "";
      this.PortofLoading = "";
      this.PortofDischarge = "";
      this.AdditionalRemarks = "";
      this.AmendedDate = "";
      this.Pdfurl = '';
      this.model.BOQRequestId = "0";
      this.model.ProjectTypeId = "0";
    } catch (Error) {
      console.log(Error.message)
    }
  }
  //#endregion

  //#region only Podetail Save Code Hemant
  PoBasicdetailSave() {
    try {
      if (this.ValidationBasic() == 0) {
        var objPoBasicDetail = new PoBasicDetial();
        objPoBasicDetail.PoId = this.model.hiddenPoId;
        objPoBasicDetail.PoNo = this.PoNo;
        this.model.HidePoNo = this.PoNo;
        objPoBasicDetail.UserId = this.UserId;
        objPoBasicDetail.CompanyId = this.CompanyId;
        objPoBasicDetail.VendorAddress_Id = this.model.VendorAddressId;
        objPoBasicDetail.VendorId = this.model.selectedEditVendorItems;
        var SDate = this._Commonservices.checkUndefined(this.model.Podate);
        objPoBasicDetail.Podate = SDate.day + '/' + SDate.month + '/' + SDate.year;
        if (this.model.selectedEditWHItems == "0") {
          objPoBasicDetail.WHId = null;
        } else {
          objPoBasicDetail.WHId = this.model.selectedEditWHItems;
        }
        //objPoBasicDetail.VoucherTypeId=this.model.VoucherTypeId;
        objPoBasicDetail.VoucherTypeId = 0;
        objPoBasicDetail.TermsofDelivery = this.TermsofDelivery;
        objPoBasicDetail.TermsofPayment = this.TermsofPayment;
        objPoBasicDetail.OtherReference = this.OtherReferences;
        objPoBasicDetail.DespatchThrough = this.DespatchThrough;
        objPoBasicDetail.PoStatusId = this.model.POStatusId;
        objPoBasicDetail.IsAmended = this.model.IsAmended;
        objPoBasicDetail.ClientListId = this.model.POClientId;
        objPoBasicDetail.EMIListId = this.model.EMITypeId;

        // brahamjot kaur 09/07/2022
        if (objPoBasicDetail.ClientListId == 60 && objPoBasicDetail.EMIListId == 1476) {
          this.FilterItemNameDetailData = this.ItemNameDetailData.filter(m => m.id == 1 || m.id == 2 || m.id == 4 || m.id == 11 || m.id == 12 || m.id == 25 || m.id == 29);
        } else if (objPoBasicDetail.ClientListId == 60 && objPoBasicDetail.EMIListId == 1477) {
          this.FilterItemNameDetailData = this.ItemNameDetailData.filter(m => m.id != 1 && m.id != 2 && m.id != 4 && m.id != 11 && m.id != 12 && m.id != 25 && m.id != 29);
        } else {
          this.FilterItemNameDetailData = this.ItemNameDetailData;
        }
        objPoBasicDetail.POCategoryListId = this.model.PoCategoryId;
        objPoBasicDetail.PurchaseTypeListId = this.model.PurchaseTypeId;
        objPoBasicDetail.ExpenseTypeListId = this.model.ExpenseTypeId;
        objPoBasicDetail.BOQRequestId = this.model.BOQRequestId;
        objPoBasicDetail.ProjectTypeId = this.model.ProjectTypeId;
        var formdata = new FormData();
        if (this.uplodfile == null) {
          formdata.append('file', this.uplodfile);
        } else {
          formdata.append('file', this.uplodfile, this.uplodfile.name);
        }
        formdata.append('jsonDetail', JSON.stringify(objPoBasicDetail));
        this._PurchaseOrderService.PostPoBasicDetail(formdata).subscribe(data => {
          if (data.Status == 1) {
            this.model.hiddenPoId = data.Value;
            this.PoNo = data.Remarks;
            setTimeout(() => {
              alert('your data has been save successfully with PO No-' + data.Remarks)
            }, 300);
            this.IsVoucherDisabled = true;
            //this.ClearPODetail();
          } else if (data.Status == 2) {
            setTimeout(() => {
              alert(data.Remarks)
            }, 300);
          } else if (data.Status == 3) {
            setTimeout(() => {
              alert(data.Remarks)
            }, 300);
          }
        });
      }
    } catch (Error) {
      var objWebErrorLogModel = new WebErrorLogModel();
      objWebErrorLogModel.ErrorBy = this.UserId;
      objWebErrorLogModel.ErrorMsg = Error.message;
      objWebErrorLogModel.ErrorFunction = "PoBasicdetailSave";
      objWebErrorLogModel.ErrorPage = "Podetail";
      this._GlobalErrorHandlerService.handleError(objWebErrorLogModel);
    }
  }

  PoOtherDetialSave() {
    try {
      if (this.model.hiddenPoId == 0) {
        alert('Please Fill First PO Basic Information');
        return false;
      }
      if (this.ValidationPOOther() == 0) {
        var objPoOtherDetial = new PoOtherDetial();
        objPoOtherDetial.PoId = this.model.hiddenPoId;
        objPoOtherDetial.UserId = this.UserId;
        objPoOtherDetial.PlaceofReceiptbyShipper = this.PlaceofReceiptbyShipper;
        objPoOtherDetial.PortofDischarge = this.PortofDischarge;
        objPoOtherDetial.PortofLoading = this.PortofLoading;
        objPoOtherDetial.VesselFlightNo = this.VesselFlightNo;
        objPoOtherDetial.NarrationTypeId = parseInt(this.model.NarrationTypeId);
        objPoOtherDetial.Narration = this.Narration;
        objPoOtherDetial.AdditionalRemarks = this.AdditionalRemarks;
        objPoOtherDetial.ActivityDay = this.model.ActivityDay;
        this._PurchaseOrderService.PoOtherDetial(objPoOtherDetial).subscribe(data => {
          if (data.Status == 1) {
            setTimeout(() => {
              alert(data.Remarks)
            }, 300);
            this.ClearPODetail();
          } else if (data.Status == 2) {
            setTimeout(() => {
              alert(data.Remarks)
            }, 300);
          } else if (data.Status == 3) {
            setTimeout(() => {
              alert(data.Remarks)
            }, 300);
          }
        });
      }
    } catch (Error) {
      var objWebErrorLogModel = new WebErrorLogModel();
      objWebErrorLogModel.ErrorBy = this.UserId;
      objWebErrorLogModel.ErrorMsg = Error.message;
      objWebErrorLogModel.ErrorFunction = "PoBasicdetailSave";
      objWebErrorLogModel.ErrorPage = "Podetail";
      this._GlobalErrorHandlerService.handleError(objWebErrorLogModel);
    }
  }

  PoItemDetialSave() {
    try {
      if (this.model.hiddenPoId == 0) {
        alert('Please Fill First PO Basic Information');
        return false;
      } else {
        this.objExeclPoItemDetialList = []
        this.objPoItemDetialList = [];
        var objUpdatePoItemDetial = new UpdatePoItemDetial();
        // if(this.dynamicArray.length==0){
        //   alert('Please add atleast one  Item row');
        //   return false;
        // }
        if (this.ValidationItem() == 1) {
          return false;
        }
        if (this.dynamicArray.length != 0) {
          for (var i = 0, len = this.dynamicArray.length; i < len; i++) {
            var objPoItemDetial = new PoItemDetial();
            objPoItemDetial.PoId = this.model.hiddenPoId;
            objPoItemDetial.UserId = this.UserId;
            objPoItemDetial.ItemId = this.dynamicArray[i].ItemId;
            if (this.dynamicArray[i].ItemCode == undefined) {
              objPoItemDetial.ItemCode = "";
            } else {
              objPoItemDetial.ItemCode = this.dynamicArray[i].ItemCode;
            }
            objPoItemDetial.Quantity = this.dynamicArray[i].Qty;
            objPoItemDetial.Rate = this.dynamicArray[i].Rate;
            objPoItemDetial.TotalAmount = this.dynamicArray[i].TotalAmount;
            objPoItemDetial.SubDescription = this.dynamicArray[i].SubDescription;
            objPoItemDetial.ReasonCode = this.dynamicArray[i].ReasonCode;
            objPoItemDetial.UnitId = this.dynamicArray[i].UnitName;
            objPoItemDetial.IsWarranty = this.dynamicArray[i].IsWarranty;
            objPoItemDetial.WarrantyMonth = this.dynamicArray[i].Month;
            objPoItemDetial.CurrencyType = this.model.CurrencyType;
            objPoItemDetial.CurrencyValue = this.model.CurrencyValue;
            var SiteData = this.dynamicArray[i].SiteId;
            if (SiteData == 0) {
              objPoItemDetial.SiteId = this.dynamicArray[i].SiteId;
              objPoItemDetial.SiteName = this.dynamicArray[i].SiteName;
              objPoItemDetial.CustomerSiteId = this.dynamicArray[i].CustomerSiteId;
              objPoItemDetial.CustomerCode = this.dynamicArray[i].CustomerCode;
              objPoItemDetial.CustomerId = this.dynamicArray[i].CustomerId;
            }
            else if (SiteData != 0 && this.dynamicArray[i].CustomerSiteId != null && this.dynamicArray[i].CustomerSiteId != "") {
              objPoItemDetial.SiteId = this.dynamicArray[i].SiteId;
              objPoItemDetial.SiteName = this.dynamicArray[i].SiteName;
              objPoItemDetial.CustomerSiteId = this.dynamicArray[i].CustomerSiteId;
              objPoItemDetial.CustomerCode = this.dynamicArray[i].CustomerCode;
              objPoItemDetial.CustomerId = this.dynamicArray[i].CustomerId;
            }
            this.objPoItemDetialList.push(objPoItemDetial)
          }
        } else {
          objUpdatePoItemDetial.PONO = this.model.hiddenPoId;;
        }
        objUpdatePoItemDetial.PoItemDetialList = this.objPoItemDetialList;
        objUpdatePoItemDetial.AmountInWord = this.model.AmountChargeable;

        this._PurchaseOrderService.PoItemDetial(JSON.stringify(objUpdatePoItemDetial)).subscribe(data => {
          if (data.Status == 1) {
            // this.model.AmountChargeable="";
            this.IsCreatePOPdf = false;
            setTimeout(() => {
              alert(data.Remarks)
            }, 300);
            //this.ClearPoItem();
          }
          else if (data.Status == 2) {
            //this.model.AmountChargeable="";
            this.IsCreatePOPdf = false;
            setTimeout(() => {
              alert(data.Remarks)
            }, 300);
          } else if (data.Status == 3) {
            setTimeout(() => {
              alert(data.Remarks)
            }, 300);
          }
        });


      }
    } catch (Error) {
      var objWebErrorLogModel = new WebErrorLogModel();
      objWebErrorLogModel.ErrorBy = this.UserId;
      objWebErrorLogModel.ErrorMsg = Error.message;
      objWebErrorLogModel.ErrorFunction = "PoItemDetialSave";
      objWebErrorLogModel.ErrorPage = "Podeatil";
      this._GlobalErrorHandlerService.handleError(objWebErrorLogModel);
    }
  }

  ExeclFileChange(evt: any) {
    try {
      this.IsPoItemDetialSave = true;
      this.objExeclPoItemDetialList = [];
      var objUpdatePoItemDetial = new UpdatePoItemDetial();
      this.ExeclImportData = [];
      /* wire up file reader */
      const target: DataTransfer = <DataTransfer>(evt.target);
      if (target.files.length !== 1) throw new Error('Cannot use multiple files');
      const reader: FileReader = new FileReader();
      reader.onload = (e: any) => {
        const bstr: string = e.target.result;
        const wb: XLSX.WorkBook = XLSX.read(bstr, { type: "binary" });
        const wsname: string = wb.SheetNames[0];
        const ws: XLSX.WorkSheet = wb.Sheets[wsname];
        var headers = [];
        var sheet = ws;
        var range = XLSX.utils.decode_range(sheet['!ref']);
        var C, R = range.s.r;
        var hdr;
        for (C = range.s.c; C <= range.e.c; ++C) {
          var cell = sheet[XLSX.utils.encode_cell({ c: C, r: R })];
          var ColuName = "UNKNOWN " + C; // <-- replace with your desired default
          if (cell && cell.t) {
            ColuName = XLSX.utils.format_cell(cell);
            if (ColuName == "Qty") {
              hdr = ColuName
            } else if (ColuName == "Rate") {
              hdr = ColuName
            } else if (ColuName == "TotalAmount") {
              hdr = ColuName
            } else if (ColuName == "SubDescription") {
              hdr = ColuName
            } else if (ColuName == "ReasonCode") {
              hdr = ColuName
            } else if (ColuName == "ItemCode") {
              hdr = ColuName
            } else if (ColuName == "SiteName") {
              hdr = ColuName
            } else if (ColuName == "CustomerSiteId") {
              hdr = ColuName
            } else if (ColuName == "OverHeadExpenses") {
              hdr = ColuName
            } else {
              alert("Invalid Column Name _" + ColuName);
              this.myInputVariable.nativeElement.value = '';
              return false;
            }
          }
          // headers.push(hdr);
        }

        this.ExeclImportData = <AOA>(XLSX.utils.sheet_to_json(ws, { raw: true }));
        if (this.ExeclImportData.length > 0 && this.ExeclImportData != null) {
          for (var i = 0, len = this.ExeclImportData.length; i < len; i++) {
            var objPoItemDetial = new PoItemDetial();
            objPoItemDetial.PoId = this.model.hiddenPoId;
            objPoItemDetial.UserId = this.UserId;
            objPoItemDetial.Quantity = this.ExeclImportData[i].Qty;
            objPoItemDetial.ItemCode = this.ExeclImportData[i].ItemCode;
            objPoItemDetial.Rate = this.ExeclImportData[i].Rate;
            objPoItemDetial.TotalAmount = this.ExeclImportData[i].TotalAmount;
            objPoItemDetial.SubDescription = this.ExeclImportData[i].SubDescription;
            objPoItemDetial.ReasonCode = this.ExeclImportData[i].ReasonCode;
            objPoItemDetial.OverHeadExpenses = this.ExeclImportData[i].OverHeadExpenses;
            var SiteData = this.ExeclImportData[i].SiteId;
            // if (SiteData == 0) {
            //   objPoItemDetial.SiteId = this.ExeclImportData[i].SiteId;
            //   objPoItemDetial.SiteName = this.ExeclImportData[i].SiteName;
            //   objPoItemDetial.CustomerSiteId = this.ExeclImportData[i].CustomerSiteId;
            //   objPoItemDetial.CustomerCode = this.ExeclImportData[i].CustomerCode;
            //   objPoItemDetial.CustomerId = this.ExeclImportData[i].CustomerId;
            // }else
            if (this.ExeclImportData[i].CustomerSiteId != null
              && this.ExeclImportData[i].CustomerSiteId != "") {
              objPoItemDetial.SiteId = this.ExeclImportData[i].SiteId;
              objPoItemDetial.SiteName = this.ExeclImportData[i].SiteName;
              objPoItemDetial.CustomerSiteId = this.ExeclImportData[i].CustomerSiteId;
              objPoItemDetial.CustomerCode = this.ExeclImportData[i].CustomerCode;
              objPoItemDetial.CustomerId = this.ExeclImportData[i].CustomerId;
            }
            this.objExeclPoItemDetialList.push(objPoItemDetial)
          }
        }
      };
      reader.readAsBinaryString(target.files[0]);
    } catch (Error) {
      var objWebErrorLogModel = new WebErrorLogModel();
      objWebErrorLogModel.ErrorBy = this.UserId;
      objWebErrorLogModel.ErrorMsg = Error.message;
      objWebErrorLogModel.ErrorFunction = "ExeclFileChange";
      objWebErrorLogModel.ErrorPage = "Podetail";
      this._GlobalErrorHandlerService.handleError(objWebErrorLogModel);
    }
  }

  fnBindExcelItemGrossTotal() {
    this.totalAmount = 0;
    this.totalQuantity = 0;
    for (var i = 0, len = this.ExeclImportData.length; i < len; i++) {
      this.totalQuantity += parseInt(this.ExeclImportData[i].Qty);
      this.ExeclImportData[i].TotalAmount = parseFloat(this.ExeclImportData[i].Qty) * parseFloat(this.ExeclImportData[i].Rate)
      // this.ExeclImportData[i].GetTotalAmount=this._Commonservices.thousands_separators(this.ExeclImportData[i].TotalAmount.toFixed(2));
      this.totalAmount += parseFloat(this.ExeclImportData[i].TotalAmount);
    }
    this.model.AmountChargeable = this._Commonservices.valueInWords(this.totalAmount.toFixed(2));
    this.totalSumAmount = this._Commonservices.thousands_separators(this.totalAmount.toFixed(2));
  }

  SavePoItemDetialByExcel() {
    try {
      if (this.model.hiddenPoId == 0) {
        alert('Please Fill First PO Basic Information');
        return false;
      } else {
        this.objPoItemDetialList = [];
        this.ErrorMessage = [];
        if (this.objExeclPoItemDetialList.length == 0 || this.objExeclPoItemDetialList.length == null) {
          alert('Please Select Annexure Excel');
          return false;
        }
        else {
          var objUpdatePoItemDetial = new UpdatePoItemDetial();
          objUpdatePoItemDetial.PoItemDetialList = this.objExeclPoItemDetialList;
          objUpdatePoItemDetial.AmountInWord = this.model.AmountChargeable;
          this._PurchaseOrderService.SavePoItemByExcel(JSON.stringify(objUpdatePoItemDetial)).subscribe(data => {
            if (data.Data[0].result == 1) {
              this.IsExcelMsgHideShow = true;
              this.IsExcelSaveDataTaleHideShow = false;
              alert('ItemCode does not match from database.');
              this.myInputVariable.nativeElement.value = '';
              this.ErrorMessage = data.Message;
            }
            else if (data.Data[0].result == 0) {
              this.IsExcelSaveDataTaleHideShow = true;
              this.IsExcelMsgHideShow = false;
              this.IsPoItemDetialSave = false;
              this.IsCreatePOPdf = false;
              alert('your data has been save successfully')
              this.myInputVariable.nativeElement.value = '';
              this.GetItemSaveExcelData();
            } else if (data.Data[0].result == 2) {
              this.myInputVariable.nativeElement.value = '';
              alert('DataBase Error')
            }
          });
        }
      }
    } catch (Error) {
      var objWebErrorLogModel = new WebErrorLogModel();
      objWebErrorLogModel.ErrorBy = this.UserId;
      objWebErrorLogModel.ErrorMsg = Error.message;
      objWebErrorLogModel.ErrorFunction = "SavePoItemDetialByExcel";
      objWebErrorLogModel.ErrorPage = "Podetail";
      this._GlobalErrorHandlerService.handleError(objWebErrorLogModel);
    }

  }
  GetItemSaveExcelData() {
    try {
      this.ItemSaveExcelData = null;
      var objVendorOrWhModel = new VendorOrWhModel();
      objVendorOrWhModel.Id = this.model.hiddenPoId;
      objVendorOrWhModel.flag = "";
      this._PurchaseOrderService.GetPOItemSaveExcelListByPoId(objVendorOrWhModel).subscribe(data => {
        if (data.Status == 1) {
          if (data.Data != null) {
            this.IsExcelSaveDataTaleHideShow = true;
            this.ItemSaveExcelData = data.Data;
          }
        }
      });
    } catch (Error) {
      var objWebErrorLogModel = new WebErrorLogModel();
      objWebErrorLogModel.ErrorBy = this.UserId;
      objWebErrorLogModel.ErrorMsg = Error.message;
      objWebErrorLogModel.ErrorFunction = "GetItemSaveExcelData";
      objWebErrorLogModel.ErrorPage = "Podetail";
      this._GlobalErrorHandlerService.handleError(objWebErrorLogModel);
    }
  }

  DownloadMessageData() {
    this._PurchaseOrderService.exportAsExcelFile(this.ErrorMessage, 'ExcelItemCode');
  }

  UploadSampleExcel() {
    this._PurchaseOrderService.exportAsExcelFile(this.SampleExcel, 'SampleExcel');
  }

  ClearPoItem() {
    for (var i = 0, len = this.dynamicArray.length; i < len; i++) {
      this.PoId = 0;
      this.dynamicArray[i].ItemId = "0";
      this.dynamicArray[i].ItemMakeId = "0";
      this.dynamicArray[i].ItemNameId = "0";
      this.dynamicArray[i].Qty = "";
      this.dynamicArray[i].Rate = "";
      this.dynamicArray[i].TotalAmount = "";
      this.dynamicArray[i].GetTotalAmount = "";
      this.dynamicArray[i].SubDescription = "";
      this.dynamicArray[i].ReasonCode = "";
      this.dynamicArray[i].UnitName = "";
      this.dynamicArray[i].SiteId = null;
      this.dynamicArray[i].SiteName = "";
      this.dynamicArray[i].CustomerSiteId = null;
      this.dynamicArray[i].CustomerCode = "";
      this.dynamicArray[i].CustomerId = null;
      this.dynamicArray[i].ValueCustomerSite = "";
      this.dynamicArray[i].ValueSiteName = "";
      this.dynamicArray[i].ItemDescription = "";
      //this.dynamicArray[i].CustomerId=null;
      this.totalSumAmount = "0.00";
      this.totalQuantity = "0";
    }
  }

  ChangeIsAmended() {
    if (this.PoId != null || this.PoId != undefined && this.Pdfurl != '') {
      alert("Are you sure PO Amended");
    }
  }

  SaveApprovalStatus(ApprovalStatusId: any) {
    try {
      if (this.model.hiddenPoId == 0) {
        alert('Please Fill First PO Basic Information');
        return false;
      }
      if (ApprovalStatusId == 1459) {
        if (this.ValidationApprovalStatus() == 1) {
          return false;
        }
      }
      var objApprovelStatusModel = new ApprovelStatusModel();
      objApprovelStatusModel.Menu_Id = this.PageMenuId;
      objApprovelStatusModel.Table_Id = this.model.hiddenPoId;
      objApprovelStatusModel.User_Id = this.UserId;
      objApprovelStatusModel.ApprovalStatus_Id = this.model.ApprovalStatus;
      objApprovelStatusModel.Reason_Id = this.model.ApprovalReason;
      objApprovelStatusModel.Remarks = this.model.Remarks;
      this._Commonservices.SaveApprovalStatusHistory(objApprovelStatusModel).subscribe(data => {
        if (data.Status == 1) {
          setTimeout(() => {
            alert('Approval Status SuccessFully Save')
          }, 300);
          this.ClearApprovalStatus();
        } else if (data.Status == 2) {
          setTimeout(() => {
            alert('Approval Status SuccessFully Update')
          }, 300);
        }
      });

    } catch (Error) {
      var objWebErrorLogModel = new WebErrorLogModel();
      objWebErrorLogModel.ErrorBy = this.UserId;
      objWebErrorLogModel.ErrorMsg = Error.message;
      objWebErrorLogModel.ErrorFunction = "SaveApprovalStatus";
      objWebErrorLogModel.ErrorPage = "PoDeatil";
      this._GlobalErrorHandlerService.handleError(objWebErrorLogModel);
    }
  }

  ClearApprovalStatus() {
    this.model.ApprovalStatus = "0";
    this.model.ApprovalReason = "0";
    this.model.Remarks = "";
  }

  AddUpdateDocumentFileType() {
    try {
      if (this.model.hiddenPoId == 0) {
        alert('Please Fill First PO Basic Information');
        return false;
      }
      if (this.ValidationDocumenttype() == 1) {
        return false;
      }
      var objPoOtherDetial = new PoOtherDetial();
      objPoOtherDetial.PoId = this.model.hiddenPoId;
      objPoOtherDetial.UserId = this.UserId;
      objPoOtherDetial.DocumentTypeId = this.model.DocumentTypeId;
      objPoOtherDetial.TypeId = this.model.TypeId;
      objPoOtherDetial.Remarks = this.model.Remarks;
      var formdata = new FormData();
      if (this.DocumentFile == null) {
        formdata.append('file', this.DocumentFile);
      } else {
        formdata.append('file', this.DocumentFile, this.DocumentFile.name);
      }
      formdata.append('jsonDetail', JSON.stringify(objPoOtherDetial));
      this._PurchaseOrderService.PostUpdateDocumentDetail(formdata).subscribe(data => {
        if (data.Status == 1) {
          alert('your data has been save successfully')
          this.ClearDocumenttype();
          this.GetAllDocumentTypeByPoId(this.model.hiddenPoId);
        }
      });
    } catch (Error) {
      var objWebErrorLogModel = new WebErrorLogModel();
      objWebErrorLogModel.ErrorBy = this.UserId;
      objWebErrorLogModel.ErrorMsg = Error.message;
      objWebErrorLogModel.ErrorFunction = "PostUpdateDocumentDetail";
      objWebErrorLogModel.ErrorPage = "Podetail";
      this._GlobalErrorHandlerService.handleError(objWebErrorLogModel);
    }
  }

  ClearDocumenttype() {
    this.model.DocumentTypeId = "0";
    this.model.TypeId = "0";
    this.model.Remarks = "";
    this.inputDocumentFile.nativeElement.value = "";
  }

  ClickViewDocument(Id: any, index: any) {
    var FilterDocumentData = this.DocumentTypeDatalist.filter(m => m.Id === parseInt(Id));
    window.open(FilterDocumentData[0].DocumentFile);
  }


  ClickDeleteDocument(Id: any, index: any) {

    try {
      var objApprovelStatusModel = new ApprovelStatusModel();
      objApprovelStatusModel.User_Id = this.UserId;
      objApprovelStatusModel.ApprovalStatus_Id = Id;
      objApprovelStatusModel.Table_Id = this.model.hiddenPoId;
      objApprovelStatusModel.Flag = "PODocumentType";
      this._MaterialMovementService.UpadateCancelDispatch(objApprovelStatusModel).subscribe(data => {
        if (data.Status == 1) {
          alert('Your SuccessFully Delete')
          this.GetAllDocumentTypeByPoId(this.model.hiddenPoId);
        }
      });
    } catch (Error) {
      this._Commonservices.ErrorFunction(this.UserId, Error.message, "UpadateCancelDispatch", "WHTOSite");
    }
  }

  ClickDownloadDocument(Id: any, index: any) {
    var FilterDocumentData = this.DocumentTypeDatalist.filter(m => m.Id === parseInt(Id));
    window.open(FilterDocumentData[0].DocumentFile);
  }

  GetAllDocumentTypeByPoId(POId: any) {
    try {
      this.DocumentTypelist = [];
      var objVendormodel = new VendorOrWhModel();
      objVendormodel.Id = POId;
      objVendormodel.flag = 'DocumentTypeGridData';
      this._Commonservices.getVendorOrWh(objVendormodel).subscribe(data => {
        if (data.Status == 1) {
          if (data.Data != null || data.Data != "") {
            this.DocumentTypeDatalist = data.Data;
          }
        } else {
          this.DocumentTypeDatalist = null;
        }
      });
    } catch (Error) {
      var objWebErrorLogModel = new WebErrorLogModel();
      objWebErrorLogModel.ErrorBy = this.UserId;
      objWebErrorLogModel.ErrorMsg = Error.message;
      objWebErrorLogModel.ErrorFunction = "GetAllDocumentTypeByPoId";
      objWebErrorLogModel.ErrorPage = "Podetail";
      this._GlobalErrorHandlerService.handleError(objWebErrorLogModel);
    }
  }
  //#endregion 

  onFileChange(event) {
    let reader = new FileReader();
    if (event.target.files && event.target.files.length > 0) {
      this.uplodfile = event.target.files[0];
    }
  }

  onFiletype(event) {
    let reader = new FileReader();
    if (event.target.files && event.target.files.length > 0) {
      this.DocumentFile = event.target.files[0];
    }
  }
  //#region  send email  code
  SendMail() {
    try {
      if (this.ValidationEmailSend() == 0) {
        this.loading = true;
        var objEmailSendTotalDataModel = new EmailSendTotalDataModel();
        var objEmailModel = new EmailModel();
        objEmailModel.MailTo = this.model.MailTo;
        objEmailModel.MailCc = this.model.MailCc;
        objEmailModel.MailBcc = this.model.MailBcc;
        objEmailModel.MailSubject = this.model.MailSubject;
        objEmailModel.MailBodyMessage = this.model.MailMessage;
        var objUserModel = JSON.parse(sessionStorage.getItem("UserSession"));
        objEmailModel.UserId = objUserModel.User_Id;
        objEmailModel.PdfUrl = this.PdfEmailurl;
        objEmailModel.PoId = this.PoId;
        var formdata = new FormData();
        for (var i = 0; i < this.MailFile.length; i++) {
          formdata.append("fileUpload", this.MailFile[i]);
        }
        formdata.append('jsonEmailDetail', JSON.stringify(objEmailModel));
        this._Commonservices.EmailSendDeatil(formdata).subscribe(data => {
          if (data.Status == 1) {
            this.loading = false;
            // $('#custom-tabs-three-outbox-tab').css('background-color', '#2196f3')
            alert('your email has been successfully send')
          } else if (data.Status == 0) {
            this.loading = false;
            alert('your email Id not correct format')
          }
        });
      }
    } catch (Error) {
      var objWebErrorLogModel = new WebErrorLogModel();
      objWebErrorLogModel.ErrorBy = this.UserId;
      objWebErrorLogModel.ErrorMsg = Error.message;
      objWebErrorLogModel.ErrorFunction = "GetItemSaveExcelData";
      objWebErrorLogModel.ErrorPage = "SendMail";
      this._GlobalErrorHandlerService.handleError(objWebErrorLogModel);
    }
  }

  AttchmentFileChange(event) {
    let reader = new FileReader();
    this.MailFile = [];
    for (var i = 0, len = event.target.files.length; i < len; i++) {
      var Size = parseInt(event.target.files[i].size);
      if (Size > 200000) {
        alert("your file size > 2mb ");
        return false;
      } else {
        this.urls.push(event.target.files[i]);
        this.MailFile.push(event.target.files[i]);
      }
    }
  }
  removeSelectedFile(index) {
    this.MailFile.splice(index, 1);
    this.urls.splice(index, 1);
  }

  KeypressMailTo(event) {
    $("#txtToMail").css('border-color', '')
  }
  KeypressSubject(event) {
    $("#txtSubject").css('border-color', '')
  }
  KeypressMessage(event) {
    $("#txtMessage").css('border-color', '')
  }
  ValidationEmailSend() {
    var flag = 0;
    if (this.model.MailTo == "" || this.model.MailTo == undefined) {
      $('#txtToMail').css('border-color', 'red')
      $('#txtToMail').focus();
      flag = 1;
    } else {
      $("#txtToMail").css('border-color', '')
    }
    if (this.model.MailSubject == "" || this.model.MailSubject == undefined) {
      $('#txtSubject').css('border-color', 'red')
      $('#txtSubject').focus();
      flag = 1;
    } else {
      $("#txtSubject").css('border-color', '')
    }
    if (this.model.MailMessage == "" || this.model.MailMessage == undefined) {
      $('#txtMessage').css('border-color', 'red')
      $('#txtMessage').focus();
      flag = 1;
    } else {
      $("#txtMessage").css('border-color', '')
    }
    return flag;
  }

  onPdfClick(poId) {
    
    var PoDataRow = this.rowData.filter(
      book => book.PoId === poId);
    window.open(PoDataRow[0].PdfSrc);
  }



  //#endregion
  fnNextandPreviousDisable() {
    try {
      if (this.rowdatacurrentindex === 0) {
        this.IsDisableNext = false;
        this.IsDisablePrevious = true;
      } else if (this.rowdatacurrentindex === this.rowdatalength - 1) {
        this.IsDisableNext = true;
        this.IsDisablePrevious = false;
      } else {
        this.IsDisableNext = false;
        this.IsDisablePrevious = false;
      }
    } catch (Error) {
      console.log(Error.message)
    }
  }

  onBtnBackPOList() {
    this.isShownPOList = true;
    this.isShownPOEdit = false;
    this.IsExcelSaveDataTaleHideShow = true;
    this.ItemSaveExcelData = null;
    this.EmailData = [];
    this.ClearPoItem();

  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.rowData = this.rowData;
  }


  addRow() {
    var objNewItemGrid = new DynamicItemGrid();
    objNewItemGrid.ItemNameId = "0";
    objNewItemGrid.ItemMakeId = "0";
    objNewItemGrid.ItemId = "0";
    objNewItemGrid.ItemDescription = "";
    objNewItemGrid.SubDescription = "";
    objNewItemGrid.SiteName = "";
    objNewItemGrid.CustomerSiteId = "";
    objNewItemGrid.ReasonCode = "";
    objNewItemGrid.CustomerCode = "";
    objNewItemGrid.CustomerId = 0;
    objNewItemGrid.UnitName = "0";
    objNewItemGrid.Rate = 0;
    objNewItemGrid.Qty = 0;
    objNewItemGrid.TotalAmount = "0.00";
    objNewItemGrid.GetTotalAmount = "0.00";
    objNewItemGrid.IsWarranty = "2";
    objNewItemGrid.Month = "";
    objNewItemGrid.IsWarrantyReq = null;
    this.dynamicArray.push(objNewItemGrid);
    this.fnBindItemGrossToatl();
    return true;


  }
  deleteRow(index) {
    // if (this.dynamicArray.length == 1) {
    //   //this.toastr.error("Can't delete the row when there is only one row", 'Warning');  
    //   return false;
    // } else {
    this.dynamicArray.splice(index, 1);
    //this.toastr.warning('Row deleted successfully', 'Delete row'); 
    this.fnBindItemGrossToatl();
    return true;
    // }
  }



  GetMissedPo() {
    try {
      this.MissedPOData = [];
      var objVendormodel = new VendorOrWhModel();
      objVendormodel.Id = this.CompanyId;
      this._PurchaseOrderService.getMissedPODetail(objVendormodel).subscribe(data => {
        if (data.Status == 1) {
          this.MissedPOData = data.Data;
          if (this.MissedPOData.length > 0) {
            this.MissedPO = this.MissedPOData.length;
          }
        } else {
          this.MissedPO = 0;
        }
      });
    } catch (Error) {
      console.log(Error.message)
    }
  }

  MissedPoExcelExport() {
    this._PurchaseOrderService.exportAsExcelFile(this.MissedPOData, 'MissedPO');
  }

  //#region  validations


  valChange(value: string) {
    $('#' + value).css('border-color', '')
    this.ChangeCulstomer();
  }

  ChangeCulstomer() {

    if (this.model.POClientId != 0) {
      var objdropdownmodel = new DropdownModel();
      objdropdownmodel.User_Id = 0;
      objdropdownmodel.Parent_Id = this.model.POClientId;
      objdropdownmodel.Other_Id = "0";
      objdropdownmodel.Company_Id = this.CompanyId;
      objdropdownmodel.Flag = 'ProjectType';
      this._Commonservices.GettAllProjectTypeandOther(objdropdownmodel).subscribe(st => {
        if (st.Status == 1 && st.Data != null) {
          this.ProjectTypeList = st.Data;
        }
      });
    }
  }
  ChangeProjectType(Id: any) {
    var objdropdownmodel = new DropdownModel();
    objdropdownmodel.User_Id = 0;
    objdropdownmodel.Parent_Id = this.model.POClientId;
    objdropdownmodel.Other_Id = Id;
    objdropdownmodel.Company_Id = this.CompanyId;
    objdropdownmodel.Flag = 'BOQIndent';
    this._Commonservices.GettAllProjectTypeandOther(objdropdownmodel).subscribe(st => {
      if (st.Status == 1 && st.Data != null) {
        this.BOQIdentList = st.Data;
      }
    });
  }

  ChangeBOQRequest(Id: any) {
    if (Id != 0) {
      this.PreviewIndent = true;
    } else {
      this.PreviewIndent = false;
    }
  }

  PreviewMaterialIndent(Id: any) {
    try {
      var objBOQModel = new BOQModel();
      objBOQModel.BOQId = Id;
      objBOQModel.CompanyId = this.CompanyId;
      objBOQModel.UserId = this.UserId;
      this._BOQService.GetBOQRequestPdfDetail(objBOQModel).subscribe(data => {
        if (data.Status == 1) {
          if (data.Data != null) {
            this._CommonpdfService.BOQRequestGeneratePDF(data.Data);
          }
        }
      });
    } catch (Error) {
      this._Commonservices.ErrorFunction(this.UserId, Error.message, "ShowMRPdfPreviewDetail", "BOQRequest");
    }
  }

  ValidationApprovalStatus() {
    var flag = 0;
    if (this.model.ApprovalReason == "0") {
      $('#txtReason').css('border-color', 'red')
      $('#txtReason').focus();
      flag = 1;
    } else {
      $("#txtReason").css('border-color', '')
    }

    if (this._Commonservices.checkUndefined(this.model.Remarks) == "") {
      $('#txtRemarks').css('border-color', 'red')
      $('#txtRemarks').focus();
      flag = 1;
    } else {
      $("#txtRemarks").css('border-color', '')
    }
    return flag;
  }

  Approvalchange() {
    $("#txtApprovalStatus").css('border-color', '')
  }
  KeypressRemarks() {
    $("#txtRemarks").css('border-color', '')
  }
  onKeypressActivityDay() {
    $("#txtActivityDay").css('border-color', '')
  }
  ValidationPOOther() {
    var flag = 0;
    if (this.model.NarrationTypeId == "" || this.model.NarrationTypeId == "0") {
      $('#txtNarration').css('border-color', 'red')
      $('#txtNarration').focus();
      flag = 1;
    } else {
      $("#txtNarration").css('border-color', '')
    }
    // if (this.model.ActivityDay == ""||this.model.ActivityDay == null) {
    //   $('#txtActivityDay').css('border-color', 'red')
    //   $('#txtActivityDay').focus();
    //   flag = 1;
    // } else {
    //   $("#txtActivityDay").css('border-color', '')
    // }

    return flag;
  }
  onKeypressPONo(event: any) {
    $("#txtPoNo").css('border-color', '');
  }

  onKeypressPoDate(event: any) {
    $("#txtPodate").css('border-color', '');
  }


  onKeypressPayment(event: any) {
    $("#txtPayment").css('border-color', '');
  }
  onKeypressReferences(event: any) {
    $("#txtReferences").css('border-color', '');
  }
  onKeypressDelivery(event: any) {
    $("#txtDelivery").css('border-color', '');
  }
  onKeypressDispatch(event: any) {
    $("#txtDespatchThrough").css('border-color', '');
  }
  ChangePOStatus(event: any) {
    $("#txtPOStatusId").css('border-color', '');
  }

  PageSlideNext() {
    $('#pdf').attr('class', 'col-12 col-sm-6 col-md-6');
    $('#Basic').attr('class', 'col-12 col-sm-6 col-md-6')
  }

  PageSlideBack() {
    $('#pdf').attr('class', 'col-12 col-sm-1 col-md-1');
    $('#Basic').attr('class', 'col-12 col-sm-11 col-md-11')
  }

  ChangeDocumentType() {
    $("#txtDocumentType").css('border-color', '')
  }

  ChangeType() {
    $("#txtDocumentType").css('border-color', '')
  }

  ValidationDocumenttype() {
    var flag = 0;
    if (this.model.DocumentTypeId == "0") {
      $('#txtDocumentType').css('border-color', 'red')
      $('#txtDocumentType').focus();
      flag = 1;
    } else {
      $("#txtDocumentType").css('border-color', '')
    }

    if (this.model.TypeId == "0") {
      $('#txttype').css('border-color', 'red')
      $('#txttype').focus();
      flag = 1;
    } else {
      $("#txttype").css('border-color', '')
    }
    return flag;
  }

  ValidationBasic() {
    var flag = 0;
    if (this.PoNo == "" || this.PoNo == 'undefined' || this.PoNo == undefined) {
      $('#txtPoNo').css('border-color', 'red')
      $('#txtPoNo').focus();
      flag = 1;
    } else {
      $("#txtPoNo").css('border-color', '')
    }
    if (this.model.Podate == "" || this.model.Podate == null) {
      $('#txtPodate').css('border-color', 'red');
      $('#txtPodate').focus();
      flag = 1;
    } else {
      $("#txtPodate").css('border-color', '');
    }


    if (this.model.selectedEditVendorItems == "" || this.model.selectedEditVendorItems == "0" || this.model.selectedEditVendorItems == null) {
      $('#txtVendorName').css('border-color', 'red');
      $('#txtVendorName').focus();
      flag = 1;
    } else {
      $("#txtVendorName").css('border-color', '');
    }

    if (this.model.VendorGST == "null" || this.model.VendorGST == "") {
      $('#txtVendorGST').css('border-color', 'red');
      $('#txtVendorGST').focus();
      flag = 1;
    } else {
      $("#txtVendorGST").css('border-color', '');
    }

    if (this.model.POStatusId == 3 && this.model.selectedEditVendorItems != 635 && this.CompanyId == 4) {
      alert('please select valid vendor name');
      flag = 1;
    } else if (this.model.POStatusId == 3 && this.model.selectedEditVendorItems != 654 && this.CompanyId == 1) {
      alert('please select valid vendor name');
      flag = 1;
    } else if (this.model.POStatusId == 3 && this.model.selectedEditVendorItems != 1702 && this.CompanyId == 14) {
      alert('please select valid vendor name');
      flag = 1;
    }
    else {
      if (this.model.selectedEditStateItem == "null" || this.model.selectedEditStateItem == '0') {
        $('#txtStateEdit').css('border-color', 'red');
        $('#txtStateEdit').focus();
        flag = 1;
      } else {
        $("#txtStateEdit").css('border-color', '');
      }
      if (this.model.selectedEditWHItems == "null" || this.model.selectedEditWHItems == "") {
        $('#txtWH').css('border-color', 'red');
        $('#txtWH').focus();
        flag = 1;
      } else {
        $("#txtWH").css('border-color', '');
      }
    }

    if (this.model.POStatusId != 3 && this.model.selectedEditVendorItems == 635 && this.CompanyId == 4) {
      alert('please select valid PO status ');
      flag = 1;
    }
    else if (this.model.POStatusId != 3 && this.model.selectedEditVendorItems == 654 && this.CompanyId == 1) {
      alert('please select valid PO status ');
      flag = 1;
    }
    else if (this.model.POStatusId != 3 && this.model.selectedEditVendorItems == 1702 && this.CompanyId == 14) {
      alert('please select valid PO status ');
      flag = 1;
    }
    else {
      if (this.model.selectedEditStateItem == "null" || this.model.selectedEditStateItem == '0') {
        $('#txtStateEdit').css('border-color', 'red');
        $('#txtStateEdit').focus();
        flag = 1;
      } else {
        $("#txtStateEdit").css('border-color', '');
      }
      if (this.model.selectedEditWHItems == "null" || this.model.selectedEditWHItems == "") {
        $('#txtWH').css('border-color', 'red');
        $('#txtWH').focus();
        flag = 1;
      } else {
        $("#txtWH").css('border-color', '');
      }
    }


    if ($('#txtPayment').val() == "" || $('#txtPayment').val() == undefined) {
      $('#txtPayment').css('border-color', 'red');
      $('#txtPayment').focus();
      flag = 1;
    } else {
      $("#txtPayment").css('border-color', '');
    }
    //var t= $('#txtReferences').val();
    if ($('#txtReferences').val() == "" || $('#txtReferences').val() == undefined) {
      $('#txtReferences').css('border-color', 'red');
      $('#txtReferences').focus();
      flag = 1;
    } else {
      $("#txtReferences").css('border-color', '');
    }
    if ($('#txtDelivery').val() == "" || $('#txtDelivery').val() == undefined) {
      $('#txtDelivery').css('border-color', 'red');
      $('#txtDelivery').focus();
      flag = 1;
    } else {
      $("#txtDelivery").css('border-color', '');
    }
    if ($('#txtDespatchThrough').val() == "" || $('#txtDespatchThrough').val() == undefined) {

      $('#txtDespatchThrough').css('border-color', 'red')
      $('#txtDespatchThrough').focus();
      flag = 1;
    } else {
      $("#txtDespatchThrough").css('border-color', '')
    }
    if (this.model.PoCategoryId == "null" || this.model.PoCategoryId == '0') {
      $('#ddlPoCategory').css('border-color', 'red')
      $('#ddlPoCategory').focus();
      flag = 1;
    } else {
      $("#ddlPoCategory").css('border-color', '')
    }

    if (this.model.POClientId == "null" || this.model.POClientId == '0') {
      $('#ddlPOClient').css('border-color', 'red')
      $('#ddlPOClient').focus();
      flag = 1;
    } else {
      $("#ddlPOClient").css('border-color', '')
    }
    // if (this.model.PurchaseTypeId == "null" || this.model.PurchaseTypeId == '0') {
    //   $('#txtPurchaseType').css('border-color', 'red')
    //   $('#txtPurchaseType').focus();
    //   flag = 1;
    // } else {
    //   $("#txtPurchaseType").css('border-color', '')
    // }

    if (this.model.ExpenseTypeId == "null" || this.model.ExpenseTypeId == '0') {
      $('#txtExpenseType').css('border-color', 'red')
      $('#txtExpenseType').focus();
      flag = 1;
    } else {
      $("#txtExpenseType").css('border-color', '')
    }

    if (this.model.EMITypeId == "null" || this.model.EMITypeId == '0') {
      $('#ddlEMIType').css('border-color', 'red')
      $('#ddlEMIType').focus();
      flag = 1;
    } else {
      $("#ddlEMIType").css('border-color', '')
    }

    if (this.model.PoCategoryId == "null" || this.model.PoCategoryId == '0') {
      $('#ddlEMIType').css('border-color', 'red')
      $('#ddlEMIType').focus();
      flag = 1;
    } else {
      $("#ddlEMIType").css('border-color', '')
    }
    return flag;
  }

  onKeypressMonth() {
    $('#tblOne > tbody  > tr').each(function () {
      $(this).find('.Month').css('border-color', '');
    });
  }

  onChangeWaranty(index: any) {
    this.dynamicArray[index].Month = "";
    $('#tblOne > tbody  > tr').each(function () {
      $(this).find('.Month').css('border-color', '');
      $(this).find('.IsWarranty').css('border-color', '');

    });
  }

  ChangeUnit() {
    $('#tblOne > tbody  > tr').each(function () {
      var valueItem = $(this).find('.Unit').val();
      if (valueItem != "0") {
        $(this).find('.Unit').css('border-color', '');
      }
    });
  }

  // brahamjot kaur 7/8/2022
  BindSearchPOCategory(para: string) {
    if (para == "DelAll") {
      this.model.PoCategoryId = [];
    } else if (this.POSearchCategoryList.length > 0) {
      this.SearchPOCategoryId = this.model.PoCategoryId.map(xx => xx.Id).join(',');
      console.log(name);
    }
    console.log(this.model.PoCategoryId);
  }

  ValidationItem() {
    var flag = 0;
    $('#tblOne > tbody  > tr').each(function () {
      var valueName = $(this).find('.ItemName').val();
      if (valueName == '0') {
        $(this).find('.ItemName').css('border-color', 'red');
      }
      var valueMake = $(this).find('.ItemMake').val();
      if (valueMake == '0') {
        $(this).find('.ItemMake').css('border-color', 'red');
      }
      var valueItem = $(this).find('.ItemCode').val();
      if (valueItem == '0') {
        $(this).find('.ItemCode').css('border-color', 'red');
      }
      var value = $(this).find('.itmsRate').val();
      if (value == '') {
        $(this).find('.itmsRate').css('border-color', 'red');
      }
      var valueQty = $(this).find('.itmsQty').val();
      if (valueQty == '0') {
        $(this).find('.itmsQty').css('border-color', 'red');
      }
      var valueUnit = $(this).find('.Unit').val();
      if (valueUnit == '0') {
        $(this).find('.Unit').css('border-color', 'red');
      }

      var valueWarranty = $(this).find('.IsWarranty').val();
      if (valueWarranty == '2') {
        $(this).find('.IsWarranty').css('border-color', 'red');
      }

      if (valueWarranty == '1') {
        var valueMonth = $(this).find('.Month').val();
        if (valueMonth == '') {
          $(this).find('.Month').css('border-color', 'red');
          flag = 1;
        }
      } else {
        $(this).find('.Month').css('border-color', '');
      }

    });

    for (var i = 0, len = this.dynamicArray.length; i < len; i++) {
      if (this.dynamicArray[i].ItemId == "0") {
        return flag = 1;
      } else if (this.dynamicArray[i].Rate == "") {
        $("#txtRate").css('border-color', 'red');
        return flag = 1;
      } else if (this.dynamicArray[i].Qty == "0") {
        return flag = 1;
      } else if (this.dynamicArray[i].ItemNameId == "0") {
        return flag = 1;
      } else if (this.dynamicArray[i].ItemMakeId == "0") {
        return flag = 1;
      }
      else if (this.dynamicArray[i].UnitName == "0") {
        return flag = 1;
      }
      else if (this.dynamicArray[i].IsWarranty == "2") {
        return flag = 1;
      }

      if (this.dynamicArray[i].IsWarrantyReq == 1) {
        if (this.dynamicArray[i].IsWarranty != "1") {
          alert('please Select Warranty Type Yes');
          return flag = 1;
        }
      }
    }

    if (this.dynamicArray.length != 0) {
      if (this.model.AmountChargeable == "" || this.model.AmountChargeable == null) {
        $('#AmountChargeable').css('border-color', 'red');
        $('#AmountChargeable').focus();
        flag = 1;
      } else {
        $("#AmountChargeable").css('border-color', '');
      }
    }
    return flag;
  }

  AmountChargeableKeyPress() {
    $("#AmountChargeable").css('border-color', '');
  }

  RateKeyPress() {
    $('#tblOne > tbody  > tr').each(function () {
      var value = $(this).find('.itmsRate').val();
      if (value != '') {
        $(this).find('.itmsRate').css('border-color', '');
      }
    });

  }

  QtyKeyPress() {
    $('#tblOne > tbody  > tr').each(function () {
      var value = $(this).find('.itmsQty').val();
      if (value != '0') {
        $(this).find('.itmsQty').css('border-color', '');
      }
    });
  }

  AmountKeyPress() {
    $('#tblOne > tbody  > tr').each(function () {
      var value = $(this).find('.itmsTotalAmount').val();
      if (value != '0') {
        $(this).find('.itmsTotalAmount').css('border-color', '');
      }
    });
  }
  //#endregion

  HideShowSaveButton() {
    this.IsEnableAllPoCretionButton = true;
    this.IsPoItemDetialSave = false;
    this.IsDocumentTypeButtonShowHide = false;
    if (this.ArrayRoleId?.length > 0) {

      if (this.ArrayRoleId.filter(res => res.includes(UserRole.PoEditDocumentTypeRole)).length > 0) {
        this.IsEnableAllPoCretionButton = false;
        this.IsPoItemDetialSave = true;
        this.IsDocumentTypeButtonShowHide = true;
      } else if (
        this.ArrayRoleId.filter(res => res.includes(UserRole.PoEditUploadTypeRole)).length > 0) {
        this.IsDocumentTypeButtonShowHide = true;
      }
    }
  }
}


function thousands_separators(num) {
  return num.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
  // var num_parts = num.toString().split(".");
  // num_parts[0] = num_parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  // return num_parts.join(".");
}

function isNumberKey(evt) {
  var charCode = (evt.which) ? evt.which : evt.keyCode;
  if (charCode != 46 && charCode > 31
    && (charCode < 48 || charCode > 57))
    return false;

  return true;
}
var PMComplaince = {};
function fnCallPMComplaince(CircleId, CustomerId, KeyName) {
  window.open("GRNDetail", "_blank");

}

