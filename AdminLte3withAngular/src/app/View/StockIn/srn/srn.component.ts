import { DatePipe } from '@angular/common';
import { Component, OnInit, TemplateRef, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { inArray, isNumeric } from 'jquery';
import { NgxSpinnerService } from 'ngx-spinner';
import { ButtonRendererComponent } from 'src/app/renderer/button-renderer.component';
import { CustomTooltipComponent } from 'src/app/renderer/customtooltip.component';
import { FileRendererComponent } from 'src/app/renderer/file-renderer.component';
import { CommonService } from 'src/app/Service/common.service';
import { GrncrnService } from 'src/app/Service/grncrn.service';
import { MaterialMovementService } from 'src/app/Service/material-movement.service';
import { PurchaseOrderService } from 'src/app/Service/purchase-order.service';
import { SearchpanelService } from 'src/app/Service/searchpanel.service';
import { ApprovelStatusModel, CommonStaticClass, CompanyStateVendorItemModel, DropdownModel, MenuName, PageActivity, ReasonActivity, TransPortModeType, UserRole, WebErrorLogModel } from 'src/app/_Model/commonModel';
import { DISearchModel, DispatchMultiSite, DispatchTrackingItemDetialModel, DispatchTrackingModel, MultiSite, SearchDispatchTrackerModel, SRNInstructionSearchModel } from 'src/app/_Model/DispatchModel';
import { SiteCustomerAutoModel } from 'src/app/_Model/grncrnModel';
import { CellNo, DownLoadZipFileDetial, DynamicItemGrid, DynamicWHAddress, GSerialNumber, VendorOrWhModel } from 'src/app/_Model/purchaseOrderModel';
import { CompanyModel } from 'src/app/_Model/userModel';
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { DomSanitizer } from '@angular/platform-browser';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { IfStmt } from '@angular/compiler';
import { GlobalErrorHandlerServiceService } from 'src/app/Service/global-error-handler-service.service';
import { approvalTooltipComponent } from 'src/app/renderer/Approvaltooltip.component';
import { ApprovalrendererComponent } from 'src/app/renderer/approvalrenderer/approvalrenderer.component';
import { first } from 'rxjs/operators';
import { SrnPdfServiceService } from 'src/app/Service/srn-pdf-service.service';
import * as JSZip from 'jszip';
import * as FileSaver from 'file-saver';
pdfMake.vfs = pdfFonts.pdfMake.vfs;
var PDFdata = null;
declare var jQuery: any;
import * as XLSX from 'xlsx';
import { SiteServiceService } from 'src/app/Service/site-service.service';
import { BOQNOListModel } from 'src/app/_Model/BOQRequestModel';
import { BOQRequestequestService } from 'src/app/Service/boqrequestequest.service';
import { AgGridCheckboxComponent } from 'src/app/renderer/ag-grid-checkbox/ag-grid-checkbox.component';
import { UserPageRight } from 'src/app/_Model/UserRoleButtonModel';

@Component({
  selector: 'app-srn',
  templateUrl: './srn.component.html',
  styleUrls: ['./srn.component.sass'],
  providers: [DatePipe]
})
export class SrnComponent implements OnInit {
  model: any = {};
  apiCSVIData: any = {};
  dynamicArray: Array<DynamicItemGrid> = [];
  ReceiveddynamicArray: Array<DynamicItemGrid> = [];
  dynamicArrayDispatchPdf: Array<DynamicItemGrid> = [];
  objDynamicWHAddress: Array<DynamicWHAddress> = [];
  public isShownList: boolean; // Grid List
  public isShownEdit: boolean; // Form Edit
  public SingledropdownSettings = {};
  public multiSortKey: string;
  public columnDefs = [];
  rowData = [];
  CheckData = [];
  CompanyData = [];
  SearchStateList = [];
  SearchVendorList = [];
  SearchItemNameList = [];
  WHStateList = [];
  SiteStateList = [];
  VendorStateList = [];
  UserId: any;
  CompanyId: any;
  EditWHList = [];
  SelectedEditVendorList = [];
  keyword = 'SiteName';
  AutoCompleteSiteCustomerList = [];
  CustomerSitekeyword = 'CustomerSiteId';
  AutoCompleteCustomerSiteIdList = [];
  UniqueSitekeyword = 'SiteId';
  AutoCompleteUniqueSiteIdList = [];
  totalSumQuantity: any;
  totalSumAmount: any;
  totalSumPOQuantity: any;
  StateCodeWhAd = [];
  DispatchTrackingItem = [];
  IsTransferTypeSite: boolean;
  ValidationerrorMessage: string;
  IsTransferTypeOtherSite: boolean;
  IsRecivedbyandNoOther: boolean;
  IsRecivedbyandNo: boolean;
  IsTaxInvoiceNo: boolean;
  IsDisabledPreviewGenratebutton: boolean;
  IsSaveButtonDisable: boolean;
  IsBiltyValidationShowandhide: boolean = false;
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
  TableHeight: any;
  DocumentFile: any;
  RecevingDocumentFile: any;
  closeResult: string;
  @ViewChild("content") modalContent: TemplateRef<any>;
  EwayBillDocumentFile: any;
  VechileTypeData: any;
  TransModeDataList: any;
  VechileTypeDataList: any;
  TransferDataList: any;
  PdfStateCodeWhAd: any;
  GRfileDocumentFile: any;
  IsTransferTypeSameState: boolean;
  IsTransferTypeOtherState: boolean;
  OtherSiteStateList: any;
  DataClientCodeList: any;
  StateGSTNo: any;
  ClientGSTNo: any;
  IsHideShowKgValue: boolean;
  @ViewChild("content") TestContent: TemplateRef<any>;
  TechDataList: any;
  COHDataList: any;
  ReceivingFile: any;
  GRFile: any;
  EwayBillfile: any;
  TaxInvoiceFile: any;
  IsReceivingFile: boolean;
  IsGRFile: boolean;
  IsEwayBillfile: boolean;
  IsTaxInvoiceFile: boolean;
  public loadingTemplate;
  ApprovalStatusDetail: any;
  ReasonDataList: any;
  ApproveStatusDataList: any;
  ApprovalList: any;
  CreateName: any;
  CreatedDate: any;
  ModifiedName: any;
  ModifiedDate: any;
  TableId: number;
  ManueId: any;
  PageMenuId: any = 8;
  ArrayRoleId: any;
  gridApi: any;
  IsApprovalstatusbtnhideShow: boolean;
  ValidationtotalSumAmount: number;
  TransporterTypeDetail: any;
  IsTransporter: boolean;
  IsTransporterReadonly: boolean;
  ItemReasonData: any;
  UserName: any;
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
  loading: boolean = false;
  WareHouseId: any;
  ClientList: any;
  SRNNokeyword = 'SRNNo';
  AutoCompleteSRNNoList: any;
  IsSRNNoShowAndHide: boolean;
  IsReadonlyField: boolean;
  SRNDocumentFile: any;
  SRNRecivedtable: boolean;
  totalSumReceivedPOQuantity: any;
  totalSumReceivedAmount: any;
  ItemAddrowhideshow: boolean = true;
  IsItemListDisabled: boolean = false;
  IsDisbaledWHDetail: boolean;
  IsHideShowCancelBtn: boolean = false;
  IsReceivedHideShow: boolean = false;
  UserRoleId: any;
  CancelReasonData: any;
  IsCancelButtonDisable: boolean;
  IsReceivingField: boolean = false;
  TransferSearchDataList: any;
  UnitList: any;
  SRNReasonTypeList: any;
  arry: any;
  IsPreviousSiteDataGrid: boolean = false;
  PreviousDatarowData: any;
  PreviousDatacolumnDefs: any;
  public loadingTemplate1;
  PreviousDataHistoryData: any;
  SearchCustomerData: any;
  SelectedSearchCustomerList: any[];
  public MultidropdownSettings = {};
  ReplaceUrl: any[];
  Downloadfile: any[];
  Exportloading: boolean;
  @ViewChild('inputExcelOther', { static: false })
  inputExcelOther: ElementRef;
  @ViewChild('inputExcelBB', { static: false })
  inputExcelBB: ElementRef;
  min: { year: any; month: any; day: number; };
  IsSRNPreview: boolean;
  SRNEditUserRoleId: any;
  IsPreviewhideandShow: boolean;
  CorrectionItemCodeList: any;
  CorretionEntryReasonDetail: any;
  Correctioncolumnhideandshow: boolean;
  RoleCorrectionEntry: boolean = false;
  IsByHand: boolean;
  IsBus: boolean;
  IsCourier: boolean;
  IsOther: boolean;
  IsVehicleType: boolean;
  IsVehicleValidationHideShow: boolean;
  IsValidationShowandhide: boolean;
  IsSrnDocumentFile: boolean;
  SrnDocumentFile: any;
  MultiSite: any[];
  @ViewChild('inputExcelMultisite', { static: false })
  inputExcelMultisite: ElementRef;
  AddMultiSite: any;
  CourierTypeDetail: any;
  TransporterAndCourierTypeDetail: any;
  IsPartialUpDateSRNRequest: boolean;
  SearchSitesPanelData: any;
  DispatchInstructionList: any[] = [];
  //SRNEditInstructionId: any;
  CreateDispatchForDIId: string;
  IsSRNInstraction: boolean;
  SRNWHId: any;
  selectedDIArr: any[] = [];
  ObjUserPageRight = new UserPageRight();
  Save: any;
  SrnId: number = 0;
  AutoCompleteDispatchNoList: any; //vishal, 04/02/2023
  DocumentNokeyword = 'DocumentNo';

  constructor(private router: Router, private _Commonservices: CommonService, private _SrnPdfServiceService: SrnPdfServiceService,
    private _PurchaseOrderService: PurchaseOrderService, private _GrncrnService: GrncrnService,
    private _MaterialMovementService: MaterialMovementService,
    private _objSearchpanelService: SearchpanelService, private Loader: NgxSpinnerService,
    private sanitizer: DomSanitizer, private _GlobalErrorHandlerService: GlobalErrorHandlerServiceService,
    private datePipe: DatePipe, private modalService: NgbModal, private _SiteServiceService: SiteServiceService, private _BOQService: BOQRequestequestService) {
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
    this.model.TransporterId = "";
    this.model.SRNFrom = "0";
    this.model.SRNType = 0;
    this.model.ReasonId = "0"
    this.model.IsActiveCancel = 2;
    this.model.CustomerId = "0";
    this.isShownList = false;
    this.isShownEdit = true;
    this.IsSRNPreview = true;
    var objUserModel = JSON.parse(sessionStorage.getItem("UserSession"));
    this.UserId = objUserModel.User_Id;
    this.UserName = objUserModel.UserName;
    this.IsApprovalstatusbtnhideShow = false;
    this.ArrayRoleId = objUserModel.Role_Id.split(',');

    for (var i = 0, len = this.ArrayRoleId.length; i < len; i++) {
      if (this.ArrayRoleId[i] == UserRole.UserRoleId || this.ArrayRoleId[i] == UserRole.SCMHo) {
        this.UserRoleId = this.ArrayRoleId[i];
      } else if (this.ArrayRoleId[i] == "14") {
        this.SRNEditUserRoleId = this.ArrayRoleId[i];
      } else if (this.ArrayRoleId[i] == UserRole.SRNCorrectionEntryRole) {
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
          onClick: this.ShowSRNDetail.bind(this),
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
        headerName: 'SRN File',
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
        width: 60,
        filter: false,
      },
      { headerName: 'SRN Status', field: 'SrnStatus', width: 120, resizable: true },
      { headerName: 'SRN No', field: 'DocumentNo', width: 150, resizable: true },
      { headerName: 'SRN Date', field: 'DocumentDate', width: 120, sortable: true },
      { headerName: 'Equp.Type', field: 'EqupmentType', width: 150, filter: false, resizable: true },
      { headerName: 'Item Name', field: 'ItemName', width: 150, resizable: true },
      { headerName: 'Item Description', field: 'ItemDescription', tooltipField: 'ItemDescription', tooltipComponent: 'customtooltip', width: 150, resizable: true },
      { headerName: 'Qty', field: 'Quantity', width: 80 },
      { headerName: 'Customer Name', field: 'CustomerName', width: 150, resizable: true },
      { headerName: 'Site ID', field: 'CustomerSiteId', width: 100, resizable: true },
      { headerName: 'SiteName', field: 'SiteName', width: 150 },
      { headerName: 'Cancel by', field: 'CancelBy', width: 100 },
      { headerName: 'Cancel Date', field: 'CancelDate', width: 100 },
      // { headerName: 'Cancel Reason', field: 'CancelReason', width: 100 },
      // { headerName: 'SRN To', field: 'DispatchTo', width: 150, filter: false },
      // { headerName: 'GR No', field: 'GRNo', width: 150 },
      // { headerName: 'GR Date', field: 'GRDate', width: 150 },
      // { headerName: 'Destination', field: 'Destination', width: 150 },
      // { headerName: 'Gross Total', field: 'GrossTotal', width: 120 },
    ];
    this.multiSortKey = 'ctrl';

    this.SingledropdownSettings = {
      singleSelection: true,
      text: "Select",
      unSelectAllText: 'UnSelect All',
      enableSearchFilter: true,
      badgeShowLimit: 1,
    };
    this.MultidropdownSettings = {
      singleSelection: false,
      text: "Select",
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      enableSearchFilter: true,
      // limitSelection:1
      badgeShowLimit: 1,
    };
    this.loadingTemplate =
      `<span class="ag-overlay-loading-center">loading...</span>`;
    this.loadingTemplate1 =
      `<span class="ag-overlay-loading-center">loading...</span>`;
    this.GettAllVechTransModeTransfertypeDispatch();
    this.SRNItemReason();
    setTimeout(() => {
      this.BindTransporterTypeDetail();
    }, 100);
    // this.SRNRecivedtable=true;
    //this.generatePDF('open');
    this.ItemReason();
    this.GetCustomerName();
    const current = new Date();
    this.min = {
      year: current.getUTCFullYear(),
      month: current.getMonth() + 1,
      day: current.getDate() - 7
    };
    this.BindCorrectionentryReason();
    //brahamjot kaur 15/7/2022
    this.CreateDispatchForDIId = "0";
    this.CreateDispatchForDIId = localStorage.getItem('DIRequestId');
    if (this.CreateDispatchForDIId != "0" && this.CreateDispatchForDIId != null) {
      setTimeout(() => {
        this.CreateNew();
        localStorage.removeItem('DIRequestId');
      }, 1000);
    }
    //brahamjot kaur 31/10/2022
    this.GetUserPageRight(this.SrnId);
  }

  //brahamjot kaur 31/10/2022
  async GetUserPageRight(id: number) {
    this._Commonservices.GetUserPageRight(this.UserId, MenuName.SRN).subscribe(data => {
      if (data.Status == 1) {
        //console.log(data);
        this.ObjUserPageRight.IsSearch = data.Data[0].IsSearch;
        this.ObjUserPageRight.IsExport = data.Data[0].IsExport;
        this.ObjUserPageRight.IsCreate = data.Data[0].IsCreate;
        this.ObjUserPageRight.IsBulkPdfDwnload = data.Data[0].IsBulkPdfDwnload;
        this.ObjUserPageRight.IsGenPdf = data.Data[0].IsGenPdf;
        this.ObjUserPageRight.IsDelete = data.Data[0].IsDelete;
        this.ObjUserPageRight.IsEdit = data.Data[0].IsEdit;
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

  //#region Dispatch
  PreviewSRN() {
    this.IsSRNPreview = false;
    this.isShownList = true;
    this.isShownEdit = true;
    this.model.PreviewDispatchDate = this._Commonservices.ConvertDateFormat(this.model.DocumentDate);
    this.model.PreviewGRDate = this._Commonservices.ConvertDateFormat(this.model.GRDate);
    this.model.PreviewTaxInvoiceDate = this._Commonservices.ConvertDateFormat(this.model.TaxInvoiceDate); //vishal, 03/12/2022
    this.model.PreviewExpectedDate = this._Commonservices.ConvertDateFormat(this.model.ExpectedDate);
    //this.model.PreviewDispatchDate = this._Commonservices.ConvertDateFormat(this.model.DispatchDate);
    this.model.PreviewLRDate = this._Commonservices.ConvertDateFormat(this.model.LRdate);

  }

  BackPreviewSRN() {
    this.IsSRNPreview = true;
    this.isShownList = true;
    this.isShownEdit = false;
  }
  //#endregion

  // Open for popup
  showModal(value: number, index: number): void {
    this.indexv = index;
    var qty = this.ReceiveddynamicArray[index].ReceivedQty;
    var unitTag = this.ReceiveddynamicArray[this.indexv].UnitName;
    var ItemNameId = this.ReceiveddynamicArray[this.indexv].ItemNameId

    // validation on ItemName
    if (this._Commonservices.checkUndefined(ItemNameId) == "" || this._Commonservices.checkUndefined(ItemNameId) == '0' || this._Commonservices.checkUndefined(ItemNameId) == '0.00') {
      this.ValidationerrorMessage = "Please select item name.";
      jQuery('#Validationerror').modal('show');
      return;
    }

    // validation on Qty
    if (this._Commonservices.checkUndefined(qty) == "" || this._Commonservices.checkUndefined(qty) == '0' || this._Commonservices.checkUndefined(qty) == '0.00') {
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

  // show model for AC/DG etc except the BB.
  genrateOther(index: any) {
    this.srnlst = [];
    this.ReceiveddynamicArray[index].InitiallValue = ''
    this.ReceiveddynamicArray[index].lastValue = ''
    for (var i = 0; i < parseInt(this.ReceiveddynamicArray[index].ReceivedQty); i++) {
      var srnData = new GSerialNumber();
      if (this.ReceiveddynamicArray[index].GSerialNumbers.length > i) {
        srnData.InitialSrno = this.ReceiveddynamicArray[index].GSerialNumbers[i].InitialSrno;
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

    // for (var i = 0;i < this.ReceiveddynamicArray[this.indexv].GSerialNumbers.length ; i++) {
    //    SerialNo = this.ReceiveddynamicArray[this.indexv].GSerialNumbers[i].InitialSrno;
    //   debugger
    //   if(SerialNo==null || SerialNo.trim()==""){
    //     alert("Please enter serialno");
    //     return false;
    //   }else if(SerialNo.length<4){
    //     alert("Please enter serialno minimum 4-digits.("+SerialNo+")");
    //     return false;
    //   }
    // }

    this.ReceiveddynamicArray[this.indexv].GSerialNumbers = this.srnlst;
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
    var cellVoltId = this.ReceiveddynamicArray[this.indexv].ItemId;
    const result = this.ReceiveddynamicArray[this.indexv].EditItemCode.filter(element => {
      return element.id === parseInt(cellVoltId);
    });
    var cellVolt = result[0].CellVolt;
    value = value / cellVolt;
    for (var i = 0; i < parseInt(this.ReceiveddynamicArray[this.indexv].ReceivedQty); i++) {
      var srnData = new GSerialNumber();
      for (var j = 0; j < value; j++) {
        var oc = new CellNo();
        oc.Sequance = i.toString();
        var celllength = this.ReceiveddynamicArray[this.indexv].GSerialNumbers.length;
        if (celllength > i) {
          // Error Comming
          oc.CellValue = this.ReceiveddynamicArray[this.indexv].GSerialNumbers[i].CellNos[j].CellValue;
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
    //this.ReceiveddynamicArray[this.indexv].GSerialNumbers = this.srnlst;
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
      let BB_SerialArr = []
      for (var j = 0; j < this.srnlst.length; j++) {
        for (var i = 0; i < this.srnlst[j].CellNos.length; i++) {
          var oc = new CellNo();
          BB_SerialArr.push(this.srnlst[j].CellNos[i].CellValue); // by hemant tygai
        }
      }

      let SerialNo = "";
      let isDup = false
      let uniq_values = []
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
      this.ReceiveddynamicArray[this.indexv].GSerialNumbers = this.srnlst;
      this.hidebbModal();
    } catch (error) {
      alert(error)
    }
  }

  // hide  BB model on cancel
  hidebbModal(): void {
    // if(this.isEdit==false)
    // {
    //   this.srnlst=[];
    // }
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
    var returnValue = 0;
    for (var i = 0; i < this.ReceiveddynamicArray.length; i++) {
      var ItemNameId = this.ReceiveddynamicArray[i].ItemNameId
      const result = this.SearchItemNameList.filter(element => {
        return element.id === parseInt(ItemNameId);
      });
      var itmName = result[0].itemName;
      if (this.IsMandatory(i) == true) {
        //let srnlength = this.ReceiveddynamicArray[i].GSerialNumbers.length;        
        if (this.ReceiveddynamicArray[i].GSerialNumbers.length != this.ReceiveddynamicArray[i].ReceivedQty) {
          returnValue = 1;
          this.IsError = true;
          this.errorMessage = "Serial-No (" + parseInt(this.ReceiveddynamicArray[i].ReceivedQty) + " -Qty) is required for " + itmName + " ";
        }
      }
    }
    return returnValue;
  }

  IsMandatory(index: any) {
    var ItemNameId = this.ReceiveddynamicArray[index].ItemNameId
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
      let ExeclImportData: any[];
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
              //this.myInputVariable.nativeElement.value = '';
              return false;
            }
          }
          // headers.push(hdr);
        }

        //this.indexv
        ExeclImportData = <AOA>(XLSX.utils.sheet_to_json(ws, { raw: true }));
        if (ExeclImportData.length > 0 && ExeclImportData != null) {
          if (this.ReceiveddynamicArray[this.indexv].ItemNameId == '4' && this.ReceiveddynamicArray[this.indexv].UnitName == '8') {
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
    if (this.ReceiveddynamicArray[this.indexv].ItemNameId == '4' && this.ReceiveddynamicArray[this.indexv].UnitName == '8') {
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


  ////change Ravinder
  SRNItemReason() {
    try {
      var objdropdownmodel = new DropdownModel();
      objdropdownmodel.User_Id = 0;
      objdropdownmodel.Parent_Id = "1493";
      objdropdownmodel.Company_Id = this.CompanyId;
      objdropdownmodel.Other_Id = "0";
      objdropdownmodel.Flag = 'CommonReason';
      this._Commonservices.getdropdown(objdropdownmodel).pipe(first()).subscribe(item => {
        this.ItemReasonData = item.Data
      }, error => {
        this._Commonservices.ErrorFunction(this.UserName, error.message, "SRNItemReason", "SRN");
      });
    } catch (Error) {
      this._Commonservices.ErrorFunction(this.UserName, Error.message, "SRNItemReason", "SRN");
    }

  }
  ///end
  ItemReason() {
    try {
      var objdropdownmodel = new DropdownModel();
      objdropdownmodel.User_Id = 0;
      objdropdownmodel.Parent_Id = "1502"; //1542 Local k live
      objdropdownmodel.Company_Id = this.CompanyId;
      objdropdownmodel.Other_Id = "0";
      objdropdownmodel.Flag = 'CommonReason';
      this._Commonservices.getdropdown(objdropdownmodel).pipe(first()).subscribe(item => {
        this.CancelReasonData = item.Data
      }, error => {
        this._Commonservices.ErrorFunction(this.UserName, error.message, "SrnItemReason", "SRN");
      });
    } catch (Error) {
      this._Commonservices.ErrorFunction(this.UserName, Error.message, "SrnItemReason", "SRN");
    }
  }

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
          if (data.TransferSRNData != null && data.TransferSRNData != "") {
            this.TransferDataList = data.TransferSRNData;
            this.TransferSearchDataList = data.TransferSRNData;
          } if (data.SRNReasonTypeData != null && data.SRNReasonTypeData != "") {
            this.SRNReasonTypeList = data.SRNReasonTypeData;
          }
        }
      }, error => {
        this._Commonservices.ErrorFunction(this.UserName, error.message, "GettAllVechTransModeTransfertypeDispatch", "SRN");
      });
    } catch (Error) {
      this._Commonservices.ErrorFunction(this.UserName, Error.message, "GettAllVechTransModeTransfertypeDispatch", "SRN");
    }
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
      objCSVTdata.ClientArray = this.apiCSVIData.ClientArray;
      this.WareHouseId = this.apiCSVIData.WHId;
      this.CompanyData = objCSVTdata.CompanyArray;
      this.SearchStateList = objCSVTdata.StateArray;
      this.WHStateList = objCSVTdata.StateArray;
      this.SiteStateList = objCSVTdata.StateArray;
      this.SearchItemNameList = objCSVTdata.ItemArray;
      this.EquipmentTypeList = objCSVTdata.EquipmentArray;
      this.ClientList = objCSVTdata.ClientArray;
      //sessionStorage.setItem("CompStatVenItmSession", JSON.stringify(objCSVTdata));
    }
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
        this._Commonservices.ErrorFunction(this.UserName, error.message, "BindTransporterTypeDetail", "SRN");
      });
    } catch (Error) {
      this._Commonservices.ErrorFunction(this.UserName, Error.message, "BindTransporterTypeDetail", "SRN");
    }
  }

  // ChangeTransporter(Id: any) {
  //   $("#txtTransporterId").css('border-color', '');
  //   if (Id == 1 || Id == "0") {
  //     // this.IsTransporter = true;
  //     // this.IsTransporterReadonly = false;
  //     this.model.TransporterName = "";
  //     this.model.TransporterGSTNo = "";
  //   } else {
  //     // this.IsTransporter = false;
  //     // this.IsTransporterReadonly = true;
  //     var TransPorterGst = this.TransporterTypeDetail.filter(
  //       m => m.id === parseInt(Id));
  //     this.model.TransporterGSTNo = TransPorterGst[0].GSTIN;
  //     this.model.TransporterName = TransPorterGst[0].TransporterName;
  //   }
  // }

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

  ChangeEditItemName(ItemNameId: any, index: any) {
    try {
      $('#tblOne > tbody  > tr').each(function () {
        var valueItem = $(this).find('.ItemName').val();
        if (valueItem != '0') {
          $(this).find('.ItemName').css('border-color', '');
        }
      });
      var FilterData = this.SearchItemNameList.filter(m => m.id === parseInt(ItemNameId));
      this.dynamicArray[index].ItemName = FilterData[0].itemName;
      var value = this._Commonservices.checkUndefined(this.PreviousDataHistoryData)
      if (value != '') {
        this.OpenPreviousHistoryPopup(ItemNameId)
      }
      this.IsHideShowKgValue = true;
      var ItemNameHSNCode = this.SearchItemNameList.filter(
        m => m.id === parseInt(ItemNameId));
      if (ItemNameHSNCode.length > 0) {
        this.dynamicArray[index].HSN = ItemNameHSNCode[0].HSNCode;
      } else {
        this.dynamicArray[index].HSN = "";
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
        this._Commonservices.ErrorFunction(this.UserName, error.message, "ChangeEditItemName", "SRN");
      });
    } catch (Error) {
      this._Commonservices.ErrorFunction(this.UserName, Error.message, "ChangeEditItemName", "SRN");
      //console.log(Error.message)
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
      var FilterData = this.dynamicArray[index].EditItemMake.filter(m => m.id === parseInt(ItemMakeId));
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
        this._Commonservices.ErrorFunction(this.UserName, error.message, "ChangeEditItemMake", "SRN");
      });
    } catch (Error) {
      this._Commonservices.ErrorFunction(this.UserName, Error.message, "ChangeEditItemMake", "SRN");
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
          this.dynamicArray[index].Qty = "0.00";
          this.dynamicArray[index].ConversionUnit = "";
          this.dynamicArray[index].HideConversionValue = "";
          this.dynamicArray[index].IsConversion = "";
          this.dynamicArray[index].HideShowConValue = false;
          //this.dynamicArray[index].UnitName = data.Data[0].UnitName;
        }
      }, error => {
        this._Commonservices.ErrorFunction(this.UserName, error.message, "ChangeEditItemCode", "SRN");
      });
    } catch (Error) {
      this._Commonservices.ErrorFunction(this.UserName, Error.message, "ChangeEditItemCode", "SRN");
    }
  }

  ChangeUnit(Id: any, index: any) {
    $('#tblOne > tbody  > tr').each(function () {
      var valueItem = $(this).find('.UnitName').val();
      if (valueItem != "0") {
        $(this).find('.UnitName').css('border-color', '');
      }
    });
    var FilterData = this.dynamicArray[index].UnitList.filter(m => m.Id === parseInt(Id));
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
      this.dynamicArray[index].Qty = "";
      this.dynamicArray[index].ConversionUnit = "";
      this.dynamicArray[index].HideConversionValue = "";
      this.dynamicArray[index].IsConversion = "";
      this.dynamicArray[index].ConversionValue = "";
    }
  }
  ChangeReceivedEditItemName(ItemNameId: any, index: any) {
    try {
      $('#tblOne > tbody  > tr').each(function () {
        var valueItem = $(this).find('.ItemName').val();
        if (valueItem != '0') {
          $(this).find('.ItemName').css('border-color', '');
        }
      });
      this.IsHideShowKgValue = true;
      var ItemNameHSNCode = this.SearchItemNameList.filter(
        m => m.id === parseInt(ItemNameId));
      if (ItemNameHSNCode.length > 0) {
        this.ReceiveddynamicArray[index].HSN = ItemNameHSNCode[0].HSNCode;
      } else {
        this.ReceiveddynamicArray[index].HSN = "";
      }
      this.ReceiveddynamicArray[index].EditItemMake = [];
      this.ReceiveddynamicArray[index].EditItemCode = [];
      var objdropdownmodel = new DropdownModel();
      objdropdownmodel.User_Id = 0;
      objdropdownmodel.Parent_Id = ItemNameId;
      objdropdownmodel.Company_Id = this.CompanyId;
      objdropdownmodel.Other_Id = "0";
      objdropdownmodel.Flag = 'ItemMake';
      this._Commonservices.getdropdown(objdropdownmodel).pipe(first()).subscribe(item => {
        console.log('1299', item)
        this.ReceiveddynamicArray[index].EditItemMake = item.Data;
        this.ReceiveddynamicArray[index].ItemMakeId = "0"
      }, error => {
        this._Commonservices.ErrorFunction(this.UserName, error.message, "ChangeReceivedEditItemName", "SRN");
      });
    } catch (Error) {
      this._Commonservices.ErrorFunction(this.UserName, Error.message, "ChangeReceivedEditItemName", "SRN");
      //console.log(Error.message)
    }
  }

  ChangeReceivedEditItemMake(ItemMakeId: any, ItemNameId: any, index: any) {
    try {
      $('#tblOne > tbody  > tr').each(function () {
        var valueItem = $(this).find('.ItemMake').val();
        if (valueItem != '0') {
          $(this).find('.ItemMake').css('border-color', '');
        }
      });
      var objdropdownmodel = new DropdownModel();
      objdropdownmodel.User_Id = 0;
      objdropdownmodel.Parent_Id = ItemNameId;
      objdropdownmodel.Other_Id = ItemMakeId;
      objdropdownmodel.Company_Id = this.CompanyId;
      objdropdownmodel.Flag = 'ItemCode';
      this.ReceiveddynamicArray[index].EditItemCode = [];
      this._Commonservices.getdropdown(objdropdownmodel).pipe(first()).subscribe(item => {
        this.ReceiveddynamicArray[index].EditItemCode = item.Data
        this.ReceiveddynamicArray[index].ItemId = "0";
      }, error => {
        this._Commonservices.ErrorFunction(this.UserName, error.message, "ChangeReceivedEditItemMake", "SRN");
      });
    } catch (Error) {
      this._Commonservices.ErrorFunction(this.UserName, Error.message, "ChangeReceivedEditItemMake", "SRN");
    }
  }

  ChangeReceivedEditItemCode(ItemId: any, index: any) {
    try {
      $('#tblOne > tbody  > tr').each(function () {
        var valueItem = $(this).find('.ItemCode').val();
        if (valueItem != '0') {
          $(this).find('.ItemCode').css('border-color', '');
        }
      });
      var objVendormodel = new VendorOrWhModel();
      objVendormodel.Id = ItemId;
      objVendormodel.flag = 'ItemMaster';
      this._Commonservices.getSrnRecivedVendorOrWh(objVendormodel).pipe(first()).subscribe(data => {
        this.ReceiveddynamicArray[index].ItemDescription = data.Data[0].ItemDescription;
        if (data.Data[0].UnitList.length == 1) {
          this.ReceiveddynamicArray[index].UnitList = data.Data[0].UnitList;
          this.ReceiveddynamicArray[index].UnitName = this.ReceiveddynamicArray[index].UnitList[0].Id;
        } else {
          this.ReceiveddynamicArray[index].UnitName = "0";
          this.ReceiveddynamicArray[index].UnitList = data.Data[0].UnitList;
        }
        if (data.Data[0].IsConversion != null && data.Data[0].IsConversion != 0) {
          this.ReceiveddynamicArray[index].HideShowConValue = true;
          this.ReceiveddynamicArray[index].ConversionUnit = data.Data[0].ConversionUnit;
          this.ReceiveddynamicArray[index].IsConversion = data.Data[0].IsConversion
          this.ReceiveddynamicArray[index].HideConversionValue = data.Data[0].ConversionValue;
          this.ReceiveddynamicArray[index].ChangeUnitConversionUnit = data.Data[0].ConversionUnit;
          this.ReceiveddynamicArray[index].ChangeUnitIsConversion = data.Data[0].IsConversion
          this.ReceiveddynamicArray[index].ChangeUnitHideConversionValue = data.Data[0].ConversionValue;
        } else {
          this.ReceiveddynamicArray[index].ReceivedQty = "";
          this.ReceiveddynamicArray[index].ConversionUnit = "";
          this.ReceiveddynamicArray[index].HideConversionValue = "";
          this.ReceiveddynamicArray[index].IsConversion = "";
          this.dynamicArray[index].ChangeUnitConversionUnit = "";
          this.dynamicArray[index].ChangeUnitIsConversion = "";
          this.dynamicArray[index].ChangeUnitHideConversionValue = "";
          this.ReceiveddynamicArray[index].HideShowConValue = false;
          //this.ReceiveddynamicArray[index].UnitName = data.Data[0].UnitName;
        }
      }, error => {
        this._Commonservices.ErrorFunction(this.UserName, error.message, "ChangeReceivedEditItemCode", "SRN");
      });
    } catch (Error) {
      this._Commonservices.ErrorFunction(this.UserName, Error.message, "ChangeReceivedEditItemCode", "SRN");
    }
  }

  ChangeReceivedUnit(Id: any, index: any) {
    $('#tblOne > tbody  > tr').each(function () {
      var valueItem = $(this).find('.UnitName').val();
      if (valueItem != "0") {
        $(this).find('.UnitName').css('border-color', '');
      }
    });
    if (Id == 2 && this.ReceiveddynamicArray[index].ItemNameId == CommonStaticClass.MSTItemNameId) {
      this.ReceiveddynamicArray[index].HideShowConValue = false;
      this.ReceiveddynamicArray[index].ReceivedQty = "";
      this.ReceiveddynamicArray[index].ConversionUnit = "";
      this.ReceiveddynamicArray[index].HideConversionValue = "";
      this.ReceiveddynamicArray[index].IsConversion = "";
    } else if (Id == 8 && this.ReceiveddynamicArray[index].ItemNameId == CommonStaticClass.MSTItemNameId) {
      this.ReceiveddynamicArray[index].HideShowConValue = true;
      this.ReceiveddynamicArray[index].ReceivedQty = "";
      this.ReceiveddynamicArray[index].ConversionUnit = "";
      this.ReceiveddynamicArray[index].HideConversionValue = "";
      this.ReceiveddynamicArray[index].IsConversion = "";
      this.ReceiveddynamicArray[index].ConversionValue = "";
      this.ReceiveddynamicArray[index].ConversionUnit = this.ReceiveddynamicArray[index].ChangeUnitConversionUnit;
      this.ReceiveddynamicArray[index].IsConversion = this.ReceiveddynamicArray[index].ChangeUnitIsConversion;
      this.ReceiveddynamicArray[index].HideConversionValue = this.ReceiveddynamicArray[index].ChangeUnitHideConversionValue;
    } else {
      this.ReceiveddynamicArray[index].HideShowConValue = false;
      this.ReceiveddynamicArray[index].ReceivedQty = "0.00";
      this.ReceiveddynamicArray[index].ConversionUnit = "";
      this.ReceiveddynamicArray[index].HideConversionValue = "";
      this.ReceiveddynamicArray[index].IsConversion = "";
      this.ReceiveddynamicArray[index].ConversionValue = "";
    }

  }


  ChangeEqupmnet(ItemId: any, index: any) {
    try {
      $('#tblOne > tbody  > tr').each(function () {
        var valueItem = $(this).find('.EqType').val();
        if (valueItem != '0') {
          $(this).find('.EqType').css('border-color', '');
        }
      });
      var FilterData = this.EquipmentTypeList.filter(m => m.id === parseInt(ItemId));
      this.dynamicArray[index].EqpType = FilterData[0].itemName;
    } catch (Error) {
      console.log(Error.message)
    }
  }

  ClickReceivedInWH(ReceivedInWH: any, index: any) {
    $('#tblOne > tbody  > tr').each(function () {
      var valueItem = $(this).find('.ReceivedQty').val();
      if (valueItem == "") {
        $(this).find('.ReceivedQty').css('border-color', '');
      }
      var valueItem1 = $(this).find('.ReasonId').val();
      if (valueItem1 == '0') {
        $(this).find('.ReasonId').css('border-color', '');
      }
      var valueItem2 = $(this).find('.Remarks').val();
      if (valueItem2 == '') {
        $(this).find('.Remarks').css('border-color', '');
      }
    });
  }

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
      } else {
        objdropdownmodel.Other_Id = "0";
      }
      objdropdownmodel.Flag = 'WHMaster';
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
        this._Commonservices.ErrorFunction(this.UserName, error.message, "BindEditWHList", "SRN");
      });
    } catch (Error) {
      this._Commonservices.ErrorFunction(this.UserName, Error.message, "BindEditWHList", "SRN");
    }
  }

  BindVendorOrWhAddess(para: string, val: string): void {
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
      }
      var objVendormodel = new VendorOrWhModel();
      objVendormodel.flag = para;
      if (para == "vendor") {
        objVendormodel.Id = VendorId;
      } else if (para == "WHMaster") {
        objVendormodel.Id = val;
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
            this.model.Destination = data.Data[0].StateName;
          }
        } else {
          if (para == "vendor") {
            this.model.VendorAddress = "";
          } else if (para == "WHMaster") {
            this.model.WHAddress = "";
          }
        }
      }, error => {
        this._Commonservices.ErrorFunction(this.UserName, error.message, "BindVendorOrWhAddess", "SRN");
      });
    } catch (Error) {
      this._Commonservices.ErrorFunction(this.UserName, Error.message, "BindVendorOrWhAddess", "SRN");
    }
  }

  OnEditVenItemDeSelect(item: any) {
    this.model.VenStateCode = "";
    this.SelectedEditVendorList = [];
    this.model.VendorName = "";
    this.model.VenGSTIN = "";
    this.model.VendorAddress = "";
  }

  onEditVenDeSelectAll(items: any) {
    this.model.VenStateCode = "";
    this.SelectedEditVendorList = [];
    this.model.VendorName = "";
    this.model.VenGSTIN = "";
    this.model.VendorAddress = "";
  }

  onSelectAll(items: any) {
    //console.log(items);
  }

  onItemSelect(item: any) {
    //console.log(item);
  }

  onfiledownload(e) {
    window.open(e.rowData.DocumentFile);
  };
  onbiltyfiledownload(e) {
    window.open(e.rowData.DocumentFile);
  }

  RecDocumentfiledownload(e) {
    window.open(e.rowData.ReceivingDocumentFile);
  }

  PreviousGridReady(params) {
    this.gridApi.hideOverlay();
  }
  ngModelChangeVendor(event): void {
    $('#TxtToVendorCode .selected-list .c-btn').attr('style', 'border-color: ');
    var objVendormodel = new VendorOrWhModel();
    objVendormodel.Id = this.SelectedEditVendorList[0].id;
    objVendormodel.flag = 'vendor';
    this._Commonservices.getVendorOrWh(objVendormodel).pipe(first()).subscribe(data => {
      if (data.Data != null && data.Data != "") {
        this.model.VendorName = data.Data[0].VendorName;
        this.model.VendorAddress = data.Data[0].VendorAddress;
        this.model.VenGSTIN = data.Data[0].GSTINNo;
        this.model.VenStateName = data.Data[0].StateName;
        this.model.Destination = data.Data[0].StateName;
        //  this.model.VenStateCode=data.Data[0].VenStateCode;
      }
    }, error => {
      this._Commonservices.ErrorFunction(this.UserName, error.message, "ngModelChangeVendor", "SRN");
    });

  }

  BindStateCodeWHAdd(StateId: any) {
    this.ChangeTransporter(1)
    //this.BindTransporterTypeDetail();
    $("#txtddlStateId").css('border-color', '');
    try {
      var StateId = this._Commonservices.checkUndefined(StateId);
      var objdropdownmodel = new DropdownModel();
      objdropdownmodel.User_Id = 0;
      objdropdownmodel.Company_Id = this.CompanyId;
      if (StateId != '') {
        objdropdownmodel.Other_Id = StateId;
      } else {
        objdropdownmodel.Other_Id = "0";
      }
      objdropdownmodel.Flag = '0';
      this.StateCodeWhAd = [];
      var SearchStateName = this.SearchStateList.filter(m => m.id === parseInt(StateId));
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
            this.model.Destination = data.WHData[0].WHName;
          } else {
            this.EditWHList = data.WHData;
            this.model.ShippedWHAddress = "";
          }

        }
      }, error => {
        this._Commonservices.ErrorFunction(this.UserName, error.message, "BindStateCodeWHAdd", "SRN");
      });
    } catch (Error) {
      this._Commonservices.ErrorFunction(this.UserName, Error.message, "BindStateCodeWHAdd", "SRN");
    }

  }

  BindShippedWhAddess(WhId: any) {
    this.model.ShippedWHAddress = null;
    $("#txtShippedfromWHId").css('border-color', '');
    var ShippedWhAddess = this.EditWHList.filter(
      m => m.Id === parseInt(WhId));
    this.model.ShippedWHAddress = ShippedWhAddess[0].WHAddress;
    this.model.PreviewWHName = ShippedWhAddess[0].WHName;
    this.model.Destination = ShippedWhAddess[0].WHName;
    this.GetAllDispatchInstructionNo(WhId);
  }

  ChangeVendorState(StId: any) {
    this.model.VenStateCode = "";
    this.SelectedEditVendorList = [];
    this.model.VendorName = "";
    this.model.VenGSTIN = "";
    this.model.VendorAddress = "";
    $("#txtTOVenderStateId").css('border-color', '');
    this.SearchVendorListById = this.SearchVendorList.filter(
      m => m.State_Id === parseInt(StId));
  }

  onFocused(e) {
  }

  onChangeSearchCustomerSiteId(val: string) {
    try {
      if (this.model.TransferTypeId == PageActivity.Srn_SiteWithinState) {
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
        })
      }
      else if (this.model.TransferTypeId == PageActivity.Srn_SiteOtherState) {
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
        this._GrncrnService.GetAutoCompleteSiteAndCustomer(objSiteCustomerAutoModel).subscribe((data) => {
          this.AutoCompleteCustomerSiteIdList = data.Data;
        }, error => {
          this._Commonservices.ErrorFunction(this.UserName, error.message, "onChangeSearchCustomerSiteId", "SRN");
        });
      }
    } catch (Error) {
      this._Commonservices.ErrorFunction(this.UserName, Error.message, "onChangeSearchCustomerSiteId", "SRN");
    }
  }

  onChangeSearchUniqueSiteId(val: string) {
    try {
      if (this.model.TransferTypeId == PageActivity.Srn_SiteWithinState) {
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
        })
      }
      else if (this.model.TransferTypeId == PageActivity.Srn_SiteOtherState) {
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
        this._GrncrnService.GetAutoCompleteSiteAndCustomer(objSiteCustomerAutoModel).subscribe((data) => {
          if (data.Data != "") {
            this.AutoCompleteUniqueSiteIdList = data.Data;
          }
        }, error => {
          this._Commonservices.ErrorFunction(this.UserName, error.message, "onChangeSearchUniqueSiteId", "SRN");
        });
      }
    } catch (Error) {
      this._Commonservices.ErrorFunction(this.UserName, Error.message, "onChangeSearchUniqueSiteId", "SRN");
    }
  }

  SelectCustomerSiteId(items) {
    this.model.CuValueSiteId = items.CustomerSiteId;
    this.model.SiteName = items.SiteName;
    this.model.SiteAddress = items.Address;
    this.model.SiteId = items.Id;
    this.model.CuUniqueSiteId = items.Id;
    this.model.HideCustomerId = items.CustomerSiteId;
    this.model.ClientName = items.ClientName;
    //this.model.ToSiteWHGSTIN=items.GSTNo;
    this.ClientGSTNo = items.GSTNo;
    this.ChangeSite();
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
    this.TechDataList = null;
    this.COHDataList = null;
    this.model.SiteName = "";
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
    this.model.ToSiteWHGSTIN = this.StateGSTNo;
    this.ClientGSTNo = null;
    // this.model.ToSiteWHGSTIN="";
  }

  SelectSiteName(item) {
    this.model.SiteAddress = item.Address
    this.model.SiteId = item.Id;
    this.model.CustomerSiteId = item.CustomerSiteId;
  }

  ChangeSite() {
    try {
      var objdropdownmodel = new DropdownModel();
      objdropdownmodel.User_Id = this.UserId;
      objdropdownmodel.Parent_Id = this.model.SiteId;
      objdropdownmodel.Other_Id = this.model.ShippedfromWHId;
      objdropdownmodel.Company_Id = this.CompanyId;
      objdropdownmodel.Flag = 'Dispatch';
      this._MaterialMovementService.GetAllPreviousDataBySiteId(objdropdownmodel).pipe(first()).subscribe(data => {
        if (data.Data != null && data.Data != '') {
          this.PreviousDataHistoryData = data.Data;
        }
      }, error => {
        this._Commonservices.ErrorFunction(this.UserName, error.message, "GetAllPreviousDataBySiteId", "WHTOSite");
      });
    } catch (Error) {
      this._Commonservices.ErrorFunction(this.UserName, Error.message, "GetAllPreviousDataBySiteId", "WHTOSite");
    }


  }

  OpenPreviousHistoryPopup(value: any) {
    var PreviousHistoryData = null;
    var value1 = this._Commonservices.checkUndefined(this.PreviousDataHistoryData)
    if (value1 != '') {
      PreviousHistoryData = this.PreviousDataHistoryData.filter(
        m => m.ItemMaster_Id === parseInt(value));
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
    this.OpenPreviousHistoryPopup(Id);
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
  CreateNew(Id?: any) {
    this.IsPreviewhideandShow = true;
    this.IsError = false;
    this.IsSuccess = false;
    this.isShownList = true;
    this.isShownEdit = false;
    this.IsTransferTypeSite = false;
    this.IsTaxInvoiceNo = false;
    this.IsPartialUpDateSRNRequest = false;
    this.IsBiltyValidationShowandhide = false;
    this.IsRecivedbyandNo = false;
    this.IsRecivedbyandNoOther = true;
    this.IsDisabledPreviewGenratebutton = true;
    this.IsTransferTypeSameState = true;
    this.IsTransferTypeOtherState = false;
    this.IsSaveButtonDisable = false;
    this.IsReceivingFile = false;
    this.IsGRFile = false;
    this.IsEwayBillfile = false;
    this.IsTaxInvoiceFile = false;
    this.model.DisatchTrackeringId = 0;
    this.ValidationtotalSumAmount = 0;
    this.TableId = 0;
    this.ManueId = null;
    this.ApprovalList = null
    this.IsItemListDisabled = false;
    this.IsDisbaledWHDetail = false;
    this.IsHideShowCancelBtn = false;
    this.clearEditForm();
    this.model.ReqAndRecvedClickId = Id;
    this.model.SecondReqAndRecvedClickId = Id;
    if (Id == 1) {
      this.SRNRecivedtable = false;
      this.IsSRNNoShowAndHide = false;
      this.IsReadonlyField = false;
      this.AutoCompleteSRNNoList = [];
      this.ItemAddrowhideshow = true;
      this.IsReceivingField = false;
      var toDate = "";
      toDate = this.datePipe.transform(Date(), "yyyy/MM/dd");
      this.model.DocumentDate = { day: parseInt(toDate.split('/')[2]), month: parseInt(toDate.split('/')[1]), year: parseInt(toDate.split('/')[0]) };
    } else {
      this.IsSRNNoShowAndHide = true;
      this.IsReadonlyField = true;
      this.AutoCompleteSRNNoList = [];
      this.SRNRecivedtable = false;
      this.model.SRNNoData = "";
      this.model.DocumentDate = "";
      this.ItemAddrowhideshow = false;
      this.IsSRNInstraction = true;
      this.model.DispatchNo = ""; //vishal 04/02/2023
      this.model.DispatchNoId = null;
    }
    this.ChangeTrasporationMode(TransPortModeType.ByRoad);
    //brahamjot kaur 15/7/2022
    if (this.CreateDispatchForDIId != "0" && this.CreateDispatchForDIId != null) {
      this.AutoFillSRNDetailByDIId(this.CreateDispatchForDIId);
    }
    //this.ChangeSiteOtherState();
    this.AutoCompleteDispatchNoList = []; //vishal
  }

  GetCustomerName() {
    var objSiteCustomerAutoModel = new SiteCustomerAutoModel();
    objSiteCustomerAutoModel.SCNo = "";
    objSiteCustomerAutoModel.CompanyId = this.CompanyId;
    objSiteCustomerAutoModel.flag = "Customer";
    this._GrncrnService.GetAutoCompleteSiteAndCustomer(objSiteCustomerAutoModel).subscribe((AutoCom) => {
      if (AutoCom.Data != null) {
        this.SearchCustomerData = AutoCom.Data;
      }
    })
  }

  onClickCustomer(para: string) {
    if (para == "DelAll") {
      this.SelectedSearchCustomerList = [];
      this.model.CustomerId = '0';
    } else if (this.SelectedSearchCustomerList.length > 0) {
      this.model.CustomerId = this.SelectedSearchCustomerList.map(xx => xx.id).join(',');;
    }
  }
  onChangeSearch(val: string) {
    this.AutoCompleteSRNNoList = [];
    var objdropdownmodel = new DropdownModel();
    objdropdownmodel.User_Id = this.UserId;
    objdropdownmodel.Parent_Id = val;
    objdropdownmodel.Company_Id = this.CompanyId;
    objdropdownmodel.Flag = 'SRN';
    this._GrncrnService.GetAutoCompleteDocumentNo(objdropdownmodel).subscribe((data) => {
      this.AutoCompleteSRNNoList = data.Data;
    })
  }
  
  SearchSRNCleared() {
    this.AutoCompleteSRNNoList = [];
    this.model.SRNNoData = "";
    this.CreateNew(this.model.ReqAndRecvedClickId);
  }

  SearchAutoDocumentNo(item) {
    this.SRNRecivedtable = true;
    this.SearchSRNEditListBySRNId(item.id);
  }
  // new function ravinder
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
        this._Commonservices.ErrorFunction(this.UserName, error.message, "GetAllTechCOHbySiteId", "SRN");
      });
    } catch (Error) {
      this._Commonservices.ErrorFunction(this.UserName, Error.message, "GetAllTechCOHbySiteId", "SRN");
    }
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
    if (this.Validation() == 1) {
      return false;
    } else if (this.validateItemData() == 1) {
      setTimeout(function () { this.IsError = false; }, 3000);
      return false;
    } else if (this.dynamicArray.length < 1) {
      alert('please fill atleast one item');
      return false;
    } else {
      jQuery('#confirm').modal('show');
    }

  }

  SaveUpDateSRNDetail() {
    this.loading = true;
    try {
      jQuery('#confirm').modal('hide');
      var objDispatchTrackingModel = new DispatchTrackingModel();
      objDispatchTrackingModel.DispatchTracker_Id = this.model.DisatchTrackeringId;
      objDispatchTrackingModel.UserId = this.UserId;
      objDispatchTrackingModel.Company_Id = this.CompanyId;
      objDispatchTrackingModel.State_Id = this.model.ddlStateId;
      objDispatchTrackingModel.DocumentNo = this.model.DocumentNo;
      //brahamjot kaur 15/7/2022
      //objDispatchTrackingModel.DispatchInstructionId  = this.model.SRNInstructionId;
      //brahamjot kaur 21/9/2022
      // objDispatchTrackingModel.DispatchInstructionId  = this.model.SRNInstructionId;

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

      let TxtInvDate = this._Commonservices.checkUndefined(this.model.TaxInvoiceDate);
      if (TxtInvDate != "") {
        objDispatchTrackingModel.TaxInvoiceDate = TxtInvDate.day + '/' + TxtInvDate.month + '/' + TxtInvDate.year;//vishal, 03/12/2022
      } else {
        objDispatchTrackingModel.TaxInvoiceDate = "";
      }

      objDispatchTrackingModel.PlaceofDispatch = this.model.PlaceofDispatch;
      objDispatchTrackingModel.Destination = this.model.Destination;
      objDispatchTrackingModel.AmountChargeable = this.model.AmountChargeable;
      objDispatchTrackingModel.Pageflag = this.model.TransferTypeId;
      objDispatchTrackingModel.IstransferTypeId = this.model.TransferTypeId;
      objDispatchTrackingModel.VehicleNumber = this.model.VehicleNumber;
      objDispatchTrackingModel.VehicleType_Id = this.model.ddlVehicleType;
      objDispatchTrackingModel.EwayBillNo = this.model.EwayBillNo;
      objDispatchTrackingModel.IsDispatch = this.model.IsDispatch;

      // vishal 

      if (this.model.AutoDispatchNo != "") {

        objDispatchTrackingModel.DispatchNo = this.model.DispatchNo;
        objDispatchTrackingModel.DispatchNoId = this.model.DispatchNoId;
      } else {
        objDispatchTrackingModel.DispatchNo = null;
        objDispatchTrackingModel.DispatchNoId = null;
      }


      objDispatchTrackingModel.CompanyName = this.model.CompanyName;
      objDispatchTrackingModel.ReasonId = this.model.ReasonId;
      objDispatchTrackingModel.ReasonRemarks = this.model.ReasonRemarks;
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

      objDispatchTrackingModel.ShippedfromWHId = this.model.ShippedfromWHId;
      if (this.model.ReqAndRecvedClickId == 1) {
        objDispatchTrackingModel.IsReceived = 0;
        this.model.SRNReqAndRecived = 0;
      } else {
        objDispatchTrackingModel.IsReceived = 1;
        this.model.SRNReqAndRecived = 1;
      }

      objDispatchTrackingModel.IsMultipleSite = this.model.IsMultipleSite;
      if (this.model.IsMultipleSite == true) {
        objDispatchTrackingModel.MultiSite = this.AddMultiSite
      } else {
        objDispatchTrackingModel.MultiSite = null;
      }
      if (this.model.TransferTypeId == PageActivity.Srn_SiteWithinState) {
        objDispatchTrackingModel.ToState_Id = this.model.ddlStateId;
        objDispatchTrackingModel.SiteId = this.model.SiteId;
        objDispatchTrackingModel.CustomerSiteId = this.model.HideCustomerId;
        objDispatchTrackingModel.SiteName = this.model.SiteName;
        objDispatchTrackingModel.ClientName = this.model.ClientName;
        objDispatchTrackingModel.SiteAddress = this.model.SiteAddress;
        objDispatchTrackingModel.ShippedToStateName = this.model.WHState;
        objDispatchTrackingModel.ShippedToStateCode = this.model.StateCode;
        objDispatchTrackingModel.ShippedToGSTNO = this.model.GSTINNo;
        objDispatchTrackingModel.TECHFE = this.model.TECHFE;
        objDispatchTrackingModel.COHCI = this.model.COHCI;
        //brahamjot kaur 26/09/2022
        if (this.selectedDIArr.length > 0) {
          objDispatchTrackingModel.DispatchInstructionId = this.selectedDIArr.map(xx => xx.id).join(',');
        } else {
          objDispatchTrackingModel.DispatchInstructionId = null;
        }
      } else if (this.model.TransferTypeId == PageActivity.Srn_SiteOtherState) {
        objDispatchTrackingModel.ToState_Id = this.model.ToSiteStateId;
        objDispatchTrackingModel.SiteId = this.model.SiteId;
        objDispatchTrackingModel.CustomerSiteId = this.model.HideCustomerId;
        objDispatchTrackingModel.SiteName = this.model.SiteName;
        objDispatchTrackingModel.ClientName = this.model.ClientName;
        objDispatchTrackingModel.SiteAddress = this.model.SiteAddress;
        objDispatchTrackingModel.ShippedToStateName = this.model.ToSiteState;
        objDispatchTrackingModel.ShippedToStateCode = this.model.ToSiteStateCode;
        objDispatchTrackingModel.ShippedToGSTNO = this.model.ToSiteWHGSTIN;
        objDispatchTrackingModel.GSTTypeId = this.model.GSTType;
        objDispatchTrackingModel.TECHFE = this.model.TECHFE;
        objDispatchTrackingModel.COHCI = this.model.COHCI;

        //brahamjot kaur 26/09/2022
        if (this.selectedDIArr.length > 0) {
          objDispatchTrackingModel.DispatchInstructionId = this.selectedDIArr.map(xx => xx.id).join(',');
        } else {
          objDispatchTrackingModel.DispatchInstructionId = null;
        }
      }
      objDispatchTrackingModel.Note = this.model.Note;
      objDispatchTrackingModel.ReceivedBy = this.model.ReceivedBy;
      objDispatchTrackingModel.ReceivedNo = this.model.ReceivedNo;
      var DeldDate = this._Commonservices.checkUndefined(this.model.DeliveredDate);
      if (DeldDate != '') {
        objDispatchTrackingModel.DeliveredDate = DeldDate.day + '/' + DeldDate.month + '/' + DeldDate.year;
      } else {
        objDispatchTrackingModel.DeliveredDate = "";
      }
      if (this.model.ReqAndRecvedClickId == 1) {
        this.DispatchTrackingItem = [];

        for (var i = 0, len = this.dynamicArray.length; i < len; i++) {
          var objDispatchTrackingItemDetialModel = new DispatchTrackingItemDetialModel();
          objDispatchTrackingItemDetialModel.Id = this.dynamicArray[i].Id;
          objDispatchTrackingItemDetialModel.ItemCode_Id = this.dynamicArray[i].ItemId;
          objDispatchTrackingItemDetialModel.Rate = this.dynamicArray[i].Rate;
          objDispatchTrackingItemDetialModel.Discount = this.dynamicArray[i].Discount;
          objDispatchTrackingItemDetialModel.HSN_SAC = this.dynamicArray[i].HSN;
          objDispatchTrackingItemDetialModel.EqpType_Id = this.dynamicArray[i].EqTypeId;
          objDispatchTrackingItemDetialModel.ClientId = this.dynamicArray[i].ClientId;
          objDispatchTrackingItemDetialModel.SubDescription = this.dynamicArray[i].SubDescription;
          objDispatchTrackingItemDetialModel.DIList_Id = this.dynamicArray[i].DIList_Id;
          objDispatchTrackingItemDetialModel.ReceivedInWH = false;
          var MfDate = this._Commonservices.checkUndefined(this.dynamicArray[i].ManufDate);
          if (MfDate != '') {
            objDispatchTrackingItemDetialModel.ManufacturerDate = MfDate.day + '/' + MfDate.month + '/' + MfDate.year;
          } else {
            objDispatchTrackingItemDetialModel.ManufacturerDate = "";
          }
          var conver = this._Commonservices.checkUndefined(this.dynamicArray[i].ConversionUnit);
          if (conver == "") {
            objDispatchTrackingItemDetialModel.Qty = this.dynamicArray[i].Qty;
            objDispatchTrackingItemDetialModel.UnitId = this.dynamicArray[i].UnitName;
            objDispatchTrackingItemDetialModel.ConversionUnit = "";
            objDispatchTrackingItemDetialModel.ConversionValue = 0;
          } else {
            // objDispatchTrackingItemDetialModel.Qty = this.dynamicArray[i].ConversionValue;
            // objDispatchTrackingItemDetialModel.ConversionUnit = this.dynamicArray[i].UnitName;
            // objDispatchTrackingItemDetialModel.ConversionValue = this.dynamicArray[i].Qty;
            objDispatchTrackingItemDetialModel.UnitId = this.dynamicArray[i].UnitName;
            objDispatchTrackingItemDetialModel.Qty = this.dynamicArray[i].Qty;
            objDispatchTrackingItemDetialModel.ConversionUnit = this.dynamicArray[i].ConversionUnit;
            objDispatchTrackingItemDetialModel.ConversionValue = this.dynamicArray[i].ConversionValue;
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
          objDispatchTrackingItemDetialModel.GSerialNumbers = this.dynamicArray[i].GSerialNumbers;
          this.DispatchTrackingItem.push(objDispatchTrackingItemDetialModel)
        }
      } else {
        this.DispatchTrackingItem = [];

        for (var i = 0, len = this.ReceiveddynamicArray.length; i < len; i++) {
          var objDispatchTrackingItemDetialModel = new DispatchTrackingItemDetialModel();
          objDispatchTrackingItemDetialModel.Id = this.ReceiveddynamicArray[i].Id;
          objDispatchTrackingItemDetialModel.ItemCode_Id = this.ReceiveddynamicArray[i].ItemId;
          objDispatchTrackingItemDetialModel.Rate = this.ReceiveddynamicArray[i].Rate;
          objDispatchTrackingItemDetialModel.Discount = this.ReceiveddynamicArray[i].Discount;
          objDispatchTrackingItemDetialModel.HSN_SAC = this.ReceiveddynamicArray[i].HSN;
          objDispatchTrackingItemDetialModel.EqpType_Id = this.ReceiveddynamicArray[i].EqTypeId;
          objDispatchTrackingItemDetialModel.ClientId = this.ReceiveddynamicArray[i].ClientId;
          objDispatchTrackingItemDetialModel.SubDescription = this.ReceiveddynamicArray[i].SubDescription;
          objDispatchTrackingItemDetialModel.ReasonId = this.ReceiveddynamicArray[i].ReasonId;
          objDispatchTrackingItemDetialModel.DIList_Id = this.ReceiveddynamicArray[i].DIList_Id;
          objDispatchTrackingItemDetialModel.Remarks = this.ReceiveddynamicArray[i].Remarks;
          objDispatchTrackingItemDetialModel.ReceivedInWH = true;
          var MfDate = this._Commonservices.checkUndefined(this.ReceiveddynamicArray[i].ManufDate);
          if (MfDate != '') {
            objDispatchTrackingItemDetialModel.ManufacturerDate = MfDate.day + '/' + MfDate.month + '/' + MfDate.year;
          } else {
            objDispatchTrackingItemDetialModel.ManufacturerDate = "";
          }
          var conver = this._Commonservices.checkUndefined(this.ReceiveddynamicArray[i].ConversionUnit);
          if (conver == "") {
            objDispatchTrackingItemDetialModel.Qty = this.ReceiveddynamicArray[i].ReceivedQty;
            objDispatchTrackingItemDetialModel.UnitId = this.ReceiveddynamicArray[i].UnitName;
            objDispatchTrackingItemDetialModel.ConversionUnit = "";
            objDispatchTrackingItemDetialModel.ConversionValue = 0;
          } else {
            objDispatchTrackingItemDetialModel.UnitId = this.ReceiveddynamicArray[i].UnitName;
            objDispatchTrackingItemDetialModel.Qty = this.ReceiveddynamicArray[i].ReceivedQty;
            objDispatchTrackingItemDetialModel.ConversionUnit = this.ReceiveddynamicArray[i].ConversionUnit;
            objDispatchTrackingItemDetialModel.ConversionValue = this.ReceiveddynamicArray[i].ConversionValue;
          }
          objDispatchTrackingItemDetialModel.ManufacturerSerialNo = this.ReceiveddynamicArray[i].SerialNo;
          var INVDate = this._Commonservices.checkUndefined(this.ReceiveddynamicArray[i].InvoiceTaxDate);
          if (INVDate != '') {
            objDispatchTrackingItemDetialModel.InvoiceTaxDate = INVDate.day + '/' + INVDate.month + '/' + INVDate.year;
          } else {
            objDispatchTrackingItemDetialModel.InvoiceTaxDate = "";
          }
          objDispatchTrackingItemDetialModel.InvoiceTaxNo = this.ReceiveddynamicArray[i].InvoiceTaxNo;
          objDispatchTrackingItemDetialModel.IGST = this.ReceiveddynamicArray[i].IGST;
          objDispatchTrackingItemDetialModel.IGSTValue = this.ReceiveddynamicArray[i].IGSTValue;
          // objDispatchTrackingItemDetialModel.GSerialNumbers = this.ReceiveddynamicArray[i].GSerialNumbers;
          this.srnlst = [];
          if (this.ReceiveddynamicArray[i].GSerialNumbers.length > 0) {
            //var _mode = this.ReceiveddynamicArray[i].GSerialNumbers[i].Mode;            
            if (this.ReceiveddynamicArray[i].ItemNameId == "4" && this.ReceiveddynamicArray[i].UnitName == "8") {
              // Check by Hemant Tyagi
              for (var j = 0; j < this.ReceiveddynamicArray[i].GSerialNumbers.length; j++) {
                for (var k = 0; k < this.ReceiveddynamicArray[i].GSerialNumbers[j].CellNos.length; k++) {
                  var srnData = new GSerialNumber();
                  srnData.InitialSrno = this.ReceiveddynamicArray[i].GSerialNumbers[j].CellNos[k].CellValue;
                  srnData.Sequance = j.toString();
                  this.srnlst.push(srnData)
                }
              }
              objDispatchTrackingItemDetialModel.GSerialNumbers = this.srnlst;
            } else {
              objDispatchTrackingItemDetialModel.GSerialNumbers = this.ReceiveddynamicArray[i].GSerialNumbers;
            }
          }
          this.DispatchTrackingItem.push(objDispatchTrackingItemDetialModel)
        }
      }
      objDispatchTrackingModel.DispatchTrackerItemList = this.DispatchTrackingItem;
      var formdata = new FormData();
      if (this.Taxinvoiceuplodfile == null) {
        formdata.append('Taxinvoicefile', this.Taxinvoiceuplodfile);
      } else {
        formdata.append('Taxinvoicefile', this.Taxinvoiceuplodfile, this.Taxinvoiceuplodfile.name);
      }
      if (this.RecDocumentFile == null) {
        formdata.append('RecDocumentfile', this.RecDocumentFile);
      } else {
        formdata.append('RecDocumentfile', this.RecDocumentFile, this.RecDocumentFile.name);
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
      if (this.SRNDocumentFile == null) {
        formdata.append('SRNDocumentFile', this.SRNDocumentFile);
      } else {
        formdata.append('SRNDocumentFile', this.SRNDocumentFile, this.SRNDocumentFile.name);
      }

      formdata.append('jsonDetail', JSON.stringify(objDispatchTrackingModel));
      //console.log(JSON.stringify(objDispatchTrackingModel));
      this._MaterialMovementService.AddUpadteSRNDeatil(formdata).pipe(first()).subscribe(data => {


        if (data.Status == 1) {
          this.loading = false;
          this.model.DisatchTrackeringId = data.Value;
          this.IsDisabledPreviewGenratebutton = false;
          this.IsSaveButtonDisable = true;

          //alert('your data has been Succesfully with SRN No-'+data.Remarks);
          jQuery('#confirm').modal('hide');
          this.succesMessage = "Your data has been save successfully with SRN No-" + data.Remarks + "";
          this.IsSuccess = true;
          setTimeout(() => {
            this.IsSuccess = false;
          }, 5000);
          this.clearEditForm();
        } else if (data.Status == 2) {
          if (this.model.ReqAndRecvedClickId == 1) {
            this.loading = false;
            this.succesMessage = "your  data update successfully";
            this.IsSuccess = true;
            setTimeout(() => {
              this.IsSuccess = false;
            }, 5000);
            jQuery('#confirm').modal('hide');
            this.IsDisabledPreviewGenratebutton = false;
            this.IsSaveButtonDisable = false;
          } else {
            this.loading = false;
            this.IsSaveButtonDisable = true;
            this.succesMessage = "your Item successfully Received";
            this.IsSuccess = true;
            setTimeout(() => {
              this.IsSuccess = false;
            }, 5000);
            jQuery('#confirm').modal('hide');
            this.IsDisabledPreviewGenratebutton = false;
            this.IsSaveButtonDisable = false;
            this.model.SRNNoData = null;
            this.clearEditForm();
          }
        } else if (data.Status == 3) {
          // alert('your documentNo already exists');
          this.loading = false;
          jQuery('#confirm').modal('hide');
          this.errorMessage = 'your documentNo already exists';
          this.IsError = true;
        } else if (data.Status == 0) {
          this.loading = false;
          jQuery('#confirm').modal('hide');
          alert(data.Remarks);
        }
      }, error => {
        this.loading = false;
        jQuery('#confirm').modal('hide');
        this._Commonservices.ErrorFunction(this.UserName, error.message, "AddUpadteSRNDeatil", "SRN");
      });
    } catch (Error) {
      this._Commonservices.ErrorFunction(this.UserName, Error.message, "AddUpadteSRNDeatil", "SRN");
      //console.log(Error.message)
    }
  }


  PartialUpadteSRNDetail() {

    try {
      if (this.PartialUpdateValidation() == 1) {
        return false;
      }
      //jQuery('#confirm').modal('hide');
      var objDispatchTrackingModel = new DispatchTrackingModel();
      objDispatchTrackingModel.DispatchTracker_Id = this.model.DisatchTrackeringId;
      objDispatchTrackingModel.UserId = this.UserId;
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
        objDispatchTrackingModel.GRDate = GRNoDate.day + '/' + GRNoDate.month + '/' + GRNoDate.year;
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

      let TxtInvDate = this._Commonservices.checkUndefined(this.model.TaxInvoiceDate);
      if (TxtInvDate != "") {
        objDispatchTrackingModel.TaxInvoiceDate = TxtInvDate.day + '/' + TxtInvDate.month + '/' + TxtInvDate.year;//vishal, 03/12/2022
      } else {
        objDispatchTrackingModel.TaxInvoiceDate = "";
      }

      objDispatchTrackingModel.PlaceofDispatch = this.model.PlaceofDispatch;
      objDispatchTrackingModel.Destination = this.model.Destination;
      objDispatchTrackingModel.Pageflag = this.model.TransferTypeId;
      objDispatchTrackingModel.IstransferTypeId = this.model.TransferTypeId;
      objDispatchTrackingModel.VehicleNumber = this.model.VehicleNumber;
      objDispatchTrackingModel.VehicleType_Id = this.model.ddlVehicleType;
      objDispatchTrackingModel.EwayBillNo = this.model.EwayBillNo;
      objDispatchTrackingModel.IsDispatch = this.model.IsDispatch;
      //objDispatchTrackingModel.DispatchNo = this.model.DispatchNo;

      //vishal 
      if (this.model.AutoDispatchNo != "") {

        objDispatchTrackingModel.DispatchNo = this.model.DispatchNo;
        objDispatchTrackingModel.DispatchNoId = this.model.DispatchNoId;
      } else {
        objDispatchTrackingModel.DispatchNo = null;
        objDispatchTrackingModel.DispatchNoId = null;
      }
      // if (this.model.DispatchNo != "") {
      //   debugger
      //   objDispatchTrackingModel.DispatchNo = this.model.DispatchNo;
      //   objDispatchTrackingModel.DispatchNoId = this.model.DispatchNoId;
      // } else {
      //   objDispatchTrackingModel.DispatchNo = null;
      //   objDispatchTrackingModel.DispatchNoId = null;
      // }
      objDispatchTrackingModel.ReasonId = this.model.ReasonId;
      objDispatchTrackingModel.ReasonRemarks = this.model.ReasonRemarks;
      objDispatchTrackingModel.Note = this.model.Note;
      objDispatchTrackingModel.DispatchTrackerItemList = [];
      var formdata = new FormData();
      if (this.Taxinvoiceuplodfile == null) {
        formdata.append('Taxinvoicefile', this.Taxinvoiceuplodfile);
      } else {
        formdata.append('Taxinvoicefile', this.Taxinvoiceuplodfile, this.Taxinvoiceuplodfile.name);
      }
      if (this.RecDocumentFile == null) {
        formdata.append('RecDocumentfile', this.RecDocumentFile);
      } else {
        formdata.append('RecDocumentfile', this.RecDocumentFile, this.RecDocumentFile.name);
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
      if (this.SRNDocumentFile == null) {
        formdata.append('SRNDocumentFile', this.SRNDocumentFile);
      } else {
        formdata.append('SRNDocumentFile', this.SRNDocumentFile, this.SRNDocumentFile.name);
      }
      formdata.append('jsonDetail', JSON.stringify(objDispatchTrackingModel));
      this._MaterialMovementService.PartialUpadteSRNDetail(formdata).pipe(first()).subscribe(data => {
        if (data.Status == 2) {
          alert('your data partial update successfully');
        }
      }, error => {
        jQuery('#confirm').modal('hide');
        this._Commonservices.ErrorFunction(this.UserName, error.message, "AddUpadteSRNDeatil", "SRN");
      });
    } catch (Error) {
      Error
      this._Commonservices.ErrorFunction(this.UserName, Error.message, "AddUpadteSRNDeatil", "SRN");
      //console.log(Error.message)
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
    if (Id == TransPortModeType.ByRoad) {
      this.TransporterTypeDetail = this.TransporterAndCourierTypeDetail.filter(m => m.IsCourier == 0 || m.IsCourier == 2);
      this.IsTransporter = true;
      this.IsValidationShowandhide = true;
      this.IsVehicleType = true;
      this.IsVehicleValidationHideShow = true;
      this.model.TransporterId = "";
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
      this.model.TransporterId = "";
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
      this.model.VehicleNumber = "";
      this.model.ddlVehicleType = "0";
      this.model.GRNo = "";
      this.model.GRDate = "";
    } else if (Id == TransPortModeType.ByHand) {
      this.IsVehicleType = true;
      this.IsByHand = true;
      this.model.TransporterId = "";
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
      this.model.VehicleNumber = "";
      this.model.ddlVehicleType = "0";
      this.model.GRNo = "";
      this.model.GRDate = "";

    } else if (Id == TransPortModeType.ByCourier) {
      this.CourierTypeDetail = this.TransporterAndCourierTypeDetail.filter(m => m.IsCourier == 1 || m.IsCourier == 2);
      this.IsVehicleType = true;
      this.IsCourier = true;
      this.model.TransporterId = "";
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
      this.model.VehicleNumber = "";
      this.model.ddlVehicleType = "0";
      this.model.GRNo = "";
      this.model.GRDate = "";
    } else if (Id == TransPortModeType.Other) {
      this.IsOther = true;
      this.IsVehicleType = true;
      this.model.TransporterId = "";
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
      this.model.VehicleNumber = "";
      this.model.ddlVehicleType = "0";
      this.model.GRNo = "";
      this.model.GRDate = "";
    }
  }

  conformCancelPopup() {
    this.IsError = false;
    if (this.CancelValidation() == 1) {
      return false;
    }
    jQuery('#Cancleconfirm').modal('show');
  }

  UpadateCancelSRN() {
    try {
      var objApprovelStatusModel = new ApprovelStatusModel();
      objApprovelStatusModel.User_Id = this.UserId;
      objApprovelStatusModel.ApprovalStatus_Id = this.model.DisatchTrackeringId;
      objApprovelStatusModel.Table_Id = this.model.InCaseReason;
      objApprovelStatusModel.Flag = "SRN";
      this._MaterialMovementService.UpadateCancelDispatch(objApprovelStatusModel).subscribe(data => {
        if (data.Status == 1) {
          this.IsHideShowCancelBtn = false;
          jQuery('#Cancleconfirm').modal('hide');
          setTimeout(() => {
            alert('Your SRN SuccessFully Cancel')
          }, 300);
        }

      });
    } catch (Error) {
      this._Commonservices.ErrorFunction(this.UserName, Error.message, "UpadateCancelDispatch", "WHTOSite");
    }
  }

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
      objDispatchTrackingModel.Flag = 'SRN';
      var formdata = new FormData();
      formdata.append('jsonDetail', JSON.stringify(objDispatchTrackingModel));
      this._Commonservices.UpdateCostDetail(formdata).pipe(first()).subscribe(data => {
        if (data.Status == 2) {
          alert('your data has been Cost Detail Update successfully');
        }
      }, error => {
        this._Commonservices.ErrorFunction(this.UserName, error.message, "UpdateCostDetail", "WHTOSite");
      });
    } catch (Error) {
      this._Commonservices.ErrorFunction(this.UserName, Error.message, "UpdateCostDetail", "WHTOSite");
    }
  }
  onGridReady(params) {
    this.gridApi = params.api;
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
  onSRNDocumentFileChange(event) {
    let reader = new FileReader();
    if (event.target.files && event.target.files.length > 0) {
      this.SRNDocumentFile = event.target.files[0];
    }
  }

  SearchSRNList(para: string) {
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
      objpara.ItemId = this.CommonSearchPanelData.ItemId;
      objpara.MakeId = this.CommonSearchPanelData.MakeId;
      objpara.ItemCodeId = this.CommonSearchPanelData.ItemCodeId;
      objpara.CapacityId = this.CommonSearchPanelData.CapacityId;
      objpara.Startdate = this.CommonSearchPanelData.Startdate;
      objpara.Enddate = this.CommonSearchPanelData.Enddate;
      objpara.DescriptionId = this.CommonSearchPanelData.DescriptionId;
      if (this._Commonservices.checkUndefined(this.SearchSitesPanelData) == '') {
        objpara.Site_Id = 0;
      } else {
        objpara.Site_Id = this.SearchSitesPanelData.SiteId;
      }
      objpara.Flag = para;
      if (para == "Export") {
        this.Exportloading = true;
      }
      objpara.IsReceived = this.model.SRNType;
      if (this._Commonservices.checkUndefined(this.model.SRNFrom) == '') {
        objpara.PageFlag = '0';
      } else {
        objpara.PageFlag = this.model.SRNFrom;
      }
      if (this._Commonservices.checkUndefined(this.model.SRNTaxinvoiceNo) == '') {
        objpara.DocumentNo = 0;
      } else {
        objpara.DocumentNo = this.model.SRNTaxinvoiceNo;
      }
      objpara.IsActiveCancel = this.model.IsActiveCancel;
      if (this._Commonservices.checkUndefined(this.model.CustomerId) != '0') {
        objpara.CustomerId = this.model.CustomerId;
      } else {
        objpara.CustomerId = '0';
      }
      this._MaterialMovementService.GetSRNList(objpara).pipe(first()).subscribe(data => {
        this.gridApi.hideOverlay();
        this.Exportloading = false;
        if (data.Status == 1) {
          if (para == "List") {
            this.Loader.hide();
            if (data.Data != null) {
              this.rowData = data.Data;
            } else {
              this.rowData = null
            }
          } else if (para == "Export") {
            if (data.Data != null) {
              var CurrentDate = this.datePipe.transform(Date(), "dd/MM/yyyy");
              this._PurchaseOrderService.exportAsExcelFile(data.Data, 'SRN Detail' + CurrentDate);
            } else {
              this.gridApi.hideOverlay();
              alert('No Data Available Of SRN Received');
            }
          }
        }
      }, error => {
        this._Commonservices.ErrorFunction(this.UserName, error.message, "GetSRNList", "SRN");
      });
    } catch (Error) {
      this._Commonservices.ErrorFunction(this.UserName, Error.message, "GetSRNList", "SRN");
    }
  }

  //#region  Download All GRN Document in Zip Folder
  // DownloadAllPdfZip() {
  //   var objDownLoadZipFileDetial = new DownLoadZipFileDetial();
  //   var value = '';
  //   var value1 = '';
  //   var formdata = new FormData();
  //   this.Downloadfile = [];
  //   if (this.rowData.length > 0) {
  //     for (let i = 0; i < this.rowData?.length; i++) {
  //       if (this.rowData[i].DocumentFile != "" && this.rowData[i].DocumentFile != null) {
  //         objDownLoadZipFileDetial.DownloadFileData.push(this.rowData[i].DocumentFile) + ',';
  //         value += this.rowData[i].DocumentFile + ',';
  //       }
  //     }
  //     this.Downloadfile.push(objDownLoadZipFileDetial);
  //     formdata.append("SendDownloadFile", JSON.stringify(value));
  //     this._Commonservices.DownloadFileZip(formdata).subscribe(data => {
  //       var zip = new JSZip();
  //       var imgFolder = zip.folder("images");
  //       for (var i = 0; i < data.lstUrlDetail.length; i++) {
  //         const byteArray = new Uint8Array(atob(data.lstUrlDetail[i].base64Value).split("").map(char => char.charCodeAt(0)));
  //         //const newBlob = new Blob([byteArray], {type: 'application/pdf'}); 
  //         imgFolder.file(this.GetFilename(data.lstUrlDetail[i].Url), byteArray, { base64: true });

  //       }
  //       zip.generateAsync({ type: "blob" })
  //         .then(function (content) {
  //           FileSaver.saveAs(content, "SRNFile.zip");
  //         });
  //     });
  //   }
  // }

  // GetFilename(url) {
  //   var m = url.substring(url.lastIndexOf('/') + 1);
  //   this.ReplaceUrl = m.split('.');
  //   for (let j = 0; j < this.rowData?.length; j++) {
  //     if (this.rowData[j].DocumentFile != "" && this.rowData[j].DocumentFile != null) {
  //       var v = this.rowData[j].DocumentFile.substring(this.rowData[j].DocumentFile.lastIndexOf('/') + 1)
  //       if (m == v) {
  //         var R = this.rowData[j].DocumentNo + ('.') + this.ReplaceUrl[1];
  //         return R;
  //       }
  //     }
  //   }
  // }
  //#endregion

  //created by: vishal 17/08/2022, description: function for download srn files
  DownloadAllSRNZip() {
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
            FileSaver.saveAs(content, "SRNFile.zip");
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
  //end vishal-region

  //created by: vishal 17/08/2022, description: function for download bilty files
  DownloadAllBiltyZip() {
    var objDownLoadZipFileDetial = new DownLoadZipFileDetial();
    var value = '';
    var formdata = new FormData();
    this.CheckData = [];
    if (this.rowData.length > 0) {
      for (let i = 0; i < this.rowData?.length; i++) {
        if (this.rowData[i].cbox == true) {
          // if (this.rowData[i].DocumentFile != "" && this.rowData[i].DocumentFile != null) {
          //value += this.rowData[i].DocumentFile + ',';
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
  //end vishal-region

  ShowSRNDetail(e) {
    //this.Loader.show();
    //this.CreateNew();
    // this.SRNRecivedtable = false;
    this.IsSRNNoShowAndHide = false;
    this.IsReadonlyField = false;
    this.IsPreviewhideandShow = false;
    this.AutoCompleteSRNNoList = [];
    this.isShownList = true;
    this.isShownEdit = false;
    this.SrnId = e.rowData.DisatchTrackeringId;
    this.GetUserPageRight(this.SrnId);
    //this.model.ReqAndRecvedClickId = 1;
    this.SearchSRNEditListBySRNId(e.rowData.DisatchTrackeringId);
  }

  SearchSRNEditListBySRNId(Id: any) {
    debugger
    try {
      this.gridApi.showLoadingOverlay();
      this.IsPreviousSiteDataGrid = false;
      this.IsDisabledPreviewGenratebutton = false;
      this.IsPartialUpDateSRNRequest = false;
      var objModel = new SearchDispatchTrackerModel();
      objModel.DispatchTracker_Id = Id;
      this._MaterialMovementService.GetSRNEditListById(objModel).pipe(first()).subscribe(data => {
        this.model.InCaseReason = "0";
        this.IsSaveButtonDisable = false;
        this.gridApi.hideOverlay();
        if (data.Status == 1) {
          if (data.RegData != null && data.RegData != '') {
            this.model.StateCode = data.RegData[0].StateCode;
            this.model.RegdOffice = data.RegData[0].OfficeAddress;

            //vishal, 09/02/2023

            // if (this.model.TransferTypeId == PageActivity.Srn_SiteOtherState) {
            //   this.model.RegdOffice = data.RegData[0].OfficeAddress;
            // } else {
            //   this.model.SiteRegdOffice = data.RegData[0].OfficeAddress;
            // }


            this.model.GSTINNo = data.RegData[0].GSTIN_UIN;
            this.model.CIN = data.RegData[0].CIN;
            this.model.WHState = data.RegData[0].StateName;
            this.StateCodeWhAd = JSON.parse(data.RegData[0].RegWHAddressList)
          }
          if (data.Data != null && data.Data != '') {
            if (this.model.SecondReqAndRecvedClickId == 2 && data.Data[0].IsReceived == 1) {
              this.model.ReqAndRecvedClickId = 2;
            } else if (this.model.SecondReqAndRecvedClickId == 2 && data.Data[0].IsReceived == 0) {
              this.model.ReqAndRecvedClickId = 2;
            } else if (data.Data[0].IsReceived == 1) {
              this.model.ReqAndRecvedClickId = 2;
            } else {
              this.model.ReqAndRecvedClickId = 1;
            }
            this.model.IsReceived = data.Data[0].IsReceived;
            this.model.DisatchTrackeringId = data.Data[0].DisatchTrackeringId;
            this.model.ddlStateId = data.Data[0].State_Id;
            this.model.DocumentNo = data.Data[0].DocumentNo;

            //vishal, 08/02/2023

            if (data.Data[0].DispatchNo != '') {
              this.model.AutoDispatchNo = data.Data[0].DispatchNo;
              this.model.DispatchNo = data.Data[0].DispatchNo;
              this.model.DispatchNoId = data.Data[0].DispatchNoId;

            } else {
              this.model.AutoDispatchNo = null;
              this.model.DispatchNo = '';
              this.model.DispatchNoId = null;

            }

            //brahamjot kaur 15/7/2022
            //this.model.SRNInstructionId = data.Data[0].DispatchInstructionId;
            //brahamjot kaur 21/7/2022
            //this.model.SRNInstructionId = data.Data[0].DispatchInstructionId;
            var DDate = data.Data[0].DocumentDate.split('/');
            this.model.DocumentDate = { year: parseInt(DDate[2]), month: parseInt(DDate[1]), day: parseInt(DDate[0]) };
            this.TableId = data.Data[0].DisatchTrackeringId;
            this.ManueId = this.PageMenuId;
            this.CreateName = data.Data[0].CreateName;
            this.CreatedDate = data.Data[0].CreatedDate;
            this.ModifiedName = data.Data[0].ModifiedName;
            this.ModifiedDate = data.Data[0].ModifiedDate;
            this.ApprovalList = null;
            this.ApprovalList = JSON.parse(data.Data[0].ApprovalStatusList);

            for (let i = 0; i < this.ArrayRoleId?.length; i++) {
              for (let j = 0; j < this.ApprovalList?.length; j++) {
                this.arry = this.ApprovalList[j].RoleId.split(',');
                if (inArray(this.ArrayRoleId[i], this.arry) > -1) {
                  this.IsApprovalstatusbtnhideShow = true;
                  break;
                }
              }
            }

            if (this.ApprovalList != null) {
              this.ApproveStatusDataList = this.ApprovalList;
            } else {
              this.ApproveStatusDataList = null;
            }

            this.model.TransferTypeId = data.Data[0].IstransferTypeId;
            if (data.Data[0].TrasporationMode != null && data.Data[0].TrasporationMode != "0") {
              this.model.TrasporationMode = data.Data[0].TrasporationMode;
              this.ChangeTrasporationMode(this.model.TrasporationMode);
            } else {
              this.model.TrasporationMode = 0;
            }

            if (data.Data[0].TrasporationMode == TransPortModeType.ByRoad) {
              this.IsBiltyValidationShowandhide = true;
            }

            if (data.Data[0].VehicleType_Id != null && data.Data[0].VehicleType_Id != 0) {
              this.model.ddlVehicleType = '' + data.Data[0].VehicleType_Id + '';
              var VLoadingCapcity = this.VechileTypeDataList.filter(m => m.Id === parseInt(data.Data[0].VehicleType_Id));
              this.model.LoadingCapcity = VLoadingCapcity[0].Definition;
            } else {
              this.model.ddlVehicleType = 0;
            }
            this.model.DateDiffHour = data.Data[0].DateDiffHour;
            if (this.model.DateDiffHour > CommonStaticClass.DifferenceDay) {
              if (this.UserRoleId == UserRole.UserRoleId || this.UserRoleId == UserRole.SCMHo) {
                this.IsItemListDisabled = true;
                this.IsHideShowCancelBtn = true;
                this.IsReadonlyField = true;
                //this.IsSaveButtonDisable = true;
                this.IsCancelButtonDisable = false;
              } else {
                this.IsItemListDisabled = true;
                this.IsHideShowCancelBtn = false;
                this.IsReadonlyField = true;
              }
              if (data.Data[0].IsReceived == 1) {
                this.IsSaveButtonDisable = true;
                this.IsPartialUpDateSRNRequest = true;
              } else {
                this.IsSaveButtonDisable = false;
              }
            } else {
              this.IsItemListDisabled = false;
              this.IsReadonlyField = false;
              this.IsHideShowCancelBtn = true;
              if (data.Data[0].IsReceived == 1) {
                this.IsSaveButtonDisable = true;
                this.IsPartialUpDateSRNRequest = true;
              } else {
                this.IsSaveButtonDisable = false;
              }
            }

            if (this.SRNEditUserRoleId == 14) {
              if (data.Data[0].IsReceived == 1) {
                this.IsSaveButtonDisable = false;
              } else {
                this.IsSaveButtonDisable = true;
              }
            }

            if (data.Data[0].IsActive == 0) {
              this.IsSaveButtonDisable = true;
            }
            this.model.IsDispatch = data.Data[0].IsDispatch;
            this.model.Destination = data.Data[0].Destination;
            this.model.GRNo = data.Data[0].GRNo;
            if (data.Data[0].GRDate != null && data.Data[0].GRDate != "") {
              var GrDate = data.Data[0].GRDate.split('/');
              this.model.GRDate = { year: parseInt(GrDate[2]), month: parseInt(GrDate[1]), day: parseInt(GrDate[0]) };
            }
            //vishal, 03/12/2022
            if (data.Data[0].TaxInvoiceDate != null && data.Data[0].TaxInvoiceDate != "") {
              var TxtInvDate = data.Data[0].TaxInvoiceDate.split('/');
              this.model.TaxInvoiceDate = { year: parseInt(TxtInvDate[2]), month: parseInt(TxtInvDate[1]), day: parseInt(TxtInvDate[0]) };
            } else {
              this.model.TaxInvoiceDate = "";
            }
            //end-vishal
            this.model.VehicleNumber = data.Data[0].VehicleNumber;
            this.model.TaxInvoiceNo = data.Data[0].TaxInvoiceNO;
            this.model.Note = data.Data[0].Note;
            this.model.ReceivedBy = data.Data[0].ReceivedBy;
            this.model.ReceivedNo = data.Data[0].ReceivedNo;
            this.model.EwayBillNo = data.Data[0].EwayBillNo;
            this.model.SecTransCost = data.Data[0].SecTransCost;
            this.model.LoadingCost = data.Data[0].LoadingCost;
            this.model.UnloadingCost = data.Data[0].UnloadingCost;
            this.model.OtherCharges = data.Data[0].OtherCharges;
            this.model.PrimaryUnloadingCost = data.Data[0].PrimaryUnloadingCost;
            if (data.Data[0].ReasonId != null && data.Data[0].ReasonId != 0) {
              this.model.ReasonId = data.Data[0].ReasonId;
            } else {
              this.model.ReasonId = "0";
            }
            this.model.ReasonRemarks = data.Data[0].ReasonRemarks;
            if (data.Data[0].ReceivingDocumentFile != "" && data.Data[0].ReceivingDocumentFile != null) {
              this.IsReceivingFile = true;
              this.ReceivingFile = data.Data[0].ReceivingDocumentFile;
            } else {
              this.IsReceivingFile = false;
            }
            if (data.Data[0].GRFile != "" && data.Data[0].GRFile != null) {
              this.IsGRFile = true;
              this.GRFile = data.Data[0].GRFile;
            } else {
              this.IsGRFile = false;
            }

            if (data.Data[0].EwayBillDocument != "" && data.Data[0].EwayBillDocument != null) {
              this.IsEwayBillfile = true;
              this.EwayBillfile = data.Data[0].EwayBillDocument;
            } else {
              this.IsEwayBillfile = false;
            }

            if (data.Data[0].TaxInvoiceFile != "" && data.Data[0].TaxInvoiceFile != null) {
              this.IsTaxInvoiceFile = true;
              this.TaxInvoiceFile = data.Data[0].TaxInvoiceFile;
            } else {
              this.IsTaxInvoiceFile = false;
            }

            if (data.Data[0].SrnDocumentFile != "" && data.Data[0].SrnDocumentFile != null) {
              this.IsSrnDocumentFile = true;
              this.SrnDocumentFile = data.Data[0].SrnDocumentFile;
            } else {
              this.IsSrnDocumentFile = false;
            }

            if (data.Data[0].DeliveredDate != null && data.Data[0].DeliveredDate != "") {
              var DelDate = data.Data[0].DeliveredDate.split('/');
              this.model.DeliveredDate = { year: parseInt(DelDate[2]), month: parseInt(DelDate[1]), day: parseInt(DelDate[0]) };
            }

            this.model.IsMultipleSite = data.Data[0].IsMultipleSite;
            if (data.Data[0].IsMultipleSite == true && data.Data[0].IsMultipleSite != 0) {
              jQuery('#MultisiteDispatchPopup').modal('show');
              this.MultiSite = JSON.parse(data.Data[0].MultisiteList);
              this.AddMultiSite = this.MultiSite;
            } else {
              this.MultiSite = null;
              jQuery('#MultisiteDispatchPopup').modal('hide');
            }
            // this.EditWHList=null;
            if (data.WHData != null && data.WHData != "" && data.WHData.length > 0) {
              this.EditWHList = data.WHData;
              var whAddress = data.WHData.filter(
                m => m.Id === parseInt(data.Data[0].ShippedfromWHId));
              this.model.ShippedWHAddress = whAddress[0].WHAddress;
              this.model.ShippedfromWHId = whAddress[0].Id;
            }
            // this.model.ShippedfromWHId = '' + data.Data[0].ShippedfromWHId + '';
            if (this.model.TrasporationMode == TransPortModeType.ByRoad) {
              this.model.TransporterId = data.Data[0].Transporter_Id;
              this.model.TransporterName = data.Data[0].TrasporationName;
              this.model.TransporterGSTNo = data.Data[0].TrasporationGSTNO;
              this.model.DriverName = data.Data[0].DriverName;
              this.model.DriverPhoneNo = data.Data[0].PhoneNo;
            }
            else if (this.model.TrasporationMode == TransPortModeType.ByBus) {
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
                this.model.TransporterId = "";
              }
              this.model.DocketNo = data.Data[0].CodeAndNo;
              this.model.CourierCompanyName = data.Data[0].TrasporationName;
              this.model.CourierPhoneNo = data.Data[0].PhoneNo;
            } else if (this.model.TrasporationMode == TransPortModeType.Other) {
              this.model.Name = data.Data[0].TrasporationName;
              this.model.PhoneNo = data.Data[0].PhoneNo;
            }
            if (data.Data[0].IstransferTypeId != null || data.Data[0].IstransferTypeId != "") {
              if (this.model.TransferTypeId == PageActivity.Srn_SiteWithinState) {
                this.model.SiteId = data.Data[0].Site_Id;
                this.model.SiteName = data.Data[0].SiteName;
                this.model.CuValueSiteId = data.Data[0].CustomerSiteId;
                this.model.HideCustomerId = data.Data[0].CustomerSiteId;
                this.model.SiteAddress = data.Data[0].SiteAddress;
                this.model.CuUniqueSiteId = data.Data[0].Site_Id;
                this.model.ClientName = data.Data[0].ClientName;
                this.model.CompanyName = data.Data[0].CompanyName;
                this.IsRecivedbyandNo = true;
                this.IsRecivedbyandNoOther = false;
                this.EditDispatchToTransferType(this.model.TransferTypeId);
                //brahamjot kaur 26/09/2022
                this.GetAllDispatchInstructionNoEdit(this.model.ShippedfromWHId, Id, data.Data[0].SRNInstructionId);
                var objVendorOrWh = new VendorOrWhModel();
                objVendorOrWh.Id = this.CompanyId;
                this._MaterialMovementService.GetAllState(objVendorOrWh).subscribe(data1 => {
                  if (data1.Status == 1) {
                    if (data1.Data != null && data1.Data != "") {
                      this.OtherSiteStateList = data1.Data.filter(m => m.id != 0).reduce(
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

                // this.bindTechCoh(this.model.SiteId, data.Data[0].FE_Tech, data.Data[0].COH_CI);
                this.TechDataList = null;
                this.COHDataList = null;

                try {
                  var objdropdownmodel = new DropdownModel();
                  objdropdownmodel.Other_Id = this.model.SiteId;
                  objdropdownmodel.Company_Id = this.CompanyId;
                  this._MaterialMovementService.GetAllEmployeeNameListBySiteId(objdropdownmodel).pipe(first()).subscribe(Emp1 => {
                    if (Emp1.TECHFEData != '') {
                      this.TechDataList = Emp1.TECHFEData;
                      if (data.Data[0].FE_Tech != null && data.Data[0].FE_Tech != "") {
                        this.model.TECHFE = '' + data.Data[0].FE_Tech + '';
                      } else {
                        this.model.TECHFE = "0";
                      }
                    }
                    if (Emp1.COHCIData != '') {
                      this.COHDataList = Emp1.COHCIData;
                      if (data.Data[0].COH_CI != null && data.Data[0].COH_CI != "") {
                        this.model.COHCI = '' + data.Data[0].COH_CI + '';
                      } else {
                        this.model.COHCI = "0";
                      }
                    }
                  }, error => {
                    this._Commonservices.ErrorFunction(this.UserName, error.message, "GetAllTechCOHbySiteId", "SRN");
                  });
                } catch (Error) {
                  this._Commonservices.ErrorFunction(this.UserName, Error.message, "GetAllTechCOHbySiteId", "SRN");
                }
              } else if (this.model.TransferTypeId == PageActivity.Srn_SiteOtherState) {
                this.EditDispatchToTransferType(this.model.TransferTypeId);
                //brahamjot kaur 26/09/2022
                this.GetAllDispatchInstructionNoEdit(this.model.ShippedfromWHId, Id, data.Data[0].SRNInstructionId);
                var objVendorOrWh = new VendorOrWhModel();
                objVendorOrWh.Id = this.CompanyId;
                this._MaterialMovementService.GetAllState(objVendorOrWh).subscribe(data1 => {
                  if (data1.Status == 1) {
                    if (data1.Data != null && data1.Data != "") {
                      this.OtherSiteStateList = data1.Data.filter(m => m.id != 0).reduce(
                        (accumulator, current) => {
                          if (!accumulator.some(x => x.id === current.id)) {
                            accumulator.push(current)
                          }
                          return accumulator;
                        }, []
                      )
                      FilterStateCode = null;
                      var FilterStateCode = this.OtherSiteStateList.filter(
                        m => m.id === parseInt(data.Data[0].ToState_Id));

                      if (FilterStateCode.length > 0) {
                        if (FilterStateCode[0].GSTNo != null) {
                          this.StateGSTNo = FilterStateCode[0].GSTNo;
                          //vishal, 09/02/2023
                          this.model.SiteRegdOffice = FilterStateCode[0].regOfficeAddress;
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

                this.model.ToSiteStateId = '' + data.Data[0].ToState_Id + '';
                this.model.ToSiteWHGSTIN = data.Data[0].ShippedToGSTNO;
                this.model.ToSiteStateCode = data.Data[0].ShippedToStateCode;
                this.model.SiteId = data.Data[0].Site_Id;
                this.model.SiteName = data.Data[0].SiteName;
                this.model.CuValueSiteId = data.Data[0].CustomerSiteId;
                this.model.HideCustomerId = data.Data[0].CustomerSiteId;
                this.model.SiteAddress = data.Data[0].SiteAddress;
                this.model.CuUniqueSiteId = data.Data[0].Site_Id;
                this.model.ClientName = data.Data[0].ClientName;
                this.model.CompanyName = data.Data[0].CompanyName;

                //this.GetAllTechCOHbySiteId(this.model.SiteId);
                if (data.Data[0].GSTTypeId != null || data.Data[0].GSTTypeId != "") {
                  this.model.GSTType = '' + data.Data[0].GSTTypeId + '';
                } else {
                  this.model.GSTType = 0;
                }
                if (data.Data[0].GSTTypeId == 2) {
                  this.ClientGSTNo = data.Data[0].ShippedToGSTNO;
                }
                this.IsRecivedbyandNo = true;
                this.IsRecivedbyandNoOther = false;
                //this.bindTechCoh(this.model.SiteId, data.Data[0].FE_Tech, data.Data[0].COH_CI);
                this.TechDataList = null;
                this.COHDataList = null;
                try {
                  var objdropdownmodel = new DropdownModel();
                  objdropdownmodel.Other_Id = this.model.SiteId;
                  objdropdownmodel.Company_Id = this.CompanyId;
                  this._MaterialMovementService.GetAllEmployeeNameListBySiteId(objdropdownmodel).pipe(first()).subscribe(Emp2 => {
                    if (Emp2.TECHFEData != '') {
                      this.TechDataList = Emp2.TECHFEData;
                      if (data.Data[0].FE_Tech != null && data.Data[0].FE_Tech != "") {
                        this.model.TECHFE = '' + data.Data[0].FE_Tech + '';
                      } else {
                        this.model.TECHFE = "0";
                      }
                    }
                    if (Emp2.COHCIData != '') {
                      this.COHDataList = Emp2.COHCIData;
                      if (data.Data[0].COH_CI != null && data.Data[0].COH_CI != "") {
                        this.model.COHCI = '' + data.Data[0].COH_CI + '';
                      } else {
                        this.model.COHCI = "0";
                      }
                    }
                  }, error => {
                    this._Commonservices.ErrorFunction(this.UserName, error.message, "GetAllTechCOHbySiteId", "SRN");
                  });
                } catch (Error) {
                  this._Commonservices.ErrorFunction(this.UserName, Error.message, "GetAllTechCOHbySiteId", "SRN");
                }
              }
            }
          }
          if (data.ItemData != null && data.ItemData != "" && data.ItemData.length > 0) {
            if (this.model.ReqAndRecvedClickId == 1 && data.Data[0].IsReceived == 0) {
              this.SRNRecivedtable = false;
              this.IsReceivingField = false;
              this.BindItemArray(data.ItemData);
            } else if (this.model.ReqAndRecvedClickId == 2 && data.Data[0].IsReceived == 0) {
              this.SRNRecivedtable = true;
              this.IsItemListDisabled = true;
              this.IsReceivingField = true;
              this.BindItemArray(data.ItemData);
              this.BindReceivedItemArray(data.ItemData)
            } else if (this.model.ReqAndRecvedClickId == 2 && data.Data[0].IsReceived == 1) {
              this.SRNRecivedtable = true;
              this.IsItemListDisabled = true;
              this.IsReceivingField = true;
              this.CorrectionItemCodeList = JSON.parse(data.Data[0].CorrectionItemCodeList);
              this.BindItemArray(data.ItemData);
              this.BindReceivedItemArray(data.ItemData)
            }
          }
        }
      }, error => {
        this._Commonservices.ErrorFunction(this.UserName, error.message, "SearchDispatchTrackerEditListByDispatchId", "SRN");
      });
    } catch (Error) {
      this._Commonservices.ErrorFunction(this.UserName, Error.message, "SearchDispatchTrackerEditListByDispatchId", "SRN");
    }
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
  SRNDocumentViewfileClick() {
    window.open(this.SrnDocumentFile);
  }
  ////#region  Change Ravinder
  async BindReceivedItemArray(ItemEditDataArr: any) {
    this.ReceiveddynamicArray = [];
    if (ItemEditDataArr != null && ItemEditDataArr != "") {
      for (var i = 0, len = ItemEditDataArr.length; i < len; i++) {
        var objRecdynamic = new DynamicItemGrid();
        objRecdynamic.Id = ItemEditDataArr[i].Id;
        objRecdynamic.IsCorrection = false;
        if (ItemEditDataArr[i].IsCorrectionEntryReason != 0) {
          objRecdynamic.IsCorrectionEntryReason = ItemEditDataArr[i].IsCorrectionEntryReason;
        } else {
          objRecdynamic.IsCorrectionEntryReason = "0";
        }
        objRecdynamic.CorrectionEntryRemarks = ItemEditDataArr[i].CorrectionEntryRemarks;
        objRecdynamic.ItemNameId = ItemEditDataArr[i].ItemNameId;
        objRecdynamic.EditItemMake = JSON.parse(ItemEditDataArr[i].ItemMakeList);
        objRecdynamic.ItemMakeId = ItemEditDataArr[i].MakeMaster_Id;
        objRecdynamic.EditItemCode = JSON.parse(ItemEditDataArr[i].ItemCodeList)
        objRecdynamic.UnitList = JSON.parse(ItemEditDataArr[i].UnitList);

        // hemant tyagi
        if (ItemEditDataArr[i].SerialNoList === null) {
          objRecdynamic.GSerialNumbers = [];
        } else {
          objRecdynamic.GSerialNumbers = JSON.parse(ItemEditDataArr[i].SerialNoList);
        }

        objRecdynamic.ItemId = ItemEditDataArr[i].ItemId;
        objRecdynamic.EqTypeId = ItemEditDataArr[i].EqpType_Id;
        objRecdynamic.ItemDescription = ItemEditDataArr[i].ItemDescription;
        objRecdynamic.SubDescription = ItemEditDataArr[i].SubDescription;
        objRecdynamic.ItemId = ItemEditDataArr[i].ItemId;

        if (ItemEditDataArr[i].ClientId != "" && ItemEditDataArr[i].ClientId != null) {
          objRecdynamic.ClientId = ItemEditDataArr[i].ClientId;
        } else {
          objRecdynamic.ClientId = "0";
        }
        //objdynamic.ReceivedInWH = ItemEditDataArr[i].ReceivedInWH;
        if (ItemEditDataArr[i].ReasonId != "" && ItemEditDataArr[i].ReasonId != null) {
          objRecdynamic.ReasonId = ItemEditDataArr[i].ReasonId;
        } else {
          objRecdynamic.ReasonId = "0";
        }
        objRecdynamic.Remarks = ItemEditDataArr[i].Remarks;
        objRecdynamic.Rate = parseFloat(ItemEditDataArr[i].Rate).toFixed(2);
        objRecdynamic.HSN = ItemEditDataArr[i].HSN_SAC;
        objRecdynamic.TotalAmount = ItemEditDataArr[i].TotalAmount;
        objRecdynamic.Discount = ItemEditDataArr[i].Discount;
        objRecdynamic.GetTotalAmount = ItemEditDataArr[i].GrandTotalAmt;

        if (objRecdynamic.ItemNameId == CommonStaticClass.MSTItemNameId) {
          if (ItemEditDataArr[i].UnitMaster_Id == "2") {
            objRecdynamic.UnitName = ItemEditDataArr[i].UnitMaster_Id;
            objRecdynamic.HideShowConValue = false;
            objRecdynamic.ReceivedQty = parseFloat(ItemEditDataArr[i].Qty).toFixed(2);
          } else {
            objRecdynamic.HideShowConValue = true;
            objRecdynamic.ConversionValue = null;
            objRecdynamic.HideConversionValue = null;
            objRecdynamic.UnitName = ItemEditDataArr[i].UnitMaster_Id;
            objRecdynamic.ConversionUnit = ItemEditDataArr[i].ConversionUnit;
            objRecdynamic.HideConversionValue = ((ItemEditDataArr[i].ConversionValue) / (ItemEditDataArr[i].Qty));
            objRecdynamic.ReceivedQty = parseFloat(ItemEditDataArr[i].Qty).toFixed(2);
            objRecdynamic.ConversionValue = parseFloat(ItemEditDataArr[i].ConversionValue).toFixed(2);
          }
          var objVendormodel = new VendorOrWhModel();
          objVendormodel.Id = objRecdynamic.ItemId;
          objVendormodel.flag = 'ItemMaster';
          this._Commonservices.getSrnRecivedVendorOrWh(objVendormodel).pipe(first()).subscribe(data => {
            if (objRecdynamic.ItemNameId == CommonStaticClass.MSTItemNameId && data.Data[0].UnitList.length == 1) {
              objRecdynamic.ConversionUnit = "";
              objRecdynamic.HideConversionValue = "";
              objRecdynamic.IsConversion = "";
              objRecdynamic.HideShowConValue = false;
              objRecdynamic.ReceivedQty = parseFloat(ItemEditDataArr[i].Qty).toFixed(2);
            }
            else if (objRecdynamic.ItemNameId == CommonStaticClass.MSTItemNameId && data.Data[0].UnitList.length != 1) {
              if (data.Data[0].IsConversion != null && data.Data[0].IsConversion != 0) {
                objRecdynamic.ConversionUnit = data.Data[0].ConversionUnit;
                objRecdynamic.IsConversion = data.Data[0].IsConversion
                objRecdynamic.HideConversionValue = data.Data[0].ConversionValue;
                objRecdynamic.ChangeUnitConversionUnit = data.Data[0].ConversionUnit;
                objRecdynamic.ChangeUnitIsConversion = data.Data[0].IsConversion
                objRecdynamic.ChangeUnitHideConversionValue = data.Data[0].ConversionValue;
              }
            }
          }, error => {
            this._Commonservices.ErrorFunction(this.UserName, error.message, "EditItem", "SRN");
          });
        } else {
          if (ItemEditDataArr[i].ConversionUnit == "" || ItemEditDataArr[i].ConversionUnit == null) {
            objRecdynamic.HideShowConValue = false;
            if (ItemEditDataArr[i].UnitMaster_Id != null) {
              objRecdynamic.UnitName = ItemEditDataArr[i].UnitMaster_Id;
            } else {
              objRecdynamic.UnitName = "0";
            }
            objRecdynamic.ReceivedQty = parseFloat(ItemEditDataArr[i].Qty).toFixed(2);
          } else {
            objRecdynamic.HideShowConValue = true;
            //objdynamic.UnitName = ItemEditDataArr[i].ConversionUnit;
            //objdynamic.ConversionUnit = ItemEditDataArr[i].UnitName;
            if (ItemEditDataArr[i].UnitMaster_Id != null) {
              objRecdynamic.UnitName = ItemEditDataArr[i].UnitMaster_Id;
            } else {
              objRecdynamic.UnitName = "0";
            }
            objRecdynamic.ConversionValue = parseFloat(ItemEditDataArr[i].ConversionValue).toFixed(2);
            objRecdynamic.ReceivedQty = parseFloat(ItemEditDataArr[i].Qty).toFixed(2);
          }

        }

        // if (ItemEditDataArr[i].ConversionUnit == "" || ItemEditDataArr[i].ConversionUnit == null) {
        //   objRecdynamic.HideShowConValue = false;
        //   if (ItemEditDataArr[i].UnitMaster_Id != null) {
        //     objRecdynamic.UnitName = ItemEditDataArr[i].UnitMaster_Id;
        //   } else {
        //     objRecdynamic.UnitName = "0";
        //   }
        //   // objRecdynamic.UnitName = ItemEditDataArr[i].UnitName;
        //   //objRecdynamic.Qty = parseFloat(ItemEditDataArr[i].Qty).toFixed(2);
        //   objRecdynamic.ReceivedQty = parseFloat(ItemEditDataArr[i].Qty).toFixed(2);

        // } else {
        //   objRecdynamic.HideShowConValue = true;
        //   objRecdynamic.UnitName = ItemEditDataArr[i].ConversionUnit;
        //   objRecdynamic.ConversionUnit = ItemEditDataArr[i].UnitName;

        //   // objRecdynamic.Qty = parseFloat(ItemEditDataArr[i].ConversionValue).toFixed(2);
        //   objRecdynamic.ReceivedQty = parseFloat(ItemEditDataArr[i].ConversionValue).toFixed(2);
        //   objRecdynamic.ConversionValue = parseFloat(ItemEditDataArr[i].Qty).toFixed(2);
        // }
        var MfDate = ItemEditDataArr[i].ManufacturerDate;
        if (MfDate != null && MfDate != '') {
          var MfDate = ItemEditDataArr[i].ManufacturerDate.split('/');
          objRecdynamic.ManufDate = { year: parseInt(MfDate[2]), month: parseInt(MfDate[1]), day: parseInt(MfDate[0]) };
        }
        objRecdynamic.SerialNo = ItemEditDataArr[i].ManufacturerSerialNo;
        var INVCDate = ItemEditDataArr[i].InvoiceTaxDate;
        if (INVCDate != null && INVCDate != '') {
          var INVCDate = ItemEditDataArr[i].InvoiceTaxDate.split('/');
          objRecdynamic.InvoiceTaxDate = { year: parseInt(INVCDate[2]), month: parseInt(INVCDate[1]), day: parseInt(INVCDate[0]) };
        }
        objRecdynamic.InvoiceTaxNo = ItemEditDataArr[i].InvoiceTaxNo;
        if (ItemEditDataArr[i].IGSTValue != null) {
          objRecdynamic.IGSTValue = ItemEditDataArr[i].IGSTValue;
        } else {
          objRecdynamic.IGSTValue = 0;
        }
        objRecdynamic.IGST = ItemEditDataArr[i].IGST;
        //brahamjot kaur 26/09/2022
        objRecdynamic.CustomerSiteId = ItemEditDataArr[i].CustomerSiteId;
        objRecdynamic.DIList_Id = ItemEditDataArr[i].DIList_Id;

        this.ReceiveddynamicArray.push(objRecdynamic);
        this.fnBindReceivedItemGrossToatal();
        this.fnBindIReceivedGSTValueItemGrossToatal();
      }
    }
  }

  fnBindReceivedItemGrossToatal() {
    var totalamount = 0.0;
    var totalqty = 0.0;
    var totalpoqty = 0.0;
    var poqty = 0.0;
    var DiscountAmt = 0.0;
    var Rate = 0.0;
    this.totalSumReceivedPOQuantity = 0.0;
    var HideConValue = 0.0;
    for (var i = 0, len = this.ReceiveddynamicArray.length; i < len; i++) {
      poqty = parseFloat(this.ReceiveddynamicArray[i].ReceivedQty == "" ? 0.0 : this.ReceiveddynamicArray[i].ReceivedQty);
      DiscountAmt = parseFloat(this.ReceiveddynamicArray[i].Discount == "" ? 0.0 : this.ReceiveddynamicArray[i].Discount);
      Rate = parseFloat(this.ReceiveddynamicArray[i].Rate == "" ? 0.0 : this.ReceiveddynamicArray[i].Rate);
      if (this._Commonservices.checkUndefined(this.ReceiveddynamicArray[i].HideConversionValue) != "") {
        HideConValue = parseFloat(this.ReceiveddynamicArray[i].HideConversionValue == "" ? 0.0 : this.ReceiveddynamicArray[i].HideConversionValue);
        this.ReceiveddynamicArray[i].ConversionValue = (poqty * HideConValue)
      }
      totalpoqty += poqty;
      totalamount += ((poqty * Rate) - DiscountAmt);
      this.ReceiveddynamicArray[i].TotalAmount = this._Commonservices.thousands_separators(poqty * Rate);
      this.ReceiveddynamicArray[i].GetTotalAmount = this._Commonservices.thousands_separators((poqty * Rate) - DiscountAmt);
    }
    this.totalSumReceivedPOQuantity = totalpoqty.toFixed(2);
    this.totalSumQuantity = totalqty.toFixed(2);
    this.ValidationtotalSumAmount = totalamount;
    this.model.AmountChargeable = this._Commonservices.valueInWords(totalamount.toFixed(2));
    this.totalSumReceivedAmount = this._Commonservices.thousands_separators(totalamount);
  }

  fnBindIReceivedGSTValueItemGrossToatal() {
    var totalamount = 0;
    var totalqty = 0.0;
    var totalpoqty = 0.0;
    var poqty = 0.0;
    var IGSTval = 0.0;
    var IGSTAmount = 0.0;
    var Rate = 0.0;
    this.totalSumQuantity = 0.0;
    var HideConValue = 0.0;
    for (var i = 0, len = this.ReceiveddynamicArray.length; i < len; i++) {
      poqty = parseFloat(this.ReceiveddynamicArray[i].ReceivedQty == "" ? 0.0 : this.ReceiveddynamicArray[i].ReceivedQty);
      Rate = parseFloat(this.ReceiveddynamicArray[i].Rate == "" ? 0.0 : this.ReceiveddynamicArray[i].Rate);
      if (this._Commonservices.checkUndefined(this.ReceiveddynamicArray[i].HideConversionValue) != "") {
        HideConValue = parseFloat(this.ReceiveddynamicArray[i].HideConversionValue == "" ? 0.0 : this.ReceiveddynamicArray[i].HideConversionValue);
        this.ReceiveddynamicArray[i].ConversionValue = (poqty * HideConValue)
      }
      IGSTval = parseFloat(this.ReceiveddynamicArray[i].IGSTValue == "" ? 0.0 : this.ReceiveddynamicArray[i].IGSTValue);
      totalpoqty += poqty;
      //totalamount+=((poqty*Rate)-DiscountAmt);
      this.ReceiveddynamicArray[i].TotalAmount = this._Commonservices.thousands_separators(poqty * Rate);
      this.ReceiveddynamicArray[i].IGST = (((poqty * Rate) * IGSTval) / 100);
      this.ReceiveddynamicArray[i].GetTotalAmount = this._Commonservices.thousands_separators((poqty * Rate) + (((poqty * Rate) * IGSTval) / 100));
      IGSTAmount = ((poqty * Rate) + (((poqty * Rate) * IGSTval) / 100));
      totalamount += IGSTAmount;
    }
    this.totalSumReceivedPOQuantity = totalpoqty.toFixed(2);
    this.totalSumQuantity = totalqty.toFixed(2);
    this.ValidationtotalSumAmount = totalamount;
    this.model.AmountChargeable = this._Commonservices.valueInWords(totalamount);
    this.totalSumReceivedAmount = this._Commonservices.thousands_separators(totalamount.toFixed(2));
  }
  ////#endregion
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
        objdynamic.UnitList = JSON.parse(ItemEditDataArr[i].UnitList);
        objdynamic.ItemId = ItemEditDataArr[i].ItemId;
        objdynamic.EqTypeId = ItemEditDataArr[i].EqpType_Id;
        objdynamic.ItemDescription = ItemEditDataArr[i].ItemDescription;
        objdynamic.SubDescription = ItemEditDataArr[i].SubDescription;
        objdynamic.ItemId = ItemEditDataArr[i].ItemId;
        //Change Ravinder
        if (ItemEditDataArr[i].ClientId != "" && ItemEditDataArr[i].ClientId != null) {
          objdynamic.ClientId = ItemEditDataArr[i].ClientId;
        } else {
          objdynamic.ClientId = "0";
        }
        //objdynamic.ReceivedInWH = ItemEditDataArr[i].ReceivedInWH;
        if (ItemEditDataArr[i].ReasonId != "" && ItemEditDataArr[i].ReasonId != null) {
          objdynamic.ReasonId = ItemEditDataArr[i].ReasonId;
        } else {
          objdynamic.ReasonId = "0";
        }
        objdynamic.Remarks = ItemEditDataArr[i].Remarks;
        objdynamic.Rate = parseFloat(ItemEditDataArr[i].Rate).toFixed(2);
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
            if (objdynamic.ItemNameId == CommonStaticClass.MSTItemNameId && objdynamic.UnitList.length == 1) {
              objdynamic.ConversionUnit = "";
              objdynamic.HideConversionValue = "";
              objdynamic.IsConversion = "";
              objdynamic.HideShowConValue = false;
              objdynamic.Qty = parseFloat(ItemEditDataArr[i].Qty).toFixed(2);
            } else if (objdynamic.ItemNameId == CommonStaticClass.MSTItemNameId && objdynamic.UnitList.length != 1) {
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
            this._Commonservices.ErrorFunction(this.UserName, error.message, "EditItem", "SRN");
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
            //objdynamic.ConversionUnit = ItemEditDataArr[i].ConversionUnit;
            if (ItemEditDataArr[i].UnitMaster_Id != null) {
              objdynamic.UnitName = ItemEditDataArr[i].UnitMaster_Id;
            } else {
              objdynamic.UnitName = "0";
            }
            objdynamic.ConversionValue = parseFloat(ItemEditDataArr[i].ConversionValue).toFixed(2);
            objdynamic.Qty = parseFloat(ItemEditDataArr[i].Qty).toFixed(2);
          }

        }


        // if (ItemEditDataArr[i].ConversionUnit == "" || ItemEditDataArr[i].ConversionUnit == null) {
        //   objdynamic.HideShowConValue = false;
        //     if (ItemEditDataArr[i].UnitMaster_Id != null) {
        //       objdynamic.UnitName = ItemEditDataArr[i].UnitMaster_Id;
        //     } else {
        //       objdynamic.UnitName = "0";
        //     }
        //   // objdynamic.UnitName = ItemEditDataArr[i].UnitName;
        //   objdynamic.Qty = parseFloat(ItemEditDataArr[i].Qty).toFixed(2);
        //   // objdynamic.ReceivedQty = parseFloat(ItemEditDataArr[i].Qty).toFixed(2);
        // } else {
        //   objdynamic.HideShowConValue = true;
        //   objdynamic.UnitName = ItemEditDataArr[i].ConversionUnit;
        //   objdynamic.ConversionUnit = ItemEditDataArr[i].UnitName;
        //   objdynamic.Qty = parseFloat(ItemEditDataArr[i].ConversionValue).toFixed(2);
        //   //objdynamic.ReceivedQty = parseFloat(ItemEditDataArr[i].ConversionValue).toFixed(2);
        //   objdynamic.ConversionValue = parseFloat(ItemEditDataArr[i].Qty).toFixed(2);
        // }
        objdynamic.HSN = ItemEditDataArr[i].HSN_SAC;
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
        objdynamic.IGST = ItemEditDataArr[i].IGST;

        //brahamjot kaur 26/09/2022
        objdynamic.CustomerSiteId = ItemEditDataArr[i].CustomerSiteId;
        objdynamic.DIList_Id = ItemEditDataArr[i].DIList_Id;

        this.dynamicArray.push(objdynamic);
        this.fnBindItemGrossToatl();
        this.fnBindIGSTValueItemGrossToatal();
      }
    }
  }


  fnBindItemGrossToatl() {
    var totalamount = 0.0;
    var totalqty = 0.0;
    var totalpoqty = 0.0;
    var poqty = 0.0;
    var DiscountAmt = 0.0;
    var Rate = 0.0;
    this.totalSumQuantity = 0.0;
    var HideConValue = 0.0;
    for (var i = 0, len = this.dynamicArray.length; i < len; i++) {
      poqty = parseFloat(this.dynamicArray[i].Qty == "" ? 0.0 : this.dynamicArray[i].Qty);
      DiscountAmt = parseFloat(this.dynamicArray[i].Discount == "" ? 0.0 : this.dynamicArray[i].Discount);
      Rate = parseFloat(this.dynamicArray[i].Rate == "" ? 0.0 : this.dynamicArray[i].Rate);
      if (this._Commonservices.checkUndefined(this.dynamicArray[i].HideConversionValue) != "") {
        HideConValue = parseFloat(this.dynamicArray[i].HideConversionValue == "" ? 0.0 : this.dynamicArray[i].HideConversionValue);
        this.dynamicArray[i].ConversionValue = (poqty * HideConValue)
      }
      totalpoqty += poqty;
      totalamount += ((poqty * Rate) - DiscountAmt);

      this.dynamicArray[i].TotalAmount = this._Commonservices.thousands_separators(poqty * Rate);
      this.dynamicArray[i].GetTotalAmount = this._Commonservices.thousands_separators((poqty * Rate) - DiscountAmt);
    }
    this.totalSumPOQuantity = totalpoqty.toFixed(2);
    this.totalSumQuantity = totalqty.toFixed(2);
    this.ValidationtotalSumAmount = totalamount;
    this.model.AmountChargeable = this._Commonservices.valueInWords(totalamount.toFixed(2));
    this.totalSumAmount = this._Commonservices.thousands_separators(totalamount);
  }
  fnBindIGSTValueItemGrossToatal() {
    var totalamount = 0;
    var totalqty = 0.0;
    var totalpoqty = 0.0;
    var poqty = 0.0;
    var IGSTval = 0.0;
    var IGSTAmount = 0.0;
    var Rate = 0.0;
    this.totalSumQuantity = 0.0;
    var HideConValue = 0.0;
    for (var i = 0, len = this.dynamicArray.length; i < len; i++) {
      poqty = parseFloat(this.dynamicArray[i].Qty == "" ? 0.0 : this.dynamicArray[i].Qty);
      Rate = parseFloat(this.dynamicArray[i].Rate == "" ? 0.0 : this.dynamicArray[i].Rate);
      if (this._Commonservices.checkUndefined(this.dynamicArray[i].HideConversionValue) != "") {
        HideConValue = parseFloat(this.dynamicArray[i].HideConversionValue == "" ? 0.0 : this.dynamicArray[i].HideConversionValue);
        this.dynamicArray[i].ConversionValue = (poqty * HideConValue)
      }
      IGSTval = parseFloat(this.dynamicArray[i].IGSTValue == "" ? 0.0 : this.dynamicArray[i].IGSTValue);
      totalpoqty += poqty;
      //totalamount+=((poqty*Rate)-DiscountAmt);
      this.dynamicArray[i].TotalAmount = this._Commonservices.thousands_separators(poqty * Rate);
      this.dynamicArray[i].IGST = (((poqty * Rate) * IGSTval) / 100);
      this.dynamicArray[i].GetTotalAmount = this._Commonservices.thousands_separators((poqty * Rate) + (((poqty * Rate) * IGSTval) / 100));
      IGSTAmount = ((poqty * Rate) + (((poqty * Rate) * IGSTval) / 100));
      totalamount += IGSTAmount;
    }
    this.totalSumPOQuantity = totalpoqty.toFixed(2);
    this.totalSumQuantity = totalqty.toFixed(2);
    this.ValidationtotalSumAmount = totalamount;
    this.model.AmountChargeable = this._Commonservices.valueInWords(totalamount);
    this.totalSumAmount = this._Commonservices.thousands_separators(totalamount.toFixed(2));
  }

  BackPage() {
    this.isShownList = false;
    this.isShownEdit = true;
    this.model.SecondReqAndRecvedClickId = 0;
    this.model.ReqAndRecvedClickId = 0;
    //this.model.DispatchNo= ""
  }

  ChangeSiteOtherState(StId: any) {
    this.StateGSTNo = null;
    $("#txtToSiteStateId").css('border-color', '');
    var FilterStateCode = this.OtherSiteStateList.filter(
      m => m.id === parseInt(StId));
    this.model.ToSiteStateCode = FilterStateCode[0].Code;
    this.model.ToSiteWHGSTIN = FilterStateCode[0].GSTNo;
    this.model.SiteRegdOffice = FilterStateCode[0].regOfficeAddress;//vishal, 09/02/2023
    this.model.PreviewToStateName = FilterStateCode[0].itemName;
    this.StateGSTNo = FilterStateCode[0].GSTNo;

    //hemant tyagi 15/02/2023
    //this.model.GSTType = 1;
    this.ChangeGSTType(1);
    this.AutoCompleteCustomerSiteIdList = [];
    this.model.CuValueSiteId = "";
    this.model.SiteId = 0;
    this.model.SiteName = "";
    this.model.HideCustomerId = 0;
    this.model.SiteAddress = "";
    this.model.CuUniqueSiteId = "";
    this.model.ClientName = "";
    this.model.CompanyName = "";

  }

  clearEditForm() {
    this.model.TranporterId = "0";
    this.model.EditStateId = '0';
    this.model.ShippedfromWHId = "0";
    //this.model.SRNInstructionId = "0"; //brahamjot kaur 15/7/2022
    //this.model.SRNInstructionId = "0"; //brahamjot kaur 21/9/2022
    this.selectedDIArr = []; //brahamjot kaur 26/09/2022
    this.model.ddlVehicleType = "0";
    this.model.TransferTypeId = 0;
    this.model.LoadingCapcity = "";
    this.model.IsDispatch = 0;
    this.dynamicArray = [];
    this.ReceiveddynamicArray = [];
    this.StateCodeWhAd = [];
    this.totalSumQuantity = "";
    this.totalSumAmount = "";
    this.totalSumPOQuantity = "";
    this.model.ddlStateId = '0';
    this.model.StateCode = "";
    this.model.RegdOffice = "";
    this.model.SiteRegdOffice = ""; //vishal, 09/02/2023
    this.model.WHAddress = "";
    this.model.ShippedWHAddress = "";
    this.model.GSTINNo = "";
    this.model.CIN = "";
    this.model.WHState = "";
    this.model.DocumentNo = "";
    //this.model.DocumentDate = "";
    this.model.TransporterId = "";
    this.model.TrasporationMode = "0";
    this.model.TransporterName = "";
    this.model.TransporterGSTNo = "";
    this.model.Destination = "";
    this.model.GRNo = "";
    this.model.GRDate = "";
    this.model.VehicleNumber = "";
    this.model.TaxInvoiceNo = "";
    this.model.Note = "1-The Goods mentioned above are 'NOT FOR SALE' ";
    this.model.ReceivedBy = "";
    this.model.ReceivedNo = "";
    this.model.EwayBillNo = "";
    this.IsTransferTypeOtherSite = false;
    this.IsTransferTypeSite = false;
    this.IsTaxInvoiceNo = false;
    this.model.SecTransCost = "";
    this.model.LoadingCost = "";
    this.model.UnloadingCost = "";
    this.model.OtherCharges = "";
    this.model.PrimaryUnloadingCost = "";
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
    this.model.Name = "";
    this.model.PhoneNo = "";
    this.model.AutoDispatchNo = "";
    this.ClearDispatchToSiteToState();
  }
  //#region Correction Entry Work
  ChangeCorrectionEntryReason(index: any) {
    if (this.ReceiveddynamicArray[index].IsCorrectionEntryReason != "" || this.ReceiveddynamicArray[index].IsCorrectionEntryReason != "0") {
      $("#ddlCentryReason_" + index).css('border-color', '');
    }
  }

  ClickCorrectionEntryRemarks(index: any) {
    if (this.ReceiveddynamicArray[index].CorrectionEntryRemarks != "" || this.ReceiveddynamicArray[index].CorrectionEntryRemarks != "0") {
      $("#txtCorrectionEntryRemarks_" + index).css('border-color', '');
    }
  }

  ChangeCorrectionCode(index: any, id: any) {
    var CorrectionAcceptqty = this.CorrectionItemCodeList.filter(m => m.SRNListId === parseInt(id));
    this.ReceiveddynamicArray[index].ReceivedQty = CorrectionAcceptqty[0].Qty;
    if (this.ReceiveddynamicArray[index].IsCorrectionCodeId != "" || this.ReceiveddynamicArray[index].IsCorrectionCodeId != "0") {
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
      this.DispatchTrackingItem = [];
      for (var i = 0, len = this.ReceiveddynamicArray.length; i < len; i++) {
        if (this.ReceiveddynamicArray[i] == this.ReceiveddynamicArray[this.model.arrayId]) {
          var objDispatchTrackingItemDetialModel = new DispatchTrackingItemDetialModel();
          objDispatchTrackingItemDetialModel.Id = this.ReceiveddynamicArray[i].IsCorrectionCodeId;
          objDispatchTrackingItemDetialModel.ItemCode_Id = this.ReceiveddynamicArray[i].ItemId;
          objDispatchTrackingItemDetialModel.Rate = this.ReceiveddynamicArray[i].Rate;
          objDispatchTrackingItemDetialModel.Discount = this.ReceiveddynamicArray[i].Discount;
          objDispatchTrackingItemDetialModel.HSN_SAC = this.ReceiveddynamicArray[i].HSN;
          objDispatchTrackingItemDetialModel.EqpType_Id = this.ReceiveddynamicArray[i].EqTypeId;
          objDispatchTrackingItemDetialModel.ClientId = this.ReceiveddynamicArray[i].ClientId;
          objDispatchTrackingItemDetialModel.SubDescription = this.ReceiveddynamicArray[i].SubDescription;
          objDispatchTrackingItemDetialModel.ReasonId = this.ReceiveddynamicArray[i].ReasonId;
          objDispatchTrackingItemDetialModel.Remarks = this.ReceiveddynamicArray[i].Remarks;
          objDispatchTrackingItemDetialModel.ReceivedInWH = true;
          objDispatchTrackingItemDetialModel.CorrectionEntryRemarks = this.ReceiveddynamicArray[i].CorrectionEntryRemarks;
          objDispatchTrackingItemDetialModel.IsCorrectionEntryReason = this.ReceiveddynamicArray[i].IsCorrectionEntryReason;
          objDispatchTrackingItemDetialModel.IsCorrectionCodeId = this.ReceiveddynamicArray[i].IsCorrectionCodeId;
          var MfDate = this._Commonservices.checkUndefined(this.ReceiveddynamicArray[i].ManufDate);
          if (MfDate != '') {
            objDispatchTrackingItemDetialModel.ManufacturerDate = MfDate.day + '/' + MfDate.month + '/' + MfDate.year;
          } else {
            objDispatchTrackingItemDetialModel.ManufacturerDate = "";
          }
          var conver = this._Commonservices.checkUndefined(this.ReceiveddynamicArray[i].ConversionUnit);
          if (conver == "") {
            objDispatchTrackingItemDetialModel.Qty = this.ReceiveddynamicArray[i].ReceivedQty;
            objDispatchTrackingItemDetialModel.UnitId = this.ReceiveddynamicArray[i].UnitName;
            objDispatchTrackingItemDetialModel.ConversionUnit = "";
            objDispatchTrackingItemDetialModel.ConversionValue = 0;
          } else {
            objDispatchTrackingItemDetialModel.UnitId = this.ReceiveddynamicArray[i].UnitName;
            objDispatchTrackingItemDetialModel.Qty = this.ReceiveddynamicArray[i].ReceivedQty;
            objDispatchTrackingItemDetialModel.ConversionUnit = this.ReceiveddynamicArray[i].ConversionUnit;
            objDispatchTrackingItemDetialModel.ConversionValue = this.ReceiveddynamicArray[i].ConversionValue;
          }
          objDispatchTrackingItemDetialModel.ManufacturerSerialNo = this.ReceiveddynamicArray[i].SerialNo;
          var INVDate = this._Commonservices.checkUndefined(this.ReceiveddynamicArray[i].InvoiceTaxDate);
          if (INVDate != '') {
            objDispatchTrackingItemDetialModel.InvoiceTaxDate = INVDate.day + '/' + INVDate.month + '/' + INVDate.year;
          } else {
            objDispatchTrackingItemDetialModel.InvoiceTaxDate = "";
          }
          objDispatchTrackingItemDetialModel.InvoiceTaxNo = this.ReceiveddynamicArray[i].InvoiceTaxNo;
          objDispatchTrackingItemDetialModel.IGST = this.ReceiveddynamicArray[i].IGST;
          objDispatchTrackingItemDetialModel.IGSTValue = this.ReceiveddynamicArray[i].IGSTValue;
          // objDispatchTrackingItemDetialModel.GSerialNumbers = this.ReceiveddynamicArray[i].GSerialNumbers;
          this.srnlst = [];
          if (this.ReceiveddynamicArray[i].GSerialNumbers.length > 0) {
            if (this.ReceiveddynamicArray[i].ItemNameId == "4" && this.ReceiveddynamicArray[i].UnitName == "8") {
              // Check by Hemant Tyagi
              for (var j = 0; j < this.ReceiveddynamicArray[i].GSerialNumbers.length; j++) {
                for (var k = 0; k < this.ReceiveddynamicArray[i].GSerialNumbers[j].CellNos.length; k++) {
                  var srnData = new GSerialNumber();
                  srnData.InitialSrno = this.ReceiveddynamicArray[i].GSerialNumbers[j].CellNos[k].CellValue;
                  srnData.Sequance = j.toString();
                  this.srnlst.push(srnData)
                }
              }
              objDispatchTrackingItemDetialModel.GSerialNumbers = this.srnlst;
            } else {
              objDispatchTrackingItemDetialModel.GSerialNumbers = this.ReceiveddynamicArray[i].GSerialNumbers;
            }
          }
          this.DispatchTrackingItem.push(objDispatchTrackingItemDetialModel)
        }
      }
      objDispatchTrackingModel.DispatchTrackerItemList = this.DispatchTrackingItem;
      var formdata = new FormData();
      var CurrentDate = this.datePipe.transform(Date(), "dd/MM/yyyy");
      formdata.append('jsonDetail', JSON.stringify(objDispatchTrackingModel));
      this._MaterialMovementService.UpadteCorrectionEntrySRNReceivedDetail(formdata).subscribe(data => {
        //this.Loader.hide();
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
  //#endregion



  //#region Add Upload Multiple Site
  ClickMultipleSite(value: any) {
    // Brahamjot kaur 21/9/2022
    // if (value.currentTarget.checked == true) {
    //   this.MultiSite = [];
    //   if (this.model.SiteId == 0) {
    //     this.model.IsMultipleSite = 0;
    //     alert('Please Select SIte Id');
    //     return false;
    //   }
    //   jQuery('#MultisiteDispatchPopup').modal('show');
    // }
  }


  MultiSiteExcelUpload(evt: any) {
    try {
      this.MultiSite = [];
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
            if (ColuName == "CustomerSiteId") {
              hdr = ColuName
            } else {
              alert("Invalid Column Name _" + ColuName);
              //this.myInputVariable.nativeElement.value = '';
              return false;
            }
          }
          //headers.push(hdr);
        }

        ExeclImportData = <AOA>(XLSX.utils.sheet_to_json(ws, { raw: true }));
        if (ExeclImportData.length > 0 && ExeclImportData != null) {
          for (var j = 0; j < ExeclImportData.length; j++) {
            var objMultiSite = new MultiSite();
            objMultiSite.CustomerSiteId = ExeclImportData[j].CustomerSiteId;
            this.MultiSite.push(objMultiSite);
          }
        }
        this.multiSiteresetExcel();
      };
      reader.readAsBinaryString(target.files[0]);
    } catch (Error) { }
  }

  multiSiteresetExcel() {
    this.inputExcelMultisite.nativeElement.value = "";
  }

  MultiSiteExcelSample: any = [{
    CustomerSiteId: '000212'
  }];

  DownloadMultiSiteExcelSample() {
    this._PurchaseOrderService.exportAsExcelFile(this.MultiSiteExcelSample, 'SampleExcel');
  }

  ClearMultiSelect() {
    this.MultiSite = null;
  }

  AddMultisite() {
    if (this.MultiSite.length == 0 || this.MultiSite == null) {
      return false;
    }
    try {
      var objDispatchMultiSite = new DispatchMultiSite();
      objDispatchMultiSite.UserId = this.UserId;
      objDispatchMultiSite.Company_Id = this.CompanyId;
      objDispatchMultiSite.StateId = this.model.ddlStateId;
      objDispatchMultiSite.MultiSiteList = this.MultiSite;
      var formdata = new FormData();
      formdata.append('jsonDetail', JSON.stringify(objDispatchMultiSite));
      this._MaterialMovementService.DispatchCheckMultiSite(formdata).pipe(first()).subscribe(data => {
        if (data.Status == 2 && data.Value != "") {
          this.AddMultiSite = null;
          alert('your Customer Site Id Not available' + data.Value);
          return false;
        } else {
          this.AddMultiSite = this.MultiSite;
          //alert('your Customer Site Id Successfully Add');
          jQuery('#MultisiteDispatchPopup').modal('hide');
        }
      }, error => {
        this._Commonservices.ErrorFunction(this.UserName, error.message, "DispatchCheckMultiSite", "WHTOSite");
      });
    } catch (Error) {
      this._Commonservices.ErrorFunction(this.UserName, Error.message, "DispatchCheckMultiSite", "WHTOSite");
    }
  }

  MultisitehideModal() {
    if (this.model.DisatchTrackeringId == 0) {
      jQuery('#MultisiteDispatchPopup').modal('hide');
      this.model.IsMultipleSite = 0;
    } else {
      jQuery('#MultisiteDispatchPopup').modal('hide');
    }
  }

  //#endregion


  EditDispatchToTransferType(TransfId: any) {
    //brahamjot kaur 15/7/2022
    this.IsSRNInstraction = false;
    if (TransfId == 0) {
      this.IsTransferTypeOtherSite = false;
      this.IsTransferTypeSite = false;
      this.IsTaxInvoiceNo = false;
    }
    else if (TransfId == PageActivity.Srn_SiteWithinState) {
      this.IsSRNInstraction = true;
      this.IsTransferTypeOtherSite = false;
      this.IsTransferTypeSite = true;
      this.IsTaxInvoiceNo = false;
      this.IsRecivedbyandNo = true;
      this.IsTransferTypeSameState = true;
      this.IsTransferTypeOtherState = false;
    } else if (TransfId == PageActivity.Srn_SiteOtherState) {
      this.IsSRNInstraction = true;
      this.IsTransferTypeOtherSite = true;
      this.IsTransferTypeSite = false;
      this.IsTaxInvoiceNo = true;
      this.IsRecivedbyandNo = true;
      this.IsTransferTypeSameState = false;
      this.IsTransferTypeOtherState = true;
      this.OtherSiteStateList = null;
    }
  }

  ChangeGSTType(Id: any) {
    this.model.ToSiteWHGSTIN = "";
    if (Id == 1) {
      this.model.GSTType = 1;
      this.IsTaxInvoiceNo = true;
      this.model.ToSiteWHGSTIN = this.StateGSTNo
      this.model.previewGStType = "AST GST";
      $("#txtToCompanyName").css('border-color', '');
    } else if (Id == 2) {
      this.IsTaxInvoiceNo = false;
      this.model.ToSiteWHGSTIN = this.ClientGSTNo;
      this.model.previewGStType = "Customer GST";
    } else if (Id == 0) {
      this.model.ToSiteWHGSTIN = "";
      this.model.previewGStType = "";
    }
  }

  ChangeTransferType(TransfId: any) {
    $("#txtTransferType").css('border-color', '');
    //brahamjot kaur 15/7/2022
    this.IsSRNInstraction = false;
    if (this.model.ddlStateId == "0" || this.model.ddlStateId == "0") {
      alert("Please Select State");
      this.model.TransferTypeId = "0";
      return false;
    }
    var DispatchToData = this.TransferDataList.filter(m => m.Id === parseInt(TransfId));
    this.model.PreviewSRNFROMName = DispatchToData[0].PageName;
    if (TransfId == 0) {
      this.IsTransferTypeOtherSite = false;
      this.IsTransferTypeSite = false;
      this.IsTaxInvoiceNo = false;
    }
    else if (TransfId == PageActivity.Srn_SiteWithinState) {
      this.IsSRNInstraction = true;
      this.IsTransferTypeOtherSite = false;
      this.IsTransferTypeSite = true;
      this.IsTaxInvoiceNo = false;
      this.model.ReceivedBy = "";
      this.model.ReceivedNo = "";
      //this.model.Destination="";
      this.IsTransferTypeSameState = true;
      this.IsTransferTypeOtherState = false;
      this.dynamicArray = [];
      this.model.COHCI = "0"
      this.model.TECHFE = "0"
      this.ClearDispatchToSiteToState();
    } else if (TransfId == PageActivity.Srn_SiteOtherState) {
      this.IsSRNInstraction = true;
      this.IsTransferTypeOtherSite = true;
      this.IsTransferTypeSite = false;
      this.IsTaxInvoiceNo = true;
      this.IsRecivedbyandNo = true;
      this.IsRecivedbyandNoOther = false;
      this.model.ReceivedBy = "";
      this.model.ReceivedNo = "";
      //this.model.Destination="";
      this.model.ToSiteStateId = 0;
      this.model.GSTType = "0";
      this.IsTransferTypeSameState = false;
      this.IsTransferTypeOtherState = true;
      this.dynamicArray = [];
      this.model.COHCI = "0"
      this.model.TECHFE = "0"
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
          //  if (data.TechData != null && data.TechData != "") {
          //   this.TechDataList = data.TechData;
          // } if (data.COHData != null && data.COHData != "") {
          //   this.COHDataList = data.COHData;
          // }
        }
      });
      this.ClearDispatchToSiteToOtherState();
    }
  }

  ClearDispatchToSiteToState() {
    this.model.CuValueSiteId = "";
    this.model.SiteId = 0;
    this.model.SiteName = "";
    this.model.HideCustomerId = 0;
    this.model.SiteAddress = "";
    this.model.ToSiteStateId = "0";
    this.model.ToSiteStateCode = "";
    this.model.ToSiteWHGSTIN = "";
    this.model.CuUniqueSiteId = "";
    this.model.ClientName = "";
    this.model.CompanyName = "";

  }

  ClearDispatchToSiteToOtherState() {
    this.model.CuValueSiteId = "";
    this.model.SiteId = 0;
    this.model.SiteName = "";
    this.model.HideCustomerId = 0;
    this.model.SiteAddress = "";
    this.model.ToSiteStateId = "0";
    this.model.ToSiteStateCode = "";
    this.model.ToSiteWHGSTIN = "";
    this.model.CuUniqueSiteId = "";
    this.model.ClientName = "";
    this.model.CompanyName = "";
    this.model.SiteRegdOffice = "";

  }

  //#region  Create SRN Pdf
  GenerateDispatchPdfbyDispatchId(Value: any, RequestId: any) {
    try {
      if (RequestId == 1) {
        this.model.FunctionFlagValue = null;
        this.model.FunctionFlagValue = Value;
        var objModel = new SearchDispatchTrackerModel();
        objModel.DispatchTracker_Id = this.model.DisatchTrackeringId;
        this._SrnPdfServiceService.GenerateSRNPdfById(this.model.FunctionFlagValue,
          this.model.DisatchTrackeringId)
      }
    } catch (Error) {
      this._Commonservices.ErrorFunction(this.UserName, Error.message, "GenerateDispatchPdfbyDispatchId", "SRN");
    }
  }
  //#endregion

  addRow() {
    var objNewItemGrid = new DynamicItemGrid();
    objNewItemGrid.Id = 0;
    objNewItemGrid.ItemNameId = "0";
    objNewItemGrid.ItemMakeId = "0";
    objNewItemGrid.ItemId = "0";
    objNewItemGrid.SiteName = "";
    objNewItemGrid.CustomerSiteId = "";
    objNewItemGrid.ReasonCode = "";
    objNewItemGrid.CustomerCode = "";
    objNewItemGrid.CustomerId = 0;
    objNewItemGrid.HSN = "";
    objNewItemGrid.Qty = "";
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
    objNewItemGrid.ReceivedInWH = false;
    objNewItemGrid.ReceivedQty = "";
    objNewItemGrid.ReasonId = "0";
    objNewItemGrid.UnitName = "0";
    objNewItemGrid.Remarks = "";
    if (this.CompanyId == 4) {
      objNewItemGrid.ClientId = "0";
    } else {
      objNewItemGrid.ClientId = "99999";
    }
    objNewItemGrid.DIList_Id = 0;
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

  addReceivedRow() {
    var objNewItemGrid = new DynamicItemGrid();
    objNewItemGrid.Id = 0;
    objNewItemGrid.ItemNameId = "0";
    objNewItemGrid.ItemMakeId = "0";
    objNewItemGrid.ItemId = "0";
    objNewItemGrid.SiteName = "";
    objNewItemGrid.CustomerSiteId = "";
    objNewItemGrid.ReasonCode = "";
    objNewItemGrid.CustomerCode = "";
    objNewItemGrid.CustomerId = 0;
    objNewItemGrid.HSN = "";
    objNewItemGrid.Qty = "";
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
    objNewItemGrid.ReceivedInWH = false;
    objNewItemGrid.ReceivedQty = "";
    objNewItemGrid.ReasonId = "0";
    objNewItemGrid.Remarks = "";
    objNewItemGrid.UnitName = "0";
    objNewItemGrid.IsCorrectionEntryReason = "0";
    objNewItemGrid.IsCorrectionCodeId = "0";
    if (this.model.IsReceived == 1 && this.RoleCorrectionEntry == true) {
      objNewItemGrid.IsCorrection = true;
      this.Correctioncolumnhideandshow = true;
      objNewItemGrid.IsCorrectionDisabled;
    } else {
      objNewItemGrid.IsCorrection = false;
      this.ItemAddrowhideshow = false;
      this.Correctioncolumnhideandshow = false;
    }
    if (this.CompanyId == 4) {
      objNewItemGrid.ClientId = "0";
    } else {
      objNewItemGrid.ClientId = "99999";
    }
    objNewItemGrid.DIList_Id = 0;
    this.ReceiveddynamicArray.push(objNewItemGrid);
    return true;
  }

  deleteReceivedRow(index) {
    if (this.ReceiveddynamicArray.length == 1) {
      //this.toastr.error("Can't delete the row when there is only one row", 'Warning');  
      return false;
    } else {
      this.ReceiveddynamicArray.splice(index, 1);
      //this.toastr.warning('Row deleted successfully', 'Delete row');  
      // this.fnBindItemGrossToatl();
      return true;
    }
  }

  //#region  validation

  changeTech(Id: any) {
    var TECHFEData = this.TechDataList.filter(
      m => m.Id === parseInt(Id));
    this.model.PreviewTECHFEName = TECHFEData[0].UserName;
    $("#txtTECHFE").css('border-color', '');
  }
  changeCOH(Id: any) {
    var TECHFEData = this.COHDataList.filter(
      m => m.Id === parseInt(Id));
    this.model.PreviewCOHName = TECHFEData[0].UserName;
    $("#txtCOHCI").css('border-color', '');
  }
  OnblurConversionValue() {
    $('#tblOne > tbody  > tr').each(function () {
      var valueReceivedQty = $(this).find('.ConversionValue').val();
      if (valueReceivedQty != '') {
        $(this).find('.ConversionValue').css('border-color', '');
      }
    });
  }

  onKeypressDocumentDate(event: any) {
    $("#txtDeliveredDate").css('border-color', '');
  }
  keypressreceiver() {
    $("#txtReceivedNo").css('border-color', '');
  }
  onKeypresstxtReceivedBy() {
    $("#txtReceivedBy").css('border-color', '');
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
  onKeypressGRDate(event: any) {
    $("#txtGRDate").css('border-color', '');
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
  onKeypressInvoicedDate(event: any) {
    $("#txtReceivedBy").css('border-color', '');
  }
  // ReceiverNoKeyPress()
  // {
  //   $("#txtReceivedNo").css('border-color', '');
  // }
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
  SRNReasonKeypress() {
    $("#txtReasonRemarks").css('border-color', '');
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
  changeSRNReason(Id: any) {
    var FilterData = this.SRNReasonTypeList.filter(m => m.Id === parseInt(Id));
    this.model.SRNReason = FilterData[0].Name;
    $("#txtReasonId").css('border-color', '');
  }
  SerialNoKeyPress() {
    $('#tblOne > tbody  > tr').each(function () {
      var valueItem = $(this).find('.SerialNo').val();
      if (valueItem != '0') {
        $(this).find('.SerialNo').css('border-color', '');
      }
    });
  }
  ReceivedQtyKeyPress() {
    $('#tblOne > tbody  > tr').each(function () {
      var valueItem = $(this).find('.ReceivedQty').val();
      if (valueItem != '') {
        $(this).find('.ReceivedQty').css('border-color', '');
      }
    });
  }
  ChangeClient(ItemId: any, index: any) {
    $('#tblOne > tbody  > tr').each(function () {
      var valueItem = $(this).find('.Client').val();
      if (valueItem != '0') {
        $(this).find('.Client').css('border-color', '');
      }
    });
    var FilterDate = this.ClientList.filter(m => m.Id === parseInt(ItemId));
    this.dynamicArray[index].ClientName = FilterDate[0].Name;
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
  PartialUpdateValidation() {
    var flag = 0;
    //vishal, 06/02/2023
    if (this.model.AutoDispatchNo != "" && (this.model.DispatchNoId == undefined || this.model.DispatchNoId == null
      || this.model.DispatchNoId == 0)) {
      flag = 1;
      alert('Please Select Correct Document No');
    }
    if (this.model.TrasporationMode == "" || this.model.TrasporationMode == "0") {
      $('#txtTrasporationMode').css('border-color', 'red');
      $('#txtTrasporationMode').focus();
      flag = 1;
    } else {
      $("#txtTrasporationMode").css('border-color', '');
    }
    if (this.model.TrasporationMode == TransPortModeType.ByRoad) {
      if (this.model.TransporterId == "") {
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
      if (this.model.DisatchTrackeringId != 0 && this.IsGRFile == false) {
        var GrDocument = this._Commonservices.checkUndefined(this.GRfileDocumentFile);
        if (GrDocument == "") {
          flag = 1;
          alert('Please Select Bilty Document');
        }
      }


    }
    if (this.model.Destination == "" || this.model.Destination == null) {
      $('#txtDestination').css('border-color', 'red');
      $('#txtDestination').focus();
      flag = 1;
    } else {
      $("#txtDestination").css('border-color', '');
    }
    if (this.model.ReasonId == "0" || this.model.ReasonId == null) {
      $('#txtReasonId').css('border-color', 'red');
      flag = 1;
    } else {
      $("#txtReasonId").css('border-color', '');
    }
    return flag;
  }

  CorrectionValidationGRN(index) {
    var flag = 0;
    if (this.ReceiveddynamicArray[index].ItemNameId == "" || this.ReceiveddynamicArray[index].ItemNameId == "null" || this.ReceiveddynamicArray[index].ItemNameId == "0") {
      $('#txtItemNameId_' + index).css('border-color', 'red');
      $('#txtItemNameId_' + index).focus();
      flag = 1;
    } else {
      $("#ddlItemNameId_" + index).css('border-color', '');
    }

    if (this.ReceiveddynamicArray[index].ItemMakeId == "" || this.ReceiveddynamicArray[index].ItemMakeId == "null" || this.ReceiveddynamicArray[index].ItemMakeId == "0") {
      $('#ddlItemMake_' + index).css('border-color', 'red');
      $('#ddlItemMake_' + index).focus();
      flag = 1;
    } else {
      $("#ddlItemMake_" + index).css('border-color', '');
    }

    if (this.ReceiveddynamicArray[index].ItemId == "" || this.ReceiveddynamicArray[index].ItemId == "null" || this.ReceiveddynamicArray[index].ItemId == "0") {
      $('#ddlItemId_' + index).css('border-color', 'red');
      $('#ddlItemId_' + index).focus();
      flag = 1;
    } else {
      $("#ddlItemId_" + index).css('border-color', '');
    }


    // if (this.dynamicArray[index].UnitName == "" || this.dynamicArray[index].UnitName == "0") {
    //   $('#ddlUnitName_' + index).css('border-color', 'red');
    //   $('#ddlUnitName_' + index).focus();
    //   flag = 1;
    // } else {
    //   $("#ddlUnitName_" + index).css('border-color', '');
    // }
    if (this.ReceiveddynamicArray[index].Rate == "" || this.ReceiveddynamicArray[index].Rate == "0") {
      $('#txtRate_' + index).css('border-color', 'red');
      $('#txtRate_' + index).focus();
      flag = 1;
    } else {
      $("#txtRate_" + index).css('border-color', '');
    }

    if (this.ReceiveddynamicArray[index].EqTypeId == "" || this.ReceiveddynamicArray[index].EqTypeId == "null" || this.ReceiveddynamicArray[index].EqTypeId == "0") {
      $('#ddlEqTypeId_' + index).css('border-color', 'red');
      $('#ddlEqTypeId_' + index).focus();
      flag = 1;
    } else {
      $("#ddlEqTypeId_" + index).css('border-color', '');
    }
    if (this.ReceiveddynamicArray[index].ClientId == "" || this.ReceiveddynamicArray[index].ClientId == "null" || this.ReceiveddynamicArray[index].ClientId == "0") {
      $('#ddlClient_' + index).css('border-color', 'red');
      $('#ddlClient_' + index).focus();
      flag = 1;
    } else {
      $("#ddlClient_" + index).css('border-color', '');
    }
    if (this.ReceiveddynamicArray[index].ReceivedQty == "" || this.ReceiveddynamicArray[index].ReceivedQty == "0.00" || this.ReceiveddynamicArray[index].ReceivedQty == "0") {
      $('#txtReceivedQty_' + index).css('border-color', 'red');
      $('#txtReceivedQty_' + index).focus();
      flag = 1;
    } else {
      $("#txtReceivedQty_" + index).css('border-color', '');
    }
    if (this.ReceiveddynamicArray[index].IsCorrectionCodeId == "" || this.ReceiveddynamicArray[index].IsCorrectionCodeId == "0") {
      this.ReceiveddynamicArray[index].IsCorrectionCodeId == 0;
      flag = 0;
    } else {
      $("#ddlCorrectionCodeId_" + index).css('border-color', '');
    }
    if (this.ReceiveddynamicArray[index].IsCorrectionEntryReason == "" || this.ReceiveddynamicArray[index].IsCorrectionEntryReason == "0") {
      $('#ddlCentryReason_' + index).css('border-color', 'red');
      $('#ddlCentryReason_' + index).focus();
      flag = 1;
    } else {
      $("#ddlCentryReason_" + index).css('border-color', '');
    }

    if (this.ReceiveddynamicArray[index].IsCorrectionEntryReason == ReasonActivity.CorrectionReason) {
      if (this._Commonservices.checkUndefined(this.ReceiveddynamicArray[index].CorrectionEntryRemarks) == "") {
        $('#txtCorrectionEntryRemarks_' + index).css('border-color', 'red');
        $('#txtCorrectionEntryRemarks_' + index).focus();
        flag = 1;
      } else {
        $("#txtCorrectionEntryRemarks_" + index).css('border-color', '');
      }

    }
    return flag;
  }

  Validation() {
    var flag = 0;
    if (this.model.ddlStateId == "null" || this.model.ddlStateId == "0") {
      $('#txtddlStateId').css('border-color', 'red');
      $('#txtddlStateId').focus();
      flag = 1;
    } else {
      $("#txtddlStateId").css('border-color', '');
    }

    //vishal, 06/02/2023
    if (this.model.AutoDispatchNo != "" && (this.model.DispatchNoId == undefined || this.model.DispatchNoId == 0 || this.model.DispatchNoId == null)) {
      flag = 1;
      alert('Please Select Correct Document No');
    }

    if (this.model.TransferTypeId == "null" || this.model.TransferTypeId == "0") {
      $('#txtTransferType').css('border-color', 'red');
      $('#txtTransferType').focus();
      flag = 1;
    } else {
      $("#txtTransferType").css('border-color', '');
    }
    if (this.model.DocumentDate == "" || this.model.DocumentDate == null) {
      $('#txtDocDate').css('border-color', 'red');
      $('#txtDocDate').focus();
      flag = 1;
    } else {
      $("#txtDocDate").css('border-color', '');
    }

    if (this.model.DisatchTrackeringId > 0 &&
      (this.model.TrasporationMode == "" || this.model.TrasporationMode == "0")) {
      $('#txtTrasporationMode').css('border-color', 'red');
      $('#txtTrasporationMode').focus();
      flag = 1;
    } else {
      $("#txtTrasporationMode").css('border-color', '');
    }

    if (this.model.DisatchTrackeringId > 0 &&
      this.model.TrasporationMode == TransPortModeType.ByRoad) {

      if (this.model.TransporterId == "") {
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

      if (this.model.DisatchTrackeringId > 0 && this.IsGRFile == false && this.model.IsReceived == 0) {
        var GrDocument = this._Commonservices.checkUndefined(this.GRfileDocumentFile);
        if (GrDocument == "") {
          flag = 1;
          alert('Please Select Bilty Document');
        }
      }

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
    }

    if (this.model.Destination == "" || this.model.Destination == null) {
      $('#txtDestination').css('border-color', 'red');
      $('#txtDestination').focus();
      flag = 1;
    } else {
      $("#txtDestination").css('border-color', '');
    }

    if (this.model.ShippedfromWHId == "0" || this.model.ShippedfromWHId == null) {
      $('#txtShippedfromWHId').css('border-color', 'red');
      $('#txtShippedfromWHId').focus();
      flag = 1;
    } else {
      $("#txtShippedfromWHId").css('border-color', '');
    }

    if (this.model.ReqAndRecvedClickId == 1) {
      if (this.model.DisatchTrackeringId > 0) {
        if (this.model.EwayBillNo != "" && this.IsEwayBillfile == false) {
          var BiilDocument = this._Commonservices.checkUndefined(this.EwayBillDocumentFile);
          if (BiilDocument == "") {
            flag = 1;
            alert('Please Select Eway Bill Document');
          }
        }
      }
    }

    if (this.model.DisatchTrackeringId > 0 && this.IsTaxInvoiceFile == false) {
      if (this.model.TransferTypeId == PageActivity.Srn_SiteOtherState) {
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

    //#region  Tax Invoice Date, by: vishal, 3/12/2022
    if (this.model.Note == "" || this.model.Note == null) {
      $('#txtNote').css('border-color', 'red');
      // $('#txtNote').focus();
      flag = 1;
    } else {
      $("#txtNote").css('border-color', '');
    }
    if (this.model.ReasonId == "0" || this.model.ReasonId == null) {
      $('#txtReasonId').css('border-color', 'red');
      flag = 1;
    } else {
      $("#txtReasonId").css('border-color', '');
    }

    if (this.model.ReasonId == 1545) {
      if (this.model.ReasonRemarks == "" || this.model.ReasonRemarks == null) {
        $('#txtReasonRemarks').css('border-color', 'red');
        flag = 1;
      } else {
        $("#txtReasonRemarks").css('border-color', '');
      }
    }

    if (this.model.TransferTypeId == PageActivity.Srn_SiteWithinState) {
      if (this.model.SiteAddress == "" || this.model.SiteAddress == null) {
        $('#txtSiteAddress').css('border-color', 'red');
        $('#txtSiteAddress').focus();
        flag = 1;
      } else {
        $("#txtSiteAddress").css('border-color', '');
      }

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

    }
    // brahamjot kaur 15/7/2022
    // if (this.model.TransferTypeId == PageActivity.Srn_SiteWithinState || this.model.TransferTypeId == PageActivity.Srn_SiteOtherState) {
    //   if (this.model.SRNInstructionId == "0" || this.model.SRNInstructionId == null
    //     || this.model.SRNInstructionId == undefined) {
    //     $('#txtSRNInstraction').css('border-color', 'red');
    //     $('#txtSRNInstraction').focus();
    //     flag = 1;
    //   } else {
    //     $("#txtSRNInstraction").css('border-color', '');
    //   }
    // }

    // brahamjot kaur 26/09/2022
    if (this.model.TransferTypeId == PageActivity.Dis_SiteWithinState
      || this.model.TransferTypeId == PageActivity.Dis_SiteOtherState) {
      if (this.selectedDIArr.length == 0 || this.selectedDIArr == undefined) {
        alert("Please Select Dispatch Instruction.");
        flag = 1;
      } else {
        $("#txtSRNInstraction").css('border-color', '');
      }
    }

    if (this.model.TransferTypeId == PageActivity.Srn_SiteOtherState) {
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
      } else {
        $("#txtToCompanyName").css('border-color', '');
      }

      if (this.model.SiteAddress == "" || this.model.SiteAddress == null) {
        $('#txtSiteAddress').css('border-color', 'red');
        $('#txtSiteAddress').focus();
        flag = 1;
      } else {
        $("#txtSiteAddress").css('border-color', '');
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
    }
    if (this.model.ReqAndRecvedClickId == 2 && this.model.IsReceived == 0) {
      var SRNDocument = this._Commonservices.checkUndefined(this.SRNDocumentFile);
      if (SRNDocument == "") {
        flag = 1;
        alert('Please Select SRN Document File');
      }
    }
    if (this.model.ReqAndRecvedClickId == 1) {
      for (var icount = 0, len = this.dynamicArray.length; icount < len; icount++) {
        if (this.dynamicArray[icount].ItemNameId == "" || this.dynamicArray[icount].ItemNameId == "null" || this.dynamicArray[icount].ItemNameId == "0") {
          $('#ddlItemNameId_' + icount).css('border-color', 'red');
          $('#ddlItemNameId_' + icount).focus();
          flag = 1;
        } else {
          $("#ddlItemNameId_" + icount).css('border-color', '');
        }

        if (this.dynamicArray[icount].ItemMakeId == "" || this.dynamicArray[icount].ItemMakeId == "null" || this.dynamicArray[icount].ItemMakeId == "0") {
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
        if (this.dynamicArray[icount].ClientId == "" || this.dynamicArray[icount].ClientId == "null" || this.dynamicArray[icount].ClientId == "0") {
          $('#ddlClient_' + icount).css('border-color', 'red');
          $('#ddlClient_' + icount).focus();
          flag = 1;
        } else {
          $("#ddlClient_" + icount).css('border-color', '');
        };
        if (this.dynamicArray[icount].UnitName == "" || this.dynamicArray[icount].UnitName == "0") {
          $('#ddlUnitName_' + icount).css('border-color', 'red');
          $('#ddlUnitName_' + icount).focus();
          flag = 1;
        } else {
          $("#ddlUnitName_" + icount).css('border-color', '');
        }
        $('#tblOne > tbody >tr').each(function () {
          var valueSerialNo = $(this).find('.SerialNo').val();
          if (valueSerialNo == '') {
            flag = 1;
            $(this).find('.SerialNo').css('border-color', 'red');
          }
          var value = $(this).find('.Rate').val();
          if (value == '') {
            flag = 1;
            $(this).find('.Rate').css('border-color', 'red');
          }
          var valueChallanQty = $(this).find('.Qty').val();
          if (valueChallanQty == '0' || valueChallanQty == '') {
            flag = 1;
            $(this).find('.Qty').css('border-color', 'red');
          }
          var valueReceivedQty = $(this).find('.HSN').val();
          if (valueReceivedQty == '' || valueReceivedQty == "0") {
            flag = 1;
            $(this).find('.HSN').css('border-color', 'red');
            alert('HSN Code enter only  4 digit')
          }
          var valueAcceptedQty = $(this).find('.Discount').val();
          if (valueAcceptedQty == '') {
            flag = 1;
            $(this).find('.Discount').css('border-color', 'red');
          }
        });

      }
    }
    if (this.model.ReqAndRecvedClickId == 2) {
      for (var icount = 0, len = this.ReceiveddynamicArray.length; icount < len; icount++) {
        if (this.ReceiveddynamicArray[icount].ItemNameId == "" || this.ReceiveddynamicArray[icount].ItemNameId == "null" || this.ReceiveddynamicArray[icount].ItemNameId == "0") {
          $('#ddlItemNameId_' + icount).css('border-color', 'red');
          $('#ddlItemNameId_' + icount).focus();
          flag = 1;
        } else {
          $("#ddlItemNameId_" + icount).css('border-color', '');
        }

        if (this.ReceiveddynamicArray[icount].ItemMakeId == "" || this.ReceiveddynamicArray[icount].ItemMakeId == "null" || this.ReceiveddynamicArray[icount].ItemMakeId == "0") {
          $('#ddlItemMake_' + icount).css('border-color', 'red');
          $('#ddlItemMake_' + icount).focus();
          flag = 1;
        } else {
          $("#ddlItemMake_" + icount).css('border-color', '');
        }

        if (this.ReceiveddynamicArray[icount].ItemId == "" || this.ReceiveddynamicArray[icount].ItemId == "null" || this.ReceiveddynamicArray[icount].ItemId == "0") {
          $('#ddlItemId_' + icount).css('border-color', 'red');
          $('#ddlItemId_' + icount).focus();
          flag = 1;
        } else {
          $("#ddlItemId_" + icount).css('border-color', '');
        }
        if (this.ReceiveddynamicArray[icount].EqTypeId == "" || this.ReceiveddynamicArray[icount].EqTypeId == "null" || this.ReceiveddynamicArray[icount].EqTypeId == "0") {
          $('#ddlEqTypeId_' + icount).css('border-color', 'red');
          $('#ddlEqTypeId_' + icount).focus();
          flag = 1;
        } else {
          $("#ddlEqTypeId_" + icount).css('border-color', '');
        }
        if (this.ReceiveddynamicArray[icount].ClientId == "" || this.ReceiveddynamicArray[icount].ClientId == "null" || this.ReceiveddynamicArray[icount].ClientId == "0") {
          $('#ddlClient_' + icount).css('border-color', 'red');
          $('#ddlClient_' + icount).focus();
          flag = 1;
        } else {
          $("#ddlClient_" + icount).css('border-color', '');
        }
        if (this.ReceiveddynamicArray[icount].ReceivedQty == "" || this.ReceiveddynamicArray[icount].ReceivedQty == "0.00" || this.ReceiveddynamicArray[icount].ReceivedQty == "0") {
          $('#txtReceivedQty_' + icount).css('border-color', 'red');
          $('#txtReceivedQty_' + icount).focus();
          flag = 1;
        } else {
          $("#txtReceivedQty_" + icount).css('border-color', '');
        }
        if (this.ReceiveddynamicArray[icount].UnitName == "" || this.ReceiveddynamicArray[icount].UnitName == "0") {
          $('#ddlUnitName_' + icount).css('border-color', 'red');
          $('#ddlUnitName_' + icount).focus();
          flag = 1;
        } else {
          $("#ddlUnitName_" + icount).css('border-color', '');
        }



        var ReqQty;
        var dlength = this.dynamicArray.length;
        if (dlength > icount) {
          ReqQty = this._Commonservices.checkUndefined(this.dynamicArray[icount].Qty);
        } else {
          ReqQty = 0;
        }
        if (this.ReceiveddynamicArray[icount].ReceivedQty != ReqQty) {

          if (this.ReceiveddynamicArray[icount].ReasonId == "" || this.ReceiveddynamicArray[icount].ReasonId == "0") {
            $('#txtReasonId_' + icount).css('border-color', 'red');
            $('#txtReasonId_' + icount).focus();
            flag = 1;
          } else {
            $("#txtReasonId_" + icount).css('border-color', '');
          }

          if (this.ReceiveddynamicArray[icount].ReasonId == 1498) {
            if (this.ReceiveddynamicArray[icount].Remarks == "" || this.ReceiveddynamicArray[icount].Remarks == "null") {
              $('#txtRemarks_' + icount).css('border-color', 'red');
              $('#txtRemarks_' + icount).focus();
              flag = 1;
            }
            // }
          }
        }
        // if (flag == 0) {
        //   flag = this.validateItemData();
        // }

        $('#tblOne > tbody >tr').each(function () {
          var value = $(this).find('.Rate').val();
          if (value == '') {
            flag = 1;
            $(this).find('.Rate').css('border-color', 'red');
          }
          var valueChallanQty = $(this).find('.Qty').val();
          if (valueChallanQty == '0' || valueChallanQty == '') {
            flag = 1;
            $(this).find('.Qty').css('border-color', 'red');
          }
          var valueReceivedQty = $(this).find('.HSN').val();
          if (valueReceivedQty == '' || valueReceivedQty == "0") {
            flag = 1;
            $(this).find('.HSN').css('border-color', 'red');
            alert('HSN Code enter only  4 digit')
          }
          var valueAcceptedQty = $(this).find('.Discount').val();
          if (valueAcceptedQty == '') {
            flag = 1;
            $(this).find('.Discount').css('border-color', 'red');
          }
        });

      }
    }
    if (this.model.DisatchTrackeringId != 0 && this.model.ReqAndRecvedClickId == 2) {
      if (this._Commonservices.checkUndefined(this.model.DeliveredDate) == "") {
        $('#txtDeliveredDate').css('border-color', 'red');
        $('#txtDeliveredDate').focus();
        flag = 1;
      } else {
        $("#txtDeliveredDate").css('border-color', '');
      }
      if (this.model.ReceivedBy == "null" || this.model.ReceivedBy == "") {
        $('#txtReceivedBy').css('border-color', 'red');
        $('#txtReceivedBy').focus();
        flag = 1;
      } else {
        $("#txtReceivedBy").css('border-color', '');
      }
      if (this.model.ReceivedNo == "null" || this.model.ReceivedNo == "") {
        $('#txtReceivedNo').css('border-color', 'red');
        $('#txtReceivedNo').focus();
        flag = 1;
      } else {
        $("#txtReceivedNo").css('border-color', '');
      }
      if (this.IsReceivingFile == false) {
        var RecDocument = this._Commonservices.checkUndefined(this.RecDocumentFile);
        if (RecDocument == "") {
          flag = 1;
          alert('Please Select Receiving Document File');
        }
      }

    }

    return flag;
  }

  //brahamjot kaur 15/7/2022
  AutoFillSRNDetailByDIId(DIId: any) {
    try {
      var objModel = new DISearchModel();
      objModel.DispatchInstruction_Id = DIId;
      //this.SRNEditInstructionId = DIId
      objModel.UserId = this.UserId;
      objModel.Flag = null;
      this._MaterialMovementService.AutoFillDispatchDetailByDIId(objModel).subscribe((data) => {
        if (data.Data != "") {
          if (data.Data[0].PageFlag == 5) {
            this.model.TransferTypeId = data.Data[0].PageFlag;
            this.model.ddlStateId = data.Data[0].StateId;
            this.BindStateCodeWHAdd(this.model.ddlStateId);
            this.ChangeTransferType(data.Data[0].PageFlag);
            //this.ChangeSRNInstruction(DIId);
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
              //this.ChangeSRNInstruction(DIId);
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
  GetAllDispatchInstructionNo(Id: any) {
    try {
      this.SRNWHId = Id;
      //this.ObjBOQReqModel.BOQId=0;
      var objModel = new BOQNOListModel();
      objModel.circleId = 0;
      objModel.CompanyId = this.CompanyId;
      objModel.SearchText = "";
      objModel.WHId = Id;
      objModel.Flag = 8;
      this.DispatchInstructionList = [];
      this._BOQService.GetBOQNoORBOQRequestNo(objModel).subscribe((data) => {
        console.log(data);
        if (data.Data != "") {
          this.DispatchInstructionList = data.Data;
          // if (this.SRNEditInstructionId != "0") {
          //   this.model.SRNInstructionId = this.SRNEditInstructionId;
          // }
        } else {
          this.DispatchInstructionList = [];
          // this.model.SRNInstructionId = "0";
        }
      })
    } catch (Error) {
      this._Commonservices.ErrorFunction(this.UserName, Error.message, "GetAutoCompleteMRNO", "ApprovalStatus");
    }
  }

  GetAllDispatchInstructionNoEdit(whId: number, SRNId: number, strDI: string) {
    try {
      var objModel = new BOQNOListModel();
      objModel.circleId = 0;
      objModel.CompanyId = this.CompanyId;
      objModel.SearchText = "";
      objModel.WHId = whId;
      objModel.DTId = SRNId;
      objModel.Flag = 8;
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

  // brahamjot kaur 26/09/2022
  ChangeSRNInstruction(para: string) {
    let multiSelectDI = "0";
    if (para == "DelAll") {
      this.selectedDIArr = [];
    } else if (this.selectedDIArr.length > 0) {
      multiSelectDI = this.selectedDIArr.map(xx => xx.id).join(',');
    }

    try {
      var objModel = new SRNInstructionSearchModel();
      objModel.DispatchInstruction_Id = multiSelectDI;
      this._MaterialMovementService.GetSRNInstructionListByDIId(objModel).subscribe((data) => {

        if (data.SRNStatus != "") {
          this.model.ReasonId = data.SRNStatus[0].SRNReason;
        } else {
          this.model.ReasonId = "0";
        }

        if (data.Data != "") {
          this.BindItemArray(data.Data)
        } else {
          alert('Please Select Correct Site Id and DI No');
        }

      })
    } catch (Error) {
      this._Commonservices.ErrorFunction(this.UserName, Error.message, "ChangeDispatchInstruction", "Dispatch Tracker");
    }
  }
  //#endregion
  //by:vishal 04/02/2023 desc: for auto complete dispatch no search. 

  onChangeDispatchSearch(val: string) {
    this.model.DispatchNoId = null;
    this.model.DispatchNo = "";
    this.AutoCompleteDispatchNoList = [];
    var objdropdownmodel = new DropdownModel();
    objdropdownmodel.User_Id = this.UserId;
    objdropdownmodel.Parent_Id = val;
    objdropdownmodel.Company_Id = this.CompanyId;
    objdropdownmodel.Flag = 'DispatchOnSite';
    this._GrncrnService.GetAutoCompleteDocumentNo(objdropdownmodel).subscribe((data) => {
      this.AutoCompleteDispatchNoList = data.Data;
    })
  }

  SearchDispatchCleared() {
    this.AutoCompleteDispatchNoList = [];
    this.model.DispatchNo = "";
    this.model.DispatchNoId = '';
    this.model.AutoDispatchNo = "";
  }

  SearchAutoDispatchNo(item: any) {
    this.model.DispatchNo = item.DocumentNo;
    this.model.DispatchNoId = item.id;
  }


}
