import { DatePipe } from '@angular/common';
import { Component, ElementRef, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import * as $ from 'jquery';
import { NgxSpinnerService } from 'ngx-spinner';
import { ButtonRendererComponent } from 'src/app/renderer/button-renderer.component';
import { CustomTooltipComponent } from 'src/app/renderer/customtooltip.component';
import { FileRendererComponent } from 'src/app/renderer/file-renderer.component';
import { CommonService } from 'src/app/Service/common.service';
import { GrncrnService } from 'src/app/Service/grncrn.service';
import { MaterialMovementService } from 'src/app/Service/material-movement.service';
import { PurchaseOrderService } from 'src/app/Service/purchase-order.service';
import { SearchpanelService } from 'src/app/Service/searchpanel.service';
import { AmountActivity, ApprovelStatusModel, CommonStaticClass, CompanyStateVendorItemModel, DropdownModel, EmailModel, EmailSendTotalDataModel, MenuName, PageActivity, ReasonActivity, TransPortModeType, UserRole, WebErrorLogModel } from 'src/app/_Model/commonModel';
import { DISearchModel, DispatchTrackingItemDetialModel, DispatchTrackingModel, SearchDispatchTrackerModel } from 'src/app/_Model/DispatchModel';
import { SaveGRNCRNModelDetail, SiteCustomerAutoModel } from 'src/app/_Model/grncrnModel';
import { CellNo, DownLoadZipFileDetial, DynamicItemGrid, DynamicWHAddress, GSerialNumber, VendorOrWhModel } from 'src/app/_Model/purchaseOrderModel';
import { CompanyModel } from 'src/app/_Model/userModel';
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { DomSanitizer } from '@angular/platform-browser';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { GlobalErrorHandlerServiceService } from 'src/app/Service/global-error-handler-service.service';
import * as JSZip from 'jszip';
import * as FileSaver from 'file-saver';
import { ApprovalrendererComponent } from 'src/app/renderer/approvalrenderer/approvalrenderer.component';
import { approvalTooltipComponent } from 'src/app/renderer/Approvaltooltip.component';
import { first } from 'rxjs/operators';
import { SiteServiceService } from 'src/app/Service/site-service.service';
import { DispatchPdfServiceService } from 'src/app/Service/dispatch-pdf-service.service';
import { StockQtyModel } from 'src/app/_Model/StockModel';
import { StockserviceService } from 'src/app/Service/stockservice.service';
import { ItemEquipmentDetail } from 'src/app/_Model/MastersModel';
import { MasterservicesService } from 'src/app/Service/masterservices.service';
import { data, inArray } from 'jquery';
import { AgGridCheckboxComponent } from 'src/app/renderer/ag-grid-checkbox/ag-grid-checkbox.component';
import * as XLSX from 'xlsx';
import { BOQNOListModel } from 'src/app/_Model/BOQRequestModel';
import { BOQRequestequestService } from 'src/app/Service/boqrequestequest.service';
import { UserPageRight } from 'src/app/_Model/UserRoleButtonModel';
import { debug } from 'console';
import { SendmailService } from 'src/app/Service/sendmail.service';
import { Modal } from 'bootstrap'
import { SendMailComponent } from '../../Common/send-mail/send-mail.component';

pdfMake.vfs = pdfFonts.pdfMake.vfs;
var PDFdata = null;
declare var jQuery: any;
@Component({
  selector: 'app-dispatch-tracker',
  templateUrl: './dispatch-tracker.component.html',
  styleUrls: ['./dispatch-tracker.component.sass'],
  providers: [DatePipe]
})
export class DispatchTrackerComponent implements OnInit {
  model: any = {};
  apiCSVIData: any = {};
  dynamicArray: Array<DynamicItemGrid> = [];
  dynamicArrayDispatchPdf: Array<DynamicItemGrid> = [];
  objDynamicWHAddress: Array<DynamicWHAddress> = [];

  //CheckData: Array<DownLoadZipFileDetial> = [];
  public isShownList: boolean; // Grid List
  public isShownEdit: boolean; // Form Edit
  public SingledropdownSettings = {};
  public multiSortKey: string;
  public columnDefs = [];
  public InstallationcolumnDefs = [];
  InstallationrowData = [];
  rowData = [];
  CheckData = [];
  totalSumAcceptedQty: any;
  CompanyData = [];
  SearchStateList = [];
  SearchVendorList = [];
  SearchItemNameList = [];
  WHStateList = [];
  SiteStateList = [];
  VendorStateList = [];
  UserId: any;
  IsVendorTax: boolean = false;
  stockLoading: boolean = false;
  CompanyId: any;
  totalAmount: any;
  totalamount: any;
  EditWHList = [];
  SelectedEditVendorList = [];
  keyword = 'SiteName';
  AutoCompleteSiteCustomerList = [];
  CustomerSitekeyword = 'CustomerSiteId';
  AutoCompleteCustomerSiteIdList = [];
  UniqueSitekeyword = 'SiteId';
  AutoCompleteUniqueSiteIdList = [];
  totalSumQuantity: any;
  Stockstrcount: any;
  totalSumAmount: any;
  totalSumPOQuantity: any;
  StateCodeWhAd = [];
  DispatchTrackingItem = [];
  IsTransferTypeSite: boolean;
  IsTransferTypeWH: boolean;
  IsTransferTypeOtherSite: boolean;
  IsTransferTypeOtherWH: boolean;
  IsTransferTypeVender: boolean;
  // IsRecivedbyandNoOther: boolean;
  // IsRecivedbyandNo: boolean;
  IsTaxInvoiceNo: boolean;
  IsDisabledPreviewGenratebutton: boolean;
  IsSaveButtonDisable: boolean;
  EquipmentTypeList: any;
  ShippedTOWHList: any;
  Taxinvoiceuplodfile: File = null;
  RecDocumentFile: File = null;
  CommonSearchPanelData: any;
  tooltipShowDelay: any;
  frameworkComponents: any;
  ShippedINWHList: any[];
  SearchVendorListById: any[];
  Address: string;
  WHAddress: any;

  DocumentFile: any;
  RecevingDocumentFile: any;
  closeResult: string;
  @ViewChild("content") modalContent: TemplateRef<any>;
  EwayBillDocumentFile: any;
  VechileTypeData: any;
  isAddIntoStock: boolean;
  TransModeDataList: any;
  VechileTypeDataList: any;
  TransferDataList: any;
  PdfStateCodeWhAd: any;
  IsTransferTypeSameState: boolean;
  IsTransferTypeOtherState: boolean;
  GRfileDocumentFile: any;
  DispatchFromList: any;
  OtherSiteStateList: any;
  @ViewChild('inputFile') myInputVariable: ElementRef;
  @ViewChild('BillFile') myBillFileVariable: ElementRef;
  @ViewChild('TaxFile') myTaxFileVariable: ElementRef;
  @ViewChild('DocumentFile') myDocFileVariable: ElementRef;
  IsTaxInvoiceNoSameState: boolean;
  IsDisabledDocumentDownload: boolean;
  IsDisabledTaxInvoiceDownload: boolean;
  DataClientCodeList: any;
  ClientGSTNo: any;
  StateGSTNo: string;
  TableHeight: any;
  IsUnitConversion: boolean;
  TechDataList: any;
  EmpDataList: any;
  COHDataList: any;
  ReceivingFile: any;
  GRFile: any;
  EwayBillfile: any;
  TaxInvoiceFile: any;
  IsReceivingFile: boolean;
  IsGRFile: boolean;
  IsEwayBillfile: boolean;
  IsTaxInvoiceFile: boolean;
  IsTransporter: boolean;
  ReceivedAllQty: boolean;
  IsTransporterReadonly: boolean;
  ApprovalStatusDetail: any;
  ReasonDataList: any;
  ApproveStatusDataList: any;
  title: any;
  ManueId: number;
  CreateName: any;
  CreatedDate: any;
  ModifiedName: any;
  ModifiedDate: any;
  ApprovalList: any = [];
  TableId: any;
  public loadingTemplate;
  public loadingTemplate1;
  public overlayNoRowsTemplate;
  gridApi: any;
  InstallationgridApi: any;
  PageMenuId: any = 14;
  RoleId: any;
  IsApprovalstatusbtnhideShow: boolean;
  ArrayRoleId: any;
  TransporterTypeDetail: any;
  UserName: any;
  IsMultipleSite: boolean;
  SearchSitesPanelData: any;
  IsMetrailInstallationGrid: boolean;
  srnlst: Array<GSerialNumber> = [];
  celllst: Array<CellNo> = [];
  indexv: any;
  strcount: any;
  firstValue: any;
  lastValue: any;
  isEdit: boolean = false;
  headerItemName: string;
  BBChangeValue: string;
  errorMessage: string;
  IsError: boolean = false;
  IsSuccess: boolean = false;
  succesMessage: string;
  loading: boolean = false
  WareHouseId: string;
  ClientList: any;
  IsItemListDisabled: boolean = false;
  ItemAddrowhideshow: boolean;
  IsDisbaledWHDetail: boolean;
  IsHideShowCancelBtn: boolean = false;
  IsReceivedHideShow: boolean = false;
  minDate: { year: number; month: number; day: number; };
  DispatcDataList: any;
  UserRoleId: any;
  ItemReasonData: any;
  CancelReasonData: any;
  DispatchTypeList: any;
  SerialNoList: any;
  EquipmentTypeListOther: any;
  MultiVenAddressList: any;
  VenderFilterAddress: any;
  ValidationerrorMessage: string;
  arry: any;
  IsReceivedDetail: boolean;
  StateINWHList: any;
  ApprovalStatus: any;
  PreviousDatarowData: any;
  PreviousDatacolumnDefs: any;
  DispatchFromSearchList: any;
  PreviousDataHistoryData: any;
  SearchCustomerData: any;
  SelectedSearchCustomerList: any[];
  SearchDispatchTypeList: any[];
  SerialBtnText: string = 'Save';
  rowdatalength: number = 0;
  rowdatacurrentindex: number = 0;
  IsDisableNext: boolean;
  IsDisablePrevious: boolean;
  ReplaceUrl: any[];
  @ViewChild('inputExcelOther', { static: false })
  inputExcelOther: ElementRef;
  @ViewChild('inputExcelBB', { static: false })
  inputExcelBB: ElementRef;



  public MultidropdownSettings = {};
  Exportloading: boolean;
  IsDispatchFor: boolean;
  IsValidationShowandhide: boolean;
  IsBiltyValidationShowandhide: boolean = false;
  IsRecivedButtonDisable: boolean;
  IsDispatchPreview: boolean;
  DispatchStartDate: { year: number; month: number; day: number; };
  min: { year: number; month: number; day: number; };
  IsEditDisabled: boolean;
  IsPreviewhideandShow: boolean;
  DateFormate: any;
  //maxDate:any;
  MaxDate: { year: number; month: number; day: number; };
  CorrectionItemCodeList: any;
  CorretionEntryReasonDetail: any;
  Correctioncolumnhideandshow: boolean;
  RoleCorrectionEntry: boolean = false;
  IsTransferTypeCenterRepaired: boolean;
  SaleUnitData: any;
  IsVendprScrapSale: boolean;
  IsSerialValidationShowHide: boolean;
  IsCustomerReturnAfterRepaired: boolean;
  GettAllCustomerList: any;
  GettAllCRNNoList: any;
  IsByHand: boolean;
  IsCourier: boolean;
  IsBus: boolean;
  IsVehicleType: boolean;
  IsOther: boolean;
  IsVehicleValidationHideShow: boolean;
  TransporterAndCourierTypeDetail: any;
  CourierTypeDetail: any;
  IsPartialUpDateDispatchRequest: boolean;
  DispatchInstructionList: any[] = [];
  IsDispatchInstraction: boolean;
  DIStatusList: any;
  DispatchEditInstructionId: any;
  CreateDispatchForDIId: string;
  DispatchTypeHideShow: boolean = false;
  VendorScaleVissible: boolean = false;
  ShippedTOVendorWHList = [];
  selectedDIArr: any[] = [];
  ObjUserPageRight = new UserPageRight();
  Save: any;
  DispatchTracker_Id: number = 0;
  IsTaxInvoiceDate: boolean; //vishal, 02/12/2022
  IsTaxInvoiceDateSameState: boolean; //vishal, 03/12/2022

  public IsModelShow: boolean; // Grid List
  public IsMailButtonHide: boolean; //vishal, 13/12/2022

  //by:vishal, 27/11/2022, desc: for model popup send mail
  show(modalRef: ElementRef) {
    const modal = new Modal(modalRef.nativeElement);
    modal.show();

  }
  // show2(modalRef: ElementRef) {
  //   const modal = new Modal(modalRef.nativeElement);
  //   modal.show();

  // }
  //end-vishal


  constructor(private router: Router, private _Commonservices: CommonService,
    private _GrncrnService: GrncrnService,
    private _MaterialMovementService: MaterialMovementService,
    private _objSearchpanelService: SearchpanelService,
    private Loader: NgxSpinnerService, private _PurchaseOrderService: PurchaseOrderService,
    private sanitizer: DomSanitizer, private _GlobalErrorHandlerService: GlobalErrorHandlerServiceService,
    private _SiteServiceService: SiteServiceService,
    private datePipe: DatePipe, private modalService: NgbModal,
    private _DispatchPdfServiceService: DispatchPdfServiceService,
    private _StockserviceService: StockserviceService, private _MasterService: MasterservicesService,
    private _BOQService: BOQRequestequestService, private _objSendMailService: SendmailService) {
    this.tooltipShowDelay = 0;
    this.frameworkComponents = {
      buttonRenderer: ButtonRendererComponent,
      fileRenderer: FileRendererComponent,
      customtooltip: CustomTooltipComponent,
      approvalTooltip: approvalTooltipComponent,
      AgGridCheckboxRenderer: AgGridCheckboxComponent,
    }

    this._objSearchpanelService.SearchPanelSubject.subscribe(data => {
      this.CommonSearchPanelData = data;
    });
    this._SiteServiceService.SearchSitesPanelSubject.subscribe(data => {
      this.SearchSitesPanelData = data;
    });

  }

  ngOnInit(): void {

    this.GettAllVechTransModeTransfertypeDispatch();
    this.model.TransporterId = "0";
    this.model.DispatchTo = "0";
    this.model.IsActiveCancel = 2;
    this.model.CustomerId = "0";
    //this.MetrailInstallationGrid();
    this.isShownList = false;
    this.IsModelShow = false;
    this.isShownEdit = true;
    this.IsDispatchPreview = true;
    var objUserModel = JSON.parse(sessionStorage.getItem("UserSession"));
    this.UserId = objUserModel.User_Id;
    this.UserName = objUserModel.User_Id;
    this.IsApprovalstatusbtnhideShow = false;
    this.ArrayRoleId = objUserModel.Role_Id.split(',');
    for (var i = 0, len = this.ArrayRoleId.length; i < len; i++) {
      if (this.ArrayRoleId[i] == "4") {
        this.UserRoleId = this.ArrayRoleId[i];
      } else if (this.ArrayRoleId[i] == UserRole.DispatchCorrectionEntryRole) {
        this.RoleCorrectionEntry = true;
      }
    }

    if (objUserModel == null || objUserModel == "null") {
      this.router.navigate(['']);
    }

    var objCompanyModel = new CompanyModel();
    objCompanyModel = JSON.parse(sessionStorage.getItem("CompanyIdSession"));
    this.CompanyId = objCompanyModel.Company_Id;
    this.model.PreviewCompanyName = objCompanyModel.FullName;

    this.BindCompanyStateVendorItem();

    this.columnDefs = [
      {
        headerName: 'Edit',
        cellRenderer: 'buttonRenderer',
        cellRendererParams: {
          onClick: this.ShowDispatcTrackerDetail.bind(this),
          label: 'edit'
        }, pinned: 'left',
        width: 35,
        filter: false
      },
      {
        headerName: 'Approval [L1]',
        cellRendererFramework: ApprovalrendererComponent,
        pinned: 'left',
        width: 60,
        filter: false,
        field: 'DisatchTrackeringId',
        tooltipField: 'DisatchTrackeringId', tooltipComponent: 'approvalTooltip',
      },

      {
        headerName: 'Dispatch File',
        field1: 'cbox', pinned: 'left',
        width: 35,
        filter: false,
        cellRendererSelector:
          function (params) {
            var ShowCheckBox = {
              component: 'AgGridCheckboxRenderer'
            };
            var HideCheckBox = {
              component: ''
            };
            if (params.data.DocumentFile == null || params.data.DocumentFile == '') {
              return HideCheckBox
            }
            else {
              return ShowCheckBox;
            }
          }
      },

      {
        cellRendererSelector: function (params) {
          var ShowFile = {
            component: 'fileRenderer'
          };
          var HideFile = {
            component: ''
          };
          if (params.data.DocumentFile == null || params.data.DocumentFile == '') {
            return HideFile
          }
          else {
            return ShowFile;
          }
        }, cellRendererParams: {
          onClick: this.onfiledownload.bind(this),
          label: 'File'
        }, pinned: 'left',
        width: 38,
        filter: false,
      },

      //vishal 17/09/2022
      {
        headerName: 'Bilty File',
        field2: 'cbox', pinned: 'left',
        width: 35,
        filter: false,
        cellRendererSelector: function (params) {
          var ShowCheckBox = {
            component: 'AgGridCheckboxRenderer',
          };
          var HideCheckBox = {
            component: ''
          };
          if (params.data.BiltyFile == null || params.data.BiltyFile == '') {
            return HideCheckBox
          }
          else {
            return ShowCheckBox;
          }
        },
      },

      {
        // headerName: 'Doc',
        cellRendererSelector: function (params) {
          var ShowFile = {
            component: 'fileRenderer'
          };
          var HideFile = {
            component: ''
          };
          if (params.data.BiltyFile == null || params.data.BiltyFile == '') {
            return HideFile
          }
          else {
            return ShowFile;
          }
        }, cellRendererParams: {
          onClick: this.onbiltyfiledownload.bind(this),
          label: 'File'
        }, pinned: 'left',
        width: 38,
        filter: false
      },

      {
        headerName: 'Rcving Doc',
        cellRendererSelector: function (params) {
          var ShowFile = {
            component: 'fileRenderer'
          };
          var HideFile = {
            component: ''
          };
          if (params.data.ReceivingDocumentFile == null || params.data.ReceivingDocumentFile == '') {
            return HideFile
          }
          else {
            return ShowFile;
          }
        }, cellRendererParams: {
          onClick: this.RecDocumentfiledownload.bind(this),
          label: 'File'
        }, pinned: 'left',
        width: 70,
        filter: false,
      },
      { headerName: 'Document No', field: 'DocumentNo', width: 150 },
      { headerName: 'Dispatch Date', field: 'DocumentDate', width: 110, sortable: true },
      { headerName: 'Item Name', field: 'ItemName', width: 100, resizable: true },
      { headerName: 'Item Description', field: 'ItemDescription', tooltipField: 'ItemDescription', tooltipComponent: 'customtooltip', width: 150, resizable: true },
      { headerName: 'Customer Name', field: 'CustomerName', width: 150, resizable: true },
      { headerName: 'Site ID', field: 'CustomerSiteId', width: 100, resizable: true },
      { headerName: 'SiteName', field: 'SiteName', width: 150 },
      { headerName: 'Destination', field: 'Destination', width: 150, resizable: true },
      { headerName: 'Dispatch Qty', field: 'Quantity', width: 120, resizable: true },
      { headerName: 'Cancel by', field: 'CancelBy', width: 100, resizable: true },
      { headerName: 'Cancel Date', field: 'CancelDate', width: 100, resizable: true },
      // { headerName: 'Cancel Reason', field: 'CancelReason', width: 100,resizable: true  },
      // { headerName: 'Gross Total', field: 'GrossTotal', width: 100 },
      // { headerName: 'STN Status', field: 'STNStatus', width: 100 },
      // { headerName: 'Installation Date', field: 'InstallationDate', width: 100 },
      // { headerName: 'GR No', field: 'GRNo', width: 80 },
      // { headerName: 'GR Date', field: 'GRDate', width: 100 },
      // { headerName: 'TaxInvoice NO', field: 'TaxInvoiceNO', width: 150 },
    ];

    this.multiSortKey = 'ctrl';
    this.SingledropdownSettings = {
      singleSelection: true,
      text: "Select",
      unSelectAllText: 'UnSelect All',
      enableSearchFilter: true,
      badgeShowLimit: 1,
    };
    this.loadingTemplate =
      `<span class="ag-overlay-loading-center">loading...</span>`;
    this.loadingTemplate1 =
      `<span class="ag-overlay-loading-center">loading...</span>`;

    setTimeout(() => {
    }, 400);
    this.BindTransporterTypeDetail();

    const current = new Date();
    this.minDate = {
      year: current.getUTCFullYear(),
      month: current.getMonth() + 1,
      day: current.getDate()
    };

    this.min = {
      year: current.getUTCFullYear(),
      month: current.getMonth() + 1,
      day: current.getDate() - 3
    };

    this.MaxDate = {
      year: current.getUTCFullYear(),
      month: current.getMonth() + 1,
      day: current.getDate()
    };

    this.GetCustomerName();
    this.ItemReason();
    this.MultidropdownSettings = {
      singleSelection: false,
      text: "Select",
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      enableSearchFilter: true,
      // limitSelection:1
      badgeShowLimit: 1,
      position: 'top', autoPosition: true
    };
    this.BindCorrectionentryReason();
    this.VendorSaleUnit();
    this.BindDispatchInstructionStatus();
    this.CreateDispatchForDIId = "0";
    this.CreateDispatchForDIId = localStorage.getItem('DIRequestId');
    if (this.CreateDispatchForDIId != "0" && this.CreateDispatchForDIId != null) {
      setTimeout(() => {
        this.CreateNew();
        localStorage.removeItem('DIRequestId');
      }, 1000);
    }
    //brahamjot kaur 31/10/2022
    this.GetUserPageRight(this.DispatchTracker_Id);
  }


  //brahamjot kaur 31/10/2022
  async GetUserPageRight(id: number) {
    this._Commonservices.GetUserPageRight(this.UserId, MenuName.DispatchTracker).subscribe(data => {
      if (data.Status == 1) {
        //console.log(data);
        this.ObjUserPageRight.IsSearch = data.Data[0].IsSearch;
        this.ObjUserPageRight.IsExport = data.Data[0].IsExport;
        this.ObjUserPageRight.IsCreate = data.Data[0].IsCreate;
        this.ObjUserPageRight.IsEdit = data.Data[0].IsEdit;
        this.ObjUserPageRight.IsBulkPdfDwnload = data.Data[0].IsBulkPdfDwnload;
        this.ObjUserPageRight.IsGenPdf = data.Data[0].IsGenPdf;
        this.ObjUserPageRight.IsDelete = data.Data[0].IsDelete;

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

  gridOptions = {
    animateRows: false,
    enableCellChangeFlash: false,
  };

  GettAllVechTransModeTransfertypeDispatch() {
    try {
      this._MaterialMovementService.GetVechileTypeAndTransPortMode().pipe(first()).subscribe(data => {
        if (data.Status == 1) {
          if (data.Data != null && data.Data != "") {
            this.VechileTypeDataList = data.Data;
          }
          if (data.TModeData != null && data.TModeData != "") {
            this.TransModeDataList = data.TModeData;
          }
          if (data.TransferData != null && data.TransferData != "") {

            this.TransferDataList = data.TransferData;
            this.DispatcDataList = data.TransferData;
          }
          if (data.DispatchFrom != null && data.DispatchFrom != "") {
            this.DispatchFromList = data.DispatchFrom;
            this.DispatchFromSearchList = data.DispatchFrom;
          }

        }
      }, error => {
        this._Commonservices.ErrorFunction(this.UserName, error.message, "GettAllVechTransModeTransfertypeDispatch", "WHTOSite");
      });
    } catch (Error) {
      this._Commonservices.ErrorFunction(this.UserName, Error.message, "GettAllVechTransModeTransfertypeDispatch", "WHTOSite");
    }
  }

  // change by Hemant Tyagi 01/08/2022 
  // add multi selete drop down
  GetAllDispatchInstructionNo(whId: any) {
    try {
      var objModel = new BOQNOListModel();
      objModel.circleId = null;
      objModel.CompanyId = this.CompanyId;
      objModel.SearchText = "";
      objModel.WHId = whId;
      objModel.Flag = 6;
      this.DispatchInstructionList = [];
      this._BOQService.GetBOQNoORBOQRequestNo(objModel).subscribe((data) => {
        if (data.Data != "") {
          this.DispatchInstructionList = data.Data;
          // if (this.DispatchEditInstructionId != "0") {
          //   this.model.DispatchInstructionId = this.DispatchEditInstructionId;
          // }
        } else {
          this.DispatchInstructionList = [];
          //this.model.DispatchInstructionId = "0";
        }
      })
    } catch (Error) {
      this._Commonservices.ErrorFunction(this.UserName, Error.message, "GetAutoCompleteMRNO", "ApprovalStatus");
    }
  }

  GetAllDispatchInstructionNoEdit(whId: number, dtId: number, strDI: string) {
    try {
      var objModel = new BOQNOListModel();
      objModel.circleId = null;
      objModel.CompanyId = this.CompanyId;
      objModel.SearchText = "";
      objModel.WHId = whId;
      objModel.DTId = dtId;
      objModel.Flag = 7;
      this.DispatchInstructionList = [];
      this._BOQService.GetBOQNoORBOQRequestNo(objModel).subscribe((data) => {
        if (data.Data != "") {
          this.DispatchInstructionList = data.Data;
          let selDIArr = [];
          if (strDI != '0') {
            selDIArr = strDI.split(',');
          }

          for (var icount = 0; selDIArr.length > icount; icount++) {
            var res = this.DispatchInstructionList.filter(xx => xx.id == parseInt(selDIArr[icount]));
            this.selectedDIArr.push(res[0]);
          }

        } else {
          this.DispatchInstructionList = [];
        }
      })
    } catch (Error) {
      this._Commonservices.ErrorFunction(this.UserName, Error.message, "GetAutoCompleteMRNO", "ApprovalStatus");
    }
  }

  // change by Hemant Tyagi 01/08/2022  
  ChangeDispatchInstruction(para: string) {
    let multiSelectDI = "0";
    if (para == "DelAll") {
      this.selectedDIArr = [];
    } else if (this.selectedDIArr.length > 0) {
      multiSelectDI = this.selectedDIArr.map(xx => xx.id).join(',');
    }

    try {
      var objModel = new DISearchModel();
      objModel.DispatchInstruction_Id = multiSelectDI;
      //commont by Hemant Tyagi
      this._MaterialMovementService.SearchDispatchInstructionListByDIId(objModel).subscribe((data) => {
        if (data.Data != "") {
          this.BindItemArray(data.Data)
        } else {
          alert('Please Select DI No.?');
        }
      })
    } catch (Error) {
      this._Commonservices.ErrorFunction(this.UserName, Error.message, "ChangeDispatchInstruction", "Dispatch Tracker");
    }
  }


  AutoFillDispatchDetailByDIId(DIId: any) {
    try {
      var objModel = new DISearchModel();
      objModel.DispatchInstruction_Id = DIId;
      this.DispatchEditInstructionId = DIId
      objModel.UserId = this.UserId;
      objModel.Flag = null;
      this._MaterialMovementService.AutoFillDispatchDetailByDIId(objModel).subscribe((data) => {
        if (data.Data != "") {
          if (data.Data[0].PageFlag == 5) {
            this.model.TransferTypeId = data.Data[0].PageFlag;
            this.model.ddlStateId = data.Data[0].StateId;
            this.BindStateCodeWHAdd(this.model.ddlStateId);
            this.ChangeTransferType(data.Data[0].PageFlag);
            this.ChangeDispatchInstruction(DIId);
            //this.onChangeSearchCustomerSiteId(data.Data[0].CustomerSiteId);
            this.SelectCustomerSiteId(data.SiteData[0]);
            this.CreateDispatchForDIId = null;
          } else {
            var objVendorOrWh = new VendorOrWhModel();
            objVendorOrWh.Id = this.CompanyId;
            this._MaterialMovementService.GetAllState(objVendorOrWh).pipe(first()).subscribe(data => {
              if (data.Status == 1) {
                if (data.Data != null && data.Data != "") {
                  this.OtherSiteStateList = data.Data.filter(m => m.id != 0).reduce(
                    (accumulator, current) => {
                      if (!accumulator.some(x => x.id === current.id)) {
                        accumulator.push(current)
                      }
                      return accumulator;
                    }, []
                  )
                }
              }
            }, error => {
              this._Commonservices.ErrorFunction(this.UserName, error.message, "ChangeTransferType", "WHTOSite");
            });
            this.model.TransferTypeId = data.Data[0].PageFlag;

            setTimeout(() => {
              this.model.ddlStateId = data.Data[0].StateId;
              this.BindStateCodeWHAdd(this.model.ddlStateId);
              this.ChangeTransferType(this.model.TransferTypeId);
              this.ChangeDispatchInstruction(DIId);
              this.model.ToSiteStateId = data.Data[0].ToStateId;
              this.ChangeSiteOtherState(this.model.ToSiteStateId);
              this.SelectCustomerSiteId(data.SiteData[0]);
              this.CreateDispatchForDIId = null;
            }, 1500);
          }
        } else {
          alert('Already Done Dispatch Tracker Respect This DI No');
          this.CreateDispatchForDIId = null;
        }
      })
    } catch (Error) {
      this._Commonservices.ErrorFunction(this.UserName, Error.message, "GetAutoCompleteMRNO", "ApprovalStatus");
    }
  }

  BindDispatchInstructionStatus() {
    var objdropdownmodel = new DropdownModel();
    objdropdownmodel.User_Id = 0;
    objdropdownmodel.Parent_Id = "0";
    objdropdownmodel.Company_Id = this.CompanyId;
    objdropdownmodel.Flag = 'DIStatus';
    this._Commonservices.getdropdown(objdropdownmodel).subscribe(data => {
      if (data.Status == 1) {
        this.DIStatusList = data.Data;
      }
    });
  }

  BackDIPage() {
    this.router.navigate(['/DispatchInstruction']);
  }

  //#region Code By Umesh, Hemant

  showModal(value: number, index: number): void {
    this.indexv = index;
    var qty = this.dynamicArray[index].Qty;
    var unitTag = this.dynamicArray[this.indexv].UnitName;
    var ItemNameId = this.dynamicArray[this.indexv].ItemNameId
    if (this.model.TransferTypeId != PageActivity.Dis_VendorScrapSale) {
      // validation on ItemName
      if (this._Commonservices.checkUndefined(ItemNameId) == "" || this._Commonservices.checkUndefined(ItemNameId) == '0' || this._Commonservices.checkUndefined(ItemNameId) == '0.00') {
        this.ValidationerrorMessage = "Please select item name.";
        jQuery('#Validationerror').modal('show');
        return;
      }
      // validation on Qty
      if (this._Commonservices.checkUndefined(qty) == ""
        || this._Commonservices.checkUndefined(qty) == '0'
        || this._Commonservices.checkUndefined(qty) == '0.00') {
        this.ValidationerrorMessage = "Please enter atleast 1 qty.";
        jQuery('#Validationerror').modal('show');
        return;
      }

      // validation on unit
      if (this._Commonservices.checkUndefined(unitTag) == "" || this._Commonservices.checkUndefined(unitTag) == '0' || this._Commonservices.checkUndefined(unitTag) == '0.00') {
        this.ValidationerrorMessage = "Please enter unit.";
        jQuery('#Validationerror').modal('show');
        return;
      }
      if (this._Commonservices.checkUndefined(unitTag) == "" || this._Commonservices.checkUndefined(unitTag) == '0' || this._Commonservices.checkUndefined(unitTag) == '0.00') {
        this.ValidationerrorMessage = "Please enter unit.";
        jQuery('#Validationerror').modal('show');
        return;
      }

      // by Default declare 48
      this.BBChangeValue = '48';

      // get Item Id and Name from item List.
      const result = this.SearchItemNameList.filter(element => {
        return element.id === parseInt(ItemNameId);
      });
      this.headerItemName = result[0].itemName;

      if (this.IsMandatory(index) == true) {
        if (ItemNameId != "4") {
          this.genrateOther(index);
        } else {
          if (unitTag == '8') {
            this.genrateBb(48);
          } else {
            this.genrateOther(index);
          }
        }
      }
    }
  }

  // show model for AC/DG etc except the BB.
  genrateOther(index: any) {
    this.srnlst = [];
    this.dynamicArray[index].InitiallValue = ''
    this.dynamicArray[index].lastValue = ''
    for (var i = 0; i < parseInt(this.dynamicArray[index].Qty); i++) {
      var srnData = new GSerialNumber();
      if (this.dynamicArray[index].GSerialNumbers.length > i) {
        srnData.InitialSrno = this.dynamicArray[index].GSerialNumbers[i].InitialSrno;
      } else {
        srnData.InitialSrno = '';
      }
      this.srnlst.push(srnData);
    }
    this.strcount = this.srnlst.length;

    var id = "#myModal";
    jQuery(id).modal('show');

    jQuery('#myModal').modal({
      backdrop: 'static',
      keyboard: false  // to prevent closing with Esc button (if you want this too)
    });
  }

  // bind serial no on Other item on blur on initialVal or LastValue
  initialsrn() {
    //this.ReceiveddynamicArray[this.indexv].GSerialNumbers = this.srnlst;
    var lstvale = this.getLastNumber(this.lastValue);
    var firstVale = this.getLastNumber(this.firstValue);
    var diff = lstvale - firstVale;
    if (lstvale != '') {
      var incerMentValue = this.firstValue;
      for (var i = 0; i < this.srnlst.length; i++) {
        if (i == 0) {
          this.srnlst[i].InitialSrno = this.firstValue;
        } else {
          incerMentValue = this.getAndIncrementLastNumber(incerMentValue);
          this.srnlst[i].InitialSrno = incerMentValue;
        }
      }
    }
  }

  // Add serial no of AC/DG etc except the BB into main array 
  addBtn() {
    let SerialNo = "";
    let isDup = false
    let uniq_values = []
    //iterate the source data
    for (let x of this.srnlst) {
      if (uniq_values.indexOf(x.InitialSrno) != -1) {
        isDup = true
        SerialNo = x.InitialSrno;
        break
      } else {
        uniq_values.push(x.InitialSrno)
      }
    }

    if (isDup == true) {
      alert("Please enter unique serialno.(" + SerialNo + ")");
      return false;
    }

    for (var i = 0; i < this.srnlst.length; i++) {
      SerialNo = this.srnlst[i].InitialSrno;
      if (SerialNo == null || SerialNo.trim() == "") {
        alert("Please enter serialno");
        return false;
      } else if (SerialNo.length < 4) {
        alert("Please enter serialno minimum 4-digits.(" + SerialNo + ")");
        return false;
      }
    }
    this.dynamicArray[this.indexv].GSerialNumbers = this.srnlst;
    this.hideModal();
    this.IsError = false;
  }

  // hide  Other model on cancel
  hideModal(): void {
    jQuery("#myModal").modal('hide');
  }

  // show model for the BB.
  genrateBb(value: number) {
    this.srnlst = [];
    var cellVoltId = this.dynamicArray[this.indexv].ItemId;
    const result = this.dynamicArray[this.indexv].EditItemCode.filter(element => {
      return element.id === parseInt(cellVoltId);
    });
    var cellVolt = result[0].CellVolt;
    value = value / cellVolt;
    for (var i = 0; i < parseInt(this.dynamicArray[this.indexv].Qty); i++) {
      var srnData = new GSerialNumber();
      for (var j = 0; j < value; j++) {
        var oc = new CellNo();
        oc.Sequance = i.toString();
        debugger
        var celllength = this.dynamicArray[this.indexv].GSerialNumbers.length;
        debugger
        if (celllength > i) {
          // Error Comming
          oc.CellValue = this.dynamicArray[this.indexv].GSerialNumbers[i].CellNos[j].CellValue;
        } else {
          oc.CellValue = '';
        }
        srnData.CellNos.push(oc);
      }
      srnData.InitialSrno = '';
      this.srnlst.push(srnData)
    }
    this.strcount = this.srnlst.length;
    jQuery('#bb').modal('show');
  }

  // bind serial no on BB item on blur on initialVal or LastValue
  bbChange(index: any) {
    var lstvale = this.getLastNumber(this.srnlst[index].BBLast);
    var firstVale = this.getLastNumber(this.srnlst[index].BBInitial);
    var inmentValue = this.srnlst[index].BBInitial;
    var diff = lstvale - firstVale;
    if (diff > this.srnlst[index].CellNos.length) {
      diff = this.srnlst[index].CellNos.length;
    }
    for (var i = 0; i < diff; i++) {
      if (i == 0) {
        this.srnlst[index].CellNos[i].CellValue = this.srnlst[index].BBInitial;
      } else {
        inmentValue = this.getAndIncrementLastNumber(inmentValue)
        this.srnlst[index].CellNos[i].CellValue = inmentValue;
      }
    }
  }

  // Add serial no of the BB into main array 
  addBb() {
    try {
      var BB_SerialArr: string[] = []
      for (var j = 0; j < this.srnlst.length; j++) {
        for (var i = 0; i < this.srnlst[j].CellNos.length; i++) {
          var oc = new CellNo();
          BB_SerialArr.push(this.srnlst[j].CellNos[i].CellValue); // by hemant tygai
        }
      }

      let SerialNo = "";
      let isDup = false
      let uniq_values: string[] = []
      //iterate the source data    
      for (let x of BB_SerialArr) {
        if (uniq_values.indexOf(x) != -1) {
          isDup = true
          SerialNo = x;
          break
        } else {
          uniq_values.push(x)
        }
      }

      if (isDup == true) {
        if (SerialNo == null || SerialNo.trim() == "") {
          alert("Please enter serialno");
          return false;
        } else {
          alert("Please enter unique serialno.(" + SerialNo + ")");
          return false;
        }
      }
      for (var i = 0; i < BB_SerialArr.length; i++) {
        SerialNo = BB_SerialArr[i];
        if (SerialNo == null || SerialNo.trim() == "") {
          alert("Please enter serialno");
          return false;
        } else if (SerialNo.length < 4) {
          alert("Please enter serialno minimum 4-digits.(" + SerialNo + ")");
          return false;
        }
      }
      this.dynamicArray[this.indexv].GSerialNumbers = this.srnlst;
      this.hidebbModal();
    } catch (error) {
      alert(error)
    }
  }

  // hide  BB model on cancel
  hidebbModal(): void {
    jQuery("#bb").modal('hide');
  }

  // Increment the Serial no
  getAndIncrementLastNumber(str) {
    return str.replace(/\d+$/, function (s) {
      return +s + 1;
    });
  }

  // get Last the Serial no
  getLastNumber(source) {
    var lastNum = source.replace(/.*?(\d+)[^\d]*$/, '$1')
    return lastNum;
  }

  validateItemData() {
    let returnValue = 0;
    // change by Hemant Tyagi 26/09/2022
    if ((this.model.TransferTypeId == PageActivity.Dis_VendorScrapSale)) {
      returnValue = 0;
    } else if ((
      (this.model.TransferTypeId == PageActivity.Dis_SiteOtherState && this.model.GSTType == "1")
      || this.model.TransferTypeId == PageActivity.Dis_WHOtherState
      || this.model.TransferTypeId == PageActivity.Dis_VendorSale) && (this.model.DisatchTrackeringId > 0)) {
      returnValue = this.serialNoValidation();
    } else if (
      (this.model.TransferTypeId == PageActivity.Dis_SiteOtherState && this.model.GSTType == "2")
      || (this.model.TransferTypeId == PageActivity.Dis_SiteWithinState)
      || (this.model.TransferTypeId == PageActivity.Dis_WHWithinState)
      || (this.model.TransferTypeId == PageActivity.Dis_Vendor)
      || (this.model.TransferTypeId == PageActivity.Dis_RepairingCenter)
      || (this.model.TransferTypeId == PageActivity.Dis_CustomerReturn)
    ) {
      returnValue = this.serialNoValidation();
    }
    return returnValue;
  }

  //Add Stock validation by Hemant Tyagi  13/06/2022
  validateStockQty() {
    let returnValue = 0;
    var DefaultySetValue = 48
    if (this.model.TransferTypeId != PageActivity.Dis_CustomerReturn && this.model.DisatchTrackeringId == 0) {

      for (var i = 0; i < this.dynamicArray.length; i++) {
        let Qty = 0, FQty = 0;
        FQty = (this.dynamicArray[i].FQty ?? 0);
        Qty = (this.dynamicArray[i].Qty ?? 0);

        var ItemNameId = this.dynamicArray[i].ItemNameId
        const resultItemList = this.SearchItemNameList.filter(element => {
          return element.id === parseInt(ItemNameId);
        });

        var itmName = resultItemList[0].itemName;

        if (itmName == 'BB' && this.dynamicArray[i].UnitName == '8') {
          const resultItemCodeList = this.dynamicArray[i].EditItemCode.filter(element => {
            return element.id === parseInt(this.dynamicArray[i].ItemId);
          });
          var cellVolt = resultItemCodeList[0].CellVolt;
          Qty = (DefaultySetValue / cellVolt) * (Qty);
        }

        if (Qty > FQty && itmName != "MISC") {
          this.IsError = true;
          this.errorMessage = "Dispatch(" + itmName + ") Qty can not be greater then stock Qty(" + FQty + ")."
          returnValue = 1;
          return returnValue;
        }
      }
    }
    return returnValue;
  }

  IsMandatory(index: any) {
    var ItemNameId = this.dynamicArray[index].ItemNameId
    const result = this.SearchItemNameList.filter(element => {
      return element.id === parseInt(ItemNameId);
    });
    return result[0].IsSerialReq;
  }

  //#endregion

  //#region Excel Upload
  SerialNoExcelUpload(evt: any) {
    try {
      //this.srnlst = [];      
      let ExeclImportData: any[] = [];
      type AOA = any[][];
      /* wire up file reader */
      const target: DataTransfer = <DataTransfer>(evt.target);
      if (target.files.length !== 1) {
        throw new Error('Cannot use multiple files');
      }
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
            if (ColuName == "SerialNo") {
              hdr = ColuName
            } else {
              alert("Invalid Column Name _" + ColuName);
              this.myInputVariable.nativeElement.value = '';
              return false;
            }
          }
          // headers.push(hdr);
        }

        //this.indexv
        ExeclImportData = <AOA>(XLSX.utils.sheet_to_json(ws, { raw: true }));
        if (ExeclImportData.length > 0 && ExeclImportData != null) {
          if (this.dynamicArray[this.indexv].ItemNameId == '4' && this.dynamicArray[this.indexv].UnitName == '8') {
            let iCount_BB_Cell = 0;
            for (var j = 0; j < this.srnlst.length; j++) {
              for (var i = 0; i < this.srnlst[j].CellNos.length; i++) {
                this.srnlst[j].CellNos[i].Sequance = i.toString();
                if (ExeclImportData.length > iCount_BB_Cell) {
                  this.srnlst[j].CellNos[i].CellValue = ExeclImportData[iCount_BB_Cell].SerialNo.toString();
                } else {
                  this.srnlst[j].CellNos[i].CellValue = '';
                }
                iCount_BB_Cell++;
              }
            }
          } else {
            for (var i = 0; i < this.srnlst.length; i++) {
              if (ExeclImportData.length > i) {
                this.srnlst[i].InitialSrno = ExeclImportData[i].SerialNo.toString();
              } else {
                this.srnlst[i].InitialSrno = ''
              }
            }
          }
          this.strcount = this.srnlst.length;
        }
        this.resetExcel();
      };
      reader.readAsBinaryString(target.files[0]);
    } catch (Error) { }
  }

  ClearSerialNoList() {
    if (this.dynamicArray[this.indexv].ItemNameId == '4' && this.dynamicArray[this.indexv].UnitName == '8') {
      for (var j = 0; j < this.srnlst.length; j++) {
        this.srnlst[j].BBInitial = '';
        this.srnlst[j].BBLast = '';
        for (var i = 0; i < this.srnlst[j].CellNos.length; i++) {
          var oc = new CellNo();
          this.srnlst[j].CellNos[i].CellValue = '';
        }
      }
    } else {
      this.firstValue = '';
      this.lastValue = '';
      for (var i = 0; i < this.srnlst.length; i++) {
        this.srnlst[i].InitialSrno = '';
      }
    }
  }

  resetExcel() {
    this.inputExcelOther.nativeElement.value = "";
    this.inputExcelBB.nativeElement.value = "";
  }

  SerialNoExcelSample: any = [{
    SerialNo: 'Amr0212334'
  }];

  DownloadSerialNoExcelSample() {
    this._PurchaseOrderService.exportAsExcelFile(this.SerialNoExcelSample, 'SampleExcel');
  }

  //#endregion

  VendorSaleUnit() {
    try {
      var objdropdownmodel = new DropdownModel();
      objdropdownmodel.User_Id = 0;
      objdropdownmodel.Parent_Id = "2595"///  2589 for local
      objdropdownmodel.Company_Id = this.CompanyId;
      objdropdownmodel.Other_Id = "0";
      objdropdownmodel.Flag = 'CommonReason';
      this._Commonservices.getdropdown(objdropdownmodel).pipe(first()).subscribe(item => {
        this.SaleUnitData = item.Data;
      }, error => {
        this._Commonservices.ErrorFunction(this.UserName, error.message, "DispatchItemReason", "Dispatch");
      });
    } catch (Error) {
      this._Commonservices.ErrorFunction(this.UserName, Error.message, "DispatchItemReason", "Dispatch");
    }
  }

  ItemReason() {
    try {
      var objdropdownmodel = new DropdownModel();
      objdropdownmodel.User_Id = 0;
      objdropdownmodel.Parent_Id = "1502";
      objdropdownmodel.Company_Id = this.CompanyId;
      objdropdownmodel.Other_Id = "0";
      objdropdownmodel.Flag = 'CommonReason';
      this._Commonservices.getdropdown(objdropdownmodel).pipe(first()).subscribe(item => {
        this.ItemReasonData = item.Data,
          this.CancelReasonData = item.Data
      }, error => {
        this._Commonservices.ErrorFunction(this.UserName, error.message, "DispatchItemReason", "Dispatch");
      });
    } catch (Error) {
      this._Commonservices.ErrorFunction(this.UserName, Error.message, "DispatchItemReason", "Dispatch");
    }
  }

  fnNextList() {
    try {
      this.rowdatacurrentindex = this.rowdatacurrentindex + 1;
      var Id = this.rowData[this.rowdatacurrentindex].DisatchTrackeringId;
      this.fnNextandPreviousDisable();
      this.SearchDispatchTrackerEditListByDispatchId(Id);
    } catch (Error) {
      console.log(Error.message)
    }
  }

  fnPreviousList() {
    try {
      this.rowdatacurrentindex = this.rowdatacurrentindex - 1;
      var Id = this.rowData[this.rowdatacurrentindex].DisatchTrackeringId;
      this.fnNextandPreviousDisable();
      this.SearchDispatchTrackerEditListByDispatchId(Id);
    } catch (Error) {
      console.log(Error.message)
    }
  }

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

  MetrailInstallationGrid() {
    this.InstallationcolumnDefs = [
      { headerName: 'Site Id', pinned: 'left', field: 'SiteId', width: 150 },
      { headerName: 'Site Name', pinned: 'left', field: 'SiteName', width: 150 },
      { headerName: 'Installation Date', field: 'InstallationDate', width: 150, sortable: true },
      { headerName: 'Installation By', field: 'InstallationBy', width: 150, resizable: true },
      { headerName: 'Item Name', field: 'ItemName', width: 120, filter: false },
      { headerName: 'Make Name', field: 'MakeName', width: 120, filter: false },
      { headerName: 'Qty', field: 'NewQuantity', width: 150 },
    ];
  }

  ChangeSite(index: number) {
    debugger
    try {
      let siteId = 0;
      if (this.dynamicArray[index].SiteId == 0 || this.dynamicArray[index].SiteId == null) {
        siteId = this.model.siteId;
      } else {
        siteId = this.dynamicArray[index].SiteId;
      }

      var objdropdownmodel = new DropdownModel();
      objdropdownmodel.User_Id = this.UserId;
      objdropdownmodel.Parent_Id = siteId.toString();
      objdropdownmodel.Other_Id = this.model.ShippedfromWHId;
      objdropdownmodel.Company_Id = this.CompanyId;
      objdropdownmodel.Flag = 'Dispatch';
      debugger
      this._MaterialMovementService.GetAllPreviousDataBySiteId(objdropdownmodel).pipe(first()).subscribe(data => {
        if (data.Data != null && data.Data != '') {
          this.PreviousDataHistoryData = data.Data;
          
          let ItemId=this.dynamicArray[index].ItemNameId;
          this.OpenPreviousHistoryPopup(ItemId);
        }else{
          jQuery("#PreviousHistory").modal('hide');
          jQuery("#NoPreviousHistory").modal('show');     
        }
      }, error => {
        this._Commonservices.ErrorFunction(this.UserName, error.message, "GetAllPreviousDataBySiteId", "WHTOSite");
      });
    } catch (Error) {
      this._Commonservices.ErrorFunction(this.UserName, Error.message, "GetAllPreviousDataBySiteId", "WHTOSite");
    }
  }

  OpenPreviousHistoryPopup(itemId: any) {
    var PreviousHistoryData = null;
    var value1 = this._Commonservices.checkUndefined(this.PreviousDataHistoryData)
    if (value1 != '') {
      PreviousHistoryData = this.PreviousDataHistoryData.filter(
        m => m.ItemMaster_Id === parseInt(itemId));

      if (PreviousHistoryData != null && PreviousHistoryData != '') {
        this.PreviousDatarowData = PreviousHistoryData;
        jQuery("#PreviousHistory").modal('show');
        jQuery("#NoPreviousHistory").modal('hide');
        this.BindPreviousHistory();
      } else {
        jQuery("#PreviousHistory").modal('hide');
        jQuery("#NoPreviousHistory").modal('show');
      }
    } else {
      jQuery("#NoPreviousHistory").modal('show');
    }
  }

  ClickHistory(Id: any, index: any) {
    // hemant Tygai 18/01/2023    
    if( this.model.TransferTypeId==PageActivity.Dis_SiteWithinState 
      || this.model.TransferTypeId==PageActivity.Dis_SiteOtherState){
      this.ChangeSite(index);
    }

    //this.OpenPreviousHistoryPopup(Id);
  }

  onClickCustomer(para: string) {
    if (para == "DelAll") {
      this.SelectedSearchCustomerList = [];
      this.model.CustomerId = '0';
    } else if (this.SelectedSearchCustomerList.length > 0) {
      this.model.CustomerId = this.SelectedSearchCustomerList.map(xx => xx.id).join(',')
    }
  }

  onClickDispatchType(para: string) {
    if (para == "DelAll") {
      this.SearchDispatchTypeList = [];
      this.model.DispatchTo = '0';
    } else if (this.SearchDispatchTypeList.length > 0) {
      this.model.DispatchTo = this.SearchDispatchTypeList.map(xx => xx.id).join(',')
    }
  }

  BindPreviousHistory() {
    this.PreviousDatacolumnDefs = [
      { headerName: 'Item Name', pinned: 'left', field: 'ItemName', width: 100, filter: false, resizable: true },
      { headerName: 'Make Name', pinned: 'left', field: 'MakeName', width: 120, filter: false, resizable: true },
      { headerName: 'Item Code', field: 'ItemCode', width: 100, sortable: true, resizable: true },
      { headerName: 'Equpment Type', pinned: 'left', field: 'EqupmentType', width: 120, resizable: true },
      { headerName: 'Qty', field: 'Qty', width: 80, resizable: true },
      { headerName: 'Document No', field: 'DocumentNo', width: 150 },
      { headerName: 'Document Date', field: 'DocumentDate', width: 150 },
      { headerName: 'Rate', field: 'Rate', width: 120, resizable: true },
      { headerName: 'HSN Code', field: 'HSNCode', width: 100, resizable: true },
      { headerName: 'Customer', field: 'Customer', width: 100, resizable: true },
      { headerName: 'Unit Name', field: 'UnitName', width: 100, resizable: true },
      { headerName: 'Item Description', field: 'ItemDescription', width: 180, resizable: true },
      { headerName: 'Create By', field: 'Createdby', width: 150 },
    ];
  }


  BindTransporterTypeDetail() {
    try {
      var objdropdownmodel = new DropdownModel();
      objdropdownmodel.User_Id = this.UserId;
      objdropdownmodel.Parent_Id = "0";
      objdropdownmodel.Other_Id = "0";
      objdropdownmodel.Company_Id = this.CompanyId;
      objdropdownmodel.Flag = 'TransPorterMaster';
      this._Commonservices.getdropdown(objdropdownmodel).pipe(first()).subscribe(vouc => {
        this.TransporterAndCourierTypeDetail = vouc.Data;
      }, error => {
        this._Commonservices.ErrorFunction(this.UserName, error.message, "BindTransporterTypeDetail", "WHTOSite");
      });
    } catch (Error) {
      this._Commonservices.ErrorFunction(this.UserName, Error.message, "BindTransporterTypeDetail", "WHTOSite");
    }
  }

  //#region MultiSite Upload

  ClickMultipleSite(value: any) {
    $("#txtEmp").css('border-color', '');
    if (value.currentTarget.checked == true) {
      if (this.model.SiteId == 0) {
        this.model.IsMultipleSite = 0;
        alert('Please Select SIte Id');
        return false;
      }
      try {
        var objdropdownmodel = new DropdownModel();
        objdropdownmodel.Other_Id = this.model.SiteId;
        objdropdownmodel.Company_Id = this.CompanyId;
        this._MaterialMovementService.GetAllEmployeeNameListBySiteId(objdropdownmodel).pipe(first()).subscribe(Emp => {
          this.EmpDataList = Emp.EmployeeData;
        }, error => {
          this._Commonservices.ErrorFunction(this.UserName, error.message, "BindEmployeeDetail", "WHTOSite");
        });
      } catch (Error) {
        this._Commonservices.ErrorFunction(this.UserName, Error.message, "BindEmployeeDetail", "WHTOSite");
      }
    } else {
      this.EmpDataList = null;
      this.model.EmployeeId = "0";
    }
  }

  //#endregion
  BackPage() {
    this.isShownList = false;
    this.isShownEdit = true;
  }

  //#region  Preview Pdf Dispatch
  PreviewDispatch() {
    this.IsDispatchPreview = false;
    this.isShownList = true;
    this.isShownEdit = true;
    this.model.PreviewDispatchDate = this._Commonservices.ConvertDateFormat(this.model.DocumentDate);
    this.model.PreviewGRDate = this._Commonservices.ConvertDateFormat(this.model.GRDate);
    this.model.PreviewExpectedDate = this._Commonservices.ConvertDateFormat(this.model.ExpectedDate);
    this.model.PreviewTaxInvoiceDate = this._Commonservices.ConvertDateFormat(this.model.TaxInvoiceDate);
    //this.model.PreviewDispatchDate = this._Commonservices.ConvertDateFormat(this.model.DispatchDate);
    this.model.PreviewLRDate = this._Commonservices.ConvertDateFormat(this.model.LRdate);
  }

  BackPreviewDispatch() {
    this.IsDispatchPreview = true;
    this.isShownList = true;
    this.isShownEdit = false;
  }
  //#endregion

  /////Umesh///
  GetCustomerName() {
    var objSiteCustomerAutoModel = new SiteCustomerAutoModel();
    objSiteCustomerAutoModel.SCNo = "";
    objSiteCustomerAutoModel.CompanyId = this.CompanyId;
    objSiteCustomerAutoModel.flag = "Customer";
    this._GrncrnService.GetAutoCompleteSiteAndCustomer(objSiteCustomerAutoModel).subscribe((AutoCom) => {
      if (AutoCom.Data != null) {
        this.SearchCustomerData = AutoCom.Data;
        this.GettAllCustomerList = AutoCom.Data;
      }
    })
  }

  //#region  Gett all tech and Coh Detail by Site Id
  GetAllTechCOHbySiteId(SiteId: any) {
    try {
      var objdropdownmodel = new DropdownModel();
      objdropdownmodel.Other_Id = SiteId;
      objdropdownmodel.Company_Id = this.CompanyId;
      this._MaterialMovementService.GetAllEmployeeNameListBySiteId(objdropdownmodel).pipe(first()).subscribe(Emp => {
        if (Emp.TECHFEData != '') {
          this.TechDataList = Emp.TECHFEData;
        }
        if (Emp.COHCIData != '') {
          this.COHDataList = Emp.COHCIData;
        }
        if (this.model.DisatchTrackeringId == 0) {
          if (Emp.DefaultTechIdData != '') {
            if (Emp.DefaultTechIdData[0].TechId != '' && Emp.DefaultTechIdData[0].TechId != null) {
              this.model.TECHFE = Emp.DefaultTechIdData[0].TechId;
              this.changeTech(this.model.TECHFE);
            } else {
              this.model.TECHFE = "0";
            }
            if (Emp.DefaultTechIdData[0].CIId != '' && Emp.DefaultTechIdData[0].CIId != null) {
              this.model.COHCI = Emp.DefaultTechIdData[0].CIId;
              this.changeCOH(this.model.COHCI);
            } else {
              this.model.COHCI = "0";
            }
          }
        }
      }, error => {
        this._Commonservices.ErrorFunction(this.UserName, error.message, "GetAllTechCOHbySiteId", "WHTOSite");
      });
    } catch (Error) {
      this._Commonservices.ErrorFunction(this.UserName, Error.message, "GetAllTechCOHbySiteId", "WHTOSite");
    }
  }
  //#endregion

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
      objCSVTdata.ClientArray = this.apiCSVIData.ClientArray;
      objCSVTdata.DispatchTypeArray = this.apiCSVIData.DispatchTypeArray;
      this.WareHouseId = this.apiCSVIData.WHId;
      this.CompanyData = objCSVTdata.CompanyArray;
      this.SearchStateList = objCSVTdata.StateArray;
      this.SiteStateList = objCSVTdata.StateArray;
      this.VendorStateList = objCSVTdata.StateArray;
      this.SearchVendorList = objCSVTdata.VendorArray;
      this.SearchItemNameList = objCSVTdata.ItemArray;
      this.ClientList = objCSVTdata.ClientArray;
      this.DispatchTypeList = objCSVTdata.DispatchTypeArray;
    }
  }

  ChangeTrasporationMode(Id: any) {
    $("#txtTrasporationMode").css('border-color', '');
    //var TransModeData = this.TransModeDataList.filter(m => m.Id === parseInt(Id));
    //this.model.PreviewTransModeName = TransModeData[0].Name;
    this.IsTransporter = false;
    this.IsValidationShowandhide = false;
    this.IsByHand = false;
    this.IsBus = false;
    this.IsCourier = false;
    this.IsOther = false;
    this.IsVehicleType = false;
    this.IsVehicleValidationHideShow = false;
    this.CourierTypeDetail = null;
    this.TransporterTypeDetail = null;


    // Change by Hemant Tyagi
    this.model.ddlVehicleType = "0";
    this.model.VehicleNumber = "";
    this.model.GRNo = "";
    this.model.GRDate = "";

    if (Id == TransPortModeType.ByRoad) {
      this.TransporterTypeDetail = this.TransporterAndCourierTypeDetail.filter(m => m.IsCourier == 0 || m.IsCourier == 2);
      this.IsTransporter = true;
      this.IsValidationShowandhide = true;
      this.IsVehicleType = true;
      this.IsVehicleValidationHideShow = true;
      this.model.TransporterId = "0";
      this.model.EmployeeCode = "";
      this.model.EmployeeName = "";
      this.model.EmployeePhoneNo = "";
      this.model.CourierCompanyName = "";

      this.model.DocketNo = "";
      this.model.CourierPhoneNo = "";
      this.model.ConductorName = "";
      this.model.ConductorNo = "";

      this.model.Name = "";
      this.model.PhoneNo = "";
    } else if (Id == TransPortModeType.ByBus) {
      this.IsBus = true;
      this.model.TransporterId = "0";
      this.model.TransporterName = "";
      this.model.TransporterGSTNo = "";
      this.model.DriverName = "";
      this.model.DriverPhoneNo = "";
      this.model.EmployeeCode = "";
      this.model.EmployeeName = "";
      this.model.EmployeePhoneNo = "";
      this.model.CourierCompanyName = "";
      this.model.DocketNo = "";
      this.model.CourierPhoneNo = "";
      this.model.Name = "";
      this.model.PhoneNo = "";
      // this.model.VehicleNumber = "";
      // this.model.ddlVehicleType = "0";
      // this.model.GRNo = "";
      // this.model.GRDate = "";
    } else if (Id == TransPortModeType.ByHand) {
      this.IsVehicleType = true;
      this.IsByHand = true;
      this.model.TransporterId = "0";
      this.model.TransporterName = "";
      this.model.TransporterGSTNo = "";
      this.model.DriverName = "";
      this.model.DriverPhoneNo = "";
      this.model.CourierCompanyName = "";
      this.model.DocketNo = "";
      this.model.CourierPhoneNo = "";
      this.model.ConductorName = "";
      this.model.ConductorNo = "";
      this.model.Name = "";
      this.model.PhoneNo = "";
      // this.model.VehicleNumber = "";
      // this.model.ddlVehicleType = "0";
      // this.model.GRNo = "";
      // this.model.GRDate = "";
    } else if (Id == TransPortModeType.ByCourier) {
      this.CourierTypeDetail = this.TransporterAndCourierTypeDetail.filter(m => m.IsCourier == 1 || m.IsCourier == 2);
      this.IsVehicleType = true;
      this.IsCourier = true;
      this.model.TransporterId = "0";
      this.model.TransporterName = "";
      this.model.TransporterGSTNo = "";
      this.model.DriverName = "";
      this.model.DriverPhoneNo = "";
      this.model.EmployeeCode = "";
      this.model.EmployeeName = "";
      this.model.EmployeePhoneNo = "";
      this.model.ConductorName = "";
      this.model.ConductorNo = "";
      this.model.Name = "";
      // this.model.VehicleNumber = "";
      // this.model.ddlVehicleType = "0";
      // this.model.GRNo = "";
      // this.model.GRDate = "";
    } else if (Id == TransPortModeType.Other) {
      this.IsOther = true;
      this.IsVehicleType = true;
      this.model.TransporterId = "0";
      this.model.TransporterName = "";
      this.model.TransporterGSTNo = "";
      this.model.DriverName = "";
      this.model.DriverPhoneNo = "";
      this.model.EmployeeCode = "";
      this.model.EmployeeName = "";
      this.model.EmployeePhoneNo = "";
      this.model.CourierCompanyName = "";
      this.model.DocketNo = "";
      this.model.CourierPhoneNo = "";
      this.model.ConductorName = "";
      this.model.ConductorNo = "";
      // this.model.ddlVehicleType = "0";
      // this.model.VehicleNumber = "";
      // this.model.GRNo = "";
      // this.model.GRDate = "";
    }
  }

  ChangeTransporter(Id: any) {
    $("#txtTransporterId").css('border-color', '');
    if (this.model.TrasporationMode == TransPortModeType.ByRoad) {
      if (Id == 1 || Id == "0") {
        this.model.TransporterName = "";
        this.model.TransporterGSTNo = "";
      } else {
        var TransPorterGst = this.TransporterTypeDetail.filter(m => m.id === parseInt(Id));
        this.model.TransporterGSTNo = TransPorterGst[0].GSTIN;
        this.model.TransporterName = TransPorterGst[0].TransporterName;
      }
    } else if (this.model.TrasporationMode == TransPortModeType.ByCourier) {
      if (Id == 1 || Id == "0") {
        this.model.CourierCompanyName = "";
        this.model.DocketNo = "";
      } else {
        var TransPorterGst = this.CourierTypeDetail.filter(m => m.id === parseInt(Id));
        this.model.CourierCompanyName = TransPorterGst[0].TransporterName;
        this.model.DocketNo = "";
      }
    }
  }

  ChangeVehicleType(VId: any) {
    this.model.LoadingCapcity = "";
    $("#txtVehicleType").css('border-color', '');
    var VLoadingCapcity = this.VechileTypeDataList.filter(
      m => m.Id === parseInt(VId));
    this.model.LoadingCapcity = VLoadingCapcity[0].Definition;
    this.model.PreviewVehicleType = VLoadingCapcity[0].Name;
  }

  //#region  this are all function used for make, code,item etc change by id

  ChangeEditItemName(ItemNameId: any, index: any) {
    try {
      $('#tblOne > tbody  > tr').each(function () {
        var valueItem = $(this).find('.ItemName').val();
        if (valueItem != '0') {
          $(this).find('.ItemName').css('border-color', '');
        }
      });
      var FilterData = this.SearchItemNameList.filter(
        m => m.id === parseInt(ItemNameId));
      this.dynamicArray[index].ItemName = FilterData[0].itemName;
      var value = this._Commonservices.checkUndefined(this.PreviousDataHistoryData)
      if (value != '') {
        this.OpenPreviousHistoryPopup(ItemNameId)
      }
      var ItemNameHSNCode = this.SearchItemNameList.filter(
        m => m.id === parseInt(ItemNameId));
      if (ItemNameHSNCode.length > 0) {
        this.dynamicArray[index].HSN = ItemNameHSNCode[0].HSNCode;
        this.dynamicArray[index].ClassId = ItemNameHSNCode[0].Class;

      } else {
        this.dynamicArray[index].HSN = "";
        this.dynamicArray[index].ClassId = "";
      }
      this.dynamicArray[index].EditItemMake = [];
      this.dynamicArray[index].EditItemCode = [];
      var objdropdownmodel = new DropdownModel();
      objdropdownmodel.User_Id = 0;
      objdropdownmodel.Parent_Id = ItemNameId;
      objdropdownmodel.Company_Id = this.CompanyId;
      objdropdownmodel.Other_Id = "0";
      objdropdownmodel.Flag = 'ItemMake';
      this._Commonservices.getdropdown(objdropdownmodel).pipe(first()).subscribe(item => {
        this.dynamicArray[index].EditItemMake = item.Data
        this.dynamicArray[index].ItemMakeId = "0"
      }, error => {
        this._Commonservices.ErrorFunction(this.UserName, error.message, "ChangeEditItemName", "WHTOSite");
      });
    } catch (Error) {
      this._Commonservices.ErrorFunction(this.UserName, Error.message, "ChangeEditItemName", "WHTOSite");
    }
  }

  ChangeEditItemMake(ItemMakeId: any, ItemNameId: any, index: any) {
    try {
      $('#tblOne > tbody  > tr').each(function () {
        var valueItem = $(this).find('.ItemMake').val();
        if (valueItem != '0') {
          $(this).find('.ItemMake').css('border-color', '');
        }
      });

      var FilterData = this.dynamicArray[index].EditItemMake.filter(
        m => m.id === parseInt(ItemMakeId));
      this.dynamicArray[index].MakeName = FilterData[0].itemName;
      var objdropdownmodel = new DropdownModel();
      objdropdownmodel.User_Id = 0;
      objdropdownmodel.Parent_Id = ItemNameId;
      objdropdownmodel.Other_Id = ItemMakeId;
      objdropdownmodel.Company_Id = this.CompanyId;
      objdropdownmodel.Flag = 'ItemCode';
      this.dynamicArray[index].EditItemCode = [];
      this._Commonservices.getdropdown(objdropdownmodel).pipe(first()).subscribe(item => {
        this.dynamicArray[index].EditItemCode = item.Data
        this.dynamicArray[index].ItemId = "0";
      }, error => {
        this._Commonservices.ErrorFunction(this.UserName, error.message, "ChangeEditItemMake", "WHTOSite");
      });
    } catch (Error) {
      this._Commonservices.ErrorFunction(this.UserName, Error.message, "ChangeEditItemMake", "WHTOSite");
    }
  }

  ChangeEditItemCode(ItemId: any, index: any) {
    try {

      $('#tblOne > tbody  > tr').each(function () {
        var valueItem = $(this).find('.ItemCode').val();
        if (valueItem != '0') {
          $(this).find('.ItemCode').css('border-color', '');
        }
      });
      $('#tblOne > tbody  > tr').each(function () {
        var valueItem1 = $(this).find('.UnitName').val();
        if (valueItem1 != '0') {
          $(this).find('.UnitName').css('border-color', '');
        }
      });

      var FilterData = this.dynamicArray[index].EditItemCode.filter(
        m => m.id === parseInt(ItemId));
      this.dynamicArray[index].ItemCode = FilterData[0].itemName;
      var objVendormodel = new VendorOrWhModel();
      objVendormodel.Id = ItemId;
      objVendormodel.flag = 'ItemMaster';
      this._Commonservices.getVendorOrWh(objVendormodel).pipe(first()).subscribe(data => {
        this.dynamicArray[index].ItemDescription = data.Data[0].ItemDescription;
        this.dynamicArray[index].UnitList = [];
        if (data.Data[0].UnitList.length == 1) {
          this.dynamicArray[index].UnitList = data.Data[0].UnitList;
          this.dynamicArray[index].UnitName = this.dynamicArray[index].UnitList[0].Id;
          this.dynamicArray[index].Unit = this.dynamicArray[index].UnitList[0].UnitName;
        } else {
          this.dynamicArray[index].UnitName = "0";
          this.dynamicArray[index].UnitList = data.Data[0].UnitList;
        }
        if (this.dynamicArray[index].ItemNameId == CommonStaticClass.MSTItemNameId && data.Data[0].UnitList.length == 1) {
          this.dynamicArray[index].Qty = "";
          this.dynamicArray[index].ConversionUnit = "";
          this.dynamicArray[index].HideConversionValue = "";
          this.dynamicArray[index].IsConversion = "";
          this.dynamicArray[index].HideShowConValue = false;
        } else if (this.dynamicArray[index].ItemNameId == CommonStaticClass.MSTItemNameId && data.Data[0].UnitList.length != 1) {
          if (data.Data[0].IsConversion != null && data.Data[0].IsConversion != 0) {
            this.dynamicArray[index].HideShowConValue = true;
            // this.dynamicArray[index].UnitName = data.Data[0].ConversionUnit;
            this.dynamicArray[index].ConversionUnit = data.Data[0].ConversionUnit;
            this.dynamicArray[index].IsConversion = data.Data[0].IsConversion
            this.dynamicArray[index].HideConversionValue = data.Data[0].ConversionValue;
            this.dynamicArray[index].ChangeUnitConversionUnit = data.Data[0].ConversionUnit;
            this.dynamicArray[index].ChangeUnitIsConversion = data.Data[0].IsConversion
            this.dynamicArray[index].ChangeUnitHideConversionValue = data.Data[0].ConversionValue;
          } else {
            this.dynamicArray[index].Qty = "";
            this.dynamicArray[index].ConversionUnit = "";
            this.dynamicArray[index].HideConversionValue = "";
            this.dynamicArray[index].IsConversion = "";
            this.dynamicArray[index].ChangeUnitConversionUnit = "";
            this.dynamicArray[index].ChangeUnitIsConversion = "";
            this.dynamicArray[index].ChangeUnitHideConversionValue = "";
            this.dynamicArray[index].HideShowConValue = false;
            //this.dynamicArray[index].UnitName = data.Data[0].UnitName;
          }
        } else if (this.dynamicArray[index].ItemNameId != CommonStaticClass.MSTItemNameId) {
          this.dynamicArray[index].Qty = "";
          this.dynamicArray[index].ConversionUnit = "";
          this.dynamicArray[index].HideConversionValue = "";
          this.dynamicArray[index].IsConversion = "";
          this.dynamicArray[index].HideShowConValue = false;
          //this.dynamicArray[index].UnitName = data.Data[0].UnitName;
        }
      }, error => {
        this._Commonservices.ErrorFunction(this.UserName, error.message, "ChangeEditItemCode", "WHTOSite");
      });
    } catch (Error) {
      this._Commonservices.ErrorFunction(this.UserName, Error.message, "ChangeEditItemCode", "WHTOSite");
    }

  }


  ChangeUnit(Id: any, index: any) {
    $('#tblOne > tbody  > tr').each(function () {
      var valueItem = $(this).find('.UnitName').val();
      if (valueItem != "0") {
        $(this).find('.UnitName').css('border-color', '');
      }
    });
    var FilterData = this.dynamicArray[index].UnitList.filter(
      m => m.Id === parseInt(Id));
    this.dynamicArray[index].Unit = FilterData[0].UnitName;
    if (Id == 2 && this.dynamicArray[index].ItemNameId == CommonStaticClass.MSTItemNameId) {
      this.dynamicArray[index].HideShowConValue = false;
      this.dynamicArray[index].Qty = "";
      this.dynamicArray[index].ConversionUnit = "";
      this.dynamicArray[index].HideConversionValue = "";
      this.dynamicArray[index].IsConversion = "";
    } else if (Id == 8 && this.dynamicArray[index].ItemNameId == CommonStaticClass.MSTItemNameId) {
      this.dynamicArray[index].HideShowConValue = true;
      this.dynamicArray[index].Qty = "";
      this.dynamicArray[index].ConversionUnit = "";
      this.dynamicArray[index].HideConversionValue = "";
      this.dynamicArray[index].IsConversion = "";
      this.dynamicArray[index].ConversionValue = "";
      this.dynamicArray[index].ConversionUnit = this.dynamicArray[index].ChangeUnitConversionUnit;
      this.dynamicArray[index].IsConversion = this.dynamicArray[index].ChangeUnitIsConversion;
      this.dynamicArray[index].HideConversionValue = this.dynamicArray[index].ChangeUnitHideConversionValue;
    } else {
      this.dynamicArray[index].HideShowConValue = false;
    }

  }

  ChangeSaleUnit(Id: any, index: any) {
    $('#tblOne > tbody  > tr').each(function () {
      var valueItem = $(this).find('.SaleUnitName').val();
      if (valueItem != "0") {
        $(this).find('.SaleUnitName').css('border-color', '');
      }
    });
  }

  ChangeEqupmnet(ItemId: any, index: any) {
    var FilterData = this.EquipmentTypeList.filter(
      m => m.id === parseInt(ItemId));
    this.dynamicArray[index].EqpType = FilterData[0].itemName;
    try {
      $('#tblOne > tbody  > tr').each(function () {
        var valueItem = $(this).find('.EqType').val();
        if (valueItem != '0') {
          $(this).find('.EqType').css('border-color', '');
        }
      });
      //Hemant Tyagi 29/12/2022
      this.getClosingStock(index);
    } catch (Error) {
      console.log(Error.message)
    }
  }



  ChangeClient(ClientId: any, index: any) {
    $('#tblOne > tbody  > tr').each(function () {
      var valueItem = $(this).find('.Client').val();
      if (valueItem != '0') {
        $(this).find('.Client').css('border-color', '');
      }
    });
    var FilterDate = this.ClientList.filter(m => m.Id === parseInt(ClientId));
    this.dynamicArray[index].ClientName = FilterDate[0].Name;
    //abhi eska koi use nhi h future m hoga 2/3/2022
    //brahamjot kaur 06/06/2022
    try {
      var objStockQtyModel = new StockQtyModel();
      objStockQtyModel.Client_Id = ClientId;
      objStockQtyModel.ItemCode_Id = this.dynamicArray[index].ItemId;
      objStockQtyModel.WH_Id = this.model.ShippedfromWHId;
      objStockQtyModel.Equp_Id = this.dynamicArray[index].EqTypeId;
      objStockQtyModel.Company_Id = this.CompanyId;
      objStockQtyModel.IsEdit = this.isEdit;
      this._StockserviceService.GetAllStockQtyByItemCode(objStockQtyModel).pipe(first()).subscribe(data => {
        if (data.Status = 1) {
          if (data.Data != null) {
            this.dynamicArray[index].Qty = data.Data[0].StockQty;
            this.dynamicArray[index].FQty = data.Data[0].StockQty;
            this.Stockstrcount = data.Data[0].StockQty;
          } else {
            this.dynamicArray[index].Qty = 0;
            this.dynamicArray[index].FQty = 0;
          }
          this.dynamicArray[index].GSerialNumbers = [];
          // commite by hemant tyagi
          // if (data.SerialNoData != null) {
          //   this.SerialNoList = data.SerialNoData;
          //   //this.dynamicArray[index].GSerialNumbers= this.SerialNoList;
          //   if (this.SerialNoList.length > 0) {
          //     for (var i = 0; i < parseInt(this.SerialNoList.length); i++) {
          //       var srnData = new GSerialNumber();
          //       srnData.Ischecked = false;
          //       srnData.Company_Id = this.CompanyId;
          //       srnData.WH_Id = this.model.ShippedfromWHId;
          //       srnData.Equp_Id = this.dynamicArray[index].EqTypeId;
          //       srnData.ItemCode_Id = this.dynamicArray[index].ItemId;
          //       srnData.InitialSrno = this.SerialNoList[i].InitialSrno;
          //       srnData.UniqueId = this.SerialNoList[i].Id;
          //       srnData.IsDisabled = this.SerialNoList[i].IsDisabled;
          //       srnData.Sequance = this.SerialNoList[i].Sequance;
          //       this.dynamicArray[index].GSerialNumbers.push(srnData)
          //     };
          //   } else {
          //     this.dynamicArray[index].GSerialNumbers = null;
          //   }
          // }
        }
      }, error => {
        this._Commonservices.ErrorFunction(this.UserName, error.message, "GetAllStockQtyByItemCode", "DispatchTracker");
      });
    } catch (Error) {
      this._Commonservices.ErrorFunction(this.UserName, Error.message, "GetAllStockQtyByItemCode", "DispatchTracker");
    }
  }

  //#endregion
  BindEditWHList() {
    try {
      $("#txtToSiteStateId").css('border-color', '');
      $("#txtTOWHStateId").css('border-color', '');
      var StateId = this._Commonservices.checkUndefined(this.model.EditStateId);
      var objdropdownmodel = new DropdownModel();
      objdropdownmodel.User_Id = 0;
      objdropdownmodel.Parent_Id = this.CompanyId;
      if (StateId != '') {
        objdropdownmodel.Other_Id = StateId;
        var PreviewToWHStateData = this.WHStateList.filter(
          m => m.id === parseInt(StateId));
        this.model.PreviewToStateName = PreviewToWHStateData[0].itemName;
      } else {
        objdropdownmodel.Other_Id = "0";
      }
      objdropdownmodel.Flag = 'OtherWHMaster';
      this.model.ShippedToWHId = '0'
      this.model.ShippedToOtherWHId = '0'
      this.model.WHAddress = '';
      this.model.WHStateCode = '';
      this.model.WHGSTIN = '';
      this.ShippedTOWHList = [];
      this._Commonservices.getdropdown(objdropdownmodel).pipe(first()).subscribe(wh => {
        if (wh.Data != null && wh.Data != "") {
          this.ShippedTOWHList = wh.Data;
        }
      }, error => {
        this._Commonservices.ErrorFunction(this.UserName, error.message, "BindEditWHList", "WHTOSite");
      });
    } catch (Error) {
      this._Commonservices.ErrorFunction(this.UserName, Error.message, "BindEditWHList", "WHTOSite");
    }
  }

  BindVendorOrWhAddess(para: string, val: string, WH: string): void {
    try {
      //$('#TxtVendorEdit .selected-list .c-btn').attr('style', 'border-color: ');
      $("#txtShippedToWHId").css('border-color', '');
      $("#txtShippedToOtherWHId").css('border-color', '');
      if (val == "Dell") {
        this.SelectedEditVendorList = [];
      }
      var VendorId = '0'
      if (this.SelectedEditVendorList.length > 0) {
        VendorId = this.SelectedEditVendorList[0].id;
        // console.log("======================================")
        // console.log(VendorId)
      }
      var objVendormodel = new VendorOrWhModel();
      objVendormodel.flag = para;
      if (para == "vendor") {
        objVendormodel.Id = VendorId;
      } else if (para == "WHMaster") {
        objVendormodel.Id = val;
        if (WH == "IN") {
          var StateINWHListData = this.StateINWHList.filter(
            m => m.Id === parseInt(val));
          this.model.PreviewSameWHName = StateINWHListData[0].WHName;
        } else {
          var StateTOWHListData = this.ShippedTOWHList.filter(
            m => m.id === parseInt(val));
          this.model.PreviewToWHName = StateTOWHListData[0].itemName;
        }
      }
      this._Commonservices.getVendorOrWh(objVendormodel).pipe(first()).subscribe(data => {
        if (data.Status == 1) {
          if (para == "vendor") {
            this.model.VendorAddress = data.Data[0].VendorAddress;
          } else if (para == "WHMaster") {
            this.model.WHAddress = data.Data[0].WHAddress;
            this.model.WHGSTIN = data.Data[0].WHGSTINNo;
            this.model.WHStateCode = data.Data[0].WHStateCode;
            this.model.WHStateName = data.Data[0].StateName;
            this.model.Destination = data.Data[0].WHName;
          }
        } else {
          if (para == "vendor") {
            this.model.VendorAddress = "";
          } else if (para == "WHMaster") {
            this.model.WHAddress = "";
          }
        }
      }, error => {
        this._Commonservices.ErrorFunction(this.UserName, error.message, "BindVendorOrWhAddess", "WHTOSite");
      });
    } catch (Error) {
      this._Commonservices.ErrorFunction(this.UserName, Error.message, "BindVendorOrWhAddess", "WHTOSite");
    }
  }

  OnEditVenItemDeSelect(item: any) {
    this.model.VenStateCode = "";
    this.SelectedEditVendorList = [];
    this.model.VendorName = "";
    this.model.VenGSTIN = "";
    this.model.VendorAddress = "";
    this.model.VendorCode = "";
  }
  onEditVenDeSelectAll(items: any) {
    this.model.VenStateCode = "";
    this.SelectedEditVendorList = [];
    this.model.VendorName = "";
    this.model.VenGSTIN = "";
    this.model.VendorAddress = "";
    this.model.VendorCode = "";
  }
  onSelectAll(items: any) {
    //console.log(items);
  }
  onItemSelect(item: any) {
    //console.log(item);
    // if(this.model.TransferTypeId == PageActivity.Dis_VendorSale){
    //   this.VendorScaleVissible = true;
    //   this.BindEditWHList();
    // }
    // else{
    //   this.VendorScaleVissible = false;
    // }

  }
  onGridReady(params) {
    this.gridApi = params.api;
  }
  onInstallationGridReady(params) {
    this.gridApi = params.api;
    this.gridApi.hideOverlay();
  }
  PreviousGridReady(params) {
    // this.gridApi.hideOverlay();
  }


  onfiledownload(e) {
    window.open(e.rowData.DocumentFile);
  };
  onbiltyfiledownload(e) {
    window.open(e.rowData.BiltyFile);
  };
  RecDocumentfiledownload(e) {
    window.open(e.rowData.ReceivingDocumentFile);
  }

  ngModelChangeVendor(event): void {
    $('#TxtToVendorCode .selected-list .c-btn').attr('style', 'border-color: ');
    $("#txtVendorAddress").css('border-color', '');
    $("#txtVenGSTIN").css('border-color', '');
    $("#txtVenStateCode").css('border-color', '');
    var objVendormodel = new VendorOrWhModel();
    objVendormodel.Id = this.SelectedEditVendorList[0].id;
    objVendormodel.flag = 'vendor';
    objVendormodel.StateId = this.model.VenOtherStateId;
    this.model.PreviewVendorNmae = this.SelectedEditVendorList[0].itemName;
    this._Commonservices.getVendorOrWh(objVendormodel).subscribe(vendata => {

      if (vendata.Data != null && vendata.Data != "") {
        //this.model.VendorName = data.Data[0].VendorName;
        this.model.VendorCode = vendata.Data[0].VendorCode;
        this.model.VenStateName = vendata.Data[0].StateName;
        this.model.Destination = vendata.Data[0].StateName;
        this.model.VenStateCode = vendata.Data[0].VenStateCode;

        //change by brahamjot 18/6/2022

        if (this.model.TransferTypeId == PageActivity.Dis_VendorSale
          && vendata.Data[0].VendorTypeFlag == '2') {
          try {
            this.VendorScaleVissible = true;
            this.BindVendorWh(vendata.Data[0].VendorCompany_Id, this.model.VenOtherStateId);
          } catch (Error) {
            this._Commonservices.ErrorFunction(this.UserName, Error.message, "ngModelChangeVendor", "Vendor(Sale)");
          }
        } else {
          this.VendorScaleVissible = false;
          this.ShippedTOVendorWHList = [];
        }

        this.MultiVenAddressList = vendata.Data[0].VenAddressList;
        if (this.MultiVenAddressList.length == 1) {
          this.VenderFilterAddress = [];
          this.model.VendorAddress = null;
          this.model.VenGSTIN = null;
          this.model.VendorAddress = this.MultiVenAddressList[0].VendorAddress;
          this.model.VenGSTIN = this.MultiVenAddressList[0].GSTINNo;
          this.VenderFilterAddress = this.MultiVenAddressList
          this.model.RadioId = this.MultiVenAddressList[0].Id;
        } else {
          this.VenderFilterAddress = [];
          this.model.VendorAddress = null;
          this.model.VenGSTIN = null;
          this.VenderFilterAddress = this.MultiVenAddressList
        }
        //  this.model.VenStateCode=data.Data[0].VenStateCode;
      }

    });
  }

  ChangeVendorAddress(Id: any) {
    $("#txtVendorAddress").css('border-color', '');
    $("#txtVenGSTIN").css('border-color', '');
    var VenderFilterAddressData = this.VenderFilterAddress.filter(
      m => m.Id === parseInt(Id));
    this.model.VendorAddress = VenderFilterAddressData[0].VendorAddress;
    this.model.VendorAddressId = VenderFilterAddressData[0].Id;
    this.model.VenGSTIN = VenderFilterAddressData[0].GSTINNo;
  }

  BindStateCodeWHAdd(StateId: any) {
    this.ChangeTransporter(1)
    $("#txtddlStateId").css('border-color', '');
    try {
      var StateId = this._Commonservices.checkUndefined(StateId);
      var objdropdownmodel = new DropdownModel();
      objdropdownmodel.User_Id = this.UserId;
      objdropdownmodel.Company_Id = this.CompanyId;
      if (StateId != '') {
        objdropdownmodel.Other_Id = StateId;
      } else {
        objdropdownmodel.Other_Id = "0";
      }
      objdropdownmodel.Flag = '0';
      this.StateCodeWhAd = [];
      var SearchStateName = this.SearchStateList.filter(
        m => m.id === parseInt(StateId));
      this.model.PreviewStateName = SearchStateName[0].itemName;
      this._MaterialMovementService.GetWHAddressAndWHListByStId(objdropdownmodel).pipe(first()).subscribe(data => {
        this.StateCodeWhAd = data.Data;
        if (data.Status == 1 && data.Data != null && data.Data != '') {
          this.model.StateCode = this.StateCodeWhAd[0].StateCode;
          this.model.RegdOffice = this.StateCodeWhAd[0].OfficeAddress;
          this.model.GSTINNo = this.StateCodeWhAd[0].GSTIN_UIN;
          this.model.CIN = this.StateCodeWhAd[0].CIN;
          this.model.WHState = this.StateCodeWhAd[0].StateName;
        }
        if (data.Status == 1 && data.WHData != null && data.WHData != '') {
          if (data.WHData.length == 1) {
            this.EditWHList = data.WHData;
            this.BindShippedWhAddess(data.WHData[0].Id);
            this.model.ShippedfromWHId = data.WHData[0].Id;
          } else {
            this.EditWHList = data.WHData;
            this.model.ShippedWHAddress = "";
          }
        }
      }, error => {
        this._Commonservices.ErrorFunction(this.UserName, error.message, "BindStateCodeWHAdd", "WHTOSite");
      }
      );
    } catch (Error) {
      this._Commonservices.ErrorFunction(this.UserName, Error.message, "BindStateCodeWHAdd", "WHTOSite");
    }
  }

  BindShippedWhAddess(whId: any) {
    //console.log(WhId);
    this.model.ShippedWHAddress = null;
    $("#txtShippedfromWHId").css('border-color', '');
    var ShippedWhAddess = this.EditWHList.filter(
      m => m.Id === parseInt(whId));
    this.model.ShippedWHAddress = ShippedWhAddess[0].WHAddress;
    this.model.PreviewWHName = ShippedWhAddess[0].WHName;
    this.GetAllDispatchInstructionNo(whId);
  }

  ChangeVendorState(StId: any) {
    this.SelectedEditVendorList = [];
    this.model.VendorName = "";
    this.model.VenGSTIN = "";
    this.model.VendorAddress = "";
    this.VenderFilterAddress = [];
    $("#txtTOVenderStateId").css('border-color', '');
    this.SearchVendorListById = this.SearchVendorList.filter(
      m => m.State_Id === parseInt(StId));
    var PreviewVendorState = this.OtherSiteStateList.filter(
      m => m.id === parseInt(StId));
    this.model.PreviewVendorState = PreviewVendorState[0].itemName;
  }

  onFocused(e) {
  }

  //#region  these are function Used only Site id And Unique Site Id
  onChangeSearchCustomerSiteId(val: string) {
    try {
      if (this.model.TransferTypeId == PageActivity.Dis_SiteWithinState) {
        if (this.model.ddlStateId == null || this.model.ddlStateId == "0") {
          alert('Please Select State Name');
          return false;
        }
        this.ClearedCustomerSiteId(2);
        var objSiteCustomerAutoModel = new SiteCustomerAutoModel();
        objSiteCustomerAutoModel.SCNo = val;
        objSiteCustomerAutoModel.CompanyId = this.CompanyId;
        objSiteCustomerAutoModel.flag = "CustomerSiteId";
        objSiteCustomerAutoModel.StateId = this.model.ddlStateId;
        this._GrncrnService.GetAutoCompleteSiteAndCustomer(objSiteCustomerAutoModel).pipe(first()).subscribe((data) => {
          this.AutoCompleteCustomerSiteIdList = data.Data;
        },
          error => {
            this._Commonservices.ErrorFunction(this.UserName, error.message, "onChangeSearchCustomerSiteId", "WHTOSite");
          })
      }
      else if (this.model.TransferTypeId == PageActivity.Dis_SiteOtherState) {
        if (this.model.ToSiteStateId == null || this.model.ToSiteStateId == "0") {
          alert('Please Select State Name');
          return false;
        }
        this.ClearedCustomerSiteId(2);
        var objSiteCustomerAutoModel = new SiteCustomerAutoModel();
        objSiteCustomerAutoModel.SCNo = val;
        objSiteCustomerAutoModel.CompanyId = this.CompanyId;
        objSiteCustomerAutoModel.flag = "CustomerSiteId";
        objSiteCustomerAutoModel.StateId = this.model.ToSiteStateId;
        this._GrncrnService.GetAutoCompleteSiteAndCustomer(objSiteCustomerAutoModel).pipe(first()).subscribe((data) => {
          this.AutoCompleteCustomerSiteIdList = data.Data;
        }, error => {
          this._Commonservices.ErrorFunction(this.UserName, error.message, "onChangeSearchCustomerSiteId", "WHTOSite");
        })
      }
    } catch (Error) {
      this._Commonservices.ErrorFunction(this.UserName, Error.message, "onChangeSearchCustomerSiteId", "WHTOSite");
    }
  }

  onChangeSearchUniqueSiteId(val: string) {
    try {
      if (this.model.TransferTypeId == PageActivity.Dis_SiteWithinState) {
        if (this.model.ddlStateId == null || this.model.ddlStateId == "0") {
          alert('Please Select State Name');
          return false;
        }
        this.ClearedCustomerSiteId(1);
        var objSiteCustomerAutoModel = new SiteCustomerAutoModel();
        objSiteCustomerAutoModel.SCNo = val;
        objSiteCustomerAutoModel.CompanyId = this.CompanyId;
        objSiteCustomerAutoModel.flag = "UniqueSiteId";
        objSiteCustomerAutoModel.StateId = this.model.ddlStateId;
        this._GrncrnService.GetAutoCompleteSiteAndCustomer(objSiteCustomerAutoModel).pipe(first()).subscribe((data) => {
          if (data.Data != "") {
            this.AutoCompleteUniqueSiteIdList = data.Data;
          }
        }, error => {
          this._Commonservices.ErrorFunction(this.UserName, error.message, "onChangeSearchUniqueSiteId", "WHTOSite");
        })
      }
      else if (this.model.TransferTypeId == PageActivity.Dis_SiteOtherState) {
        if (this.model.ToSiteStateId == null || this.model.ToSiteStateId == "0") {
          alert('Please Select State Name');
          return false;
        }
        this.ClearedCustomerSiteId(1);
        var objSiteCustomerAutoModel = new SiteCustomerAutoModel();
        objSiteCustomerAutoModel.SCNo = val;
        objSiteCustomerAutoModel.CompanyId = this.CompanyId;
        objSiteCustomerAutoModel.flag = "UniqueSiteId";
        objSiteCustomerAutoModel.StateId = this.model.ToSiteStateId;
        this._GrncrnService.GetAutoCompleteSiteAndCustomer(objSiteCustomerAutoModel).pipe(first()).subscribe((data) => {
          if (data.Data != "") {
            this.AutoCompleteUniqueSiteIdList = data.Data;
          }
        }, error => {
          this._Commonservices.ErrorFunction(this.UserName, error.message, "onChangeSearchUniqueSiteId", "WHTOSite");
        })
      }
    } catch (Error) {
      this._Commonservices.ErrorFunction(this.UserName, Error.message, "onChangeSearchUniqueSiteId", "WHTOSite");
    }
  }

  SelectCustomerSiteId(items) {
    this.model.CuValueSiteId = items.CustomerSiteId;
    this.model.SiteName = items.SiteName;
    this.model.SiteAddress = items.Address;
    this.model.SiteId = items.Id;
    // this.GetAllDispatchInstructionNo(this.model.SiteId); //Brahamjot kaur 13/7/2022
    this.model.CuUniqueSiteId = items.Id;
    this.model.HideCustomerId = items.CustomerSiteId;
    this.model.ClientName = items.ClientName;
    this.model.Destination = items.DistrictName;
    this.ClientGSTNo = items.GSTNo;
    //this.ChangeSite(this.model.SiteId);
    this.GetAllTechCOHbySiteId(this.model.SiteId);

  }

  ClearedCustomerSiteId(val: any) {
    this.AutoCompleteCustomerSiteIdList = [];
    this.AutoCompleteUniqueSiteIdList = [];
    this.model.CustomerSiteName = "";
    this.model.SiteAddress = "";
    this.model.SiteId = 0;
    this.model.TECHFE = "0";
    this.model.COHCI = "0";
    this.model.SiteName = "";
    this.model.Destination = "";
    this.COHDataList = null;
    this.TechDataList = null;
    if (val == 1) {
      this.model.CuValueSiteId = "";
    } else if (val == 2) {
      this.model.CuUniqueSiteId = "";
    } else {
      this.model.CuValueSiteId = "";
      this.model.CuUniqueSiteId = "";
    }
    this.model.ClientName = "";
    this.model.GSTType = 1;
    this.model.ToSiteWHGSTIN = this.StateGSTNo
    this.ClientGSTNo = null;
  }

  SelectSiteName(item) {
    this.model.SiteAddress = item.Address
    this.model.SiteId = item.Id;
    this.model.CustomerSiteId = item.CustomerSiteId;
  }
  //#endregion
  ChangeGSTType(Id: any) {
    this.model.ToSiteWHGSTIN = "";
    if (Id == 1) {
      //this.IsTaxInvoiceNoSameState = false;
      this.model.GSTType = 1;
      this.IsTaxInvoiceNo = true;
      this.model.ToSiteWHGSTIN = this.StateGSTNo;
      this.model.previewGStType = "AST GST";
      $("#txtToCompanyName").css('border-color', '');
    } else if (Id == 2) {
      //this.IsTaxInvoiceNoSameState = true;
      this.IsTaxInvoiceNo = false;
      this.model.ToSiteWHGSTIN = this.ClientGSTNo;
      this.model.previewGStType = "Customer GST";
    } else if (Id == 0) {
      this.model.ToSiteWHGSTIN = "";
      this.model.previewGStType = "";
    }
  }

  CreateNew() {
    //this.name = this.ViewApprovalpageComponent.name;
    this.IsPreviewhideandShow = true;
    this.IsMetrailInstallationGrid = false;
    this.IsBiltyValidationShowandhide = false;
    this.IsPartialUpDateDispatchRequest = false;
    this.isShownList = true;
    this.isShownEdit = false;
    this.IsTransferTypeSite = false;
    this.IsTransferTypeWH = false;
    this.IsTransferTypeVender = false;
    this.IsTaxInvoiceNo = false;
    this.IsTaxInvoiceDate = false; //vishal, 02/12/2022
    this.IsMailButtonHide = true; //vishal, 13/12/2022
    //this.IsRecivedbyandNo = false;
    this.IsSaveButtonDisable = false;
    //this.IsRecivedbyandNoOther = true;
    this.IsDisabledPreviewGenratebutton = true;
    this.IsTransferTypeSameState = true;
    this.IsTransferTypeOtherState = false;
    this.IsDisabledTaxInvoiceDownload = false;
    this.IsReceivingFile = false;
    this.ItemAddrowhideshow = true;
    this.IsGRFile = false;
    this.IsEwayBillfile = false;
    this.IsTaxInvoiceFile = false;
    this.IsItemListDisabled = false;
    this.IsDisbaledWHDetail = false;
    this.IsReceivedHideShow = false;
    this.IsHideShowCancelBtn = false;
    this.IsReceivedDetail = false;
    this.model.DisatchTrackeringId = 0;
    this.model.IsApproved = 0;
    this.TableId = 0;
    this.ManueId = null;
    this.ApprovalList = null
    this.totalamount = 0;
    var toDate = "";
    this.IsEditDisabled = false;
    toDate = this.datePipe.transform(Date(), "yyyy/MM/dd");
    this.model.DocumentDate = { day: parseInt(toDate.split('/')[2]), month: parseInt(toDate.split('/')[1]), year: parseInt(toDate.split('/')[0]) };
    this.clearEditForm();
    const current1 = new Date();
    this.ChangeTrasporationMode(TransPortModeType.ByRoad);

    if (this.CreateDispatchForDIId != "0" && this.CreateDispatchForDIId != null) {
      this.AutoFillDispatchDetailByDIId(this.CreateDispatchForDIId);
    }
    //this.ClearAllUploadFile();
  }


  ConfirmmationClick() {
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

  conformPopup() {
    this.IsError = false;
    // Validation on basic Detail.
    if (this.validation() == 1) {
      return false;
      // validation on serial-No.
    } else if (this.validateItemData() == 1) {
      setTimeout(function () { this.IsError = false; }, 3000);
      return false;
      // validation on qty with stock qty.
    } else if (this.validateStockQty() == 1) {
      setTimeout(function () { this.IsError = false; }, 3000);
      return false;
    } else if (this.dynamicArray.length < 1) {
      alert('please fill atleast one item');
      return false;
    } else if (this.validationDICustomerSiteId() == 1) {
      setTimeout(function () { this.IsError = false; }, 3000);
      return false;
    } else {
      jQuery('#confirm').modal('show');
    }
  }

  //#region This Fuction Used to Add Update Dispatch Request
  SaveUpDateDispatchRequest() {
    try {

      debugger
      // this.IsSaveButtonDisable = true;
      jQuery('#confirm').modal('hide');
      var objDispatchTrackingModel = new DispatchTrackingModel();
      objDispatchTrackingModel.DispatchTracker_Id = this.model.DisatchTrackeringId;
      objDispatchTrackingModel.UserId = this.UserId;
      objDispatchTrackingModel.Company_Id = this.CompanyId;
      objDispatchTrackingModel.State_Id = this.model.ddlStateId;

      // change by Hemant Tyagi 01/08/2022 multiple DI select
      objDispatchTrackingModel.IsMultipleSite = this.model.IsMultipleSite;

      objDispatchTrackingModel.EmployeeId = this.model.EmployeeId;
      objDispatchTrackingModel.DocumentNo = this.model.DocumentNo;
      var DocDate = this._Commonservices.checkUndefined(this.model.DocumentDate);
      objDispatchTrackingModel.DocumentDate = DocDate.day + '/' + DocDate.month + '/' + DocDate.year;
      objDispatchTrackingModel.TrasporationMode = this.model.TrasporationMode;
      if (this.model.TrasporationMode == TransPortModeType.ByRoad) {
        objDispatchTrackingModel.Transporter_Id = this.model.TransporterId;
        objDispatchTrackingModel.TransporterName = this.model.TransporterName;
        objDispatchTrackingModel.TransporterGSTNo = this.model.TransporterGSTNo;
        objDispatchTrackingModel.DriverName = this.model.DriverName;
        objDispatchTrackingModel.PhoneNo = this.model.DriverPhoneNo;
      } else if (this.model.TrasporationMode == TransPortModeType.ByHand) {
        objDispatchTrackingModel.CodeAndNo = this.model.EmployeeCode;
        objDispatchTrackingModel.TransporterName = this.model.EmployeeName;
        objDispatchTrackingModel.PhoneNo = parseInt(this.model.EmployeePhoneNo);
      } else if (this.model.TrasporationMode == TransPortModeType.ByCourier) {
        objDispatchTrackingModel.Transporter_Id = this.model.TransporterId;
        objDispatchTrackingModel.TransporterName = this.model.CourierCompanyName;
        objDispatchTrackingModel.CodeAndNo = this.model.DocketNo;
        objDispatchTrackingModel.PhoneNo = parseInt(this.model.CourierPhoneNo);
      }
      else if (this.model.TrasporationMode == TransPortModeType.ByBus) {
        objDispatchTrackingModel.TransporterName = this.model.ConductorName;
        objDispatchTrackingModel.PhoneNo = parseInt(this.model.ConductorNo);
      } else if (this.model.TrasporationMode == TransPortModeType.Other) {
        objDispatchTrackingModel.TransporterName = this.model.Name;
        objDispatchTrackingModel.PhoneNo = parseInt(this.model.PhoneNo);
      }

      objDispatchTrackingModel.TaxInvoiceNo = this.model.TaxInvoiceNo;
      //vishal, 03/12/2022
      let taxInvoiceDate = this._Commonservices.checkUndefined(this.model.TaxInvoiceDate);
      if (taxInvoiceDate != "") {
        objDispatchTrackingModel.TaxInvoiceDate = taxInvoiceDate.day + '/' + taxInvoiceDate.month + '/' + taxInvoiceDate.year;
      } else {
        objDispatchTrackingModel.TaxInvoiceDate = "";
      }
      //end-vishal

      objDispatchTrackingModel.PlaceofDispatch = this.model.PlaceofDispatch;
      objDispatchTrackingModel.Destination = this.model.Destination;
      objDispatchTrackingModel.AmountChargeable = this.model.AmountChargeable;
      objDispatchTrackingModel.DispatchFromId = this.model.DispatchFrom;
      objDispatchTrackingModel.GRNo = this.model.GRNo;
      if (this.model.SecTransCost != "") {
        objDispatchTrackingModel.SecTransCost = this.model.SecTransCost;
      } else {
        objDispatchTrackingModel.SecTransCost = 0.00;
      }
      if (this.model.LoadingCost != "") {
        objDispatchTrackingModel.LoadingCost = this.model.LoadingCost;
      } else {
        objDispatchTrackingModel.LoadingCost = 0.00;
      }
      if (this.model.UnloadingCost != "") {
        objDispatchTrackingModel.UnloadingCost = this.model.UnloadingCost;
      } else {
        objDispatchTrackingModel.UnloadingCost = 0.00;
      }
      if (this.model.OtherCharges != "") {
        objDispatchTrackingModel.OtherCharges = this.model.OtherCharges;
      } else {
        objDispatchTrackingModel.OtherCharges = 0.00;
      }
      if (this.model.PrimaryUnloadingCost != "") {
        objDispatchTrackingModel.PrimaryUnloadingCost = this.model.PrimaryUnloadingCost;
      } else {
        objDispatchTrackingModel.PrimaryUnloadingCost = 0.00;
      }
      objDispatchTrackingModel.Pageflag = this.model.TransferTypeId;
      objDispatchTrackingModel.IstransferTypeId = this.model.TransferTypeId;
      var GRNoDate = this._Commonservices.checkUndefined(this.model.GRDate);
      if (GRNoDate != "") {
        objDispatchTrackingModel.GRDate = GRNoDate.day + '/' + GRNoDate.month + '/' + GRNoDate.year;
      } else {
        objDispatchTrackingModel.GRDate = "";
      }
      objDispatchTrackingModel.VehicleNumber = this.model.VehicleNumber;
      objDispatchTrackingModel.VehicleType_Id = this.model.ddlVehicleType;
      objDispatchTrackingModel.EwayBillNo = this.model.EwayBillNo;
      objDispatchTrackingModel.IsDispatch = this.model.IsDispatch;
      objDispatchTrackingModel.ShippedfromWHId = this.model.ShippedfromWHId;
      // var ExpDeliveryDate = this._Commonservices.checkUndefined(this.model.ExpectedDate);
      // objDispatchTrackingModel.ExpDeliveryDate = ExpDeliveryDate.day + '/' + ExpDeliveryDate.month + '/' + ExpDeliveryDate.year;

      let ExpDeliveryDate = this._Commonservices.checkUndefined(this.model.ExpectedDate);
      if (ExpDeliveryDate != "" && ExpDeliveryDate != null) {
        objDispatchTrackingModel.ExpDeliveryDate = ExpDeliveryDate.day + '/' + ExpDeliveryDate.month + '/' + ExpDeliveryDate.year;
      } else {
        objDispatchTrackingModel.ExpDeliveryDate = "";
      }

      // if (this.model.TransferTypeId == PageActivity.Dis_SiteOtherState) {
      //   this.IsModelShow = false;} //vishal, 05/12/2022

      if (this.model.TransferTypeId == PageActivity.Dis_SiteWithinState) {
        // this.IsModelShow = true; //vishal, 05/12/2022
        objDispatchTrackingModel.ToState_Id = this.model.ddlStateId;
        objDispatchTrackingModel.SiteId = this.model.SiteId;
        objDispatchTrackingModel.CustomerSiteId = this.model.HideCustomerId;
        objDispatchTrackingModel.SiteName = this.model.SiteName;
        objDispatchTrackingModel.ClientName = this.model.ClientName;
        objDispatchTrackingModel.SiteAddress = this.model.SiteAddress;
        objDispatchTrackingModel.ShippedToStateName = this.model.WHState;
        objDispatchTrackingModel.ShippedToStateCode = this.model.StateCode;
        objDispatchTrackingModel.ShippedToGSTNO = this.model.GSTINNo;
        objDispatchTrackingModel.CompanyName = this.model.CompanyName;
        objDispatchTrackingModel.TECHFE = this.model.TECHFE;
        objDispatchTrackingModel.COHCI = this.model.COHCI;
        if (this.selectedDIArr.length > 0) {
          objDispatchTrackingModel.DispatchInstructionId = this.selectedDIArr.map(xx => xx.id).join(',');
        } else {
          objDispatchTrackingModel.DispatchInstructionId = null;
        }
        objDispatchTrackingModel.GSTTypeId = 0;
      }
      else if (this.model.TransferTypeId == PageActivity.Dis_SiteOtherState) {
        // this.IsModelShow = true;//vishal, 05/12/2022
        objDispatchTrackingModel.ToState_Id = this.model.ToSiteStateId;
        objDispatchTrackingModel.SiteId = this.model.SiteId;
        objDispatchTrackingModel.CustomerSiteId = this.model.HideCustomerId;
        objDispatchTrackingModel.SiteName = this.model.SiteName;
        objDispatchTrackingModel.ClientName = this.model.ClientName;
        objDispatchTrackingModel.SiteAddress = this.model.SiteAddress;
        objDispatchTrackingModel.ShippedToStateName = this.model.ToSiteState;
        objDispatchTrackingModel.ShippedToStateCode = this.model.ToSiteStateCode;
        objDispatchTrackingModel.ShippedToGSTNO = this.model.ToSiteWHGSTIN;
        objDispatchTrackingModel.CompanyName = this.model.CompanyName;
        if (this.model.GSTType == 0) {
          objDispatchTrackingModel.GSTTypeId = 1;
        } else {
          objDispatchTrackingModel.GSTTypeId = this.model.GSTType;
        }
        objDispatchTrackingModel.TECHFE = this.model.TECHFE;
        objDispatchTrackingModel.COHCI = this.model.COHCI;
        if (this.selectedDIArr.length > 0) {
          objDispatchTrackingModel.DispatchInstructionId = this.selectedDIArr.map(xx => xx.id).join(',');
        } else {
          objDispatchTrackingModel.DispatchInstructionId = null;
        }
      }
      else if (this.model.TransferTypeId == PageActivity.Dis_WHWithinState) {
        // this.IsModelShow = true;//vishal, 05/12/2022
        objDispatchTrackingModel.ToState_Id = this.model.ddlStateId;
        objDispatchTrackingModel.ShippedToWHId = this.model.ShippedToINWHId;
        objDispatchTrackingModel.ShippedToStateName = this.model.WHState;
        objDispatchTrackingModel.ShippedToStateCode = this.model.StateCode;
        objDispatchTrackingModel.ShippedToGSTNO = this.model.GSTINNo;
      }
      else if (this.model.TransferTypeId == PageActivity.Dis_WHOtherState || this.model.TransferTypeId == PageActivity.Dis_RepairingCenter) {
        objDispatchTrackingModel.ToState_Id = this.model.EditStateId;
        objDispatchTrackingModel.ShippedToWHId = this.model.ShippedToOtherWHId;
        //objDispatchTrackingModel.ShippedToStateName=this.model.WHState;
        objDispatchTrackingModel.ShippedToStateCode = this.model.WHStateCode;
        objDispatchTrackingModel.ShippedToGSTNO = this.model.WHGSTIN;
      }
      else if (this.model.TransferTypeId == PageActivity.Dis_Vendor
        || this.model.TransferTypeId == PageActivity.Dis_VendorScrapSale
        || this.model.TransferTypeId == PageActivity.Dis_VendorSale) {
        // this.IsModelShow = false;//vishal, 05/12/2022
        objDispatchTrackingModel.ToState_Id = this.model.VenOtherStateId;
        objDispatchTrackingModel.VendorId = this.SelectedEditVendorList[0].id;
        objDispatchTrackingModel.ShippedToStateName = this.model.VenStateName;
        objDispatchTrackingModel.ShippedToStateCode = this.model.VenStateCode;
        objDispatchTrackingModel.ShippedToGSTNO = this.model.VenGSTIN;
        objDispatchTrackingModel.VenAddressId = this.model.RadioId;
        if (this.VendorScaleVissible == true && this.model.TransferTypeId == PageActivity.Dis_VendorSale) {
          // this.IsModelShow = false;//vishal, 05/12/2022
          objDispatchTrackingModel.ShippedToWHId = this.model.ShippedToVendorWHId;
        }
      }
      else if (this.model.TransferTypeId == PageActivity.Dis_CustomerReturn) {
        // this.IsModelShow = true;//vishal, 05/12/2022
        objDispatchTrackingModel.ToState_Id = this.model.EditStateId;
        objDispatchTrackingModel.ShippedToStateCode = this.model.OtherStateCode;
        objDispatchTrackingModel.CRNId = this.model.CRNId;
        objDispatchTrackingModel.ShippedToGSTNO = this.model.CustomerGSTIN;
      }

      objDispatchTrackingModel.Note = this.model.Note;
      this.DispatchTrackingItem = [];
      for (var i = 0, len = this.dynamicArray.length; i < len; i++) {
        var objDispatchTrackingItemDetialModel = new DispatchTrackingItemDetialModel();
        objDispatchTrackingItemDetialModel.Id = this.dynamicArray[i].Id;
        objDispatchTrackingItemDetialModel.ItemCode_Id = this.dynamicArray[i].ItemId;
        objDispatchTrackingItemDetialModel.Rate = this.dynamicArray[i].Rate;
        objDispatchTrackingItemDetialModel.Discount = this.dynamicArray[i].Discount;
        objDispatchTrackingItemDetialModel.HSN_SAC = this.dynamicArray[i].HSN;
        objDispatchTrackingItemDetialModel.EqpType_Id = this.dynamicArray[i].EqTypeId;
        if (this.model.TransferTypeId == PageActivity.Dis_SiteWithinState || this.model.TransferTypeId == PageActivity.Dis_SiteOtherState || this.model.TransferTypeId == PageActivity.Dis_VendorScrapSale) {
          objDispatchTrackingItemDetialModel.DispatchType_Id = this.dynamicArray[i].DispatchTypeId;
        } else {
          objDispatchTrackingItemDetialModel.DispatchType_Id = 0
        }
        objDispatchTrackingItemDetialModel.SubDescription = this.dynamicArray[i].SubDescription;
        var MfDate = this._Commonservices.checkUndefined(this.dynamicArray[i].ManufDate);
        if (MfDate != '') {
          objDispatchTrackingItemDetialModel.ManufacturerDate = MfDate.day + '/' + MfDate.month + '/' + MfDate.year;
        } else {
          objDispatchTrackingItemDetialModel.ManufacturerDate = "";
        }
        objDispatchTrackingItemDetialModel.ManufacturerSerialNo = this.dynamicArray[i].SerialNo;
        var INVDate = this._Commonservices.checkUndefined(this.dynamicArray[i].InvoiceTaxDate);
        if (INVDate != '') {
          objDispatchTrackingItemDetialModel.InvoiceTaxDate = INVDate.day + '/' + INVDate.month + '/' + INVDate.year;
        } else {
          objDispatchTrackingItemDetialModel.InvoiceTaxDate = "";
        }
        objDispatchTrackingItemDetialModel.InvoiceTaxNo = this.dynamicArray[i].InvoiceTaxNo;
        objDispatchTrackingItemDetialModel.IGST = this.dynamicArray[i].IGST;
        objDispatchTrackingItemDetialModel.IGSTValue = this.dynamicArray[i].IGSTValue;
        objDispatchTrackingItemDetialModel.CGSTRate = this.dynamicArray[i].CGSTRate;
        objDispatchTrackingItemDetialModel.CGST = this.dynamicArray[i].CGST;
        objDispatchTrackingItemDetialModel.SGSTRate = this.dynamicArray[i].SGSTRate;
        objDispatchTrackingItemDetialModel.SGST = this.dynamicArray[i].SGST;
        objDispatchTrackingItemDetialModel.TCSRate = this.dynamicArray[i].TCSRate;
        objDispatchTrackingItemDetialModel.TCS = this.dynamicArray[i].TCS;
        objDispatchTrackingItemDetialModel.TotalInvoiceValue = this.dynamicArray[i].TotalInvoiceValue;
        objDispatchTrackingItemDetialModel.FreightCharge = this.dynamicArray[i].FreightCharge;
        objDispatchTrackingItemDetialModel.TotalAmountWithFreightCharge = this.dynamicArray[i].TotalAmountWithFreightCharge;
        objDispatchTrackingItemDetialModel.ClientId = this.dynamicArray[i].ClientId;
        objDispatchTrackingItemDetialModel.ReceivedQty = 0.00;


        if (this.model.TransferTypeId == PageActivity.Dis_VendorScrapSale) {
          // this.IsModelShow = true;//vishal, 05/12/2022
          objDispatchTrackingItemDetialModel.SaleQty = this.dynamicArray[i].SaleQty;
          objDispatchTrackingItemDetialModel.SaleUnit = this.dynamicArray[i].SaleUnitName;
        } else {
          objDispatchTrackingItemDetialModel.SaleQty = 0.00;
          objDispatchTrackingItemDetialModel.SaleUnit = 0;
        }
        var conver = this._Commonservices.checkUndefined(this.dynamicArray[i].ConversionUnit);
        if (conver == "") {
          objDispatchTrackingItemDetialModel.Qty = this.dynamicArray[i].Qty;
          objDispatchTrackingItemDetialModel.UnitId = this.dynamicArray[i].UnitName;
          objDispatchTrackingItemDetialModel.ConversionUnit = "";
          objDispatchTrackingItemDetialModel.ConversionValue = 0;
        } else {
          objDispatchTrackingItemDetialModel.Qty = this.dynamicArray[i].Qty;
          objDispatchTrackingItemDetialModel.UnitId = this.dynamicArray[i].UnitName;
          objDispatchTrackingItemDetialModel.ConversionUnit = this.dynamicArray[i].ConversionUnit;
          objDispatchTrackingItemDetialModel.ConversionValue = this.dynamicArray[i].ConversionValue;
        }

        // objDispatchTrackingItemDetialModel.GSerialNumbers = this.dynamicArray[i].GSerialNumbers;
        this.srnlst = [];
        if (this.dynamicArray[i].GSerialNumbers.length > 0) {
          if (this.dynamicArray[i].ItemNameId == "4" && this.dynamicArray[i].UnitName == "8") {
            // Check by Hemant Tyagi
            for (var j = 0; j < this.dynamicArray[i].GSerialNumbers.length; j++) {
              for (var k = 0; k < this.dynamicArray[i].GSerialNumbers[j].CellNos.length; k++) {
                var srnData = new GSerialNumber();
                srnData.InitialSrno = this.dynamicArray[i].GSerialNumbers[j].CellNos[k].CellValue;
                srnData.Sequance = j.toString();
                this.srnlst.push(srnData)
              }
            }
            objDispatchTrackingItemDetialModel.GSerialNumbers = this.srnlst;
          } else {
            objDispatchTrackingItemDetialModel.GSerialNumbers = this.dynamicArray[i].GSerialNumbers;
          }
        }
        objDispatchTrackingItemDetialModel.DIList_Id = this.dynamicArray[i].DIList_Id;
        this.DispatchTrackingItem.push(objDispatchTrackingItemDetialModel)
      }
      objDispatchTrackingModel.DispatchTrackerItemList = this.DispatchTrackingItem;
      var formdata = new FormData();
      if (this.Taxinvoiceuplodfile == null) {
        formdata.append('Taxinvoicefile', this.Taxinvoiceuplodfile);
      } else {
        formdata.append('Taxinvoicefile', this.Taxinvoiceuplodfile, this.Taxinvoiceuplodfile.name);
      }
      // if (this.RecDocumentFile == null) {
      //   formdata.append('RecDocumentfile', this.RecDocumentFile);
      // } else {
      //   formdata.append('RecDocumentfile', this.RecDocumentFile, this.RecDocumentFile.name);
      // }

      if (this.EwayBillDocumentFile == null) {
        formdata.append('EwayBillDocumentFile', this.EwayBillDocumentFile);
      } else {
        formdata.append('EwayBillDocumentFile', this.EwayBillDocumentFile, this.EwayBillDocumentFile.name);
      }
      if (this.GRfileDocumentFile == null) {
        formdata.append('GRfileDocumentFile', this.GRfileDocumentFile);
      } else {
        formdata.append('GRfileDocumentFile', this.GRfileDocumentFile, this.GRfileDocumentFile.name);
      }
      //var tt=JSON.stringify(objDispatchTrackingModel);
      formdata.append('jsonDetail', JSON.stringify(objDispatchTrackingModel));
      this._MaterialMovementService.SaveUpadteDispatchTracking(formdata).pipe(first()).subscribe(data => {

        if (data.Status == 1) {

          this.model.DisatchTrackeringId = data.Value;
          this.IsDisabledPreviewGenratebutton = false;

          this.clearEditForm();
          alert('your data has been Succesfully with Document No-' + data.Remarks);
          this.GenerateDispatchPdfbyDispatchId(1)
          this.IsSaveButtonDisable = true;
          this.ClearAllUploadFile();
        } else if (data.Status == 2) {
          jQuery('#confirm').modal('hide');
          alert('your data update successfully');
          this.IsDisabledPreviewGenratebutton = false;
          this.IsSaveButtonDisable = false;
        } else if (data.Status == 3) {
          alert('your documentNo already exists');
        } else if (data.Status == 0) {
          alert(data.Remarks);
          this.IsSaveButtonDisable = false;
        }
      }, error => {
        this._Commonservices.ErrorFunction(this.UserName, error.message, "SaveUpDateDispatchTrackingWhTosite", "WHTOSite");
      });
    } catch (Error) {
      this._Commonservices.ErrorFunction(this.UserName, Error.message, "SaveUpDateDispatchRequest", "WHTOSite");
    }





  }
  //#endregion

  //#region This Fuction Used to Add Update Dispatch Recived
  conformRecivedPopup() {
    this.IsError = false;
    if (this.ValidationReceived() == 1) {
      return false;
    } else {
      jQuery('#confirmreceived').modal('show');
    }
  }

  SaveUpDateDispatchReceived() {
    try {

      var objDispatchTrackingModel = new DispatchTrackingModel();
      objDispatchTrackingModel.DispatchTracker_Id = this.model.DisatchTrackeringId;
      objDispatchTrackingModel.ReceivedBy = this.model.ReceivedBy;
      objDispatchTrackingModel.ReceivedNo = this.model.ReceivedNo;
      var DeldDate = this._Commonservices.checkUndefined(this.model.DeliveredDate);
      if (DeldDate != '') {
        objDispatchTrackingModel.DeliveredDate = DeldDate.day + '/' + DeldDate.month + '/' + DeldDate.year;
      } else {
        objDispatchTrackingModel.DeliveredDate = "";
      }

      this.DispatchTrackingItem = [];
      for (var i = 0, len = this.dynamicArray.length; i < len; i++) {
        var objDispatchTrackingItemDetialModel = new DispatchTrackingItemDetialModel();
        objDispatchTrackingItemDetialModel.Id = this.dynamicArray[i].Id;
        if (this.dynamicArray[i].ReceivedQty == "") {
          objDispatchTrackingItemDetialModel.ReceivedQty = 0.00;
        } else {
          objDispatchTrackingItemDetialModel.ReceivedQty = this.dynamicArray[i].ReceivedQty;
        }
        objDispatchTrackingItemDetialModel.ReasonId = this.dynamicArray[i].ReasonId;
        objDispatchTrackingItemDetialModel.Remarks = this.dynamicArray[i].Remarks;
        this.DispatchTrackingItem.push(objDispatchTrackingItemDetialModel)
      }
      objDispatchTrackingModel.DispatchTrackerItemList = this.DispatchTrackingItem;
      var formdata = new FormData();
      if (this.RecDocumentFile == null) {
        formdata.append('RecDocumentfile', this.RecDocumentFile);
      } else {
        formdata.append('RecDocumentfile', this.RecDocumentFile, this.RecDocumentFile.name);
      }
      formdata.append('ReceivedjsonDetail', JSON.stringify(objDispatchTrackingModel));
      this._MaterialMovementService.UpadteReceivedDispatch(formdata).pipe(first()).subscribe(data => {
        if (data.Status == 2) {
          jQuery('#confirmreceived').modal('hide');
          alert('your data has been Received successfully');
          this.IsDisabledPreviewGenratebutton = false;
          this.IsSaveButtonDisable = true;
          this.IsRecivedButtonDisable = true;
        }
      }, error => {
        this._Commonservices.ErrorFunction(this.UserName, error.message, "SaveUpDateDispatchReceived", "WHTOSite");
      });
    } catch (Error) {
      this._Commonservices.ErrorFunction(this.UserName, Error.message, "SaveUpDateDispatchReceived", "WHTOSite");
    }
  }
  //#endregion

  //#region This Fuction Used to Add Update Dispatch Cost detail
  UpdateCostDetail() {
    if (this.model.DisatchTrackeringId == 0) {
      alert('plz first generate document no after update cost detail');
      return false;
    }
    try {
      var objDispatchTrackingModel = new DispatchTrackingModel();
      objDispatchTrackingModel.DispatchTracker_Id = this.model.DisatchTrackeringId;
      if (this.model.SecTransCost != "") {
        objDispatchTrackingModel.SecTransCost = this.model.SecTransCost;
      } else {
        objDispatchTrackingModel.SecTransCost = 0.00;
      }
      if (this.model.LoadingCost != "") {
        objDispatchTrackingModel.LoadingCost = this.model.LoadingCost;
      } else {
        objDispatchTrackingModel.LoadingCost = 0.00;
      }
      if (this.model.UnloadingCost != "") {
        objDispatchTrackingModel.UnloadingCost = this.model.UnloadingCost;
      } else {
        objDispatchTrackingModel.UnloadingCost = 0.00;
      }
      if (this.model.OtherCharges != "") {
        objDispatchTrackingModel.OtherCharges = this.model.OtherCharges;
      } else {
        objDispatchTrackingModel.OtherCharges = 0.00;
      }
      if (this.model.PrimaryUnloadingCost != "") {
        objDispatchTrackingModel.PrimaryUnloadingCost = this.model.PrimaryUnloadingCost;
      } else {
        objDispatchTrackingModel.PrimaryUnloadingCost = 0.00;
      }
      objDispatchTrackingModel.Flag = 'Dispatch';
      var formdata = new FormData();
      formdata.append('jsonDetail', JSON.stringify(objDispatchTrackingModel));
      this._Commonservices.UpdateCostDetail(formdata).pipe(first()).subscribe(data => {
        if (data.Status == 2) {
          alert('your  Cost Detail Update successfully');
        }
      }, error => {
        this._Commonservices.ErrorFunction(this.UserName, error.message, "UpdateCostDetail", "WHTOSite");
      });
    } catch (Error) {
      this._Commonservices.ErrorFunction(this.UserName, Error.message, "UpdateCostDetail", "WHTOSite");
    }
  }
  //#endregion

  //#region This Fuction Used to Partial Update Dispatch Detail
  PartialUpDateDispatchRequest() {
    try {

      if (this.PartialUpdateValidation() == 1) {
        return false;
      }

      var objDispatchTrackingModel = new DispatchTrackingModel();
      objDispatchTrackingModel.DispatchTracker_Id = this.model.DisatchTrackeringId;
      objDispatchTrackingModel.UserId = this.UserId;
      objDispatchTrackingModel.Company_Id = this.CompanyId;
      objDispatchTrackingModel.State_Id = this.model.ddlStateId;
      var DocDate = this._Commonservices.checkUndefined(this.model.DocumentDate);
      objDispatchTrackingModel.DocumentDate = DocDate.day + '/' + DocDate.month + '/' + DocDate.year;
      objDispatchTrackingModel.TrasporationMode = this.model.TrasporationMode;
      if (this.model.TrasporationMode == TransPortModeType.ByRoad) {
        objDispatchTrackingModel.Transporter_Id = this.model.TransporterId;
        objDispatchTrackingModel.TransporterName = this.model.TransporterName;
        objDispatchTrackingModel.TransporterGSTNo = this.model.TransporterGSTNo;
        objDispatchTrackingModel.DriverName = this.model.DriverName;
        objDispatchTrackingModel.PhoneNo = this.model.DriverPhoneNo;
        objDispatchTrackingModel.GRNo = this.model.GRNo;
        var GRNoDate = this._Commonservices.checkUndefined(this.model.GRDate);
        if (GRNoDate != "") {
          objDispatchTrackingModel.GRDate = GRNoDate.day + '/' + GRNoDate.month + '/' + GRNoDate.year;
        } else {
          objDispatchTrackingModel.GRDate = "";
        }
      } else if (this.model.TrasporationMode == TransPortModeType.ByHand) {
        objDispatchTrackingModel.CodeAndNo = this.model.EmployeeCode;
        objDispatchTrackingModel.TransporterName = this.model.EmployeeName;
        objDispatchTrackingModel.PhoneNo = parseInt(this.model.EmployeePhoneNo);
      } else if (this.model.TrasporationMode == TransPortModeType.ByCourier) {
        objDispatchTrackingModel.Transporter_Id = this.model.TransporterId;
        objDispatchTrackingModel.TransporterName = this.model.CourierCompanyName;
        objDispatchTrackingModel.CodeAndNo = this.model.DocketNo;
        objDispatchTrackingModel.PhoneNo = parseInt(this.model.CourierPhoneNo);
      }
      else if (this.model.TrasporationMode == TransPortModeType.ByBus) {
        objDispatchTrackingModel.TransporterName = this.model.ConductorName;
        objDispatchTrackingModel.PhoneNo = parseInt(this.model.ConductorNo);
      } else if (this.model.TrasporationMode == TransPortModeType.Other) {
        objDispatchTrackingModel.TransporterName = this.model.Name;
        objDispatchTrackingModel.PhoneNo = parseInt(this.model.PhoneNo);
      }

      objDispatchTrackingModel.TaxInvoiceNo = this.model.TaxInvoiceNo;
      objDispatchTrackingModel.PlaceofDispatch = this.model.PlaceofDispatch;
      objDispatchTrackingModel.Destination = this.model.Destination;
      objDispatchTrackingModel.DispatchFromId = this.model.DispatchFrom;
      objDispatchTrackingModel.VehicleType_Id = this.model.ddlVehicleType;
      objDispatchTrackingModel.VehicleNumber = this.model.VehicleNumber;
      objDispatchTrackingModel.EwayBillNo = this.model.EwayBillNo;
      objDispatchTrackingModel.IsDispatch = this.model.IsDispatch;
      objDispatchTrackingModel.Pageflag = this.model.TransferTypeId;

      //vishal, 03/12/2022
      let TxtInvDate = this._Commonservices.checkUndefined(this.model.TaxInvoiceDate);
      if (TxtInvDate != "") {
        objDispatchTrackingModel.TaxInvoiceDate = TxtInvDate.day + '/' + TxtInvDate.month + '/' + TxtInvDate.year;
      } else {
        objDispatchTrackingModel.TaxInvoiceDate = "";
      }

      //end-vishal
      var ExpDeliveryDate = this._Commonservices.checkUndefined(this.model.ExpectedDate);
      objDispatchTrackingModel.ExpDeliveryDate = ExpDeliveryDate.day + '/' + ExpDeliveryDate.month + '/' + ExpDeliveryDate.year;
      objDispatchTrackingModel.Note = this.model.Note;
      objDispatchTrackingModel.DispatchTrackerItemList = [];
      var formdata = new FormData();
      if (this.Taxinvoiceuplodfile == null) {
        formdata.append('Taxinvoicefile', this.Taxinvoiceuplodfile);
      } else {
        formdata.append('Taxinvoicefile', this.Taxinvoiceuplodfile, this.Taxinvoiceuplodfile.name);
      }
      if (this.EwayBillDocumentFile == null) {
        formdata.append('EwayBillDocumentFile', this.EwayBillDocumentFile);
      } else {
        formdata.append('EwayBillDocumentFile', this.EwayBillDocumentFile, this.EwayBillDocumentFile.name);
      }
      if (this.GRfileDocumentFile == null) {
        formdata.append('GRfileDocumentFile', this.GRfileDocumentFile);
      } else {
        formdata.append('GRfileDocumentFile', this.GRfileDocumentFile, this.GRfileDocumentFile.name);
      }

      //var tt=JSON.stringify(objDispatchTrackingModel);
      formdata.append('jsonDetail', JSON.stringify(objDispatchTrackingModel));
      this._MaterialMovementService.PartialUpadteDispatchTrackingDetail(formdata).pipe(first()).subscribe(data => {
        if (data.Status == 2) {
          jQuery('#confirm').modal('hide');
          alert('your data partial update successfully');
          this.IsDisabledPreviewGenratebutton = false;
          this.IsSaveButtonDisable = false;
        } else if (data.Status == 0) {
          alert(data.Remarks);
          this.IsSaveButtonDisable = false;
        }
      }, error => {
        this._Commonservices.ErrorFunction(this.UserName, error.message, "PartialUpDateDispatchRequest", "WHTOSite");
      });
    } catch (Error) {
      this._Commonservices.ErrorFunction(this.UserName, Error.message, "PartialUpDateDispatchRequest", "WHTOSite");
    }
  }
  //#endregion
  ClickReceivedAllQty() {
    if (this.ReceivedAllQty == true) {
      for (var i = 0, len = this.dynamicArray.length; i < len; i++) {
        this.dynamicArray[i].ReceivedQty = this.dynamicArray[i].Qty;
      }
    } else {
      for (var i = 0, len = this.dynamicArray.length; i < len; i++) {
        this.dynamicArray[i].ReceivedQty = "";
      }
    }
  }

  ClearAllUploadFile() {
    this.myInputVariable.nativeElement.value = '';
    this.myBillFileVariable.nativeElement.value = '';
    this.myTaxFileVariable.nativeElement.value = '';
    this.myDocFileVariable.nativeElement.value = '';
  }

  onTaxInvoiceFileChange(event) {
    let reader = new FileReader();
    if (event.target.files && event.target.files.length > 0) {
      this.Taxinvoiceuplodfile = event.target.files[0];
    }
  }

  onRecDocumentFileChange(event) {
    let reader = new FileReader();
    if (event.target.files && event.target.files.length > 0) {
      this.RecDocumentFile = event.target.files[0];
    }
  }

  onEwayBillDocumentChange(event) {
    let reader = new FileReader();
    if (event.target.files && event.target.files.length > 0) {
      this.EwayBillDocumentFile = event.target.files[0];
    }
  }

  onGRfileDocumentChange(event) {
    let reader = new FileReader();
    if (event.target.files && event.target.files.length > 0) {
      this.GRfileDocumentFile = event.target.files[0];
    }
  }

  SearchDispatchTrackerList(para: string) {
  
    this.gridApi.showLoadingOverlay();
    try {
      var objpara = new SearchDispatchTrackerModel();
      objpara.CompanyId = this.CompanyId;
      objpara.State_Id = this.CommonSearchPanelData.State_Id;
      if (this.CommonSearchPanelData.WHId != "") {
        objpara.WHId = this.CommonSearchPanelData.WHId;
      } else {
        if (this.WareHouseId == "0") {
          objpara.WHId = "";
        } else {
          objpara.WHId = this.WareHouseId;
        }
      }
      objpara.VendorId = this.CommonSearchPanelData.VendorId;
      objpara.ItemClassId = this.CommonSearchPanelData.ItemClassId;
      objpara.CapacityId = this.CommonSearchPanelData.CapacityId;
      objpara.ItemId = this.CommonSearchPanelData.ItemId;
      objpara.MakeId = this.CommonSearchPanelData.MakeId;
      objpara.ItemCodeId = this.CommonSearchPanelData.ItemCodeId;
      objpara.DescriptionId = this.CommonSearchPanelData.DescriptionId;
      objpara.Startdate = this.CommonSearchPanelData.Startdate;
      objpara.Enddate = this.CommonSearchPanelData.Enddate;
      if (this._Commonservices.checkUndefined(this.model.DispatchNo) == '') {
        objpara.DocumentNo = 0;
      } else {
        objpara.DocumentNo = this.model.DispatchNo;
      }
      if (this._Commonservices.checkUndefined(this.SearchSitesPanelData) == '') {
        objpara.Site_Id = 0;
      } else {
        objpara.Site_Id = this.SearchSitesPanelData.SiteId;
      }
      objpara.Flag = para;
      if (this._Commonservices.checkUndefined(this.model.DispatchTo) == '') {
        objpara.PageFlag = '0';
      } else {
        objpara.PageFlag = this.model.DispatchTo;
      }
      objpara.IsActiveCancel = this.model.IsActiveCancel;
      if (this._Commonservices.checkUndefined(this.model.CustomerId) == '') {
        objpara.CustomerId = '0';
      } else {
        objpara.CustomerId = this.model.CustomerId;

      }


      // brahamjot kaur 23/6/2022
      if (this._Commonservices.checkUndefined(this.model.DINo) == '') {
        objpara.DINo = '0';
      } else {
        objpara.DINo = this.model.DINo;
      }
      if (para == "Export") {
        this.Exportloading = true;
        this.gridApi.hideOverlay();
      }

      this._MaterialMovementService.GetDispatchTrackerList(objpara).pipe(first()).subscribe(data => {
        this.gridApi.hideOverlay();
        this.Exportloading = false;
        if (data.Status == 1) {
          if (para == "List") {
            if (data.Data != null) {
              this.rowData = data.Data;
            } else {
              this.rowData = null;
            }
          } else if (para == "Export") {
            if (data.Data != null) {
              var CurrentDate = this.datePipe.transform(Date(), "dd/MM/yyyy");
              this._PurchaseOrderService.exportAsExcelFile(data.Data, 'DispatchTracker' + CurrentDate);
            } else {
              alert('No Data Available');
            }
          }
        }
      }, error => {
        this._Commonservices.ErrorFunction(this.UserName, error.message, "SearchDispatchTrackerList", "WHTOSite");
      });
    } catch (Error) {
      this._Commonservices.ErrorFunction(this.UserName, Error.message, "SearchDispatchTrackerList", "WHTOSite");
    }
  }
  //#region this function used edit Dispatch detail by Dispatch Id

  ShowDispatcTrackerDetail(e) {
    this.rowdatalength = this.rowData.length;
    this.rowdatacurrentindex = this.rowData.findIndex(function (item, i) {
      return item.Id === e.rowData.DisatchTrackeringId;
    });
    this.CreateNew();
    this.isEdit = true;
    this.IsEditDisabled = true;
    this.DispatchTracker_Id = e.rowData.DisatchTrackeringId;
    this.GetUserPageRight(this.DispatchTracker_Id);
    this.SearchDispatchTrackerEditListByDispatchId(e.rowData.DisatchTrackeringId);
    this.model.InCaseReason = "0";
  }

  SearchDispatchTrackerEditListByDispatchId(Id: any) {
    try {
      this.GetUserPageRight(Id);
      this.DispatchTypeHideShow = false;
      this.IsReceivedHideShow = true;
      this.ItemAddrowhideshow = true;
      this.IsPreviewhideandShow = false;
      this.IsBiltyValidationShowandhide = true;
      // call api by Dispatch Tracker Id.
      this.IsItemListDisabled = true;
      let objModel = new SearchDispatchTrackerModel();
      objModel.DispatchTracker_Id = Id;
      this._MaterialMovementService.GetDispatchTrackerEditListByDispatchId(objModel).pipe(first()).subscribe(data => {
        this._objSendMailService._SetSendMailData(data.Data[0].DocumentFile); //vishal
        if (data.Status == 1) {
          this.IsDisabledPreviewGenratebutton = false;
          // bind 
          if (data.RegData != null && data.RegData != '') {
            this.model.StateCode = data.RegData[0].StateCode;
            this.model.RegdOffice = data.RegData[0].OfficeAddress;
            this.model.GSTINNo = data.RegData[0].GSTIN_UIN;
            this.model.CIN = data.RegData[0].CIN;
            this.model.WHState = data.RegData[0].StateName;
            this.StateCodeWhAd = JSON.parse(data.RegData[0].RegWHAddressList)
          }

          if (data.Data != null && data.Data != '') {
            this.model.TransferTypeId = data.Data[0].IstransferTypeId;
            this.model.DisatchTrackeringId = data.Data[0].DisatchTrackeringId;
            this.TableId = data.Data[0].DisatchTrackeringId;
            this.ManueId = this.PageMenuId;
            this.model.ddlStateId = data.Data[0].State_Id;

            this.model.DocumentNo = data.Data[0].DocumentNo;
            var DDate = data.Data[0].DocumentDate.split('/');
            this.model.DocumentDate = { year: parseInt(DDate[2]), month: parseInt(DDate[1]), day: parseInt(DDate[0]) };

            if (data.Data[0].ExpDeliveryDate != null) {
              var ExpDelDate = data.Data[0].ExpDeliveryDate.split('/');
              this.model.ExpectedDate = { year: parseInt(ExpDelDate[2]), month: parseInt(ExpDelDate[1]), day: parseInt(ExpDelDate[0]) };
            } else {
              this.model.ExpectedDate = "";
            }

            if (data.Data[0].TrasporationMode != null) {
              this.model.TrasporationMode = data.Data[0].TrasporationMode;
              this.ChangeTrasporationMode(this.model.TrasporationMode);
            } else {
              this.model.TrasporationMode = 0;
            }

            this.model.DateDiffHour = data.Data[0].DateDiffHour;
            this.ApprovalStatus = data.Data[0].ApprovalStatus;
            this.model.IsApproved = data.Data[0].IsApproved;

            this.IsPartialUpDateDispatchRequest = false;
            this.IsApprovalstatusbtnhideShow = false;

            // Change by Hemant Tyagi 20/10/2022
            if (this.CompanyId == 4) {
              if (data.Data[0].IsApproved == 1 && this.model.ReceivedBy == "") {
                this.IsSaveButtonDisable = true;
                this.IsHideShowCancelBtn = true;
                this.IsPartialUpDateDispatchRequest = true;
                this.IsReceivedHideShow = true;
                this.IsRecivedButtonDisable = false;
              } else if (data.Data[0].IsApproved == 1 && this.model.ReceivedBy != "") {
                this.IsSaveButtonDisable = true;
                this.IsHideShowCancelBtn = false;
                this.IsPartialUpDateDispatchRequest = true;
                this.IsReceivedHideShow = true;
                this.IsRecivedButtonDisable = true;
              } else {
                this.IsSaveButtonDisable = false;
                this.IsHideShowCancelBtn = true;
                this.IsPartialUpDateDispatchRequest = false;
                this.IsReceivedHideShow = false;
                this.IsRecivedButtonDisable = true;
              }
            } else if (this.CompanyId == 1) {
              if (data.Data[0].IsApproved == 1 && this.model.ReceivedBy == "" &&
                ((this.model.TransferTypeId == PageActivity.Dis_SiteOtherState && data.Data[0].GSTTypeId == '2')
                  || this.model.TransferTypeId == PageActivity.Dis_SiteWithinState
                  || this.model.TransferTypeId == PageActivity.Dis_WHWithinState
                  || this.model.TransferTypeId == PageActivity.Dis_Vendor
                  || this.model.TransferTypeId == PageActivity.Dis_RepairingCenter
                  || this.model.TransferTypeId == PageActivity.Dis_CustomerReturn)
              ) {
                this.IsSaveButtonDisable = true;
                this.IsHideShowCancelBtn = true;
                this.IsPartialUpDateDispatchRequest = true;
                this.IsReceivedHideShow = true;
                this.IsRecivedButtonDisable = false;
              } else if (data.Data[0].IsApproved == 1 && this.model.ReceivedBy == "" &&
                ((this.model.TransferTypeId == PageActivity.Dis_SiteOtherState && data.Data[0].GSTTypeId == '1')
                  || this.model.TransferTypeId == PageActivity.Dis_WHOtherState
                  || this.model.TransferTypeId == PageActivity.Dis_VendorSale
                  || this.model.TransferTypeId == PageActivity.Dis_VendorScrapSale
                ) && (data.Data[0].TaxInvoiceNO != '' && data.Data[0].TaxInvoiceNO != null)
              ) {
                this.IsSaveButtonDisable = true;
                this.IsHideShowCancelBtn = true;
                this.IsPartialUpDateDispatchRequest = true;
                this.IsReceivedHideShow = true;
                this.IsRecivedButtonDisable = false;
              } else if (data.Data[0].IsApproved == 1 && this.model.ReceivedBy != "") {
                this.IsSaveButtonDisable = true;
                this.IsHideShowCancelBtn = false;
                this.IsPartialUpDateDispatchRequest = true;
                this.IsReceivedHideShow = true;
                this.IsRecivedButtonDisable = true;
              } else {
                this.IsSaveButtonDisable = false;
                this.IsHideShowCancelBtn = true;
                this.IsPartialUpDateDispatchRequest = false;
                this.IsReceivedHideShow = false;
                this.IsRecivedButtonDisable = true;
              }
            }

            // Change by Hemant Tyagi 20/10/2022            
            // else if (this.CompanyId == 1) {
            //   if (this.model.DateDiffHour > CommonStaticClass.DifferenceDay) {
            //     if (data.Data[0].IsApproved == 1 && this.model.ReceivedBy == "") {
            //       this.IsHideShowCancelBtn = false;
            //       this.IsSaveButtonDisable = true;
            //       this.IsReceivedDetail = true;
            //       this.IsRecivedButtonDisable = false;
            //       this.IsPartialUpDateDispatchRequest = true;
            //     } else if (data.Data[0].IsApproved == 1 && this.model.ReceivedBy != "") {
            //       this.IsHideShowCancelBtn = false;
            //       this.IsSaveButtonDisable = true;
            //       this.IsReceivedDetail = true;
            //       this.IsRecivedButtonDisable = true;
            //       this.IsPartialUpDateDispatchRequest = true;
            //     } else {
            //       this.IsHideShowCancelBtn = false;
            //       this.IsSaveButtonDisable = false;
            //       this.IsReceivedDetail = true;
            //       this.IsRecivedButtonDisable = false;
            //     }
            //   } else {
            //     if (data.Data[0].IsApproved == 1 && this.model.ReceivedBy == "" 
            //     && this.model.TrasporationMode != TransPortModeType.ByHand) {
            //       this.IsHideShowCancelBtn = true;
            //       this.IsSaveButtonDisable = false;
            //       this.IsReceivedDetail = false;
            //       this.IsRecivedButtonDisable = false;
            //       this.IsPartialUpDateDispatchRequest = true;
            //     }
            //     else if (data.Data[0].IsApproved == 1 && this.model.ReceivedBy != "") {
            //       this.IsHideShowCancelBtn = false;
            //       this.IsSaveButtonDisable = true;
            //       this.IsReceivedDetail = true;
            //       this.IsRecivedButtonDisable = true;
            //       this.IsPartialUpDateDispatchRequest = true;
            //     } else {
            //       this.IsHideShowCancelBtn = true;
            //       this.IsSaveButtonDisable = false;
            //       this.IsReceivedDetail = true;
            //       this.IsRecivedButtonDisable = false;
            //     }
            //   }
            // }

            // Change by Hemant Tyagi
            //this.model.DispatchInstructionId = data.Data[0].DispatchInstructionId;
            // this.model.DIStatusId = data.Data[0].DIStatusId; // brahamjot kaur 19/7/2022

            if (this.model.TrasporationMode == TransPortModeType.ByRoad) {
              this.model.TransporterId = data.Data[0].Transporter_Id;
              this.model.TransporterName = data.Data[0].TrasporationName;
              this.model.TransporterGSTNo = data.Data[0].TrasporationGSTNO;
              this.model.DriverName = data.Data[0].DriverName;
              this.model.DriverPhoneNo = data.Data[0].PhoneNo;
            } else if (this.model.TrasporationMode == TransPortModeType.ByBus) {
              this.model.ConductorName = data.Data[0].TrasporationName;
              this.model.ConductorNo = data.Data[0].PhoneNo;
            } else if (this.model.TrasporationMode == TransPortModeType.ByHand) {
              this.model.EmployeeCode = data.Data[0].CodeAndNo;
              this.model.EmployeeName = data.Data[0].TrasporationName;
              this.model.EmployeePhoneNo = data.Data[0].PhoneNo;
            } else if (this.model.TrasporationMode == TransPortModeType.ByCourier) {
              if (data.Data[0].Transporter_Id != 0 && data.Data[0].Transporter_Id != null) {
                this.model.TransporterId = data.Data[0].Transporter_Id;
              } else {
                // hemant tygai 15/2/2023
                this.model.TransporterId = "0";
              }
              this.model.DocketNo = data.Data[0].CodeAndNo;
              this.model.CourierCompanyName = data.Data[0].TrasporationName;
              this.model.CourierPhoneNo = data.Data[0].PhoneNo;
            } else if (this.model.TrasporationMode == TransPortModeType.Other) {
              this.model.Name = data.Data[0].TrasporationName;
              this.model.PhoneNo = data.Data[0].PhoneNo;
            }

            this.model.ISItemMandetory = data.Data[0].ISItemMandetory;
            this.CreateName = data.Data[0].CreateName;
            this.CreatedDate = data.Data[0].CreatedDate;
            this.ModifiedName = data.Data[0].ModifiedName;
            this.ModifiedDate = data.Data[0].ModifiedDate;
            this.model.InCaseReason = data.Data[0].CancelReasonId;
            this.ApprovalList = null;
            this.ApprovalList = JSON.parse(data.Data[0].ApprovalStatusList);
            for (let i = 0; i < this.ArrayRoleId?.length; i++) {
              for (let j = 0; j < this.ApprovalList?.length; j++) {
                this.arry = this.ApprovalList[j].RoleId.split(',');
                if (inArray(this.ArrayRoleId[i], this.arry) > -1) {
                  this.IsApprovalstatusbtnhideShow = true;
                  this.IsHideShowCancelBtn = true;
                  break;
                }
              }
            }
            if (data.Data[0].IsApproved == 1) {
              this.IsApprovalstatusbtnhideShow = false;
            }
            if (this.ApprovalList != null) {
              this.ApproveStatusDataList = this.ApprovalList;
            } else {
              this.ApproveStatusDataList = null;
            }

            // this.model.TransferTypeId = data.Data[0].IstransferTypeId;
            if (data.Data[0].DispatchFromId != null) {
              this.model.DispatchFrom = data.Data[0].DispatchFromId;
            } else {
              this.model.DispatchFrom = 0;
            }

            // fill bilty 
            this.model.GRNo = data.Data[0].GRNo;
            if (data.Data[0].GRDate != null && data.Data[0].GRDate != "") {
              var GrDate = data.Data[0].GRDate.split('/');
              this.model.GRDate = { year: parseInt(GrDate[2]), month: parseInt(GrDate[1]), day: parseInt(GrDate[0]) };
            } else {
              this.model.GRDate = "";
            }
            if (data.Data[0].GRFile != null && data.Data[0].GRFile != "") {
              this.IsGRFile = true;
              this.GRFile = data.Data[0].GRFile;
            } else {
              this.IsGRFile = false;
            }

            //fill vehicle
            if (data.Data[0].VehicleType_Id != 0) {
              this.model.ddlVehicleType = '' + data.Data[0].VehicleType_Id + '';
              var VLoadingCapcity = this.VechileTypeDataList.filter(
                m => m.Id === parseInt(data.Data[0].VehicleType_Id));
              this.model.LoadingCapcity = VLoadingCapcity[0].Definition;
            } else {
              this.model.ddlVehicleType = 0;
            }
            this.model.VehicleNumber = data.Data[0].VehicleNumber;


            if (data.Data[0].DocumentFile != null) {
              this.IsDisabledDocumentDownload = false;
            } else {
              this.IsDisabledDocumentDownload = true;
            }
            this.model.DocmentFile = data.Data[0].DocumentFile;

            // fill Eway Bill No
            this.model.EwayBillNo = data.Data[0].EwayBillNo;
            if (data.Data[0].EwayBillDocument != "" && data.Data[0].EwayBillDocument != null) {
              this.IsEwayBillfile = true;
              this.EwayBillfile = data.Data[0].EwayBillDocument;
            } else {
              this.IsEwayBillfile = false;
            }

            this.model.TaxInvoiceNo = data.Data[0].TaxInvoiceNO;
            //vishal, 03/12/2022
            if (data.Data[0].TaxInvoiceDate != null && data.Data[0].TaxInvoiceDate != "") {
              var TxtInvDate = data.Data[0].TaxInvoiceDate.split('/');
              this.model.TaxInvoiceDate = { year: parseInt(TxtInvDate[2]), month: parseInt(TxtInvDate[1]), day: parseInt(TxtInvDate[0]) };
            } else {
              this.model.TaxInvoiceDate = "";
            }
            //end-vishal

            if (data.Data[0].TaxInvoiceFile != "" && data.Data[0].TaxInvoiceFile != null) {
              this.IsDisabledTaxInvoiceDownload = true;
              this.IsTaxInvoiceFile = true;
              this.TaxInvoiceFile = data.Data[0].TaxInvoiceFile;
            } else {
              this.IsDisabledTaxInvoiceDownload = false;
              this.IsTaxInvoiceFile = false;
            }
            this.model.TaxInvoicDocFile = data.Data[0].TaxInvoiceFile;


            this.model.ReceivedBy = data.Data[0].ReceivedBy;
            this.model.ReceivedNo = data.Data[0].ReceivedNo;
            if (data.Data[0].DeliveredDate != null) {
              var DelDate = data.Data[0].DeliveredDate.split('/');
              this.model.DeliveredDate = { year: parseInt(DelDate[2]), month: parseInt(DelDate[1]), day: parseInt(DelDate[0]) };
            }
            if (data.Data[0].ReceivingDocumentFile != "" && data.Data[0].ReceivingDocumentFile != null) {
              this.IsReceivingFile = true;
              this.ReceivingFile = data.Data[0].ReceivingDocumentFile;
            } else {
              this.IsReceivingFile = false;
            }

            if (data.Data[0].IsSTN == 1) {
              this.IsDisbaledWHDetail = true;
            }
            this.model.IsDispatch = data.Data[0].IsDispatch;
            this.model.Destination = data.Data[0].Destination;
            this.model.Note = data.Data[0].Note;

            // fill Costing Data
            this.model.SecTransCost = data.Data[0].SecTransCost;
            this.model.LoadingCost = data.Data[0].LoadingCost;
            this.model.UnloadingCost = data.Data[0].UnloadingCost;
            this.model.OtherCharges = data.Data[0].OtherCharges;
            this.model.PrimaryUnloadingCost = data.Data[0].PrimaryUnloadingCost;


            if (data.Data[0].IsMultipleSite == true && data.Data[0].IsMultipleSite != 0) {
              if (data.InstallationDataGrid != '') {
                this.MetrailInstallationGrid();
                this.IsMetrailInstallationGrid = true;
                this.InstallationrowData = data.InstallationDataGrid;
              } else {
                this.MetrailInstallationGrid();
                this.InstallationrowData = null;
              }
            }

            if (data.Data[0].IsActive == 0) {
              this.IsSaveButtonDisable = true;
            }

            if (data.WHData != null && data.WHData != "" && data.WHData.length > 0) {
              this.EditWHList = data.WHData;
              var FromWHAddressEdit = this.EditWHList.filter(m => m.Id === parseInt(data.Data[0].ShippedfromWHId));
              this.model.ShippedWHAddress = FromWHAddressEdit[0].WHAddress;
              this.model.ShippedfromWHId = FromWHAddressEdit[0].Id;
            }

            if (data.Data[0].IstransferTypeId != null || data.Data[0].IstransferTypeId != "") {
              if (this.model.TransferTypeId == PageActivity.Dis_SiteWithinState) {
                this.model.SiteId = data.Data[0].Site_Id;
                this.model.SiteName = data.Data[0].SiteName;
                this.model.CuValueSiteId = data.Data[0].CustomerSiteId;
                this.model.HideCustomerId = data.Data[0].CustomerSiteId;
                this.model.SiteAddress = data.Data[0].SiteAddress;
                this.model.CuUniqueSiteId = data.Data[0].Site_Id;
                this.model.ClientName = data.Data[0].ClientName;
                this.model.CompanyName = data.Data[0].CompanyName;
                this.EmpDataList = null;
                this.GetAllTechCOHbySiteId(data.Data[0].Site_Id);
                this.EditDispatchToTransferType(this.model.TransferTypeId);
                if (data.Data[0].FE_Tech != null && data.Data[0].FE_Tech != "") {
                  this.model.TECHFE = '' + data.Data[0].FE_Tech + '';
                } else {
                  this.model.TECHFE = "0";
                }
                if (data.Data[0].COH_CI != null && data.Data[0].COH_CI != "") {
                  this.model.COHCI = '' + data.Data[0].COH_CI + '';
                } else {
                  this.model.COHCI = "0";
                }
                if (data.Data[0].IsMultipleSite == true && data.Data[0].IsMultipleSite != null) {
                  try {
                    var objdropdownmodel = new DropdownModel();
                    objdropdownmodel.Other_Id = this.model.SiteId;
                    objdropdownmodel.Company_Id = this.CompanyId;
                    this._MaterialMovementService.GetAllEmployeeNameListBySiteId(objdropdownmodel).pipe(first()).subscribe(Emp => {
                      this.EmpDataList = Emp.EmployeeData;
                    }, error => {
                      this._Commonservices.ErrorFunction(this.UserName, error.message, "BindEmployeeDetail", "WHTOSite");
                    });
                  } catch (Error) {
                    this._Commonservices.ErrorFunction(this.UserName, Error.message, "BindEmployeeDetail", "WHTOSite");
                  }
                  this.model.IsMultipleSite = data.Data[0].IsMultipleSite;
                  this.model.EmployeeId = data.Data[0].EmployeeId;
                } else {
                  this.model.IsMultipleSite = data.Data[0].IsMultipleSite;
                  this.model.EmployeeId = "0";
                }
                //hemant Tyagi current 02/08/2022
                this.GetAllDispatchInstructionNoEdit(this.model.ShippedfromWHId, Id, data.Data[0].DispatchInstructionId);

              }
              else if (this.model.TransferTypeId == PageActivity.Dis_SiteOtherState) {
                this.EditDispatchToTransferType(this.model.TransferTypeId);
                var objVendorOrWh = new VendorOrWhModel();
                objVendorOrWh.Id = this.CompanyId;
                this._MaterialMovementService.GetAllState(objVendorOrWh).subscribe(data1 => {
                  if (data1.Status == 1) {
                    if (data1.Data != null && data1.Data != "") {
                      this.OtherSiteStateList = data1.Data;
                      FilterStateCode = null;
                      var FilterStateCode = this.OtherSiteStateList.filter(
                        m => m.id === parseInt(data.Data[0].ToState_Id));
                      if (FilterStateCode.length > 0) {
                        if (FilterStateCode[0].GSTNo != null) {
                          this.StateGSTNo = FilterStateCode[0].GSTNo;
                          this.model.ToSiteWHGSTIN = data.Data[0].ShippedToGSTNO;
                        } else {
                          this.model.ToSiteWHGSTIN = data.Data[0].ShippedToGSTNO;
                        }
                      } else {
                        this.model.ToSiteWHGSTIN = data.Data[0].ShippedToGSTNO;
                      }
                    }
                  }
                });
                this.GetAllTechCOHbySiteId(data.Data[0].Site_Id);

                this.model.ToSiteStateId = '' + data.Data[0].ToState_Id + '';
                this.model.ToSiteStateCode = data.Data[0].ShippedToStateCode;
                this.model.SiteId = data.Data[0].Site_Id;
                this.model.SiteName = data.Data[0].SiteName;
                this.model.CuValueSiteId = data.Data[0].CustomerSiteId;
                this.model.HideCustomerId = data.Data[0].CustomerSiteId;
                this.model.SiteAddress = data.Data[0].SiteAddress;
                this.model.CuUniqueSiteId = data.Data[0].Site_Id;
                this.model.ClientName = data.Data[0].ClientName;
                if (data.Data[0].GSTTypeId == 2) {
                  this.ClientGSTNo = data.Data[0].ShippedToGSTNO;
                }

                this.model.CompanyName = data.Data[0].CompanyName;
                //////
                if (data.Data[0].GSTTypeId != null || data.Data[0].GSTTypeId != "") {
                  this.model.GSTType = '' + data.Data[0].GSTTypeId + '';
                } else {
                  this.model.GSTType = 0;
                }


                if (data.Data[0].FE_Tech != null && data.Data[0].FE_Tech != "") {
                  this.model.TECHFE = '' + data.Data[0].FE_Tech + '';
                } else {
                  this.model.TECHFE = "0";
                }

                if (data.Data[0].COH_CI != null && data.Data[0].COH_CI != "") {
                  this.model.COHCI = '' + data.Data[0].COH_CI + '';
                } else {
                  this.model.COHCI = "0";
                }

                if (data.Data[0].IsMultipleSite == true && data.Data[0].IsMultipleSite != null) {
                  try {
                    var objdropdownmodel = new DropdownModel();
                    objdropdownmodel.Other_Id = this.model.SiteId;
                    objdropdownmodel.Company_Id = this.CompanyId;
                    this._MaterialMovementService.GetAllEmployeeNameListBySiteId(objdropdownmodel).pipe(first()).subscribe(Emp => {
                      this.EmpDataList = Emp.EmployeeData;
                    }, error => {
                      this._Commonservices.ErrorFunction(this.UserName, error.message, "BindEmployeeDetail", "WHTOSite");
                    });
                  } catch (Error) {
                    this._Commonservices.ErrorFunction(this.UserName, Error.message, "BindEmployeeDetail", "WHTOSite");
                  }
                  this.model.IsMultipleSite = data.Data[0].IsMultipleSite;
                  this.model.EmployeeId = data.Data[0].EmployeeId;
                } else {
                  this.model.IsMultipleSite = data.Data[0].IsMultipleSite;
                  this.model.EmployeeId = "0";
                }
                //hemant Tyagi current 02/08/2022
                this.GetAllDispatchInstructionNoEdit(this.model.ShippedfromWHId, Id, data.Data[0].DispatchInstructionId);
              }
              else if (this.model.TransferTypeId == PageActivity.Dis_WHWithinState) {
                try {
                  var StateId = this._Commonservices.checkUndefined(this.model.ddlStateId);
                  var objdropdownmodel = new DropdownModel();
                  objdropdownmodel.User_Id = this.UserId;
                  objdropdownmodel.Parent_Id = this.model.ShippedfromWHId;
                  if (StateId != '') {
                    objdropdownmodel.Other_Id = StateId;
                  } else {
                    objdropdownmodel.Other_Id = "0";
                  }
                  objdropdownmodel.User_Id = this.UserId;
                  objdropdownmodel.Parent_Id = this.model.ShippedfromWHId;
                  if (StateId != '') {
                    objdropdownmodel.Other_Id = StateId;
                  } else {
                    objdropdownmodel.Other_Id = "0";
                  }
                  objdropdownmodel.Company_Id = this.CompanyId;
                  objdropdownmodel.Flag = 'SameStateWHMaster';
                  this.model.ShippedToINWHId = '0'
                  this.StateINWHList = null;
                  this._Commonservices.getdropdown(objdropdownmodel).pipe(first()).subscribe(wh1 => {
                    if (wh1.Status == 1) {
                      if (wh1.Data != null && wh1.Data != "") {
                        this.StateINWHList = wh1.Data;
                        this.model.ShippedToINWHId = '' + data.Data[0].ShippedToWHId + '';
                        this.model.WHAddress = data.Data[0].ToWhAddress;
                      } else {
                        this.model.ShippedToINWHId = "0";
                        this.model.WHAddress = "";
                      }
                    }
                  }, error => {
                    this._Commonservices.ErrorFunction(this.UserName, error.message, "BindEditWHSameStateWHMaster", "WHTOSite");
                  });
                } catch (Error) {
                  this._Commonservices.ErrorFunction(this.UserName, Error.message, "BindEditWHSameStateWHMaster", "WHTOSite");
                }

                // if (data.WHData != null && data.WHData != "" && data.WHData.length > 0) {
                //   this.StateINWHList = data.WHData;
                //   this.model.WHAddress = data.WHData[0].WHAddress;
                // }


                this.EditDispatchToTransferType(this.model.TransferTypeId);
              }
              else if (this.model.TransferTypeId == PageActivity.Dis_WHOtherState || this.model.TransferTypeId == PageActivity.Dis_RepairingCenter) {
                this.EditDispatchToTransferType(this.model.TransferTypeId);
                this.ShippedTOWHList = JSON.parse(data.Data[0].ToOtherWHAddressList)
                this.model.ShippedToOtherWHId = '' + data.Data[0].ShippedToWHId + '';
                this.model.EditStateId = '' + data.Data[0].ToState_Id + '';
                this.model.WHAddress = data.Data[0].ToWhAddress;
                this.model.WHGSTIN = data.Data[0].ToWHGSTIN_UIN;
                this.model.WHStateCode = data.Data[0].ShippedToStateCode;
              }
              else if (this.model.TransferTypeId == PageActivity.Dis_CustomerReturn) {
                this.EditDispatchToTransferType(this.model.TransferTypeId);
                this.GettAllCRNNoList = JSON.parse(data.Data[0].CRNList)
                // this.model.ShippedToOtherWHId = '' + data.Data[0].ShippedToWHId + '';
                this.model.CustomerId = '' + data.Data[0].CustomerId + '';
                this.model.CRNId = '' + data.Data[0].CRN_Id + '';
                this.model.EditStateId = '' + data.Data[0].ToState_Id + '';
                this.model.CustomerAddress = data.Data[0].CustomerAddress;
                this.model.CustomerGSTIN = data.Data[0].ShippedToGSTNO;
                this.model.OtherStateCode = data.Data[0].ShippedToStateCode;
              }
              else if (this.model.TransferTypeId == PageActivity.Dis_Vendor
                || this.model.TransferTypeId == PageActivity.Dis_VendorScrapSale || this.model.TransferTypeId == PageActivity.Dis_VendorSale) {
                //this.OtherSiteStateList = JSON.parse(data.Data[0].ToOtherStateList);
                var objVendorOrWh = new VendorOrWhModel();
                objVendorOrWh.Id = this.CompanyId;
                this._MaterialMovementService.GetAllState(objVendorOrWh).subscribe(Vendata => {
                  if (Vendata.Status == 1) {
                    if (Vendata.Data != null && Vendata.Data != "") {
                      this.OtherSiteStateList = Vendata.Data.filter(m => m.id != 0).reduce(
                        (accumulator, current) => {
                          if (!accumulator.some(x => x.id === current.id)) {
                            accumulator.push(current)
                          }
                          return accumulator;
                        }, []
                      )
                    }
                    // this.VendorStateList=this.OtherSiteStateList
                  }
                });
                this.model.VenOtherStateId = data.Data[0].ToState_Id;
                this.SearchVendorListById = JSON.parse(data.Data[0].ToOtherVendorList);
                this.SelectedEditVendorList = [];
                this.MultiVenAddressList = [];
                this.MultiVenAddressList = JSON.parse(data.Data[0].VenAddressList);
                if (this.MultiVenAddressList.length == 1) {
                  this.VenderFilterAddress = [];
                  this.VenderFilterAddress = this.MultiVenAddressList
                  this.model.RadioId = data.Data[0].VenAddressId;
                } else {
                  this.VenderFilterAddress = this.MultiVenAddressList;
                  this.model.RadioId = data.Data[0].VenAddressId;
                }

                this.model.VendorCode = data.Data[0].VendorCode;
                this.model.VenGSTIN = data.Data[0].VenderGSTINNo;
                this.model.VendorAddress = data.Data[0].VenderAddress;
                this.model.VenStateCode = data.Data[0].ShippedToStateCode;
                if (data.Data[0].Vendor_Id != null && data.Data[0].Vendor_Id > 0) {
                  this.SelectedEditVendorList = [{ "id": '' + data.Data[0].Vendor_Id + '', "itemName": '' + data.Data[0].VendorName + '' }]
                } else {
                  this.SelectedEditVendorList = [];
                }
                this.EditDispatchToTransferType(this.model.TransferTypeId);

                //change by bramjot 18/6/20222
                if (data.Data[0].VendorTypeFlag == 2 && this.model.TransferTypeId == PageActivity.Dis_VendorSale) {
                  this.VendorScaleVissible = true;
                  this.BindVendorWh(data.Data[0].VendorCompany_Id, this.model.VenOtherStateId);
                  this.model.ShippedToVendorWHId = data.Data[0].ShippedToWHId;
                } else {
                  this.VendorScaleVissible = false;
                  this.ShippedTOVendorWHList = [];
                }
                //change by Hemant Tyagi 18/06/2022
              }
            }
          }
          this.CorrectionItemCodeList = JSON.parse(data.Data[0].CorrectionItemCodeList);
          if (data.ItemData != null && data.ItemData != "" && data.ItemData.length > 0) {
            this.BindItemArray(data.ItemData);
          }
          if (this.model.TransferTypeId == PageActivity.Dis_Vendor || this.model.TransferTypeId == PageActivity.Dis_VendorSale) {
            this.IsVendorTax = true;
            this.IsTransferTypeSameState = false;
            this.IsTransferTypeOtherSite = false;
            this.IsVendprScrapSale = false;
            this.IsSerialValidationShowHide = true;
          }
          if (this.model.TransferTypeId == PageActivity.Dis_VendorScrapSale) {
            this.IsVendorTax = true;
            this.IsTransferTypeSameState = false;
            this.IsTransferTypeOtherSite = false;
            this.IsVendprScrapSale = true;
            this.IsSerialValidationShowHide = false;
          }
        }
        //vishal: 13/12/2022, desc: for mail button hide/show
        if (this.model.TransferTypeId == PageActivity.Dis_SiteOtherState || this.model.TransferTypeId == PageActivity.Dis_WHOtherState
          || this.model.TransferTypeId == PageActivity.Dis_VendorSale || this.model.TransferTypeId == PageActivity.Dis_VendorScrapSale) {

          this.IsMailButtonHide = false;
        } else if (this.model.TransferTypeId == PageActivity.Dis_SiteWithinState || this.model.TransferTypeId == PageActivity.Dis_WHWithinState
          || this.model.TransferTypeId == PageActivity.Dis_CustomerReturn || this.model.TransferTypeId == PageActivity.Dis_RepairingCenter) {

          this.IsMailButtonHide = true;
        } else {

          this.IsMailButtonHide = true;
        } //end-vishal

      }, error => {
        this._Commonservices.ErrorFunction(this.UserName, error.message, "SearchDispatchTrackerEditListByDispatchId", "WHTOSite");
      });
    } catch (Error) {
      this._Commonservices.ErrorFunction(this.UserName, Error.message, "SearchDispatchTrackerEditListByDispatchId", "WHTOSite");
    }
  }
  //#endregion

  //#region this function used To Cancel Dispatch by Dispatch Id
  conformCancelPopup() {
    this.IsError = false;
    if (this.CancelValidation() == 1) {
      return false;
    }
    jQuery('#Cancleconfirm').modal('show');
  }

  UpadateCancelDispatch() {
    try {
      var objApprovelStatusModel = new ApprovelStatusModel();
      objApprovelStatusModel.User_Id = this.UserId;
      objApprovelStatusModel.ApprovalStatus_Id = this.model.DisatchTrackeringId;
      objApprovelStatusModel.Table_Id = this.model.InCaseReason;
      objApprovelStatusModel.Flag = "Dispatch";
      this._MaterialMovementService.UpadateCancelDispatch(objApprovelStatusModel).subscribe(data => {
        if (data.Status == 1) {
          this.IsHideShowCancelBtn = false;
          jQuery('#Cancleconfirm').modal('hide');
          setTimeout(() => {
            alert('Your Dispatch SuccessFully Cancel')
          }, 300);
        }

      });
    } catch (Error) {
      this._Commonservices.ErrorFunction(this.UserName, Error.message, "UpadateCancelDispatch", "WHTOSite");
    }
  }
  //#endregion
  DocDocumentfiledownload() {
    window.open(this.model.DocmentFile);
  }

  TaxInvoiceDocumentfiledownload() {
    window.open(this.model.TaxInvoicDocFile);
  }

  GRViewfileClick() {
    window.open(this.GRFile);
  }

  EwayBillViewfileClick() {
    window.open(this.EwayBillfile);
  }

  ReceivingViewfileClick() {
    window.open(this.ReceivingFile);
  }

  TaxInvViewfileClick() {
    window.open(this.TaxInvoiceFile);
  }

  //#region Correction Entry Work
  ChangeCorrectionEntryReason(index: any) {
    if (this.dynamicArray[index].IsCorrectionEntryReason != "" || this.dynamicArray[index].IsCorrectionEntryReason != "0") {
      $("#ddlCentryReason_" + index).css('border-color', '');
    }
  }

  ClickCorrectionEntryRemarks(index: any) {
    if (this.dynamicArray[index].CorrectionEntryRemarks != "" || this.dynamicArray[index].CorrectionEntryRemarks != "0") {
      $("#txtCorrectionEntryRemarks_" + index).css('border-color', '');
    }
  }

  ChangeCorrectionCode(index: any, id: any) {
    var CorrectionAcceptqty = this.CorrectionItemCodeList.filter(m => m.DispatchListId === parseInt(id));
    //this.dynamicArray[index].Qty = CorrectionAcceptqty[0].AcceptedQty;
    if (this.dynamicArray[index].IsCorrectionCodeId != "" || this.dynamicArray[index].IsCorrectionCodeId != "0") {
      $("#ddlCorrectionCodeId_" + index).css('border-color', '');
    }
  }

  ConfirmCorrectionPopup(index: any) {
    this.model.arrayId = index;
    if (this.CorrectionValidationGRN(index) == 1) {
      return false;
    }
    jQuery('#Correctionconfirm').modal('show');
  }

  UpadateCorrectionEntry() {
    jQuery('#Correctionconfirm').modal('hide');
    try {
      // this.loading = true;
      var objDispatchTrackingModel = new DispatchTrackingModel();
      objDispatchTrackingModel.DispatchTracker_Id = this.model.DisatchTrackeringId;
      objDispatchTrackingModel.UserId = this.UserId;
      objDispatchTrackingModel.Company_Id = this.CompanyId;
      objDispatchTrackingModel.Pageflag = this.model.TransferTypeId;
      this.DispatchTrackingItem = [];
      for (var i = 0, len = this.dynamicArray.length; i < len; i++) {
        if (this.dynamicArray[i] == this.dynamicArray[this.model.arrayId]) {
          var objDispatchTrackingItemDetialModel = new DispatchTrackingItemDetialModel();
          objDispatchTrackingItemDetialModel.Id = this.dynamicArray[i].IsCorrectionCodeId;
          objDispatchTrackingItemDetialModel.CorrectionEntryRemarks = this.dynamicArray[i].CorrectionEntryRemarks;
          objDispatchTrackingItemDetialModel.IsCorrectionEntryReason = this.dynamicArray[i].IsCorrectionEntryReason;
          objDispatchTrackingItemDetialModel.IsCorrectionCodeId = this.dynamicArray[i].IsCorrectionCodeId;
          objDispatchTrackingItemDetialModel.ItemCode_Id = this.dynamicArray[i].ItemId;
          objDispatchTrackingItemDetialModel.Rate = this.dynamicArray[i].Rate;
          objDispatchTrackingItemDetialModel.Discount = this.dynamicArray[i].Discount;
          objDispatchTrackingItemDetialModel.HSN_SAC = this.dynamicArray[i].HSN;
          objDispatchTrackingItemDetialModel.EqpType_Id = this.dynamicArray[i].EqTypeId;
          objDispatchTrackingItemDetialModel.DispatchType_Id = this.dynamicArray[i].DispatchTypeId;
          objDispatchTrackingItemDetialModel.SubDescription = this.dynamicArray[i].SubDescription;
          var MfDate = this._Commonservices.checkUndefined(this.dynamicArray[i].ManufDate);
          if (MfDate != '') {
            objDispatchTrackingItemDetialModel.ManufacturerDate = MfDate.day + '/' + MfDate.month + '/' + MfDate.year;
          } else {
            objDispatchTrackingItemDetialModel.ManufacturerDate = "";
          }
          objDispatchTrackingItemDetialModel.ManufacturerSerialNo = this.dynamicArray[i].SerialNo;
          var INVDate = this._Commonservices.checkUndefined(this.dynamicArray[i].InvoiceTaxDate);
          if (INVDate != '') {
            objDispatchTrackingItemDetialModel.InvoiceTaxDate = INVDate.day + '/' + INVDate.month + '/' + INVDate.year;
          } else {
            objDispatchTrackingItemDetialModel.InvoiceTaxDate = "";
          }
          objDispatchTrackingItemDetialModel.InvoiceTaxNo = this.dynamicArray[i].InvoiceTaxNo;
          objDispatchTrackingItemDetialModel.IGST = this.dynamicArray[i].IGST;
          objDispatchTrackingItemDetialModel.IGSTValue = this.dynamicArray[i].IGSTValue;
          objDispatchTrackingItemDetialModel.CGSTRate = this.dynamicArray[i].CGSTRate;
          objDispatchTrackingItemDetialModel.CGST = this.dynamicArray[i].CGST;
          objDispatchTrackingItemDetialModel.SGSTRate = this.dynamicArray[i].SGSTRate;
          objDispatchTrackingItemDetialModel.SGST = this.dynamicArray[i].SGST;
          objDispatchTrackingItemDetialModel.TCSRate = this.dynamicArray[i].TCSRate;
          objDispatchTrackingItemDetialModel.TCS = this.dynamicArray[i].TCS;
          objDispatchTrackingItemDetialModel.TotalInvoiceValue = this.dynamicArray[i].TotalInvoiceValue;
          objDispatchTrackingItemDetialModel.FreightCharge = this.dynamicArray[i].FreightCharge;
          objDispatchTrackingItemDetialModel.TotalAmountWithFreightCharge = this.dynamicArray[i].TotalAmountWithFreightCharge;
          objDispatchTrackingItemDetialModel.ClientId = this.dynamicArray[i].ClientId;
          if (this.dynamicArray[i].ReceivedQty == "") {
            objDispatchTrackingItemDetialModel.ReceivedQty = 0.00;
          } else {
            objDispatchTrackingItemDetialModel.ReceivedQty = this.dynamicArray[i].ReceivedQty;
          }
          objDispatchTrackingItemDetialModel.ReasonId = this.dynamicArray[i].ReasonId;
          objDispatchTrackingItemDetialModel.Remarks = this.dynamicArray[i].Remarks;
          var conver = this._Commonservices.checkUndefined(this.dynamicArray[i].ConversionUnit);
          if (conver == "") {
            objDispatchTrackingItemDetialModel.Qty = this.dynamicArray[i].Qty;
            objDispatchTrackingItemDetialModel.UnitId = this.dynamicArray[i].UnitName;
            objDispatchTrackingItemDetialModel.ConversionUnit = "";
            objDispatchTrackingItemDetialModel.ConversionValue = 0;
          } else {
            objDispatchTrackingItemDetialModel.Qty = this.dynamicArray[i].Qty;
            objDispatchTrackingItemDetialModel.UnitId = this.dynamicArray[i].UnitName;
            objDispatchTrackingItemDetialModel.ConversionUnit = this.dynamicArray[i].ConversionUnit;
            objDispatchTrackingItemDetialModel.ConversionValue = this.dynamicArray[i].ConversionValue;
          }
          this.srnlst = [];
          if (this.dynamicArray[i].GSerialNumbers.length > 0) {
            if (this.dynamicArray[i].ItemNameId == "4" && this.dynamicArray[i].UnitName == "8") {
              // Check by Hemant Tyagi
              for (var j = 0; j < this.dynamicArray[i].GSerialNumbers.length; j++) {
                for (var k = 0; k < this.dynamicArray[i].GSerialNumbers[j].CellNos.length; k++) {
                  var srnData = new GSerialNumber();
                  srnData.InitialSrno = this.dynamicArray[i].GSerialNumbers[j].CellNos[k].CellValue;
                  srnData.Sequance = j.toString();
                  this.srnlst.push(srnData)
                }
              }
              objDispatchTrackingItemDetialModel.GSerialNumbers = this.srnlst;
            } else {
              objDispatchTrackingItemDetialModel.GSerialNumbers = this.dynamicArray[i].GSerialNumbers;
            }
          }
          this.DispatchTrackingItem.push(objDispatchTrackingItemDetialModel)
        }
      }
      objDispatchTrackingModel.DispatchTrackerItemList = this.DispatchTrackingItem;
      var formdata = new FormData();
      formdata.append('jsonDetail', JSON.stringify(objDispatchTrackingModel));
      this._MaterialMovementService.UpadteCorrectionEntryDispatchDetail(formdata).subscribe(data => {
        if (data.Status == 1) {
          //this.dynamicArray[this.model.arrayId].IsCorrectionDisabled = true;
          jQuery("#confirm").modal('hide');
          alert(data.Remarks);
        } else if (data.Status == 2) {
          jQuery("#confirm").modal('hide');
          alert('your accpeted qty > remaining qty and your remaining qty :- ' + data.Remarks);
        }
      });
    } catch (Error) {
      console.log(Error.message)
    }

  }

  CorrectionValidationGRN(index) {
    var flag = 0;
    if (this.dynamicArray[index].ItemNameId == "" || this.dynamicArray[index].ItemNameId == "null" || this.dynamicArray[index].ItemNameId == "0") {
      $('#ddlItemNameId_' + index).css('border-color', 'red');
      $('#ddlItemNameId_' + index).focus();
      flag = 1;
    } else {
      $("#ddlItemNameId_" + index).css('border-color', '');
    }

    if (this.dynamicArray[index].ItemMakeId == "" || this.dynamicArray[index].ItemMakeId == "null" || this.dynamicArray[index].ItemMakeId == "0") {
      $('#ddlItemMake_' + index).css('border-color', 'red');
      $('#ddlItemMake_' + index).focus();
      flag = 1;
    } else {
      $("#ddlItemMake_" + index).css('border-color', '');
    }

    if (this.dynamicArray[index].ItemId == "" || this.dynamicArray[index].ItemId == "null" || this.dynamicArray[index].ItemId == "0") {
      $('#ddlItemId_' + index).css('border-color', 'red');
      $('#ddlItemId_' + index).focus();
      flag = 1;
    } else {
      $("#ddlItemId_" + index).css('border-color', '');
    }

    if (this.dynamicArray[index].Rate == "" || this.dynamicArray[index].Rate == "0") {
      $('#txtRate_' + index).css('border-color', 'red');
      $('#txtRate_' + index).focus();
      flag = 1;
    } else {
      $("#txtRate_" + index).css('border-color', '');
    }

    if (this.dynamicArray[index].EqTypeId == "" || this.dynamicArray[index].EqTypeId == "0") {
      $('#ddlEqTypeId_' + index).css('border-color', 'red');
      $('#ddlEqTypeId_' + index).focus();
      flag = 1;
    } else {
      $("#ddlEqTypeId_" + index).css('border-color', '');
    }

    if (this.dynamicArray[index].ClientId == "null" || this.dynamicArray[index].ClientId == "0") {
      $('#ddlClient_' + index).css('border-color', 'red');
      $('#ddlClient_' + index).focus();
      flag = 1;
    } else {
      $("#ddlClient_" + index).css('border-color', '');
    }

    if (this.dynamicArray[index].UnitName == "" || this.dynamicArray[index].UnitName == "0") {
      $('#ddlUnitName_' + index).css('border-color', 'red');
      $('#ddlUnitName_' + index).focus();
      flag = 1;
    } else {
      $("#ddlUnitName_" + index).css('border-color', '');
    }

    if (this.dynamicArray[index].Rate == "" || this.dynamicArray[index].Rate == "0") {
      $('#txtRate_' + index).css('border-color', 'red');
      $('#txtRate_' + index).focus();
      flag = 1;
    } else {
      $("#txtRate_" + index).css('border-color', '');
    }

    if (this.dynamicArray[index].Qty == "" || this.dynamicArray[index].Qty == "0") {
      $('#txtQty_' + index).css('border-color', 'red');
      $('#txtQty_' + index).focus();
      flag = 1;
    } else {
      $("#txtQty_" + index).css('border-color', '');
    }

    if (this.dynamicArray[index].DispatchTypeId == "" || this.dynamicArray[index].DispatchTypeId == "0") {
      $('#ddlDispatchType_' + index).css('border-color', 'red');
      $('#ddlDispatchType_' + index).focus();
      flag = 1;
    } else {
      $("#ddlDispatchType_" + index).css('border-color', '');
    }

    if (this.dynamicArray[index].IsCorrectionCodeId == "" || this.dynamicArray[index].IsCorrectionCodeId == "0") {
      $('#ddlCorrectionCodeId_' + index).css('border-color', 'red');
      $('#ddlCorrectionCodeId_' + index).focus();
      flag = 1;
    } else {
      $("#ddlCorrectionCodeId_" + index).css('border-color', '');
    }
    if (this.dynamicArray[index].IsCorrectionEntryReason == "" || this.dynamicArray[index].IsCorrectionEntryReason == "0") {
      $('#ddlCentryReason_' + index).css('border-color', 'red');
      $('#ddlCentryReason_' + index).focus();
      flag = 1;
    } else {
      $("#ddlCentryReason_" + index).css('border-color', '');
    }

    //vishal

    //  if (this.dynamicArray[index].ItemName == "MISC" ) {
    //   $('#txtSubDesc_' + index).css('border-color', 'red');
    //   $('#txtSubDesc_' + index).focus();
    //   flag = 1;
    // } else {
    //   $("#txtSubDesc_" + index).css('border-color', '');
    // }

    //vishal-end-region


    if (this.dynamicArray[index].IsCorrectionEntryReason == ReasonActivity.CorrectionReason) {
      if (this._Commonservices.checkUndefined(this.dynamicArray[index].CorrectionEntryRemarks) == "") {
        $('#txtCorrectionEntryRemarks_' + index).css('border-color', 'red');
        $('#txtCorrectionEntryRemarks_' + index).focus();
        flag = 1;
      } else {
        $("#txtCorrectionEntryRemarks_" + index).css('border-color', '');
      }

    }
    return flag;
  }
  //#endregion


  async BindItemArray(ItemEditDataArr: any) {
    this.dynamicArray = [];
    if (ItemEditDataArr != null && ItemEditDataArr != "") {
      for (var i = 0, len = ItemEditDataArr.length; i < len; i++) {
        var objdynamic = new DynamicItemGrid();
        objdynamic.Id = ItemEditDataArr[i].Id;
        objdynamic.ItemNameId = ItemEditDataArr[i].ItemNameId;
        objdynamic.EditItemMake = JSON.parse(ItemEditDataArr[i].ItemMakeList);
        objdynamic.ItemMakeId = ItemEditDataArr[i].MakeMaster_Id;
        objdynamic.EditItemCode = JSON.parse(ItemEditDataArr[i].ItemCodeList);
        objdynamic.CorrectionEntryRemarks = ItemEditDataArr[i].CorrectionEntryRemarks;
        objdynamic.IsCorrectionEntryReason = ItemEditDataArr[i].IsCorrectionEntryReason;
        objdynamic.IsCorrectionCodeId = ItemEditDataArr[i].IsCorrectionCodeId;
        debugger
        if (ItemEditDataArr[i].SerialNoList != null) {
          objdynamic.GSerialNumbers = JSON.parse(ItemEditDataArr[i].SerialNoList);
        } else {
          objdynamic.GSerialNumbers = [];
        }

        objdynamic.UnitList = JSON.parse(ItemEditDataArr[i].UnitList);
        objdynamic.ItemId = ItemEditDataArr[i].ItemId;
        objdynamic.EqTypeId = ItemEditDataArr[i].EqpType_Id;

        if (ItemEditDataArr[i].DispatchType_Id != "" && ItemEditDataArr[i].DispatchType_Id != null) {
          objdynamic.DispatchTypeId = ItemEditDataArr[i].DispatchType_Id;
        } else {
          objdynamic.DispatchTypeId = "0";
        }

        objdynamic.ItemDescription = ItemEditDataArr[i].ItemDescription;
        objdynamic.SubDescription = ItemEditDataArr[i].SubDescription;

        if (ItemEditDataArr[i].ClientId != "" && ItemEditDataArr[i].ClientId != null) {
          objdynamic.ClientId = ItemEditDataArr[i].ClientId;
        } else {
          objdynamic.ClientId = "0";
        }

        if (ItemEditDataArr[i].ReasonId != "" && ItemEditDataArr[i].ReasonId != null) {
          objdynamic.ReasonId = ItemEditDataArr[i].ReasonId;
        } else {
          objdynamic.ReasonId = "0";
        }

        if (ItemEditDataArr[i].ReceivedQty != "" && ItemEditDataArr[i].ReceivedQty != null) {
          objdynamic.ReceivedQty = parseFloat(ItemEditDataArr[i].ReceivedQty).toFixed(2);
        } else {
          objdynamic.ReceivedQty = "";
        }

        if (this.model.TransferTypeId == PageActivity.Dis_VendorScrapSale) {
          objdynamic.SaleQty = ItemEditDataArr[i].SaleQty;
          objdynamic.SaleUnitName = ItemEditDataArr[i].SaleUnit;
        }

        objdynamic.Remarks = ItemEditDataArr[i].Remarks;
        objdynamic.Rate = parseFloat(ItemEditDataArr[i].Rate).toFixed(2);
        objdynamic.CGST = parseFloat(ItemEditDataArr[i].CGST).toFixed(2);
        objdynamic.CGSTRate = parseFloat(ItemEditDataArr[i].CGSTRate).toFixed(2);
        objdynamic.SGST = parseFloat(ItemEditDataArr[i].SGST).toFixed(2);
        objdynamic.SGSTRate = parseFloat(ItemEditDataArr[i].SGSTRate).toFixed(2);
        objdynamic.TCSRate = parseFloat(ItemEditDataArr[i].TCSRate).toFixed(2);
        objdynamic.TCS = parseFloat(ItemEditDataArr[i].TCS).toFixed(2);
        objdynamic.IGST = parseFloat(ItemEditDataArr[i].IGST).toFixed(2);
        objdynamic.IGSTValue = parseFloat(ItemEditDataArr[i].IGSTValue).toFixed(2);
        objdynamic.TotalInvoiceValue = parseFloat(ItemEditDataArr[i].TotalInvoiceValue).toFixed(2);
        objdynamic.FreightCharge = parseFloat(ItemEditDataArr[i].FreightCharge).toFixed(2);
        objdynamic.TotalAmountWithFreightCharge = parseFloat(ItemEditDataArr[i].TotalAmountWithFreightCharge).toFixed(2);

        if (objdynamic.ItemNameId == CommonStaticClass.MSTItemNameId) {
          if (ItemEditDataArr[i].UnitMaster_Id == "2") {
            objdynamic.UnitName = ItemEditDataArr[i].UnitMaster_Id;
            objdynamic.HideShowConValue = false;
            objdynamic.Qty = parseFloat(ItemEditDataArr[i].Qty).toFixed(2);
          } else {
            objdynamic.HideShowConValue = true;
            objdynamic.UnitName = ItemEditDataArr[i].UnitMaster_Id;
            objdynamic.ConversionUnit = ItemEditDataArr[i].ConversionUnit;
            objdynamic.HideConversionValue = ((ItemEditDataArr[i].ConversionValue) / (ItemEditDataArr[i].Qty));
            objdynamic.Qty = parseFloat(ItemEditDataArr[i].Qty).toFixed(2);
            objdynamic.ConversionValue = parseFloat(ItemEditDataArr[i].ConversionValue).toFixed(2);
          }

          var objVendormodel = new VendorOrWhModel();
          objVendormodel.Id = objdynamic.ItemId;
          objVendormodel.flag = 'ItemMaster';
          this._Commonservices.getVendorOrWh(objVendormodel).pipe(first()).subscribe(data => {
            if (objdynamic.ItemNameId == CommonStaticClass.MSTItemNameId && data.Data[0].UnitList.length == 1) {
              objdynamic.ConversionUnit = "";
              objdynamic.HideConversionValue = "";
              objdynamic.IsConversion = "";
              objdynamic.HideShowConValue = false;
              objdynamic.Qty = parseFloat(ItemEditDataArr[i].Qty).toFixed(2);
            } else if (objdynamic.ItemNameId == CommonStaticClass.MSTItemNameId && data.Data[0].UnitList.length != 1) {
              if (data.Data[0].IsConversion != null && data.Data[0].IsConversion != 0) {
                objdynamic.ConversionUnit = data.Data[0].ConversionUnit;
                objdynamic.IsConversion = data.Data[0].IsConversion
                objdynamic.HideConversionValue = data.Data[0].ConversionValue;
                objdynamic.ChangeUnitConversionUnit = data.Data[0].ConversionUnit;
                objdynamic.ChangeUnitIsConversion = data.Data[0].IsConversion
                objdynamic.ChangeUnitHideConversionValue = data.Data[0].ConversionValue;
              }
            }
          }, error => {
            this._Commonservices.ErrorFunction(this.UserName, error.message, "EditItem", "WHTOSite");
          });
        } else {
          if (ItemEditDataArr[i].ConversionUnit == "" || ItemEditDataArr[i].ConversionUnit == null) {
            objdynamic.HideShowConValue = false;
            if (ItemEditDataArr[i].UnitMaster_Id != null) {
              objdynamic.UnitName = ItemEditDataArr[i].UnitMaster_Id;
            } else {
              objdynamic.UnitName = "0";
            }
            objdynamic.Qty = parseFloat(ItemEditDataArr[i].Qty).toFixed(2);
          } else {
            objdynamic.HideShowConValue = true;
            //objdynamic.UnitName = ItemEditDataArr[i].ConversionUnit;
            //objdynamic.ConversionUnit = ItemEditDataArr[i].UnitName;
            if (ItemEditDataArr[i].UnitMaster_Id != null) {
              objdynamic.UnitName = ItemEditDataArr[i].UnitMaster_Id;
            } else {
              objdynamic.UnitName = "0";
            }
            objdynamic.ConversionValue = parseFloat(ItemEditDataArr[i].ConversionValue).toFixed(2);
            objdynamic.Qty = parseFloat(ItemEditDataArr[i].Qty).toFixed(2);
          }

        }

        objdynamic.HSN = parseInt(ItemEditDataArr[i].HSN_SAC);
        objdynamic.TotalAmount = ItemEditDataArr[i].TotalAmount;
        objdynamic.Discount = ItemEditDataArr[i].Discount;
        objdynamic.GetTotalAmount = ItemEditDataArr[i].GrandTotalAmt;
        var MfDate = ItemEditDataArr[i].ManufacturerDate;
        if (MfDate != null && MfDate != '') {
          var MfDate = ItemEditDataArr[i].ManufacturerDate.split('/');
          objdynamic.ManufDate = { year: parseInt(MfDate[2]), month: parseInt(MfDate[1]), day: parseInt(MfDate[0]) };
        }
        objdynamic.SerialNo = ItemEditDataArr[i].ManufacturerSerialNo;
        var INVCDate = ItemEditDataArr[i].InvoiceTaxDate;
        if (INVCDate != null && INVCDate != '') {
          var INVCDate = ItemEditDataArr[i].InvoiceTaxDate.split('/');
          objdynamic.InvoiceTaxDate = { year: parseInt(INVCDate[2]), month: parseInt(INVCDate[1]), day: parseInt(INVCDate[0]) };
        }
        objdynamic.InvoiceTaxNo = ItemEditDataArr[i].InvoiceTaxNo;
        if (ItemEditDataArr[i].IGSTValue != null) {
          objdynamic.IGSTValue = ItemEditDataArr[i].IGSTValue;
        } else {
          objdynamic.IGSTValue = 0;
        }

        // add by Hemant Tyagi 02/08/2022
        objdynamic.SiteId = ItemEditDataArr[i].SiteId;
        objdynamic.CustomerSiteId = ItemEditDataArr[i].CustomerSiteId;
        objdynamic.DIList_Id = ItemEditDataArr[i].DIList_Id;
        this.dynamicArray.push(objdynamic);
        this.dynamicArray[i].FQty = (this.dynamicArray[i].Qty ?? 0)  //this.getClosingStock(i);
        this.fnBindItemGrossToatl();
        this.fnBindIGSTValueItemGrossToatal();
      }
    }
  }

  fnBindItemGrossToatl() {
    this.totalamount = 0.0;
    var totalqty = 0.0;
    var totalpoqty = 0.0;
    var poqty = 0.0;
    var DiscountAmt = 0.0;
    var Rate = 0.0;
    var HideConValue = 0.0;
    this.totalSumQuantity = 0.0;
    for (var i = 0, len = this.dynamicArray.length; i < len; i++) {
      poqty = parseFloat(this.dynamicArray[i].Qty == "" ? 0.0 : this.dynamicArray[i].Qty);
      DiscountAmt = parseFloat(this.dynamicArray[i].Discount == "" ? 0.0 : this.dynamicArray[i].Discount);
      Rate = parseFloat(this.dynamicArray[i].Rate == "" ? 0.0 : this.dynamicArray[i].Rate);
      if (this._Commonservices.checkUndefined(this.dynamicArray[i].HideConversionValue) != "") {
        HideConValue = parseFloat(this.dynamicArray[i].HideConversionValue == "" ? 0.0 : this.dynamicArray[i].HideConversionValue);
        this.dynamicArray[i].ConversionValue = (poqty * HideConValue)
      }
      totalpoqty += poqty;
      this.totalamount += ((poqty * Rate) - DiscountAmt);
      this.dynamicArray[i].TotalAmount = this._Commonservices.thousands_separators(poqty * Rate);
      this.dynamicArray[i].GetTotalAmount = this._Commonservices.thousands_separators((poqty * Rate) - DiscountAmt);
    }
    this.totalSumPOQuantity = totalpoqty.toFixed(2);
    this.totalSumQuantity = totalqty.toFixed(2);
    //this.totalSumAmount=totalamount.toFixed(2);
    this.model.AmountChargeable = this._Commonservices.valueInWords(this.totalamount.toFixed(2));
    this.totalSumAmount = this._Commonservices.thousands_separators(this.totalamount);
  }


  fnBindIGSTValueItemGrossToatal() {
    this.totalamount = 0.0;
    var totalqty = 0.0;
    var totalpoqty = 0.0;
    var poqty = 0.0;
    var IGSTval = 0.0;
    var IGSTAmount = 0.0;
    var Rate = 0.0;
    this.totalSumQuantity = 0.0;
    var HideConValue = 0.0;
    for (var i = 0, len = this.dynamicArray.length; i < len; i++) {
      if (this.model.TransferTypeId == PageActivity.Dis_VendorScrapSale) {
        poqty = parseFloat(this.dynamicArray[i].SaleQty == "" ? 0.0 : this.dynamicArray[i].SaleQty);
      }
      else {
        poqty = parseFloat(this.dynamicArray[i].Qty == "" ? 0.0 : this.dynamicArray[i].Qty);
      }
      Rate = parseFloat(this.dynamicArray[i].Rate == "" ? 0.0 : this.dynamicArray[i].Rate);
      IGSTval = parseFloat(this.dynamicArray[i].IGSTValue == "" ? 0.0 : this.dynamicArray[i].IGSTValue);
      if (this._Commonservices.checkUndefined(this.dynamicArray[i].HideConversionValue) != "") {
        HideConValue = parseFloat(this.dynamicArray[i].HideConversionValue == "" ? 0.0 : this.dynamicArray[i].HideConversionValue);
        this.dynamicArray[i].ConversionValue = (poqty * HideConValue)
      }
      totalpoqty += poqty;
      //totalamount+=((poqty*Rate)-DiscountAmt);
      this.dynamicArray[i].TotalAmount = this._Commonservices.thousands_separators(poqty * Rate);
      this.dynamicArray[i].IGST = (((poqty * Rate) * IGSTval) / 100);
      this.dynamicArray[i].GetTotalAmount = this._Commonservices.thousands_separators((poqty * Rate) + (((poqty * Rate) * IGSTval) / 100));
      IGSTAmount = ((poqty * Rate) + (((poqty * Rate) * IGSTval) / 100));
      this.totalamount += IGSTAmount;
    }
    this.totalSumPOQuantity = totalpoqty.toFixed(2);
    this.totalSumQuantity = totalqty.toFixed(2);
    //this.totalSumAmount=totalamount.toFixed(2);
    this.model.AmountChargeable = this._Commonservices.valueInWords(this.totalamount);
    this.totalSumAmount = this._Commonservices.thousands_separators(this.totalamount.toFixed(2));
  }

  ItemRateOnblur() {
    if (this.model.TransferTypeId == PageActivity.Dis_Vendor || this.model.TransferTypeId == PageActivity.Dis_VendorScrapSale || this.model.TransferTypeId == PageActivity.Dis_VendorSale) {
      this.fnBindItemGrossToatlTax();
    } else {
      this.fnBindItemGrossToatl();
    }
  }

  fnBindItemGrossToatlTax() {
    this.totalAmount = 0.0;
    var _rowAmount = 0.0;
    var accqty = 0.0;
    var AcceptedQty = 0.0;
    var rate = 0.0;
    this.totalSumAcceptedQty = 0.0;
    var cgstRate = 0.00;
    var sgstRate = 0.00;
    var tcsRate = 0.00;
    var igstrate = 0.00;
    var taxWith;
    var totalBottemAmount = 0;
    this.totalSumAmount = 0;
    for (var i = 0, len = this.dynamicArray.length; i < len; i++) {
      _rowAmount = 0.0;
      if (this.dynamicArray[i].SGSTRate != 0) {
        this.dynamicArray[i].CGSTRate = this.dynamicArray[i].SGSTRate;
      }
      if (this.dynamicArray[i].CGSTRate != 0) {
        this.dynamicArray[i].SGSTRate = this.dynamicArray[i].CGSTRate;
      }
      if (this.dynamicArray[i].IGSTValue != 0) {
        this.dynamicArray[i].SGSTRate = 0;
        this.dynamicArray[i].CGSTRate = 0;
      }
      if (this.model.TransferTypeId == PageActivity.Dis_VendorScrapSale) {
        accqty = parseFloat(this.dynamicArray[i].SaleQty == "" ? 0.0 : this.dynamicArray[i].SaleQty);
      } else {
        accqty = parseFloat(this.dynamicArray[i].Qty == "" ? 0.0 : this.dynamicArray[i].Qty);
      }
      rate = parseFloat(this.dynamicArray[i].Rate == "" ? 0.0 : this.dynamicArray[i].Rate);
      cgstRate = parseFloat(this.dynamicArray[i].CGSTRate == "" ? 0.0 : this.dynamicArray[i].CGSTRate);
      sgstRate = parseFloat(this.dynamicArray[i].SGSTRate == "" ? 0.0 : this.dynamicArray[i].SGSTRate);
      tcsRate = parseFloat(this.dynamicArray[i].TCSRate == "" ? 0.0 : this.dynamicArray[i].TCSRate);
      igstrate = parseFloat(this.dynamicArray[i].IGSTValue == "" ? 0.0 : this.dynamicArray[i].IGSTValue);

      AcceptedQty += accqty;
      this.totalAmount += (accqty * rate);
      _rowAmount = accqty * rate;
      this.dynamicArray[i].TotalAmount = this._Commonservices.thousands_separators(accqty * rate);
      taxWith = this.dynamicArray[i].TaxWith;
      if (taxWith == "1") {
        this.dynamicArray[i].TotalAmountWithFreightCharge = _rowAmount + parseFloat(this.dynamicArray[i].FreightCharge);
        this.dynamicArray[i].CGST = (this.dynamicArray[i].TotalAmountWithFreightCharge * cgstRate) / 100;
        this.dynamicArray[i].SGST = (this.dynamicArray[i].TotalAmountWithFreightCharge * sgstRate) / 100;
        this.dynamicArray[i].IGST = (this.dynamicArray[i].TotalAmountWithFreightCharge * igstrate) / 100;
        this.dynamicArray[i].TCS = ((this.dynamicArray[i].TotalAmountWithFreightCharge + this.dynamicArray[i].IGST) * tcsRate) / 100
      }
      else {
        this.dynamicArray[i].TotalAmountWithFreightCharge = _rowAmount + parseFloat(this.dynamicArray[i].FreightCharge);
        this.dynamicArray[i].CGST = (_rowAmount * cgstRate) / 100;
        this.dynamicArray[i].SGST = (_rowAmount * sgstRate) / 100;
        this.dynamicArray[i].IGST = (_rowAmount * igstrate) / 100;
        this.dynamicArray[i].TCS = ((_rowAmount + this.dynamicArray[i].IGST) * tcsRate) / 100
      }
      if (this.dynamicArray[i].SGSTRate != 0 && this.dynamicArray[i].IGSTValue != 0) {
        this.ValidationerrorMessage = 'Invalid Tax Detail';
        jQuery('#Validationerror').modal('show');
        this.dynamicArray[i].SGSTRate = 0.00;
        this.dynamicArray[i].CGSTRate = 0.00;
        this.dynamicArray[i].IGSTValue = 0.00;
      }
      if (this.dynamicArray[i].SGSTRate != 0 && this.dynamicArray[i].CGSTRate != 0) {
        this.dynamicArray[i].TotalInvoiceValue = (this.dynamicArray[i].TotalAmountWithFreightCharge + this.dynamicArray[i].CGST + this.dynamicArray[i].SGST + this.dynamicArray[i].TCS);
      }
      if (this.dynamicArray[i].SGSTRate == 0 && this.dynamicArray[i].CGSTRate == 0) {
        this.dynamicArray[i].TotalInvoiceValue = (this.dynamicArray[i].TotalAmountWithFreightCharge + this.dynamicArray[i].IGST);
      }
      if (this.dynamicArray[i].SGSTRate != 0 && this.dynamicArray[i].CGSTRate != 0) {
        this.dynamicArray[i].TotalInvoiceValue = (this.dynamicArray[i].TotalAmountWithFreightCharge + this.dynamicArray[i].CGST + this.dynamicArray[i].SGST + this.dynamicArray[i].TCS)
      }
      if (this.dynamicArray[i].SGSTRate == 0 && this.dynamicArray[i].CGSTRate == 0) {
        this.dynamicArray[i].TotalInvoiceValue = (this.dynamicArray[i].TotalAmountWithFreightCharge + this.dynamicArray[i].IGST + this.dynamicArray[i].TCS)
      }
      if (this.dynamicArray[i].TCSRate == '') {
        this.dynamicArray[i].TCSRate = 0;
      }
      if (this.dynamicArray[i].IGSTValue == '') {
        this.dynamicArray[i].IGSTValue = 0;
      }
      if (this.dynamicArray[i].CGSTRate == '') {
        this.dynamicArray[i].CGSTRate = 0;
      }
      if (this.dynamicArray[i].SGSTRate == '') {
        this.dynamicArray[i].SGSTRate = 0;
      }
      this.dynamicArray[i].TotalInvoiceValue = this.dynamicArray[i].TotalInvoiceValue.toFixed(2);
      totalBottemAmount += parseFloat(this.dynamicArray[i].TotalInvoiceValue);
      var chekValidation = (parseFloat(this.dynamicArray[i].SGSTRate) + parseFloat(this.dynamicArray[i].CGSTRate))
      var chekValidationIgst = (parseFloat(this.dynamicArray[i].IGSTValue))
      if (chekValidation > 28) {
        alert('Please enter tax detail less then 14');
        this.dynamicArray[i].SGSTRate = 0;
        this.dynamicArray[i].CGSTRate = 0;
      }
      if (chekValidationIgst > 28) {
        alert('Please enter tax detail less then 28');
        this.dynamicArray[i].IGSTValue = 0;
      }
    }
    this.totalSumAcceptedQty = AcceptedQty.toFixed(2);
    this.totalSumAmount = this._Commonservices.thousands_separators(totalBottemAmount);
    //this.totalSumQuantity=parseFloat(this.totalQuantity).toFixed(2);
    // parseFloat(this.totalSumAmount).toFixed(2)
  }

  ChangeSiteOtherState(StId: any) {
    this.StateGSTNo = null;
    $("#txtToSiteStateId").css('border-color', '');
    var FilterStateCode = this.OtherSiteStateList.filter(
      m => m.id === parseInt(StId));
    this.model.ToSiteStateCode = FilterStateCode[0].Code;
    this.model.ToSiteWHGSTIN = FilterStateCode[0].GSTNo;
    this.StateGSTNo = FilterStateCode[0].GSTNo;
    this.model.PreviewToStateName = FilterStateCode[0].itemName;

    //hemant Tyagi 15/02/2023
    this.ChangeGSTType(1);
    //this.model.GSTType = 1;
    this.model.previewGStType = "AST GST";
    this.AutoCompleteCustomerSiteIdList = [];
    this.model.CuValueSiteId = "";
    this.model.SiteId = 0;
    this.model.HideCustomerId = 0;
    this.model.SiteName = "";
    this.model.SiteAddress = "";
    this.model.CompanyName = "";
    this.model.Destination = "";
    //this.model.ToSiteStateCode="";
    //this.model.ToSiteWHGSTIN="";
    this.model.ClientName = "";
    this.model.CuUniqueSiteId = "";

  }

  clearEditForm() {
    this.model.IsMultipleSite = false;
    this.model.EmployeeId = "0";
    this.model.CRNId = "0";
    this.DispatchInstructionList = [];
    this.selectedDIArr = [];

    // this.model.DispatchInstructionId = "0";
    this.model.TransporterId = "0";
    this.model.EditStateId = '0';
    this.model.ShippedfromWHId = "0";
    this.model.ddlVehicleType = "0";
    this.model.TransferTypeId = 0;
    this.model.LoadingCapcity = "";
    this.model.IsDispatch = 0;
    // this.model.DIStatusId = "0"; // brahamjot kaur 19/7/2022
    this.dynamicArray = [];
    this.StateCodeWhAd = [];
    this.totalSumQuantity = "";
    this.totalSumAmount = "";
    this.totalSumPOQuantity = "";
    this.model.ddlStateId = '0';
    this.model.DispatchFrom = '0';
    this.model.StateCode = "";
    this.model.RegdOffice = "";
    this.model.WHAddress = "";
    this.model.ShippedWHAddress = "";
    this.model.GSTINNo = "";
    this.model.CIN = "";
    this.model.WHState = "";
    this.model.DocumentNo = "";
    this.model.ExpectedDate = "";
    this.model.TrasporationMode = "0";
    this.model.TransporterName = "";
    this.model.TransporterGSTNo = "";
    this.model.DriverName = "";
    this.model.DriverPhoneNo = "";
    this.model.Destination = "";
    this.model.GRNo = "";
    this.model.GRDate = "";
    this.model.VehicleNumber = "";
    this.model.TaxInvoiceNo = "";
    this.model.TaxInvoiceData = "";
    this.model.SecTransCost = "";
    this.model.LoadingCost = "";
    this.model.UnloadingCost = "";
    this.model.OtherCharges = "";

    this.model.CustomerId = "0";
    this.model.OtherStateCode = "";
    this.model.CustomerGSTIN = "";
    this.model.CustomerAddress = "";
    this.model.CRNId = "0";

    this.model.Note = "1-The Goods mentioned above are 'NOT FOR SALE' ";
    this.model.ReceivedBy = "";
    this.model.ReceivedNo = "";
    this.model.EwayBillNo = "";
    this.model.DeliveredDate = "";
    this.IsTaxInvoiceNo = false;
    this.model.EmployeeCode = "";
    this.model.EmployeeName = "";
    this.model.EmployeePhoneNo = "";
    this.model.CourierCompanyName = "";
    this.model.DocketNo = "";
    this.model.CourierPhoneNo = "";
    this.model.ConductorName = "";
    this.model.ConductorNo = "";
    this.model.Name = "";
    this.model.PhoneNo = "";
    this.IsVendorTax = false;
    this.HideDispatchTo();
    //this.ClearAllUploadFile();
  }

  HideDispatchTo() {
    this.IsTransferTypeOtherSite = false;
    this.IsTransferTypeOtherWH = false;
    this.IsTransferTypeSite = false;
    this.IsTransferTypeWH = false;
    this.IsTransferTypeVender = false;
    //this.IsTaxInvoiceNoSameState = false;
    this.IsTaxInvoiceDateSameState = false; //vishal, 03/12/2022
    this.IsTransferTypeCenterRepaired = false;
  }
  // change by Hemant Tyagi
  EditDispatchToTransferType(TransfId: any) {
    this.IsDispatchInstraction = false;
    this.DispatchTypeHideShow = false;
    if (TransfId == 0) {
      this.IsTransferTypeOtherSite = false;
      this.IsTransferTypeOtherWH = false;
      this.IsTransferTypeSite = false;
      this.IsTransferTypeWH = false;
      this.IsTransferTypeVender = false;
      this.IsTaxInvoiceNo = false;
      this.IsTransferTypeCenterRepaired = false;
    }
    else if (TransfId == PageActivity.Dis_SiteWithinState) {
      this.DispatchTypeHideShow = true;
      this.IsTransferTypeOtherSite = false;
      this.IsDispatchInstraction = true;
      this.IsTransferTypeSite = true;
      this.IsTransferTypeWH = false;
      this.IsTransferTypeOtherWH = false;
      this.IsTransferTypeVender = false;
      this.IsTaxInvoiceNo = false;
      this.IsTaxInvoiceDate = false; //vishal, 02/12/2022
      //this.IsTaxInvoiceNoSameState = true;
      this.IsTaxInvoiceDateSameState = true; //vishal, 03/12/2022
      this.IsTransferTypeSameState = true;
      this.IsTransferTypeOtherState = false;
      this.OtherSiteStateList = null;
      this.IsDispatchFor = true;
      this.IsTransferTypeCenterRepaired = false;
      this.ChangeEditEquipment(TransfId);
      this.DispatchDateformat(2);
      // this.TechDataList = null;
      // this.COHDataList = null;
      // this.EmpDataList = null;

    } else if (TransfId == PageActivity.Dis_SiteOtherState) {
      this.DispatchTypeHideShow = true;
      this.IsDispatchInstraction = true;
      this.IsTransferTypeOtherSite = true;
      this.IsTransferTypeOtherWH = false;
      this.IsTransferTypeVender = false;
      this.IsTransferTypeSite = false;
      this.IsTransferTypeWH = false;
      this.IsTaxInvoiceNo = true;
      this.IsTaxInvoiceDate = true; //vishal, 02/12/2022
      //this.IsTaxInvoiceNoSameState = false;
      this.IsTaxInvoiceDateSameState = false; //vishal , 03/12/2022
      //this.IsRecivedbyandNo = true;
      // this.IsDisabledPreviewGenratebutton=true;
      this.IsTransferTypeSameState = false;
      this.IsTransferTypeOtherState = true;
      this.OtherSiteStateList = null;
      this.IsDispatchFor = true;
      this.IsTransferTypeCenterRepaired = false;
      this.ChangeEditEquipment(TransfId);
      this.DispatchDateformat(1);
      // this.TechDataList = null;
      // this.COHDataList = null;
      // this.EmpDataList = null;
    }
    else if (TransfId == PageActivity.Dis_WHWithinState) {
      this.IsTransferTypeOtherSite = false;
      this.IsTransferTypeOtherWH = false;
      this.IsTransferTypeVender = false;
      this.IsTransferTypeSite = false;
      this.IsTransferTypeWH = true;
      this.IsTaxInvoiceNo = false;
      this.IsTaxInvoiceDate = false; //vishal, 03/12/2022
      this.IsTaxInvoiceNoSameState = true;
      this.IsTaxInvoiceDateSameState = true; //vishal, 03/12/2022
      // this.IsRecivedbyandNo = false;
      this.IsTransferTypeSameState = true;
      this.IsTransferTypeOtherState = false;
      this.StateINWHList = null;
      this.IsDispatchFor = false;
      this.IsTransferTypeCenterRepaired = false;
      this.ChangeEditEquipment(TransfId);
      this.DispatchDateformat(1);

    } else if (TransfId == PageActivity.Dis_WHOtherState || TransfId == PageActivity.Dis_RepairingCenter) {
      var objVendorOrWh = new VendorOrWhModel();
      objVendorOrWh.Id = this.CompanyId;
      this._MaterialMovementService.GetAllState(objVendorOrWh).pipe(first()).subscribe(data => {
        if (data.Status == 1) {
          if (data.Data != null && data.Data != "") {
            this.WHStateList = data.Data.filter(m => m.id != 0).reduce(
              (accumulator, current) => {
                if (!accumulator.some(x => x.id === current.id)) {
                  accumulator.push(current)
                }
                return accumulator;
              }, []
            )
          }
        }
      }, error => {
        this._Commonservices.ErrorFunction(this.UserName, error.message, "ChangeTransferType", "WHTOSite");
      });
      if (TransfId == PageActivity.Dis_WHOtherState) {
        this.IsTransferTypeOtherWH = true;
        this.IsTransferTypeCenterRepaired = false;
        this.IsTaxInvoiceNo = true;
        this.IsTaxInvoiceDate = true; //vishal, 02/12/2022
        this.IsTaxInvoiceNoSameState = false;
        this.IsTaxInvoiceDateSameState = false; //vishal 03/12/2022
        this.IsTransferTypeSameState = false;
        this.IsTransferTypeOtherState = true;
      } else {
        this.IsTransferTypeOtherWH = false;
        this.IsTransferTypeCenterRepaired = true;
        this.IsTaxInvoiceNo = false;
        this.IsTaxInvoiceDate = false; //vishal, 02/12/2022
        this.IsTaxInvoiceNoSameState = true;
        this.IsTaxInvoiceDateSameState = true; //vishal, 02/12/2022
        this.IsTransferTypeSameState = true;
        this.IsTransferTypeOtherState = false;
      }
      this.IsTransferTypeOtherSite = false;
      this.IsTransferTypeSite = false;
      this.IsTransferTypeWH = false;
      this.IsTransferTypeVender = false;
      //this.IsRecivedbyandNo = false;
      this.IsDispatchFor = false;
      this.ChangeEditEquipment(TransfId);
      this.DispatchDateformat(1);
      //this.IsDisabledPreviewGenratebutton=true;
    }
    else if (TransfId == PageActivity.Dis_Vendor || TransfId == PageActivity.Dis_VendorScrapSale || TransfId == PageActivity.Dis_VendorSale) {

      //change by Hemant Tyagi 18/06/2022
      this.IsTransferTypeOtherSite = false;
      this.IsTransferTypeOtherWH = false;
      this.IsTransferTypeSite = false;
      this.IsTransferTypeWH = false;
      this.IsTransferTypeVender = true;
      this.IsTaxInvoiceNo = false;
      this.IsTaxInvoiceDate = false; //vishal, 02/12/2022
      this.IsTaxInvoiceNoSameState = true;
      this.IsTaxInvoiceDateSameState = true; //vishal , 03/12/2022
      this.IsTransferTypeSameState = false;
      this.IsTransferTypeOtherState = false;
      this.IsVendorTax = true;
      if (TransfId == PageActivity.Dis_VendorScrapSale) {
        this.DispatchTypeHideShow = true;
        this.IsVendprScrapSale = true;
        this.IsSerialValidationShowHide = false;
      } else {
        this.DispatchTypeHideShow = false;
        this.IsVendprScrapSale = false;
        this.IsSerialValidationShowHide = true;
      }
      this.IsDispatchFor = false;
      this.IsTransferTypeCenterRepaired = false;
      this.DispatchDateformat(2);
      this.ChangeEditEquipment(TransfId);
    } else if (TransfId == PageActivity.Dis_CustomerReturn) {
      this.EquipmentTypeList = null;
      this.GettAllstate();
      this.IsDispatchFor = false;
      this.ChangeEditEquipment(TransfId);
      this.IsTransferTypeOtherSite = false;
      this.IsTransferTypeOtherWH = false;
      this.IsTransferTypeSite = false;
      this.IsTransferTypeWH = false;
      this.IsTransferTypeVender = false;
      this.IsVendprScrapSale = false;
      this.IsTransferTypeCenterRepaired = false;
      this.IsCustomerReturnAfterRepaired = true;
      this.IsTaxInvoiceNoSameState = true;
      this.IsTaxInvoiceDateSameState = true; //vishal, 02/03/2022
      this.IsTaxInvoiceNo = false;
      this.IsTaxInvoiceDate = false; //vishal, 02/12/2022
      this.DispatchDateformat(2);
      this.IsTransferTypeSameState = true;
      this.IsTransferTypeOtherState = false;
      // this.dynamicArray = [];
      // this.ClearDispatchToWHToOtherState();
    }
  }

  //#region  this function used to Change Dispatch To
  ChangeTransferType(TransfId: any) {
    this.DispatchTypeHideShow = false;
    $("#txtTransferType").css('border-color', '');
    if (this.model.ddlStateId == "0" || this.model.ddlStateId == "0") {
      alert("Please Select State");
      this.model.TransferTypeId = "0";
      return false;
    }
    var DispatchToData = this.TransferDataList.filter(m => m.PageId === parseInt(TransfId));
    //this.model.PreviewDispatchToName = DispatchToData[0].PageName;
    this.model.TransferTypeId = TransfId;
    this.IsDispatchInstraction = false;
    if (TransfId == 0) {
      this.IsTransferTypeOtherSite = false;
      this.IsTransferTypeOtherWH = false;
      this.IsTransferTypeSite = false;
      this.IsTransferTypeWH = false;
      this.IsTransferTypeVender = false;
      this.IsTransferTypeCenterRepaired = false;
      this.IsTaxInvoiceNo = false;
      this.IsTaxInvoiceDate = false; //vishal, 02/12/2022
      this.IsVendprScrapSale = false;
      this.IsCustomerReturnAfterRepaired = false;
    }
    else if (TransfId == PageActivity.Dis_SiteWithinState) {
      this.IsTransferTypeOtherSite = false;
      this.IsDispatchInstraction = true;
      this.IsTransferTypeSite = true;
      this.IsTransferTypeWH = false;
      this.IsTransferTypeOtherWH = false;
      this.IsTransferTypeVender = false;
      this.IsTaxInvoiceNoSameState = true;
      this.IsTaxInvoiceDateSameState = true; //vishal, 03/12/2022
      this.IsTransferTypeCenterRepaired = false;
      // this.IsRecivedbyandNo = true;
      // this.IsRecivedbyandNoOther = false;
      this.IsTaxInvoiceNo = false;
      this.IsTaxInvoiceDate = false; //vishal, 02/12/2022
      this.model.ReceivedBy = "";
      this.model.ReceivedNo = "";
      this.model.Destination = "";
      this.EquipmentTypeList = null;
      this.ChangeEditEquipment(TransfId);
      this.IsTransferTypeSameState = true;
      this.IsTransferTypeOtherState = false;
      this.IsCustomerReturnAfterRepaired = false;
      this.dynamicArray = [];
      this.model.COHCI = "0";
      this.model.TECHFE = "0";
      this.COHDataList = null;
      this.TechDataList = null;
      this.model.EmployeeId = "0";
      this.IsDispatchFor = true;
      this.IsVendprScrapSale = false;
      //Brahamjot kaur 01-06-2022
      this.DispatchTypeHideShow = true;
      this.ClearDispatchToSiteToState();
      this.DispatchDateformat(2);
    } else if (TransfId == PageActivity.Dis_SiteOtherState) {
      this.EquipmentTypeList = null;
      this.IsDispatchFor = true;
      this.IsDispatchInstraction = true;
      this.ChangeEditEquipment(TransfId);
      this.IsTransferTypeOtherSite = true;
      this.IsTransferTypeOtherWH = false;
      this.IsTransferTypeVender = false;
      this.IsTransferTypeSite = false;
      this.IsTransferTypeWH = false;
      this.IsTransferTypeCenterRepaired = false;
      this.IsTaxInvoiceNoSameState = false;
      this.IsTaxInvoiceDateSameState = false; //vishal, 03/12/2022
      this.IsTaxInvoiceNo = true;
      this.IsTaxInvoiceDate = true; //vishal, 02/12/2022
      this.IsVendprScrapSale = false;
      this.IsCustomerReturnAfterRepaired = false;
      this.DispatchDateformat(1);
      // this.IsRecivedbyandNo = true;
      // this.IsRecivedbyandNoOther = false;
      this.model.ReceivedBy = "";
      this.model.ReceivedNo = "";
      this.model.Destination = "";
      this.model.ToSiteStateId = 0;
      this.model.GSTType = 0;
      this.IsTransferTypeSameState = false;
      this.IsTransferTypeOtherState = true;
      this.IsVendprScrapSale = false;
      this.dynamicArray = [];
      this.model.COHCI = "0";
      this.model.TECHFE = "0";
      this.model.EmployeeId = "0";
      this.COHDataList = null;
      this.TechDataList = null;
      //Brahamjot kaur 01-06-2022
      this.DispatchTypeHideShow = true;
      if (this.CreateDispatchForDIId == "0" || this.CreateDispatchForDIId == null) {
        var objVendorOrWh = new VendorOrWhModel();
        objVendorOrWh.Id = this.CompanyId;
        this._MaterialMovementService.GetAllState(objVendorOrWh).pipe(first()).subscribe(data => {
          if (data.Status == 1) {
            if (data.Data != null && data.Data != "") {

              this.OtherSiteStateList = data.Data.filter(m => m.id != 0).reduce(

                (accumulator, current) => {
                  if (!accumulator.some(x => x.id === current.id)) {
                    accumulator.push(current)
                  }
                  return accumulator;
                }, []
              )
            }
          }
        }, error => {
          this._Commonservices.ErrorFunction(this.UserName, error.message, "ChangeTransferType", "WHTOSite");
        });
      }
      this.ClearDispatchToSiteToOtherState();
    }
    else if (TransfId == PageActivity.Dis_WHWithinState) {
      this.EquipmentTypeList = null;
      this.IsDispatchFor = false;
      this.ChangeEditEquipment(TransfId);
      this.IsTransferTypeOtherSite = false;
      this.IsTransferTypeOtherWH = false;
      this.IsTransferTypeVender = false;
      this.IsTransferTypeSite = false;
      this.IsTransferTypeWH = true;
      this.IsVendprScrapSale = false;
      this.IsTransferTypeCenterRepaired = false;
      this.IsCustomerReturnAfterRepaired = false;
      this.IsTaxInvoiceNo = false;
      this.IsTaxInvoiceDate = false; //vishal, 02/12/2022
      this.DispatchDateformat(2);
      this.IsTaxInvoiceNoSameState = true;
      this.IsTaxInvoiceDateSameState = true; //vishal. 02/12/2022
      // this.IsRecivedbyandNo = false;
      // this.IsRecivedbyandNoOther = true;
      this.model.ShippedToINWHId = 0;
      this.model.ReceivedBy = "";
      this.model.ReceivedNo = "";
      this.model.Destination = "";
      this.ShippedINWHList = this.EditWHList;
      this.IsTransferTypeSameState = true;
      this.IsTransferTypeOtherState = false;
      this.dynamicArray = [];

      this.ClearDispatchToWHToWH();
      try {
        var StateId = this._Commonservices.checkUndefined(this.model.ddlStateId);
        var objdropdownmodel = new DropdownModel();
        objdropdownmodel.User_Id = this.UserId;
        objdropdownmodel.Parent_Id = this.model.ShippedfromWHId;
        if (StateId != '') {
          objdropdownmodel.Other_Id = StateId;
        } else {
          objdropdownmodel.Other_Id = "0";
        }
        objdropdownmodel.Company_Id = this.CompanyId;
        objdropdownmodel.Flag = 'SameStateWHMaster';
        this.model.ShippedToINWHId = '0'
        this.StateINWHList = null;
        this._Commonservices.getdropdown(objdropdownmodel).pipe(first()).subscribe(wh1 => {
          if (wh1.Status == 1) {
            if (wh1.Data != null && wh1.Data != "") {
              this.StateINWHList = wh1.Data;
            }
          }
        }, error => {
          this._Commonservices.ErrorFunction(this.UserName, error.message, "BindEditWHList", "WHTOSite");
        });
      } catch (Error) {
        this._Commonservices.ErrorFunction(this.UserName, Error.message, "BindEditWHList", "WHTOSite");
      }
    } else if (TransfId == PageActivity.Dis_WHOtherState) {
      this.EquipmentTypeList = null;
      this.IsDispatchFor = false;
      this.ChangeEditEquipment(TransfId);
      this.IsTransferTypeOtherSite = false;
      this.IsTransferTypeOtherWH = true;
      this.IsTransferTypeSite = false;
      this.IsTransferTypeWH = false;
      this.IsTransferTypeCenterRepaired = false;
      this.IsCustomerReturnAfterRepaired = false;
      this.IsTransferTypeVender = false;
      this.IsVendprScrapSale = false;
      // this.IsRecivedbyandNo = false;
      // this.IsRecivedbyandNoOther = true;
      this.IsTaxInvoiceNoSameState = false;
      this.IsTaxInvoiceDateSameState = false; //vishal, 03/12/2022
      this.IsTaxInvoiceNo = true;
      this.IsTaxInvoiceDate = true; //vishal, 02/12/2022
      this.DispatchDateformat(1);
      this.model.ReceivedBy = "";
      this.model.ReceivedNo = "";
      this.model.Destination = "";
      this.IsTransferTypeSameState = false;
      this.IsTransferTypeOtherState = true;
      this.dynamicArray = [];
      var objVendorOrWh = new VendorOrWhModel();
      objVendorOrWh.Id = this.CompanyId;

      this._MaterialMovementService.GetAllState(objVendorOrWh).pipe(first()).subscribe(data => {
        if (data.Status == 1) {
          if (data.Data != null && data.Data != "") {
            this.WHStateList = data.Data.filter(m => m.id != 0).reduce(
              (accumulator, current) => {
                if (!accumulator.some(x => x.id === current.id)) {
                  accumulator.push(current)
                }
                return accumulator;
              }, []
            )
          }
        }
      }, error => {
        this._Commonservices.ErrorFunction(this.UserName, error.message, "ChangeTransferType", "WHTOSite");
      });

      this.ClearDispatchToWHToOtherState();

    }
    else if (TransfId == PageActivity.Dis_Vendor) {
      this.ChangeEditEquipment(TransfId);
      this.IsDispatchFor = false;
      this.EquipmentTypeList = null;
      this.IsTransferTypeOtherSite = false;
      this.IsTransferTypeOtherWH = false;
      this.IsTransferTypeSite = false;
      this.IsTransferTypeWH = false;
      this.IsTransferTypeVender = true;
      this.IsTaxInvoiceNo = false;
      this.IsTaxInvoiceDate = false; //vishal, 02/12/2022
      this.IsVendprScrapSale = false;
      this.IsCustomerReturnAfterRepaired = false;
      this.DispatchDateformat(2);
      this.IsTaxInvoiceNoSameState = true;
      this.IsTaxInvoiceDateSameState = true; //vishal, 03/12/2022
      // this.IsRecivedbyandNo = false;
      // this.IsRecivedbyandNoOther = true;
      this.IsTransferTypeCenterRepaired = false;
      this.model.VenOtherStateId = 0;
      this.model.ReceivedBy = "";
      this.model.ReceivedNo = "";
      this.model.Destination = "";
      this.IsTransferTypeSameState = false;
      this.IsTransferTypeOtherState = true;
      this.dynamicArray = [];
      this.VenderFilterAddress = [];
      this.model.VendorCode = "";

      this.ClearDispatchToVendor();
      var objVendorOrWh = new VendorOrWhModel();
      objVendorOrWh.Id = this.CompanyId;
      this._MaterialMovementService.GetAllState(objVendorOrWh).subscribe(data => {

        if (data.Status == 1) {
          if (data.Data != null && data.Data != "") {
            this.OtherSiteStateList = data.Data.filter(m => m.id != 0).reduce(
              (accumulator, current) => {
                if (!accumulator.some(x => x.id === current.id)) {
                  accumulator.push(current)
                }
                return accumulator;
              }, []
            )
          }

          // this.VendorStateList=this.OtherSiteStateList
        }
      });
    }
    else if (TransfId == PageActivity.Dis_VendorScrapSale) {
      this.EquipmentTypeList = null;
      this.IsDispatchFor = false;
      this.ChangeEditEquipment(TransfId);
      this.IsTransferTypeOtherSite = false;
      this.IsTransferTypeOtherWH = false;
      this.IsTransferTypeSite = false;
      this.IsTransferTypeWH = false;
      this.IsTransferTypeVender = true;
      this.IsTransferTypeCenterRepaired = false;
      this.IsTaxInvoiceNo = false;
      this.IsTaxInvoiceDate = false; //vishal, 02/12/2022
      this.IsVendprScrapSale = true;
      this.IsCustomerReturnAfterRepaired = false;
      this.DispatchDateformat(2);
      this.IsTaxInvoiceNoSameState = true;
      this.IsTaxInvoiceDateSameState = true; //vishal, 03/12/2022
      // this.IsRecivedbyandNo = false;
      // this.IsRecivedbyandNoOther = true;

      this.model.VenOtherStateId = 0;
      this.model.ReceivedBy = "";
      this.model.ReceivedNo = "";
      this.model.Destination = "";
      this.VenderFilterAddress = [];
      this.model.VendorCode = "";
      this.IsTransferTypeSameState = false;
      this.IsTransferTypeOtherState = true;
      this.DispatchTypeHideShow = true;
      this.dynamicArray = [];
      this.ClearDispatchToVendor();
      var objVendorOrWh = new VendorOrWhModel();
      objVendorOrWh.Id = this.CompanyId;
      this._MaterialMovementService.GetAllState(objVendorOrWh).subscribe(data => {
        if (data.Status == 1) {
          if (data.Data != null && data.Data != "") {
            this.OtherSiteStateList = data.Data.filter(m => m.id != 0).reduce(
              (accumulator, current) => {
                if (!accumulator.some(x => x.id === current.id)) {
                  accumulator.push(current)
                }
                return accumulator;
              }, []
            )
          }
        }
      });
    }
    else if (TransfId == PageActivity.Dis_VendorSale) {
      this.EquipmentTypeList = null;
      this.IsDispatchFor = false;
      this.ChangeEditEquipment(TransfId);
      this.IsTransferTypeOtherSite = false;
      this.IsTransferTypeOtherWH = false;
      this.IsTransferTypeSite = false;
      this.IsTransferTypeWH = false;
      this.IsTransferTypeVender = true;
      this.IsTaxInvoiceNo = false;
      this.IsTaxInvoiceDate = false; //vishal, 02/12/2022
      this.IsVendprScrapSale = false;
      this.IsCustomerReturnAfterRepaired = false;
      this.DispatchDateformat(2);
      this.IsTaxInvoiceNoSameState = true;
      this.IsTaxInvoiceDateSameState = true; //vishal, 03/12,2022
      // this.IsRecivedbyandNo = false;
      // this.IsRecivedbyandNoOther = true;
      this.model.VenOtherStateId = 0;
      this.model.ReceivedBy = "";
      this.model.ReceivedNo = "";
      this.model.Destination = "";
      this.VenderFilterAddress = [];
      this.model.VendorCode = "";
      this.IsTransferTypeSameState = false;
      this.IsTransferTypeOtherState = true;
      this.dynamicArray = [];
      this.ClearDispatchToVendor();
      var objVendorOrWh = new VendorOrWhModel();
      objVendorOrWh.Id = this.CompanyId;
      this._MaterialMovementService.GetAllState(objVendorOrWh).subscribe(data => {
        if (data.Status == 1) {
          if (data.Data != null && data.Data != "") {
            this.OtherSiteStateList = data.Data.filter(m => m.id != 0).reduce(
              (accumulator, current) => {
                if (!accumulator.some(x => x.id === current.id)) {
                  accumulator.push(current)
                }
                return accumulator;
              }, []
            )
          }
          // this.VendorStateList=this.OtherSiteStateList
        }
      });
    }
    else if (TransfId == PageActivity.Dis_RepairingCenter) {
      this.EquipmentTypeList = null;
      this.IsDispatchFor = false;
      this.ChangeEditEquipment(TransfId);
      this.IsTransferTypeOtherSite = false;
      this.IsTransferTypeOtherWH = false;
      this.IsTransferTypeSite = false;
      this.IsTransferTypeWH = false;
      this.IsTransferTypeVender = false;
      this.IsVendprScrapSale = false;
      this.IsTransferTypeCenterRepaired = true;
      this.IsCustomerReturnAfterRepaired = false;
      // this.IsRecivedbyandNo = false;
      // this.IsRecivedbyandNoOther = false;
      this.IsTaxInvoiceNoSameState = true;
      this.IsTaxInvoiceDateSameState = true; //vishal, 03/12/2022
      this.IsTaxInvoiceNo = false;
      this.IsTaxInvoiceDate = false; //vishal, 02/12/2022
      this.DispatchDateformat(2);
      this.model.ReceivedBy = "";
      this.model.ReceivedNo = "";
      this.model.Destination = "";
      this.IsTransferTypeSameState = true;
      this.IsTransferTypeOtherState = false;
      this.dynamicArray = [];
      var objVendorOrWh = new VendorOrWhModel();
      objVendorOrWh.Id = this.CompanyId;
      this._MaterialMovementService.GetAllState(objVendorOrWh).pipe(first()).subscribe(data => {
        if (data.Status == 1) {
          if (data.Data != null && data.Data != "") {
            this.WHStateList = data.Data.filter(m => m.id != 0).reduce(
              (accumulator, current) => {
                if (!accumulator.some(x => x.id === current.id)) {
                  accumulator.push(current)
                }
                return accumulator;
              }, []
            )
          }
        }
      }, error => {
        this._Commonservices.ErrorFunction(this.UserName, error.message, "ChangeTransferType", "WHTOSite");
      });
      this.ClearDispatchToWHToOtherState();
    }
    else if (TransfId == PageActivity.Dis_CustomerReturn) {
      this.EquipmentTypeList = null;
      this.GettAllstate();
      this.IsDispatchFor = false;
      this.ChangeEditEquipment(TransfId);
      this.IsTransferTypeOtherSite = false;
      this.IsTransferTypeOtherWH = false;
      this.IsTransferTypeSite = false;
      this.IsTransferTypeWH = false;
      this.IsTransferTypeVender = false;
      this.IsVendprScrapSale = false;
      this.IsTransferTypeCenterRepaired = false;
      this.IsCustomerReturnAfterRepaired = true;
      // this.IsRecivedbyandNo = false;
      // this.IsRecivedbyandNoOther = false;
      this.IsTaxInvoiceNoSameState = true;
      this.IsTaxInvoiceDateSameState = true; //vishal, 02/12/2022
      this.IsTaxInvoiceNo = false;
      this.IsTaxInvoiceDate = false; //vishal, 02/12/2022
      this.DispatchDateformat(2);
      this.model.ReceivedBy = "";
      this.model.ReceivedNo = "";
      this.model.Destination = "";
      this.IsTransferTypeSameState = true;
      this.IsTransferTypeOtherState = false;
      this.dynamicArray = [];
      this.ClearDispatchToWHToOtherState();
    }

    if (TransfId == PageActivity.Dis_Vendor || TransfId == PageActivity.Dis_VendorScrapSale || TransfId == PageActivity.Dis_VendorSale) {
      this.IsVendorTax = true;
      this.IsTransferTypeSameState = false;
      this.IsTransferTypeOtherState = false;
      // this.IsVendprScrapSale = true;
    } else {
      this.IsVendorTax = false;

      // this.IsVendprScrapSale = false;
    }

  }
  //#endregion
  ChangeEditEquipment(Id: any) {
    var objItemEquipmentModel = new ItemEquipmentDetail();
    objItemEquipmentModel.ItemMasterId = Id;
    objItemEquipmentModel.Flag = "DispatchTo";
    this.EquipmentTypeList = null;
    this._MasterService.ChangeItemGetUnitNameList(objItemEquipmentModel).subscribe(data => {
      if (data.Status == 1) {
        if (data.Data != null) {
          this.EquipmentTypeList = data.Data;
        }
      };
    });
  }

  DispatchDateformat(Id: any) {
    // change by Hemant Tyagi 14/02/2023
    // if (Id == 1) {
    //   this.DateFormate = this.min;
    // } else {
    //   this.DateFormate = this.minDate;
    // }
    this.DateFormate = this.minDate;
  }

  ChangeCustomerName(CustomerId: string) {
    $("#txtCustomerName").css('border-color', '');
    var FilterData = this.GettAllCustomerList.filter(
      m => m.id === parseInt(CustomerId));
    this.model.CustomerAddress = FilterData[0].Address;
    // this.model.CustomerName = FilterData[0].ClientName;
    try {
      var objdropdownmodel = new DropdownModel();
      objdropdownmodel.User_Id = 0;
      objdropdownmodel.Parent_Id = this.model.EditStateId;
      objdropdownmodel.Company_Id = this.CompanyId;
      objdropdownmodel.Other_Id = CustomerId;
      objdropdownmodel.Flag = 'CustomerAddressGSTNo';
      this._Commonservices.getdropdown(objdropdownmodel).pipe(first()).subscribe(item => {
        if (item.Data != null) {
          this.model.CustomerAddress = item.Data[0].Address;
          this.model.CustomerGSTIN = item.Data[0].GSTNO;
        } else {
          this.model.CustomerAddress = "";
          this.model.CustomerGSTIN = "";
        }
      }, error => {
        this._Commonservices.ErrorFunction(this.UserName, error.message, "ChangeCustomerName", "CRN");
      });
    } catch (Error) {
      this._Commonservices.ErrorFunction(this.UserName, Error.message, "ChangeCustomerName", "CRN");
    }

    try {
      var objdropdownmodel = new DropdownModel();
      objdropdownmodel.User_Id = 0;
      objdropdownmodel.Parent_Id = this.WareHouseId
      objdropdownmodel.Company_Id = this.CompanyId;
      objdropdownmodel.Other_Id = CustomerId;
      objdropdownmodel.Flag = 'CustomerReturnNotes';
      this._Commonservices.getdropdown(objdropdownmodel).pipe(first()).subscribe(item => {
        this.GettAllCRNNoList = item.Data;
      }, error => {
        this._Commonservices.ErrorFunction(this.UserName, error.message, "ChangeCustomerName", "Dispatch");
      });
    } catch (Error) {
      this._Commonservices.ErrorFunction(this.UserName, Error.message, "DispatchItemReason", "Dispatch");
    }
  }

  ChangeCRNNo(Id: any) {
    $("#txtCRNo").css('border-color', '');
    var FilterData = this.GettAllCRNNoList.filter(
      m => m.Id === parseInt(Id));
    this.model.CustomerAddress = FilterData[0].CustomerAddress;
    var objPoSearchModel = new SaveGRNCRNModelDetail();
    objPoSearchModel.GrnCrnId = Id;
    this._GrncrnService.GetCRNEditListById(objPoSearchModel).subscribe((data) => {
      if (data.ItemData != null) {
        this.BindItemListArrayByCrnId(data.ItemData);
      }
    });
  }

  GettAllstate() {
    var objVendorOrWh = new VendorOrWhModel();
    objVendorOrWh.Id = this.CompanyId;
    this._MaterialMovementService.GetAllState(objVendorOrWh).pipe(first()).subscribe(data => {
      if (data.Status == 1) {
        if (data.Data != null && data.Data != "") {
          this.WHStateList = data.Data.filter(m => m.id != 0).reduce(
            (accumulator, current) => {
              if (!accumulator.some(x => x.id === current.id)) {
                accumulator.push(current)
              }
              return accumulator;
            }, []
          )
        }
      }
    }, error => {
      this._Commonservices.ErrorFunction(this.UserName, error.message, "ChangeTransferType", "WHTOSite");
    });
  }

  ChangeotherState(Id: any) {
    $("#txtTOWHStateId").css('border-color', '');
    var FilterData = this.WHStateList.filter(m => m.id === parseInt(Id));
    this.model.OtherStateCode = FilterData[0].Code;
    try {
      var objdropdownmodel = new DropdownModel();
      objdropdownmodel.User_Id = 0;
      objdropdownmodel.Parent_Id = Id;
      objdropdownmodel.Company_Id = this.CompanyId;
      objdropdownmodel.Other_Id = this.model.CustomerId;
      objdropdownmodel.Flag = 'CustomerAddressGSTNo';
      this._Commonservices.getdropdown(objdropdownmodel).pipe(first()).subscribe(item => {
        if (item.Data != null) {
          this.model.CustomerAddress = item.Data[0].Address;
          this.model.CustomerGSTIN = item.Data[0].GSTNO;
        } else {
          this.model.CustomerAddress = "";
          this.model.CustomerGSTIN = "";
        }
      }, error => {
        this._Commonservices.ErrorFunction(this.UserName, error.message, "ChangeCustomerName", "CRN");
      });
    } catch (Error) {
      this._Commonservices.ErrorFunction(this.UserName, Error.message, "ChangeCustomerName", "CRN");
    }
  }

  //#region this Function Used to Bind Item List By CRN Id
  BindItemListArrayByCrnId(ItemEditDataArr: any) {
    this.dynamicArray = [];
    for (var i = 0, len = ItemEditDataArr.length; i < len; i++) {
      var objdynamic = new DynamicItemGrid();
      objdynamic.ItemNameId = ItemEditDataArr[i].ItemNameId;
      objdynamic.EditItemCode = JSON.parse(ItemEditDataArr[i].ItemCodeList)
      objdynamic.EditItemMake = JSON.parse(ItemEditDataArr[i].ItemMakeList);
      objdynamic.UnitList = JSON.parse(ItemEditDataArr[i].UnitList);
      objdynamic.ItemDescription = ItemEditDataArr[i].ItemDescription;
      objdynamic.SubDescription = ItemEditDataArr[i].SubDescription;
      objdynamic.UnitName = ItemEditDataArr[i].UnitMaster_Id;
      objdynamic.EqTypeId = ItemEditDataArr[i].EquipmentType_Id;
      if (ItemEditDataArr[i].DispatchType_Id != "" && ItemEditDataArr[i].DispatchType_Id != null) {
        objdynamic.DispatchTypeId = ItemEditDataArr[i].DispatchType_Id;
      } else {
        objdynamic.DispatchTypeId = "0";
      }
      if (ItemEditDataArr[i].ClientId != "" && ItemEditDataArr[i].ClientId != null) {
        objdynamic.ClientId = ItemEditDataArr[i].ClientId;
      } else {
        objdynamic.ClientId = "0";
      }
      if (ItemEditDataArr[i].SerialNoList === null) {
        objdynamic.GSerialNumbers = [];
      } else {
        objdynamic.GSerialNumbers = JSON.parse(ItemEditDataArr[i].SerialNoList);
      }
      objdynamic.Qty = ItemEditDataArr[i].AcceptedQty;
      objdynamic.Rate = parseFloat(ItemEditDataArr[i].ItemRate).toFixed(2);
      objdynamic.ExcessShort = ItemEditDataArr[i].ExcessShort;
      objdynamic.TotalAmount = ItemEditDataArr[i].TotalAmount;
      objdynamic.Discount = 0;
      objdynamic.HSN = ItemEditDataArr[i].HSNCode;
      objdynamic.ItemId = ItemEditDataArr[i].ItemId;
      objdynamic.ItemMakeId = ItemEditDataArr[i].MakeMaster_Id;

      this.dynamicArray.push(objdynamic);
      //objdynamic.TotalAmount=parseFloat(ItemEditDataArr[i].TotalAmount).toFixed(2);
      this.fnBindItemGrossToatl();
    }

    //this.fnBindItemGrossToatl();
  }

  //#endregion

  ClearDispatchToSiteToState() {
    this.AutoCompleteUniqueSiteIdList = [];
    this.AutoCompleteCustomerSiteIdList = [];
    this.model.CuValueSiteId = "";
    this.model.SiteId = 0;
    this.model.HideCustomerId = 0;
    this.model.SiteName = "";
    this.model.SiteAddress = "";
    this.model.CuUniqueSiteId = "";
    this.model.ClientName = "";
    this.model.ToSiteWHGSTIN = "";
    this.model.GSTType = 0;
    this.model.CompanyName = "";
    this.totalSumPOQuantity = 0.00;
    this.totalSumAmount = 0.00;
  }

  ClearDispatchToSiteToOtherState() {
    this.AutoCompleteUniqueSiteIdList = [];
    this.AutoCompleteCustomerSiteIdList = [];
    this.model.CuValueSiteId = "";
    this.model.SiteId = 0;
    this.model.SiteName = "";
    this.model.HideCustomerId = 0;
    this.model.SiteAddress = "";
    this.model.ToSiteStateId = "0";
    this.model.ToSiteStateCode = "";
    this.model.ToSiteWHGSTIN = "";
    this.model.CuUniqueSiteId = "";
    this.model.CompanyName = "";
    this.model.GSTType = 0;
    this.model.ClientName = "";
    this.totalSumPOQuantity = 0.00;
    this.totalSumAmount = 0.00;
  }

  ClearDispatchToWHToWH() {
    this.model.ShippedToWHId = "0";
    this.model.WHAddress = "";
    this.totalSumPOQuantity = 0.00;
    this.totalSumAmount = 0.00;
  }

  ClearDispatchToWHToOtherState() {
    this.model.WHStateCode = "";
    this.model.EditStateId = "0";
    this.model.ShippedToOtherWHId = "0";
    this.model.WHGSTIN = "";
    this.model.WHAddress = "";
    this.totalSumPOQuantity = 0.00;
    this.totalSumAmount = 0.00;
  }

  ClearDispatchToVendor() {
    this.model.VenOtherStateId = "0";
    this.model.VenStateCode = "";
    this.SelectedEditVendorList = [];
    this.model.VendorName = "";
    this.model.VenGSTIN = "";
    this.model.VendorAddress = "";
    this.totalSumPOQuantity = 0.00;
    this.totalSumAmount = 0.00;
  }

  //#region Download Dispatch Doument in Zip
  DownloadAllDispatchZip() {
    var objDownLoadZipFileDetial = new DownLoadZipFileDetial();
    var value = '';
    var formdata = new FormData();
    this.CheckData = [];
    if (this.rowData.length > 0) {
      for (let i = 0; i < this.rowData?.length; i++) {
        if (this.rowData[i].cbox == true) {
          this.CheckData.push(this.rowData[i]);
          // }
        }
      }
      if (this.CheckData.length > 0) {
        for (let i = 0; i < this.CheckData?.length; i++) {
          if (this.CheckData[i].DocumentFile != "" && this.CheckData[i].DocumentFile != null) {
            value += this.CheckData[i].DocumentFile + ',';
          }
        }
      } else {
        for (let i = 0; i < this.rowData?.length; i++) {
          if (this.rowData[i].DocumentFile != "" && this.rowData[i].DocumentFile != null) {
            value += this.rowData[i].DocumentFile + ',';
          }
        }
      }
      formdata.append("SendDownloadFile", JSON.stringify(value));
      this._Commonservices.DownloadFileZip(formdata).subscribe(data => {
        var zip = new JSZip();
        var imgFolder = zip.folder("images");
        for (var i = 0; i < data.lstUrlDetail.length; i++) {
          const byteArray = new Uint8Array(atob(data.lstUrlDetail[i].base64Value).split("").map(char => char.charCodeAt(0)));
          //const newBlob = new Blob([byteArray], {type: 'application/pdf'}); 
          imgFolder.file(this.GetFilename(data.lstUrlDetail[i].Url), byteArray, { base64: true });

        }
        zip.generateAsync({ type: "blob" })
          .then(function (content) {
            FileSaver.saveAs(content, "DispatchFile.zip");
          });
      });
    }
  }

  GetFilename(url) {
    var m = url.substring(url.lastIndexOf('/') + 1);
    this.ReplaceUrl = m.split('.');
    for (let j = 0; j < this.rowData?.length; j++) {
      if (this.rowData[j].DocumentFile != "" && this.rowData[j].DocumentFile != null) {
        var v = this.rowData[j].DocumentFile.substring(this.rowData[j].DocumentFile.lastIndexOf('/') + 1)
        if (m == v) {
          var R = this.rowData[j].DocumentNo + ('.') + this.ReplaceUrl[1];
          return R;
        }
      }
    }
  }

  //#endregion

  //#region  Create Dispatch  Pdf
  GenerateDispatchPdfbyDispatchId(Value: any) {
    try {
      debugger
      this.model.FunctionFlagValue = null;
      this.model.FunctionFlagValue = Value;
      var objModel = new SearchDispatchTrackerModel();
      objModel.DispatchTracker_Id = this.model.DisatchTrackeringId;
      this._DispatchPdfServiceService.DispatchPdfbyDispatchId(this.model.FunctionFlagValue, this.model.DisatchTrackeringId)

    } catch (Error) {
      this._Commonservices.ErrorFunction(this.UserName, Error.message, "DispatchPdfbyDispatchId", "WHTOSite");
    }

  }

  //#endregion

  BindCorrectionentryReason() {
    var objdropdownmodel = new DropdownModel();
    objdropdownmodel.User_Id = 0;
    objdropdownmodel.Parent_Id = "0";
    objdropdownmodel.Company_Id = this.CompanyId;
    objdropdownmodel.Flag = 'CorrectionEntryReason';
    this._Commonservices.getdropdown(objdropdownmodel).subscribe(data => {
      if (data.Status == 1) {
        this.CorretionEntryReasonDetail = data.Data;
      }
    });
  }

  addRow() {
    var objNewItemGrid = new DynamicItemGrid();
    objNewItemGrid.Id = 0;
    objNewItemGrid.ItemNameId = "0";
    objNewItemGrid.ItemMakeId = "0";
    objNewItemGrid.ItemId = "0";
    objNewItemGrid.SiteId = 0;
    objNewItemGrid.SiteName = "";
    objNewItemGrid.CustomerSiteId = "";
    objNewItemGrid.ReasonCode = "";
    objNewItemGrid.CustomerCode = "";
    objNewItemGrid.CustomerId = 0;
    objNewItemGrid.HSN = "";
    objNewItemGrid.Qty = "";
    objNewItemGrid.SubDescription = "";
    objNewItemGrid.Rate = "";
    objNewItemGrid.Discount = 0;
    objNewItemGrid.ValueQty = "";
    objNewItemGrid.TotalAmount = "";
    objNewItemGrid.SerialNo = "";
    objNewItemGrid.ManufDate = "";
    objNewItemGrid.GetTotalAmount = "";
    objNewItemGrid.EqTypeId = "0";
    objNewItemGrid.InvoiceTaxNo = "";
    objNewItemGrid.InvoiceTaxDate = "";
    objNewItemGrid.IGST = "0";
    objNewItemGrid.IGSTValue = "0";
    objNewItemGrid.ConversionUnit = "";
    objNewItemGrid.ConversionValue = "";
    objNewItemGrid.ReceivedQty = "";
    objNewItemGrid.ReasonId = "0";
    objNewItemGrid.UnitName = "0";
    objNewItemGrid.Remarks = "";
    objNewItemGrid.SaleUnitName = "0";
    objNewItemGrid.SaleQty = "";
    objNewItemGrid.DispatchTypeId = "0";
    if (this.CompanyId == 4) {
      objNewItemGrid.ClientId = "0";
    } else {
      objNewItemGrid.ClientId = "99999";
    }
    objNewItemGrid.IsCorrectionEntryReason = "0";
    objNewItemGrid.IsCorrectionCodeId = "0";
    if (this.model.DisatchTrackeringId != 0 && this.model.IsApproved == 1 && this.RoleCorrectionEntry == true) {
      objNewItemGrid.IsCorrection = true;
      this.Correctioncolumnhideandshow = true;
      objNewItemGrid.IsCorrectionDisabled;
    } else {
      objNewItemGrid.IsCorrection = false;
      this.Correctioncolumnhideandshow = false;
    }
    objNewItemGrid.DIList_Id = 0;
    objNewItemGrid.FQty = 0;
    this.dynamicArray.push(objNewItemGrid);
    return true;
  }

  deleteRow(index) {
    if (this.dynamicArray.length == 1) {
      //this.toastr.error("Can't delete the row when there is only one row", 'Warning');  
      return false;
    } else {
      this.dynamicArray.splice(index, 1);
      //this.toastr.warning('Row deleted successfully', 'Delete row');  
      // this.fnBindItemGrossToatl();
      return true;
    }

  }

  //#region  validation
  ChangeDispatchFrom(Id: any) {
    $("#txtDispatchFrom").css('border-color', '');
    var DispatchFromData = this.DispatchFromList.filter(
      m => m.Id === parseInt(Id));
    this.model.PreviewDispatchFromName = DispatchFromData[0].Name;
  }

  onKeypressDocumentDatee(event: any) {
    $("#txtDeliveredDate").css('border-color', '');
  }

  TransporterNameKeyPress() {
    $("#txtTransporterName").css('border-color', '');
  }
  TransporteGSTNoKeyPress() {
    $("#txtTransporterGSTNo").css('border-color', '');
  }
  DestinationKeyPress() {
    $("#txtDestination").css('border-color', '');
  }
  GrNoKeyPress() {
    $("#txtGRNo").css('border-color', '');
  }
  VendorAddressKeyPress() {
    $("#txtVendorAddress").css('border-color', '');
  }
  VenGSTINKeyPress() {
    $("#txtVenGSTIN").css('border-color', '');
  }
  onKeypressGRDate(event: any) {
    $("#txtGRDate").css('border-color', '');
  }
  onKeypressExpectedDate(event: any) {
    $("#txtExpected").css('border-color', '');
  }
  onKeypressInvoicedDate(event: any) {
    $("#txtInvoiceDate").css('border-color', '');
  }
  VehicleKeyPress() {
    $("#txtVehicleNumber").css('border-color', '');
  }
  TaxInvoiceKeyPress() {
    $("#txtTaxInvoiceNo").css('border-color', '');
  }
  NoteKeyPress() {
    $("#txtNote").css('border-color', '');
  }

  ReceivedByKeyPress() {
    $("#txtReceivedBy").css('border-color', '');
  }
  changeTech(Id: any) {
    var TECHFEData = this.TechDataList.filter(m => m.Id === parseInt(Id));
    this.model.PreviewTECHFEName = TECHFEData[0].UserName;
    $("#txtTECHFE").css('border-color', '');
  }
  changeCOH(Id: any) {
    var TECHFEData = this.COHDataList.filter(m => m.Id === parseInt(Id));
    this.model.PreviewCOHName = TECHFEData[0].UserName;
    $("#txtCOHCI").css('border-color', '');
  }
  changeEmp(Id: any) {
    var LoanEmpNameData = this.EmpDataList.filter(m => m.UserId === parseInt(Id));
    this.model.PreviewLoanEmpName = LoanEmpNameData[0].UserName;
    $("#txtEmp").css('border-color', '');
  }
  FromSiteAddresKeyPress() {
    $("#txtSiteAddress").css('border-color', '');
  }
  ToSiteStateCodeKeyPress() {
    $("#txtToSiteStateCode").css('border-color', '');
  }
  ToSiteGSTINKeyPress() {
    $("#txtToSiteWHGSTIN").css('border-color', '');
  }
  ToWHStateCodeKeyPress() {
    $("#txtToWHStateCode").css('border-color', '');
  }
  ToVenDerStateCodeKeyPress() {
    $("#txtVenStateCode").css('border-color', '');
  }
  EwayBillNoKeyPress() {
    $("#txtEwayBillNo").css('border-color', '');
  }
  //vishal, 08/02/2023
  ToCompanyNameKeyPress() {
    $("#txtToCompanyName").css('border-color', '');
  }
  QtyKeyPress() {
    $('#tblOne > tbody  > tr').each(function () {
      var valueItem = $(this).find('.Qty').val();
      if (valueItem != '0') {
        $(this).find('.Qty').css('border-color', '');
      }
    });
  }

  SaleQtyKeyPress() {
    $('#tblOne > tbody  > tr').each(function () {
      var valueItem = $(this).find('.SaleQty').val();
      if (valueItem != '0') {
        $(this).find('.SaleQty').css('border-color', '');
      }
    });
  }

  ReceivedKeyPress() {
    $('#tblOne > tbody  > tr').each(function () {
      var valueItem = $(this).find('.ReceivedQty').val();
      if (valueItem != '') {
        $(this).find('.ReceivedQty').css('border-color', '');
      }
    });
  }

  RateKeyPress() {
    $('#tblOne > tbody  > tr').each(function () {
      var valueItem = $(this).find('.Rate').val();
      if (valueItem != '0') {
        $(this).find('.Rate').css('border-color', '');
      }
    });
  }

  HSNKeyPress() {
    $('#tblOne > tbody  > tr').each(function () {
      var valueItem = $(this).find('.HSN').val();
      if (valueItem != '0') {
        $(this).find('.HSN').css('border-color', '');
      }
    });
  }
  //vishal 21/09/2022
  subDescKeyPress() {
    $('#tblOne > tbody  > tr').each(function () {
      var valueItem = $(this).find('.SubDescription').val();
      if (valueItem != '') {
        $(this).find('.SubDescription').css('border-color', '');
      }
    });
  }
  //vishal-end

  ChangeDipatch(Id: any, index: any) {
    var DispatchTypeData = this.DispatchTypeList.filter(
      m => {
        m.Id === parseInt(Id);
      });
    this.dynamicArray[index].PreviewDispatchType = DispatchTypeData[0].DispatchType;
    $('#tblOne > tbody  > tr').each(function () {
      var valueItem = $(this).find('.DispatchType').val();
      if (valueItem != '0') {
        $(this).find('.DispatchType').css('border-color', '');
      }
    });
  }

  DiscountKeyPress() {
    $('#tblOne > tbody  > tr').each(function () {
      var valueItem = $(this).find('.Discount').val();
      if (valueItem != '') {
        $(this).find('.Discount').css('border-color', '');
      }
    });
  }

  IGSTKeyPress() {
    $('#tblOne > tbody  > tr').each(function () {
      var valueItem = $(this).find('.IGSTValue').val();
      if (valueItem != '0') {
        $(this).find('.IGSTValue').css('border-color', '');
      }
      var valueIGST = $(this).find('.IGST').val();
      if (valueIGST != '0') {
        $(this).find('.IGST').css('border-color', '');
      }
    });
  }

  SerialNoKeyPress() {
    $('#tblOne > tbody  > tr').each(function () {
      var valueItem = $(this).find('.SerialNo').val();
      if (valueItem != '0') {
        $(this).find('.SerialNo').css('border-color', '');
      }
    });
  }

  OnblurConversionValue() {
    $('#tblOne > tbody  > tr').each(function () {
      var valueReceivedQty = $(this).find('.ConversionValue').val();
      if (valueReceivedQty != '') {
        $(this).find('.ConversionValue').css('border-color', '');
      }
    });
  }

  ChangeReason() {
    $('#tblOne > tbody  > tr').each(function () {
      var valueItem = $(this).find('.ReasonId').val();
      if (valueItem != '') {
        $(this).find('.ReasonId').css('border-color', '');
      }
    });
  }

  RemarksKeyPress() {
    $('#tblOne > tbody  > tr').each(function () {
      var valueItem = $(this).find('.Remarks').val();
      if (valueItem != '') {
        $(this).find('.Remarks').css('border-color', '');
      }
    });
  }

  CancelValidation() {
    var flag = 0;
    if (this.model.InCaseReason == "0") {
      $('#txtInCaseReason').css('border-color', 'red');
      $('#txtInCaseReason').focus();
      flag = 1;
    } else {
      $("#txtInCaseReason").css('border-color', '');
    }
    return flag;
  }

  changeCaseReason() {
    $("#txtInCaseReason").css('border-color', '');
  }

  keypressreceiver() {
    $("#txtReceivedNo").css('border-color', '');
  }
  onKeypresstxtReceivedBy() {
    $("#txtReceivedBy").css('border-color', '');
  }
  ChangeDIStatus() {
    $("#txtDIStatus").css('border-color', '');
  }


  PartialUpdateValidation() {
    var flag = 0;

    //#region validation on Dispatch Details 
    if (this.model.Destination == "" || this.model.Destination == null) {
      $('#txtDestination').css('border-color', 'red');
      $('#txtDestination').focus();
      flag = 1;
    } else {
      $("#txtDestination").css('border-color', '');
    }

    //#region Transpotor/Bilty/Vehicle validation
    if (this.model.DisatchTrackeringId > 0 &&
      (this.model.TrasporationMode == "" || this.model.TrasporationMode == "0")) {
      $('#txtTrasporationMode').css('border-color', 'red');
      $('#txtTrasporationMode').focus();
      flag = 1;
    } else {
      $("#txtTrasporationMode").css('border-color', '');
    }

    if (this.model.DisatchTrackeringId > 0 && this.model.TrasporationMode == TransPortModeType.ByRoad) {

      //#region Transpotor
      if (this.model.TransporterId == "0") {
        $('#txtTransporterId').css('border-color', 'red');
        $('#txtTransporterId').focus();
        flag = 1;
      } else {
        $("#txtTransporterId").css('border-color', '');
      }

      if (this.model.TransporterName == "" || this.model.TransporterName == null) {
        $('#txtTransporterName').css('border-color', 'red');
        $('#txtTransporterName').focus();
        flag = 1;
      } else {
        $("#txtTransporterName").css('border-color', '');
      }

      if (this.model.TransporterGSTNo == "" || this.model.TransporterGSTNo == null) {
        $('#txtTransporterGSTNo').css('border-color', 'red');
        $('#txtTransporterGSTNo').focus();
        flag = 1;
      } else {
        $("#txtTransporterGSTNo").css('border-color', '');
      }
      //#endregion Transpotor

      //#region BiltyNo
      if (this.model.GRNo == "" || this.model.GRNo == null) {
        $('#txtGRNo').css('border-color', 'red');
        $('#txtGRNo').focus();
        flag = 1;
      } else {
        $("#txtGRNo").css('border-color', '');
      }

      if (this.model.GRDate == "" || this.model.GRDate == null) {
        $('#txtGRDate').css('border-color', 'red');
        $('#txtGRDate').focus();
        flag = 1;
      } else {
        $("#txtGRDate").css('border-color', '');
      }


      if (this.model.DisatchTrackeringId > 0 && this.IsGRFile == false) {
        var GrDocument = this._Commonservices.checkUndefined(this.GRfileDocumentFile);
        if (GrDocument == "") {
          flag = 1;
          alert('Please Select Bilty Document');
        }
      }
      //#endregion BiltyNo

      //#region  VehicleType
      if (this.model.ddlVehicleType == "null" || this.model.ddlVehicleType == "0") {
        $('#txtVehicleType').css('border-color', 'red');
        $('#txtVehicleType').focus();
        flag = 1;
      } else {
        $("#txtVehicleType").css('border-color', '');
      }
      if (this.model.VehicleNumber == "" || this.model.VehicleNumber == null) {
        $('#txtVehicleNumber').css('border-color', 'red');
        $('#txtVehicleNumber').focus();
        flag = 1;
      } else {
        $("#txtVehicleNumber").css('border-color', '');
      }
      //#endregion VehicleType
    }
    //#endregion Transpotor/Bilty/Vehicle validation


    //#region  EwayBill
    if (this.model.DisatchTrackeringId > 0 && this.IsEwayBillfile == false) {
      // if (this.model.ddlStateId == 29 && this.totalamount > AmountActivity.OtherState) {
      //   if (this.model.EwayBillNo == "" || this.model.EwayBillNo == null) {
      //     $('#txtEwayBillNo').css('border-color', 'red');
      //     $('#txtEwayBillNo').focus();
      //     flag = 1;
      //     alert('ypur total amount grather than > 100000, Please Fill EwayBillNo And Eway Bill Document');
      //   } else {
      //     $("#txtEwayBillNo").css('border-color', '');
      //   }

      //   if (this.model.EwayBillNo != "") {
      //     var BiilDocument = this._Commonservices.checkUndefined(this.EwayBillDocumentFile);
      //     if (BiilDocument == "") {
      //       flag = 1;
      //       alert('Please Select Eway Bill Document');
      //     }
      //   }
      // } else if (this.model.ddlStateId != 29 && this.totalamount > AmountActivity.SameState) {
      //   if (this.model.EwayBillNo == "" || this.model.EwayBillNo == null) {
      //     $('#txtEwayBillNo').css('border-color', 'red');
      //     $('#txtEwayBillNo').focus();
      //     flag = 1;
      //     alert('your total amount grather than > 50000, Please Fill EwayBillNo And Eway Bill Document');
      //   } else {
      //     $("#txtEwayBillNo").css('border-color', '');
      //   }
      // }
      if (this.model.EwayBillNo != "") {
        var BiilDocument = this._Commonservices.checkUndefined(this.EwayBillDocumentFile);
        if (BiilDocument == "") {
          flag = 1;
          alert('Please Select Eway Bill Document');
        }
      }
    }
    //#endregion EwayBill

    //#region  Tax Invoice No

    if (this.model.DisatchTrackeringId > 0 && this.IsTaxInvoiceFile == false) {
      if (this.model.TransferTypeId == PageActivity.Dis_SiteOtherState) {
        if (this.model.GSTType == "1") {

          if (this.model.TaxInvoiceNo == "" || this.model.TaxInvoiceNo == null) {
            $('#txtTaxInvoiceNo').css('border-color', 'red');
            $('#txtTaxInvoiceNo').focus();
            flag = 1;
          } else {
            $("#txtTaxInvoiceNo").css('border-color', '');
          }

          if (this.model.TaxInvoiceDate == "" || this.model.TaxInvoiceDate == null) {
            $('#txtInvoiceDate').css('border-color', 'red');
            $('#txtInvoiceDate').focus();
            flag = 1;
          } else {
            $("#txtInvoiceDate").css('border-color', '');
          }
        } else {
          flag = 0;
        }
      } else if (this.model.TransferTypeId == PageActivity.Dis_WHOtherState
        || this.model.TransferTypeId == PageActivity.Dis_VendorSale
        || this.model.TransferTypeId == PageActivity.Dis_VendorScrapSale) {

        if (this.model.TaxInvoiceNo == "" || this.model.TaxInvoiceNo == null) {
          $('#txtTaxInvoiceNo').css('border-color', 'red');
          $('#txtTaxInvoiceNo').focus();
          flag = 1;
        } else {
          $("#txtTaxInvoiceNo").css('border-color', '');
        }

        if (this.model.TaxInvoiceDate == "" || this.model.TaxInvoiceDate == null) {
          $('#txtInvoiceDate').css('border-color', 'red');
          $('#txtInvoiceDate').focus();
          flag = 1;
        } else {
          $("#txtInvoiceDate").css('border-color', '');
        }

      }

      // validation on Taxinvoiceuplodfile
      if (this._Commonservices.checkUndefined(this.model.TaxInvoiceNo) != "") {
        var TaxFile = this._Commonservices.checkUndefined(this.Taxinvoiceuplodfile);
        if (TaxFile == "") {
          flag = 1;
          alert('Please Select Tax Invoice File');
        }
      }
    }
    //#endregion Tax Invoice No

    // validation on DispatchFor/DispatchInstruction --change by Hemant tyagi 23/09/2022
    if (this.model.TransferTypeId == PageActivity.Dis_SiteWithinState
      && this.model.TransferTypeId == PageActivity.Dis_SiteOtherState) {

      // validation on Dispatch For --change by Hemant tyagi 23/09/2022
      if (this.model.DispatchFrom == "null" || this.model.DispatchFrom == "0") {
        $('#txtDispatchFrom').css('border-color', 'red');
        $('#txtDispatchFrom').focus();
        flag = 1;
      } else {
        $("#txtDispatchFrom").css('border-color', '');
      }

      // validation on Dispatch Instruction --change by Hemant tyagi 23/09/2022
      if (this.selectedDIArr.length == 0 || this.selectedDIArr == undefined) {
        alert("Please Select Dispatch Instruction.");
        flag = 1;
      } else {
        $("#txtDispatchInstraction").css('border-color', '');
      }
    } else {
      $("#txtDispatchFrom").css('border-color', '');
      $("#txtDispatchInstraction").css('border-color', '');
    }

    // validation on ExpectedDate change by Hemant Tyagi
    if (this.model.DisatchTrackeringId != 0 && (this.model.ExpectedDate == "" || this.model.ExpectedDate == null)) {
      $('#txtExpected').css('border-color', 'red');
      $('#txtExpected').focus();
      flag = 1;
    } else {
      $("#txtExpected").css('border-color', '');
    }
    //#endregion validation on Dispatch Details
    return flag;
  }

  validation() {
    var flag = 0;
    //#region Company WH Details    
    // validation On State Id.


    if (this.model.ddlStateId == "null" || this.model.ddlStateId == "0") {
      $('#txtddlStateId').css('border-color', 'red');
      $('#txtddlStateId').focus();
      flag = 1;
    } else {
      $("#txtddlStateId").css('border-color', '');
    }

    // validation On Dispatch To.
    if (this.model.TransferTypeId == "null" || this.model.TransferTypeId == "0") {
      $('#txtTransferType').css('border-color', 'red');
      $('#txtTransferType').focus();
      flag = 1;
    } else {
      $("#txtTransferType").css('border-color', '');
    }
    //#endregion Company WH Details

    //#region validation On SHIPPEDFROM WHId.
    if (this.model.ShippedfromWHId == "0" || this.model.ShippedfromWHId == null) {
      $('#txtShippedfromWHId').css('border-color', 'red');
      $('#txtShippedfromWHId').focus();
      flag = 1;
    } else {
      $("#txtShippedfromWHId").css('border-color', '');
    }
    //#endregion SHIPPEDFROM

    //#region SHIPPEDTO validation
    // validation on SHIPPEDTO SiteWithINState releated filed.
    if (this.model.TransferTypeId == PageActivity.Dis_SiteWithinState) {

      if (this.model.SiteId == "0" || this.model.SiteId == null) {
        alert("Please select Site Id");
        flag = 1;
      }

      if (this.model.TECHFE == "0" || this.model.TECHFE == null || this.model.TECHFE == "") {
        $('#txtTECHFE').css('border-color', 'red');
        $('#txtTECHFE').focus();
        flag = 1;
      } else {
        $("#txtTECHFE").css('border-color', '');
      }

      if (this.model.COHCI == "0" || this.model.COHCI == null || this.model.COHCI == "") {
        $('#txtCOHCI').css('border-color', 'red');
        $('#txtCOHCI').focus();
        flag = 1;
      } else {
        $("#txtCOHCI").css('border-color', '');
      }

      if (this.model.IsMultipleSite == true) {
        if (this.model.EmployeeId == "0" || this.model.EmployeeId == null) {
          $('#txtEmp').css('border-color', 'red');
          $('#txtEmp').focus();
          flag = 1;
        } else {
          $("#txtEmp").css('border-color', '');
        }
      }

      if (this.model.SiteAddress == "" || this.model.SiteAddress == null) {
        $('#txtSiteAddress').css('border-color', 'red');
        $('#txtSiteAddress').focus();
        flag = 1;
      } else {
        $("#txtSiteAddress").css('border-color', '');
      }

    }

    // validation on SHIPPEDTO SiteOtherState releated filed.
    if (this.model.TransferTypeId == PageActivity.Dis_SiteOtherState) {

      if (this.model.ToSiteStateId == "0" || this.model.ToSiteStateId == null) {
        $('#txtToSiteStateId').css('border-color', 'red');
        $('#txtToSiteStateId').focus();
        flag = 1;
      } else {
        $("#txtToSiteStateId").css('border-color', '');
      }

      if (this.model.ToSiteStateCode == "" || this.model.ToSiteStateCode == null) {
        $('#txtToSiteStateCode').css('border-color', 'red');
        $('#txtToSiteStateCode').focus();
        flag = 1;
      } else {
        $("#txtToSiteStateCode").css('border-color', '');
      }

      if (this.model.SiteId == "0" || this.model.SiteId == null) {
        alert("Please select Site Id");
        flag = 1;
      }

      if (this.model.ToSiteWHGSTIN == "" || this.model.ToSiteWHGSTIN == null) {
        $('#txtToSiteWHGSTIN').css('border-color', 'red');
        $('#txtToSiteWHGSTIN').focus();
        flag = 1;
      } else {
        $("#txtToSiteWHGSTIN").css('border-color', '');
      }

      if (this.model.TECHFE == "0" || this.model.TECHFE == null || this.model.TECHFE == "") {
        $('#txtTECHFE').css('border-color', 'red');
        $('#txtTECHFE').focus();
        flag = 1;
      } else {
        $("#txtTECHFE").css('border-color', '');
      }

      if (this.model.COHCI == "0" || this.model.COHCI == null || this.model.COHCI == "") {
        $('#txtCOHCI').css('border-color', 'red');
        $('#txtCOHCI').focus();
        flag = 1;
      } else {
        $("#txtCOHCI").css('border-color', '');
      }

      if (this.model.IsMultipleSite == true) {
        if (this.model.EmployeeId == "0" || this.model.EmployeeId == null) {
          $('#txtEmp').css('border-color', 'red');
          $('#txtEmp').focus();
          flag = 1;
        } else {
          $("#txtEmp").css('border-color', '');
        }
      }

      if (this.model.SiteAddress == "" || this.model.SiteAddress == null) {
        $('#txtSiteAddress').css('border-color', 'red');
        $('#txtSiteAddress').focus();
        flag = 1;
      } else {
        $("#txtSiteAddress").css('border-color', '');
      }

      if (this.model.GSTType == "0" || this.model.GSTType == null) {
        $('#txtGSTType').css('border-color', 'red');
        $('#txtGSTType').focus();
        flag = 1;
      } else {
        $("#txtGSTType").css('border-color', '');
      }

       //vishal, 08/02/2023, company name with customer gst selection
       if (this.model.GSTType == "2") {
        if (this.model.CompanyName == "" || this.model.CompanyName == null) {
          $('#txtToCompanyName').css('border-color', 'red');
          $('#txtToCompanyName').focus();
          flag = 1;
        } else {
          $("#txtToCompanyName").css('border-color', '');
        }
      }else {
        $("#txtToCompanyName").css('border-color', '');
      }

    }

    // validation on SHIPPEDTO WHWIthINState releated filed.
    if (this.model.TransferTypeId == PageActivity.Dis_WHWithinState) {
      if (this.model.ShippedToINWHId == "0" || this.model.ShippedToINWHId == null) {
        $('#txtShippedToWHId').css('border-color', 'red');
        $('#txtShippedToWHId').focus();
        flag = 1;
      } else {
        $("#txtShippedToWHId").css('border-color', '');
      }
    }

    // validation on SHIPPEDTO WHOtherState/ReparingCenter releated filed.
    if (this.model.TransferTypeId == PageActivity.Dis_WHOtherState
      || this.model.TransferTypeId == PageActivity.Dis_RepairingCenter) {

      if (this.model.EditStateId == "0" || this.model.EditStateId == "") {
        $('#txtTOWHStateId').css('border-color', 'red');
        $('#txtTOWHStateId').focus();
        flag = 1;
      } else {
        $("#txtTOWHStateId").css('border-color', '');
      }

      if (this.model.WHStateCode == "" || this.model.WHStateCode == null) {
        $('#txtToWHStateCode').css('border-color', 'red');
        $('#txtToWHStateCode').focus();
        flag = 1;
      } else {
        $("#txtToWHStateCode").css('border-color', '');
      }

      if (this.model.ShippedToOtherWHId == "0" || this.model.ShippedToOtherWHId == null) {
        $('#txtShippedToOtherWHId').css('border-color', 'red');
        $('#txtShippedToOtherWHId').focus();
        flag = 1;
      } else {
        $("#txtShippedToOtherWHId").css('border-color', '');
      }

    }

    // validation on SHIPPEDTO CustomerReturn (After Repaired) releated filed.
    if (this.model.TransferTypeId == PageActivity.Dis_CustomerReturn) {
      if (this.model.EditStateId == "0" || this.model.EditStateId == "") {
        $('#txtTOWHStateId').css('border-color', 'red');
        $('#txtTOWHStateId').focus();
        flag = 1;
      } else {
        $("#txtTOWHStateId").css('border-color', '');
      }

      if (this.model.OtherStateCode == "" || this.model.OtherStateCode == null) {
        $('#txtToWHStateCode').css('border-color', 'red');
        $('#txtToWHStateCode').focus();
        flag = 1;
      } else {
        $("#txtToWHStateCode").css('border-color', '');
      }

      if (this.model.CustomerId == "0" || this.model.CustomerId == null) {
        $('#txtCustomerName').css('border-color', 'red');
        $('#txtCustomerName').focus();
        flag = 1;
      } else {
        $("#txtCustomerName").css('border-color', '');
      }

      if (this.model.CRNId == "0" || this.model.CRNId == null) {
        $('#txtCRNo').css('border-color', 'red');
        $('#txtCRNo').focus();
        flag = 1;
      } else {
        $("#txtCRNo").css('border-color', '');
      }

      if (this.model.CustomerGSTIN == "" || this.model.CustomerGSTIN == null) {
        $('#txtToWHGSTIN').css('border-color', 'red');
        $('#txtToWHGSTIN').focus();
        flag = 1;
      } else {
        $("#txtToWHGSTIN").css('border-color', '');
      }

      if (this.model.CustomerAddress == "" || this.model.CustomerAddress == null) {
        $('#txtCustomerAddress').css('border-color', 'red');
        $('#txtCustomerAddress').focus();
        flag = 1;
      } else {
        $("#txtCustomerAddress").css('border-color', '');
      }
    }
    //#region  Tax Invoice No

    if (this.model.DisatchTrackeringId > 0 && this.IsTaxInvoiceFile == false) {
      if (this.model.TransferTypeId == PageActivity.Dis_SiteOtherState) {
        if (this.model.GSTType == "1") {
          if (this.model.TaxInvoiceNo == "" || this.model.TaxInvoiceNo == null) {
            $('#txtTaxInvoiceNo').css('border-color', 'red');
            $('#txtTaxInvoiceNo').focus();
            flag = 1;
          } else {
            $("#txtTaxInvoiceNo").css('border-color', '');
          }

          if (this.model.TaxInvoiceDate == "" || this.model.TaxInvoiceDate == null) {
            $('#txtInvoiceDate').css('border-color', 'red');
            $('#txtInvoiceDate').focus();
            flag = 1;
          } else {
            $("#txtInvoiceDate").css('border-color', '');
          }
        } else {
          flag = 0;
        }
      } else if (this.model.TransferTypeId == PageActivity.Dis_WHOtherState
        || this.model.TransferTypeId == PageActivity.Dis_VendorSale
        || this.model.TransferTypeId == PageActivity.Dis_VendorScrapSale) {
        if (this.model.TaxInvoiceNo == "" || this.model.TaxInvoiceNo == null) {
          $('#txtTaxInvoiceNo').css('border-color', 'red');
          $('#txtTaxInvoiceNo').focus();
          flag = 1;
        } else {
          $("#txtTaxInvoiceNo").css('border-color', '');
        }

        if (this.model.TaxInvoiceDate == "" || this.model.TaxInvoiceDate == null) {
          $('#txtInvoiceDate').css('border-color', 'red');
          $('#txtInvoiceDate').focus();
          flag = 1;
        } else {
          $("#txtInvoiceDate").css('border-color', '');
        }
      }
      // validation on Taxinvoiceuplodfile
      if (this._Commonservices.checkUndefined(this.model.TaxInvoiceNo) != "") {
        var TaxFile = this._Commonservices.checkUndefined(this.Taxinvoiceuplodfile);
        if (TaxFile == "") {
          flag = 1;
          alert('Please Select Tax Invoice File');
        }
      }
    }
    //#endregion Tax Invoice No

    // validation on SHIPPEDTO vendor releated filed for (Repaire,sale,scrap sale).
    if (this.model.TransferTypeId == PageActivity.Dis_Vendor
      || this.model.TransferTypeId == PageActivity.Dis_VendorScrapSale
      || this.model.TransferTypeId == PageActivity.Dis_VendorSale) {

      if (this.model.VenOtherStateId == "0" || this.model.VenOtherStateId == "") {
        $('#txtTOVenderStateId').css('border-color', 'red');
        $('#txtTOVenderStateId').focus();
        flag = 1;
      } else {
        $("#txtTOVenderStateId").css('border-color', '');
      }

      if (this.model.VenStateCode == "0" || this.model.VenStateCode == "") {
        $('#txtVenStateCode').css('border-color', 'red');
        $('#txtVenStateCode').focus();
        flag = 1;
      } else {
        $("#txtVenStateCode").css('border-color', '');
      }

      if (this.SelectedEditVendorList.length == 0 || this.SelectedEditVendorList.length == 0) {
        $('#TxtToVendorCode .selected-list .c-btn').attr('style', 'border-color: red');
        $('#TxtToVendorCode').focus();
        flag = 1;
      } else {
        $('#TxtToVendorCode .selected-list .c-btn').attr('style', 'border-color: ');
      }

      if (this.model.VenGSTIN == "") {
        $('#txtVenGSTIN').css('border-color', 'red');
        $('#txtVenGSTIN').focus();
        flag = 1;
      } else {
        $("#txtVenGSTIN").css('border-color', '');
      }

      if (this.model.VendorAddress == "") {
        $('#txtVendorAddress').css('border-color', 'red');
        $('#txtVendorAddress').focus();
        flag = 1;
      } else {
        $("#txtVendorAddress").css('border-color', '');
      }
    }
    // Hemant Tyagi

    // validation on SHIPPEDTO vendorsale releated filed WarehouseId. 
    if (this.model.TransferTypeId == PageActivity.Dis_VendorSale && this.VendorScaleVissible == true) {
      if (this.model.ShippedToVendorWHId == "0" || this.model.ShippedToVendorWHId == null) {
        $('#txtShippedToVendorWHId').css('border-color', 'red');
        $('#txtShippedToVendorWHId').focus();
        flag = 1;
      } else {
        $("#txtShippedToVendorWHId").css('border-color', '');
      }
    }
    //#endregion SHIPPEDTO validation

    //#region validation on Dispatch Details 
    if (this.model.Destination == "" || this.model.Destination == null) {
      $('#txtDestination').css('border-color', 'red');
      $('#txtDestination').focus();
      flag = 1;
    } else {
      $("#txtDestination").css('border-color', '');
    }

    //#region Transpotor/Bilty/Vehicle validation
    if (this.model.DisatchTrackeringId > 0 &&
      (this.model.TrasporationMode == "" || this.model.TrasporationMode == "0")) {
      $('#txtTrasporationMode').css('border-color', 'red');
      $('#txtTrasporationMode').focus();
      flag = 1;
    } else {
      $("#txtTrasporationMode").css('border-color', '');
    }

    if (this.model.DisatchTrackeringId > 0 && this.model.TrasporationMode == TransPortModeType.ByRoad) {

      //#region Transpotor
      if (this.model.TransporterId == "0") {
        $('#txtTransporterId').css('border-color', 'red');
        $('#txtTransporterId').focus();
        flag = 1;
      } else {
        $("#txtTransporterId").css('border-color', '');
      }

      if (this.model.TransporterName == "" || this.model.TransporterName == null) {
        $('#txtTransporterName').css('border-color', 'red');
        $('#txtTransporterName').focus();
        flag = 1;
      } else {
        $("#txtTransporterName").css('border-color', '');
      }

      if (this.model.TransporterGSTNo == "" || this.model.TransporterGSTNo == null) {
        $('#txtTransporterGSTNo').css('border-color', 'red');
        $('#txtTransporterGSTNo').focus();
        flag = 1;
      } else {
        $("#txtTransporterGSTNo").css('border-color', '');
      }
      //#endregion Transpotor

      //#region BiltyNo
      if (this.model.GRNo == "" || this.model.GRNo == null) {
        $('#txtGRNo').css('border-color', 'red');
        $('#txtGRNo').focus();
        flag = 1;
      } else {
        $("#txtGRNo").css('border-color', '');
      }

      if (this.model.GRDate == "" || this.model.GRDate == null) {
        $('#txtGRDate').css('border-color', 'red');
        $('#txtGRDate').focus();
        flag = 1;
      } else {
        $("#txtGRDate").css('border-color', '');
      }

      if (this.model.DisatchTrackeringId > 0 && this.IsGRFile == false) {
        var GrDocument = this._Commonservices.checkUndefined(this.GRfileDocumentFile);
        if (GrDocument == "") {
          flag = 1;
          alert('Please Select Bilty Document');
        }
      }
      //#endregion BiltyNo

      //#region  VehicleType
      if (this.model.ddlVehicleType == "null" || this.model.ddlVehicleType == "0") {
        $('#txtVehicleType').css('border-color', 'red');
        $('#txtVehicleType').focus();
        flag = 1;
      } else {
        $("#txtVehicleType").css('border-color', '');
      }
      if (this.model.VehicleNumber == "" || this.model.VehicleNumber == null) {
        $('#txtVehicleNumber').css('border-color', 'red');
        $('#txtVehicleNumber').focus();
        flag = 1;
      } else {
        $("#txtVehicleNumber").css('border-color', '');
      }
      //#endregion VehicleType
    }
    //#endregion Transpotor/Bilty/Vehicle validation

    //#region  EwayBill
    if (this.model.IsDispatch == true && this.model.DisatchTrackeringId > 0 && this.IsEwayBillfile == false) {
      if (this.model.ddlStateId == 29 && this.totalamount > AmountActivity.OtherState) {
        if (this.model.EwayBillNo == "" || this.model.EwayBillNo == null) {
          $('#txtEwayBillNo').css('border-color', 'red');
          $('#txtEwayBillNo').focus();
          flag = 1;
          alert('ypur total amount grather than > 100000, Please Fill EwayBillNo And Eway Bill Document');
        } else {
          $("#txtEwayBillNo").css('border-color', '');
        }

        if (this.model.EwayBillNo != "") {
          var BiilDocument = this._Commonservices.checkUndefined(this.EwayBillDocumentFile);
          if (BiilDocument == "") {
            flag = 1;
            alert('Please Select Eway Bill Document');
          }
        }
      } else if (this.model.ddlStateId != 29 && this.totalamount > AmountActivity.SameState) {
        if (this.model.EwayBillNo == "" || this.model.EwayBillNo == null) {
          $('#txtEwayBillNo').css('border-color', 'red');
          $('#txtEwayBillNo').focus();
          flag = 1;
          alert('your total amount grather than > 50000, Please Fill EwayBillNo And Eway Bill Document');
        } else {
          $("#txtEwayBillNo").css('border-color', '');
        }
      }
      if (this.model.EwayBillNo != "") {
        var BiilDocument = this._Commonservices.checkUndefined(this.EwayBillDocumentFile);
        if (BiilDocument == "") {
          flag = 1;
          alert('Please Select Eway Bill Document');
        }
      }
    }
    //#endregion EwayBill

    //#region  Tax Invoice No    
    //if (this.model.DisatchTrackeringId > 0 && this.IsTaxInvoiceFile == false) {
    // if (this.model.TransferTypeId == PageActivity.Dis_SiteOtherState) {
    //   if (this.model.GSTType == "1") {
    //     if (this.model.TaxInvoiceNo == "" || this.model.TaxInvoiceNo == null) {
    //       $('#txtTaxInvoiceNo').css('border-color', 'red');
    //       $('#txtTaxInvoiceNo').focus();
    //       flag = 1;
    //     } else {
    //       $("#txtTaxInvoiceNo").css('border-color', '');
    //     }
    //   } else {
    //     flag = 0;
    //   }
    // } else if (this.model.TransferTypeId == PageActivity.Dis_WHOtherState) {
    //   if (this.model.TaxInvoiceNo == "" || this.model.TaxInvoiceNo == null) {
    //     $('#txtTaxInvoiceNo').css('border-color', 'red');
    //     $('#txtTaxInvoiceNo').focus();
    //     flag = 1;
    //   } else {
    //     $("#txtTaxInvoiceNo").css('border-color', '');
    //   }
    // }

    // validation on Taxinvoiceuplodfile
    // if (this._Commonservices.checkUndefined(this.model.TaxInvoiceNo) != "") {
    //   var TaxFile = this._Commonservices.checkUndefined(this.Taxinvoiceuplodfile);
    //   if (TaxFile == "") {
    //     flag = 1;
    //     alert('Please Select Tax Invoice File');
    //   }
    // }
    //}
    //#endregion Tax Invoice No

    // validation on DispatchFor/DispatchInstruction --change by Hemant tyagi 23/09/2022
    if (this.model.TransferTypeId == PageActivity.Dis_SiteWithinState
      && this.model.TransferTypeId == PageActivity.Dis_SiteOtherState) {

      // validation on Dispatch For --change by Hemant tyagi 23/09/2022
      if (this.model.DispatchFrom == "null" || this.model.DispatchFrom == "0") {
        $('#txtDispatchFrom').css('border-color', 'red');
        $('#txtDispatchFrom').focus();
        flag = 1;
      } else {
        $("#txtDispatchFrom").css('border-color', '');
      }

      // validation on Dispatch Instruction --change by Hemant tyagi 23/09/2022
      if (this.selectedDIArr.length == 0 || this.selectedDIArr == undefined) {
        alert("Please Select Dispatch Instruction.");
        flag = 1;
      } else {
        $("#txtDispatchInstraction").css('border-color', '');
      }
    } else {
      $("#txtDispatchFrom").css('border-color', '');
      $("#txtDispatchInstraction").css('border-color', '');
    }

    // validation on ExpectedDate change by Hemant Tyagi
    if (this.model.DisatchTrackeringId != 0 && (this.model.ExpectedDate == "" || this.model.ExpectedDate == null)) {
      $('#txtExpected').css('border-color', 'red');
      $('#txtExpected').focus();
      flag = 1;
    } else {
      $("#txtExpected").css('border-color', '');
    }

    //#endregion validation on Dispatch Details

    //#region  validation On Item Detail
    for (var icount = 0, len = this.dynamicArray.length; icount < len; icount++) {
      if (this.dynamicArray[icount].ItemNameId == ""
        || this.dynamicArray[icount].ItemNameId == "null"
        || this.dynamicArray[icount].ItemNameId == "0") {
        $('#ddlItemNameId_' + icount).css('border-color', 'red');
        $('#ddlItemNameId_' + icount).focus();
        flag = 1;
      } else {
        $("#ddlItemNameId_" + icount).css('border-color', '');
      }

      if (this.dynamicArray[icount].ItemMakeId == ""
        || this.dynamicArray[icount].ItemMakeId == "null"
        || this.dynamicArray[icount].ItemMakeId == "0") {
        $('#ddlItemMake_' + icount).css('border-color', 'red');
        $('#ddlItemMake_' + icount).focus();
        flag = 1;
      } else {
        $("#ddlItemMake_" + icount).css('border-color', '');
      }

      if (this.dynamicArray[icount].ItemId == "" || this.dynamicArray[icount].ItemId == "null" || this.dynamicArray[icount].ItemId == "0") {
        $('#ddlItemId_' + icount).css('border-color', 'red');
        $('#ddlItemId_' + icount).focus();
        flag = 1;
      } else {
        $("#ddlItemId_" + icount).css('border-color', '');
      }

      if (this.dynamicArray[icount].EqTypeId == "" || this.dynamicArray[icount].EqTypeId == "null" || this.dynamicArray[icount].EqTypeId == "0") {
        $('#ddlEqTypeId_' + icount).css('border-color', 'red');
        $('#ddlEqTypeId_' + icount).focus();
        flag = 1;
      } else {
        $("#ddlEqTypeId_" + icount).css('border-color', '');
      }

      if (this.dynamicArray[icount].ClientId == "null" || this.dynamicArray[icount].ClientId == "0") {
        $('#ddlClient_' + icount).css('border-color', 'red');
        $('#ddlClient_' + icount).focus();
        flag = 1;
      } else {
        $("#ddlClient_" + icount).css('border-color', '');
      }

      //vishal

      if (this.dynamicArray[icount].ItemName == "MISC") {
        if (this.dynamicArray[icount].SubDescription == '' || this.dynamicArray[icount].SubDescription == null) {
          $('#txtSubDesc_' + icount).css('border-color', 'red');
          $('#txtSubDesc_' + icount).focus();
          flag = 1;
        } else {
          $("#txtSubDesc_" + icount).css('border-color', '');
        }
      }
      //vishal-end-region

      if (this.model.TransferTypeId != PageActivity.Dis_VendorScrapSale) {
        if (this.dynamicArray[icount].UnitName == "" || this.dynamicArray[icount].UnitName == "0") {
          $('#ddlUnitName_' + icount).css('border-color', 'red');
          $('#ddlUnitName_' + icount).focus();
          flag = 1;
        } else {
          $("#ddlUnitName_" + icount).css('border-color', '');
        }
        if (this.dynamicArray[icount].Qty == "" || this.dynamicArray[icount].Qty == "0") {
          $('#txtQty_' + icount).css('border-color', 'red');
          $('#txtQty_' + icount).focus();
          flag = 1;
        } else {
          $("#txtQty_" + icount).css('border-color', '');
        }
      } else {
        if (this.dynamicArray[icount].SaleUnitName == "" || this.dynamicArray[icount].SaleUnitName == "0") {
          $('#ddlSaleUnitName_' + icount).css('border-color', 'red');
          $('#ddlSaleUnitName_' + icount).focus();
          flag = 1;
        } else {
          $("#ddlSaleUnitName_" + icount).css('border-color', '');
        }
        if (this.dynamicArray[icount].SaleQty == "" || this.dynamicArray[icount].SaleQty == "0") {
          $('#txtSaleQty_' + icount).css('border-color', 'red');
          $('#txtSaleQty_' + icount).focus();
          flag = 1;
        } else {
          $("#txtSaleQty_" + icount).css('border-color', '');
        }

      }

      if (this.dynamicArray[icount].Rate == "" || this.dynamicArray[icount].Rate == "0") {
        $('#txtRate_' + icount).css('border-color', 'red');
        $('#txtRate_' + icount).focus();
        flag = 1;
      } else {
        $("#txtRate_" + icount).css('border-color', '');
      }

      if (this.dynamicArray[icount].DispatchTypeId == ""
        || this.dynamicArray[icount].DispatchTypeId == "0") {

        if (this.model.TransferTypeId == PageActivity.Dis_SiteWithinState
          || this.model.TransferTypeId == PageActivity.Dis_SiteOtherState
          || this.model.TransferTypeId == PageActivity.Dis_VendorScrapSale) {
          $('#ddlDispatchType_' + icount).css('border-color', 'red');
          $('#ddlDispatchType_' + icount).focus();
          flag = 1;

        } else {
          $("#ddlDispatchType_" + icount).css('border-color', '');
        }
      } else {
        $("#ddlDispatchType_" + icount).css('border-color', '');
      }

      if (this.model.DisatchTrackeringId == 0) {
        if (this.dynamicArray[icount].ClientId == "0") {
          $('#ddlClient_' + icount).css('border-color', 'red');
          $('#ddlClient_' + icount).focus();
          flag = 1;
        } else {
          $("#ddlClient_" + icount).css('border-color', '');
        }
      }

    }
    //#endregion  validation On Item Detail

    // validation on Note
    if (this.model.Note == "" || this.model.Note == null) {
      $('#txtNote').css('border-color', 'red');
      flag = 1;
    } else {
      $("#txtNote").css('border-color', '');
    }
    return flag;
  }

  ValidationReceived() {
    var flag = 0;
    if (this.IsReceivingFile == false) {
      var recDocument = this._Commonservices.checkUndefined(this.RecDocumentFile);
      if (recDocument == "" || recDocument == null) {
        flag = 1;
        alert('Please Select Receiveing Document');
      }
    }

    if (this.model.ReceivedBy == "0" || this.model.ReceivedBy == "" || this.model.ReceivedBy == null) {
      $('#txtReceivedBy').css('border-color', 'red');
      $('#txtReceivedBy').focus();
      flag = 1;
    } else {
      $("#txtReceivedBy").css('border-color', '');
    }

    if (this.model.ReceivedNo == "0" || this.model.ReceivedNo == "" || this.model.ReceivedNo == null) {
      $('#txtReceivedNo').css('border-color', 'red');
      $('#txtReceivedNo').focus();
      flag = 1;
    } else {
      $("#txtReceivedNo").css('border-color', '');
    }

    if (this._Commonservices.checkUndefined(this.model.DeliveredDate) == "") {
      $('#txtDeliveredDate').css('border-color', 'red');
      $('#txtDeliveredDate').focus();
      flag = 1;
    } else {
      $("#txtDeliveredDate").css('border-color', '');
    }

    for (var icount = 0, len = this.dynamicArray.length; icount < len; icount++) {
      if (this.dynamicArray[icount].ReceivedQty == "" || this.dynamicArray[icount].ReceivedQty == "0.00") {
        $('#txtReceivedQty_' + icount).css('border-color', 'red');
        $('#txtReceivedQty_' + icount).focus();
        flag = 1;
      } else {
        $("#txtReceivedQty_" + icount).css('border-color', '');
      }

      if (this.dynamicArray[icount].ReceivedQty != "") {
        var ReqQty;
        var dlength = this.dynamicArray.length;
        if (dlength > icount) {
          ReqQty = this._Commonservices.checkUndefined(this.dynamicArray[icount].Qty);
        } else {
          ReqQty = 0;
        }

        if (parseInt(this.dynamicArray[icount].ReceivedQty) != parseInt(ReqQty)) {
          if (this.dynamicArray[icount].ReasonId == "" || this.dynamicArray[icount].ReasonId == "0") {
            $('#txtReasonId_' + icount).css('border-color', 'red');
            $('#txtReasonId_' + icount).focus();
            flag = 1;
          } else {
            $("#txtReasonId_" + icount).css('border-color', '');
          }

          if (this.dynamicArray[icount].ReasonId == 1506) {
            if (this.dynamicArray[icount].Remarks == "" || this.dynamicArray[icount].Remarks == "null") {
              $('#txtRemarks_' + icount).css('border-color', 'red');
              $('#txtRemarks_' + icount).focus();
              flag = 1;
            }
            // }
          }
        }
      }
    }
    return flag;
  }

  BindVendorWh(companyId: any, stateId: any) {
    var StateId = this._Commonservices.checkUndefined(stateId);
    var objdropdownmodel = new DropdownModel();
    objdropdownmodel.User_Id = 0;
    objdropdownmodel.Parent_Id = companyId;
    if (StateId != '') {
      objdropdownmodel.Other_Id = StateId;
    } else {
      objdropdownmodel.Other_Id = "0";
      return false;
    }
    objdropdownmodel.Flag = 'OtherWHMaster';
    this.ShippedTOVendorWHList = [];
    this._Commonservices.getdropdown(objdropdownmodel).pipe(first()).subscribe(SaleWh => {
      if (SaleWh.Data != null && SaleWh.Data != "") {
        this.ShippedTOVendorWHList = SaleWh.Data;
      }
    }, error => {
      this._Commonservices.ErrorFunction(this.UserName, error.message, "getdropdown", "Vendor(Sale)");
    });
  }

  //created by: vishal 17/09/2022, description: function for download bilty files
  DownloadAllBiltyZip() {
    var objDownLoadZipFileDetial = new DownLoadZipFileDetial();
    var value = '';
    var formdata = new FormData();
    this.CheckData = [];
    if (this.rowData.length > 0) {
      for (let i = 0; i < this.rowData?.length; i++) {
        if (this.rowData[i].cbox == true) {
          this.CheckData.push(this.rowData[i]);
          // }
        }
      }
      if (this.CheckData.length > 0) {
        for (let i = 0; i < this.CheckData?.length; i++) {
          if (this.CheckData[i].BiltyFile != "" && this.CheckData[i].BiltyFile != null) {
            value += this.CheckData[i].BiltyFile + ',';
          }
        }
      } else {
        for (let i = 0; i < this.rowData?.length; i++) {
          if (this.rowData[i].BiltyFile != "" && this.rowData[i].BiltyFile != null) {
            value += this.rowData[i].BiltyFile + ',';
          }
        }
      }
      formdata.append("SendDownloadFile", JSON.stringify(value));
      this._Commonservices.DownloadFileZip(formdata).subscribe(data => {
        var zip = new JSZip();
        var imgFolder = zip.folder("images");
        for (var i = 0; i < data.lstUrlDetail.length; i++) {
          const byteArray = new Uint8Array(atob(data.lstUrlDetail[i].base64Value).split("").map(char => char.charCodeAt(0)));
          //const newBlob = new Blob([byteArray], {type: 'application/pdf'}); 
          imgFolder.file(this.GetFilename1(data.lstUrlDetail[i].Url), byteArray, { base64: true });

        }
        zip.generateAsync({ type: "blob" })
          .then(function (content) {
            FileSaver.saveAs(content, "BiltyFile.zip");
          });
      });
    }
  }

  GetFilename1(url) {
    var m = url.substring(url.lastIndexOf('/') + 1);
    this.ReplaceUrl = m.split('.');
    for (let j = 0; j < this.rowData?.length; j++) {
      if (this.rowData[j].BiltyFile != "" && this.rowData[j].BiltyFile != null) {
        var v = this.rowData[j].BiltyFile.substring(this.rowData[j].BiltyFile.lastIndexOf('/') + 1)
        if (m == v) {
          var R = this.rowData[j].DocumentNo + ('.') + this.ReplaceUrl[1];
          return R;
        }
      }
    }
  }


  getClosingStock(index: any) {
    try {
      var objStockQtyModel = new StockQtyModel();
      objStockQtyModel.Client_Id = this.dynamicArray[index].ClientId;
      objStockQtyModel.ItemCode_Id = this.dynamicArray[index].ItemId;
      objStockQtyModel.WH_Id = this.model.ShippedfromWHId;
      objStockQtyModel.Equp_Id = this.dynamicArray[index].EqTypeId;
      objStockQtyModel.Company_Id = this.CompanyId;
      objStockQtyModel.IsEdit = this.isEdit;
      this._StockserviceService.GetAllStockQtyByItemCode(objStockQtyModel).pipe(first()).subscribe(data => {
        if (data.Status = 1) {
          if (data.Data != null) {
            this.dynamicArray[index].FQty = data.Data[0].StockQty;
          } else {
            this.dynamicArray[index].FQty = 0;
          }
          this.dynamicArray[index].GSerialNumbers = [];
        }
      }, error => {
        this._Commonservices.ErrorFunction(this.UserName, error.message, "getClosingStock", "DispatchTracker");
      });
    } catch (Error) {
      this._Commonservices.ErrorFunction(this.UserName, Error.message, "getClosingStock", "DispatchTracker");
    }
  }

  serialNoValidation() {
    let returnValue = 0;
    for (var i = 0; i < this.dynamicArray.length; i++) {
      var ItemNameId = this.dynamicArray[i].ItemNameId

      const result = this.SearchItemNameList.filter(element => {
        return element.id === parseInt(ItemNameId);
      });

      var itmName = result[0].itemName;
      if (this.IsMandatory(i) == true) {
        if (this.dynamicArray[i].GSerialNumbers.length != this.dynamicArray[i].Qty) {
          returnValue = 1;
          this.IsError = true;
          this.errorMessage = "Serial-No (" + parseInt(this.dynamicArray[i].Qty) + " -Qty) is required for " + itmName + " ";
          return returnValue;
        }
      }
    }
  }

  validationDICustomerSiteId() {
    let returnStatus = 0;
    if (this.model.TransferTypeId == PageActivity.Dis_SiteWithinState
      || this.model.TransferTypeId == PageActivity.Dis_SiteOtherState) {

      returnStatus = 1;
      for (var i = 0; i < this.dynamicArray.length; i++) {
        if (this.dynamicArray[i].CustomerSiteId == this.model.HideCustomerId) {
          returnStatus = 0;
        }
      }
    }

    if (returnStatus == 1) {
      this.IsError = true;
      this.errorMessage = "CustomerSiteId don't match with Dispatch Instruction(CustomerSiteId)";
    }
    return returnStatus;
  }
}