import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { GRNDynamicItemGrid, VendorOrWhModel, PoSearchModel, DynamicItemGrid, GSerialNumber, CellNo, DownLoadZipFileDetial } from 'src/app/_Model/purchaseOrderModel';
import { ButtonRendererComponent } from 'src/app/renderer/button-renderer.component';
import { FileRendererComponent } from 'src/app/renderer/file-renderer.component';
import { NgbDateStruct, NgbDateAdapter, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { CommonService } from 'src/app/Service/common.service';
import { PurchaseOrderService } from 'src/app/Service/purchase-order.service';
import { ActivatedRoute, Router } from '@angular/router';
import * as $ from 'jquery';
import * as JSZip from 'jszip';
import * as FileSaver from 'file-saver';
import { ApprovelStatusModel, CommonStaticClass, CompanyStateVendorItemModel, DropdownModel, MenuName, ReasonActivity, UserRole, WebErrorLogModel } from 'src/app/_Model/commonModel';
import { DatePipe, formatDate } from '@angular/common';
import { GrncrnService } from 'src/app/Service/grncrn.service';
import { SearchGRNCRNPoModel, SaveGRNCRNModelDetail, GRNDynamicItemModel, FaultyImageModel, SiteCustomerAutoModel } from 'src/app/_Model/grncrnModel';
import { CustomTooltipComponent } from 'src/app/renderer/customtooltip.component';
import { DomSanitizer } from '@angular/platform-browser';
import { CompanyModel } from 'src/app/_Model/userModel';
import { SearchpanelService } from 'src/app/Service/searchpanel.service';
import { NgxSpinnerService } from 'ngx-spinner';
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { GlobalErrorHandlerServiceService } from 'src/app/Service/global-error-handler-service.service';
import { approvalTooltipComponent } from 'src/app/renderer/Approvaltooltip.component';
import { ApprovalrendererComponent } from 'src/app/renderer/approvalrenderer/approvalrenderer.component';
import { debug } from 'console';
import { MaterialMovementService } from 'src/app/Service/material-movement.service';
import { first } from 'rxjs/operators';
import { inArray } from 'jquery';
import { ItemEquipmentDetail } from 'src/app/_Model/MastersModel';
import { MasterservicesService } from 'src/app/Service/masterservices.service';
import { toBase64String } from '@angular/compiler/src/output/source_map';
pdfMake.vfs = pdfFonts.pdfMake.vfs;
var PDFdata = null;
import * as XLSX from 'xlsx';
import { UserPageRight } from 'src/app/_Model/UserRoleButtonModel';

declare var jQuery: any;
@Component({
  selector: 'app-grndetail',
  templateUrl: './grndetail.component.html',
  styleUrls: ['./grndetail.component.sass'],
  providers: [DatePipe]
})

export class GRNDetailComponent implements OnInit {
  model: any = {};
  apiCSVIData: any = {};
  apiItemCodeAndDescriptionData: any = {};
  dynamicArray: Array<GRNDynamicItemGrid> = [];
  dynamicArrayForPdf: Array<GRNDynamicItemGrid> = [];
  FaultyFileArray: Array<FaultyImageModel> = [];
  Downloadfile: Array<DownLoadZipFileDetial> = [];
  public isShownPOList: boolean; // Grid List
  public isShownPOEdit: boolean; // Form Edit
  ValidationerrorMessage: string;
  CompanyData = [];
  SearchStateList = []; // State
  SelectedSearchStateList = [];
  SearchWHList = [];
  SelectedSearchWHList = [];
  SearchVendorList = [];
  //SelectedSearchVendorList=[];
  SearchItemNameList = [];

  DateModel: NgbDateStruct;
  DateModel2: NgbDateStruct;
  PODateModel: NgbDateStruct;
  GRNDateModel: NgbDateStruct;
  ChallanDateModel: NgbDateStruct;


  public MultidropdownSettings = {};
  public SingledropdownSettings = {};


  public columnDefs = [];  //grid column
  public GridrowData = [];   //  grid data

  public multiSortKey: string;
  frameworkComponents: any;

  GRNCRN_Name: string;
  CompanyCustomer_Name: string;

  //--------------------------------------------------
  keyword = 'PoName';
  AutoCompletePOList = [];
  //---------------------------
  GRNCRNkeyword = 'PoName';
  gridApi: any;
  gridColumnApi: any;
  tooltipShowDelay: any;
  AutoCompleteGRNCRNPoList = [];
  GRNCRNPOId: any;
  GRNCRNPODetailList: any;
  GRNCRNWHStateList = [];
  SelectedGRNCRNStateItem: any;
  GRNCRNWHList: any;
  ItemGRNCRNData = [];
  GRNCRNItemmListData: any;
  ItemNameDetailData: any;
  ItemMakeGRNCRNListData: any;
  ItemCodeGRNCRNData: any;
  ChallanUploadFile: File = null;
  GatePdfUploadFile: File = null;
  LRPdfUploadFile: File = null;
  isdisabled: boolean;//not use
  VendorEditList: any;
  public selectedEditVendorItems = [];
  // ChallanUploadFile:File=null;
  GrndynamicItemArray: any = [];
  loading = false;
  rowData: any[];
  GRNCRNRowData: any[];
  totalSumAcceptedQty: any;
  totalSumAmount: any;
  totalAmount: any;
  public FaultyFile = [];
  GrnId: any =0;
  PoeditId: any;
  InvChallanFile: any;
  GatePdfFile: any;
  LRFile: any;
  InvChallanEditFile: any;
  GateEditFile: any;
  LREditFile: any;
  POBasedisabled: boolean;
  ChallanNodisabled: boolean;
  isShownGrnCompany: boolean;
  isShownCrnCoustmer: boolean;
  isdisabledGrnDate: boolean;
  CompanyId: any;
  SearchPanelPoId: any;
  CommonSearchPanelData: any
  ExcelrowData: any;
  VoucherTypeDetail: any;
  ItemAddrowhideshow: boolean;
  EquipmentTypeHideShow: boolean = false;
  InvoiceData: any;
  InvoiceListData = [];
  UserId: any;
  InvoiceListEditData: any[];
  IsReceivingFile: boolean;
  IsLRFile: boolean;
  IsGatefile: boolean;
  IsGrnSignedfile: boolean;
  IsChallanQtyJobQty: boolean;

  SiteCustomer = 'SiteName';
  CustomerSiteIdkeyword = 'CustomerSiteId';
  AutoCompleteSiteCustomerList = [];
  AutoCompleteCustomerSiteIdList = [];
  IsRateDesabled: boolean;
  IsAutoCompleteDesabled: boolean;
  IsChallanDateDesabled: boolean;
  IsDownloadPrintHideShow: boolean;
  GRNPdfData: any;
  GRNCRNPdfItemData: any;
  GRNHistoryData: any;
  NewGRN: any;
  UpdateGRN: any;
  EquipmentTypeList: any;
  @ViewChild('ChallanfilePicker') ChallanfilePickerVariable: ElementRef;
  @ViewChild('GatefilePicker') GatefilePickerVariable: ElementRef;
  @ViewChild('LRfilePicker') LRfilePickerFileVariable: ElementRef;
  public loadingTemplate;
  CreateName: any;
  CreatedDate: any;
  ModifiedName: any;
  ModifiedDate: any;
  ApprovalList: any;
  ApproveStatusDataList: any;
  PageMenuId: any = 7;
  TableId: any;
  ManueId: number;
  ArrayRoleId: any;
  IsApprovalstatusbtnhideShow: boolean;
  modelpdf: any;
  IsPageActive: boolean;
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
  WareHouseId: string;
  IsHideShowCancelBtn: boolean;
  UserName: any;
  UserRoleId: string;
  IsSaveButtonDisable: boolean;
  IsCancelButtonDisable: boolean;
  CancelReasonData: any;
  ViewChallanPdffile: any;
  ViewGatePdffile: any;
  ViewCLRPdfile: any;
  IsUnitDisabled: boolean = false;
  grnNumber: any;
  arry: any;
  EditFlag: string;
  IsHiddenSearchCustomer: boolean = false;
  IsGRNByPO: boolean = false;
  IsGRNByDispatch: boolean = false;
  DocumentNokeyword = 'DocumentNo';
  AutoCompleteDocumentNoList: any;
  DATEType: string;
  ChangeLabelQty: string;
  IsHideQty: boolean;
  GRNSignedDocumentfile: any;
  GRNSignedFile: any;
  TransporterTypeDetail: any;
  IsTransporterReadonly: boolean;
  IsByHand: boolean;
  IsTransporter: boolean;
  isPdfPreview: boolean;
  IsNewPreview: boolean;
  IsDownloadButtonDisable: boolean;
  ReplaceUrl: any;
  EwayBillfile: any;
  IsEwayBillfile: boolean;
  GrandAllSumtotalInvoiceValue: any;
  Exportloading: boolean;
  @ViewChild('inputExcelOther', { static: false })
  inputExcelOther: ElementRef;
  @ViewChild('inputExcelBB', { static: false })
  inputExcelBB: ElementRef;
  base64textString: string;
  CorrectionItemCodeList: any;
  Addrowhideandshow: boolean;
  CorretionEntryReasonDetail: any;
  Correctioncolumnhideandshow: boolean;
  RoleCorrectionEntry: boolean = false;
  IsCourier: boolean;
  IsVehicleValidation: boolean;
  PoQtyLabel: any;
  ValidationHideShow: boolean;
  SupplierNametextBox: boolean = false;
  ChangeLabelSupplierAddress: string;
  ObjUserPageRight = new UserPageRight();
  Save: any;
  constructor(private router: Router, private _Commonservices: CommonService, private _objSearchpanelService: SearchpanelService,
    private _PurchaseOrderService: PurchaseOrderService, private datePipe: DatePipe, private sanitizer: DomSanitizer,
    private _GrncrnService: GrncrnService, private Loader: NgxSpinnerService,
    private _MaterialMovementService: MaterialMovementService,
    private route: ActivatedRoute,
    private _GlobalErrorHandlerService: GlobalErrorHandlerServiceService, private _MasterService: MasterservicesService) {
    this.tooltipShowDelay = 0;
    this.frameworkComponents = {
      buttonRenderer: ButtonRendererComponent,
      fileRenderer: FileRendererComponent,
      customtooltip: CustomTooltipComponent,
      approvalTooltip: approvalTooltipComponent
    }
    this._objSearchpanelService.SearchPanelSubject.subscribe(data => {
      this.CommonSearchPanelData = data;
    });

    this.route.queryParams.subscribe(params => {
      this.grnNumber = params['grn'];

    });
  }

  ngOnInit(): void {
    localStorage.setItem('grnApprovedResion', '2574');
    var objCompanyModel = new CompanyModel();
    objCompanyModel = JSON.parse(sessionStorage.getItem("CompanyIdSession"));
    this.CompanyId = objCompanyModel.Company_Id;
    var objUserModel = JSON.parse(sessionStorage.getItem("UserSession"));
    this.UserId = objUserModel.User_Id;
    this.UserName = objUserModel.UserName;
    this.IsApprovalstatusbtnhideShow = false;
    this.model.ddlActive = "2"
    localStorage.removeItem("Id");
    this.ArrayRoleId = objUserModel.Role_Id.split(',');
    for (var i = 0, len = this.ArrayRoleId.length; i < len; i++) {
      if (this.ArrayRoleId[i] == UserRole.Admin || this.ArrayRoleId[i] == UserRole.SCMLead) {
        this.UserRoleId = this.ArrayRoleId[i];
      } else if (this.ArrayRoleId[i] == UserRole.GRNCorrectionEntryRole) {
        this.RoleCorrectionEntry = true;
      }
    }
    if (objUserModel == null || objUserModel == "null") {
      this.router.navigate(['']);
    }
    this.BindCorrectionentryReason();
    this.model.GRNSTNId = "0";
    this.model.GRNById = "1";
    this.ChangeGRNBy(this.model.GRNById);
    this.isShownPOList = true;
    this.isShownPOEdit = false;
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
        headerName: 'Approval [L1]',
        cellRendererFramework: ApprovalrendererComponent,
        pinned: 'left',
        width: 100,
        filter: false,
        resizable: true,
        field: 'Id',
        tooltipField: 'Id', tooltipComponent: 'approvalTooltip',
      },
      {
        headerName: 'Document',
        cellRendererSelector: function (params) {
          var ShowFile = {
            component: 'fileRenderer'
          };
          var HideFile = {
            component: ''
          };
          if (params.data.GRNDocumentFile == null || params.data.GRNDocumentFile == '') {
            return HideFile
          }
          else {
            return ShowFile;
          }
        }, cellRendererParams: {
          onClick: this.onfiledownload.bind(this),
          label: 'File'
        },
        pinned: 'left',
        width: 100,
        filter: false
      },
      { headerName: 'PO No', field: 'PONo', pinned: 'left', width: 180, resizable: true, filter: false },
      { headerName: 'PO Date', field: 'PoDate', pinned: 'left', width: 100, resizable: true, filter: false },
      { headerName: 'GRN No', field: 'GRNNo', width: 140, resizable: true, filter: false, },
      { headerName: 'GRN Date', field: 'GRNDate', width: 100, resizable: true, filter: false, },
      { headerName: 'Received Qty', field: 'ReceivedQty', width: 80, filter: false, resizable: true },
      { headerName: 'Invoice No', field: 'InvChallanNo', width: 110, filter: false, resizable: true },
      { headerName: 'Invoice Date', field: 'InvoiceDate', width: 100, filter: false, resizable: true },
      { headerName: 'Supplier Name', field: 'VendorName', width: 120, filter: false, resizable: true },
      { headerName: 'Cancel By', field: 'CancelBy', width: 120, filter: false, resizable: true },
      { headerName: 'Cancel Date', field: 'CancelDate', width: 120, filter: false, resizable: true },
      // { headerName: 'Item Name', field: 'ItemName', width: 120, filter: false, resizable: true },
      // {
      //   headerName: 'Item Description', field: 'ItemDescription', tooltipField: 'ItemDescription',
      //   tooltipComponent: 'customtooltip', width: 130, filter: false, resizable: true
      // },
      // { headerName: 'Challan Qty', field: 'ChallanQty', width: 110, filter: false, resizable: true },
      // { headerName: 'Accepted Qty', field: 'AcceptedQty', width: 120, filter: false, resizable: true },
      // { headerName: 'Rejected Qty', field: 'RejectedQty', width: 110, filter: false, resizable: true },
      // { headerName: 'Inv. Amt', field: 'InvoiceAmount', width: 150, filter: false, resizable: true },
      // { headerName: 'Total Amount', field: 'TotalAmount', width: 150, filter: false, resizable: true },

    ];
    this.multiSortKey = 'ctrl';
    this.loadingTemplate =
      `<span class="ag-overlay-loading-center">loading...</span>`;
    this.MultidropdownSettings = {
      singleSelection: false,
      text: "Select",
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      enableSearchFilter: true,
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
    this.BindCompanyStateVendorItem();
    setTimeout(() => { this.SearchGRNHistoryCountList(); }, 100);
    this.BindVoucherType();
    this.ItemReason();

    if (this._Commonservices.checkUndefined(this.grnNumber)) {
      this.editFromReport(this.grnNumber);
    }
    this.PageLoadEquipmentType();
    this.BindTransporterTypeDetail();
    this.model.TransporterId = "";
     //brahamjot kaur 31/10/2022
     this.GetUserPageRight(this.GrnId);
    }
  
    //brahamjot kaur 31/10/2022
    async GetUserPageRight(id:number) {
      this._Commonservices.GetUserPageRight(this.UserId, MenuName.GRN).subscribe(data => {
        if (data.Status == 1) {
          console.log(data);
          this.ObjUserPageRight.IsSearch = data.Data[0].IsSearch;
          this.ObjUserPageRight.IsExport = data.Data[0].IsExport;
          this.ObjUserPageRight.IsCreate = data.Data[0].IsCreate;
          this.ObjUserPageRight.IsBulkPdfDwnload = data.Data[0].IsBulkPdfDwnload;
          this.ObjUserPageRight.IsGenPdf = data.Data[0].IsGenPdf;
          this.ObjUserPageRight.IsPdfView = data.Data[0].IsPdfView;
          this.ObjUserPageRight.IsDelete = data.Data[0].IsDelete;
          if(this.ObjUserPageRight.IsCreate == 1 && id == 0){
            this.Save = 1;
          }else if(this.ObjUserPageRight.IsEdit == 1 && id != 0){
            this.Save = 1;
          }else{
            this.Save = 0
          }
        }
      })
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
        this.TransporterTypeDetail = vouc.Data;
      }, error => {
        this._Commonservices.ErrorFunction(this.UserName, error.message, "BindTransporterTypeDetail", "WHTOSite");
      });
    } catch (Error) {
      this._Commonservices.ErrorFunction(this.UserName, Error.message, "BindTransporterTypeDetail", "WHTOSite");
    }
  }

  ChangeDespatchby(Id: any) {
    this.IsVehicleValidation = false;
    this.IsTransporter = false;
    this.IsByHand = false;
    this.IsCourier = false;
    if (Id == 1 || Id == "0") {
      this.IsTransporter = true;
      this.IsVehicleValidation = true;
    } else if (Id == 2) {
      this.IsByHand = true;
    } else {
      this.IsCourier = true;
    }
  }
  //#region Code By Ravinder 04/06/2021
  ItemReason() {
    try {
      var objdropdownmodel = new DropdownModel();
      objdropdownmodel.User_Id = 0;
      objdropdownmodel.Parent_Id = "1502";
      objdropdownmodel.Company_Id = this.CompanyId;
      objdropdownmodel.Other_Id = "0";
      objdropdownmodel.Flag = 'CommonReason';
      this._Commonservices.getdropdown(objdropdownmodel).pipe(first()).subscribe(item => {
        this.CancelReasonData = item.Data
      }, error => {
        this._Commonservices.ErrorFunction(this.UserName, error.message, "GrnItemReason", "SRN");
      });
    } catch (Error) {
      this._Commonservices.ErrorFunction(this.UserName, Error.message, "GrnItemReason", "SRN");
    }
  }
  ////#endregion
  //#region Code By Umesh, Hemant

  showModal(value: number, index: number): void {
    this.indexv = index;
    var qty = this.dynamicArray[index].AcceptedQty;
    var unitTag = this.dynamicArray[this.indexv].UnitName;
    var ItemNameId = this.dynamicArray[this.indexv].ItemNameId

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
    this.dynamicArray[index].InitiallValue = ''
    this.dynamicArray[index].lastValue = ''
    for (var i = 0; i < parseInt(this.dynamicArray[index].AcceptedQty); i++) {
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
    for (var i = 0; i < parseInt(this.dynamicArray[this.indexv].AcceptedQty); i++) {
      var srnData = new GSerialNumber();
      for (var j = 0; j < value; j++) {
        var oc = new CellNo();
        oc.Sequance = i.toString();
        var celllength = this.dynamicArray[this.indexv].GSerialNumbers.length;
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
    var returnValue = 0;
    for (var i = 0; i < this.dynamicArray.length; i++) {
      var ItemNameId = this.dynamicArray[i].ItemNameId
      const result = this.SearchItemNameList.filter(element => {
        return element.id === parseInt(ItemNameId);
      });
      // brahamjot kaur 20/6/2022
      if (this.model.GRNById == 3) {
        if (this.dynamicArray[i].EqTypeId == "" || this.dynamicArray[i].EqTypeId == "null" || this.dynamicArray[i].EqTypeId == "0") {
          $('#ddlEqTypeId_' + i).css('border-color', 'red');
          $('#ddlEqTypeId_' + i).focus();
          returnValue = 1;
        } else {
          $("#ddlEqTypeId_" + i).css('border-color', '');
        }
      } else {
        $("#ddlEqTypeId_" + i).css('border-color', '');
      }
      var itmName = result[0].itemName;
      if (this.IsMandatory(i) == true) {
        //let srnlength = this.ReceiveddynamicArray[i].GSerialNumbers.length;        
        if (this.dynamicArray[i].GSerialNumbers.length != this.dynamicArray[i].AcceptedQty) {
          returnValue = 1;
          this.IsError = true;
          this.errorMessage = "Serial-No (" + parseInt(this.dynamicArray[i].AcceptedQty) + " -Qty) is required for " + itmName + " ";
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


  //#region  Create GRN PDf
  CreateGRNPdfData(FlagValue: any) {
    try {
      this.model.FlagValue = FlagValue
      this.GRNPdfData = null;
      this.GRNCRNPdfItemData = null;
      var ChallanNovalue = this._Commonservices.checkUndefined(this.model.HideChallanNo);
      if (ChallanNovalue == '') {
        alert('Please Create New GRN');
        return false;
      } else {
        var objdropdownmodel = new DropdownModel();
        objdropdownmodel.User_Id = 0;
        objdropdownmodel.Parent_Id = this.GrnId;
        objdropdownmodel.Company_Id = this.CompanyId;
        objdropdownmodel.Flag = "GRN";
        this._GrncrnService.GetCreatePdfGRNDetailItemByGRNId(objdropdownmodel).subscribe((data) => {
          if (data.Status == 1) {
            this.GRNPdfData = data.Data[0];
            this.model.TotalSumAmount = data.Data[0].TotalSumAmount;
            if (data.Data[0].IsDespatch == 1) {
              this.model.labelTransSender = "Transpoter";
            } else if (data.Data[0].IsDespatch == 2) {
              this.model.labelTransSender = "Sender Name";
            } else {
              this.model.labelTransSender = "Courier Company Name";
            }
            if (data.Data[0].LRDate != '') {
              this.model.labelBiltyNo = "Bilty No";
              this.model.labelBiltyDate = "Bilty Date";
            } else {
              this.model.labelBiltyNo = " ";
              this.model.labelBiltyDate = " ";
            }
            if (this.GRNPdfData.GRNById == 2) {
              this.model.labelJobandInHouseNo = "JOB No";
              this.model.labelJobandInHouseDate = "JOB Date";
            } else if (this.GRNPdfData.GRNById == 3) {
              this.model.labelJobandInHouseNo = "JOB No(In House)";
              this.model.labelJobandInHouseDate = "JOB Date(In House)";
            }

            this.GRNCRNPdfItemData = data.GridItemData;
            this.dynamicArrayForPdf = [];
            for (var i = 0, len = this.GRNCRNPdfItemData.length; i < len; i++) {
              var objdynamicPdf = new GRNDynamicItemGrid();
              objdynamicPdf.RowId = this.GRNCRNPdfItemData[i].RowId;
              objdynamicPdf.ItemDescription = this.GRNCRNPdfItemData[i].ItemDescription;
              objdynamicPdf.ItemCode = this.GRNCRNPdfItemData[i].ItemCode;
              objdynamicPdf.SubDescription = this.GRNCRNPdfItemData[i].SubDescription;
              objdynamicPdf.UnitName = this.GRNCRNPdfItemData[i].UnitName;
              objdynamicPdf.EqpType = this.GRNCRNPdfItemData[i].EqpType;
              objdynamicPdf.Rate = parseFloat(this.GRNCRNPdfItemData[i].ItemRate).toFixed(2);
              objdynamicPdf.ChallanQty = this.GRNCRNPdfItemData[i].ChallanQty;
              objdynamicPdf.AcceptedQty = this.GRNCRNPdfItemData[i].AcceptedQty;
              objdynamicPdf.ReceivedQty = this.GRNCRNPdfItemData[i].ReceivedQty;
              objdynamicPdf.RejectedQty = this.GRNCRNPdfItemData[i].RejectedQty;
              objdynamicPdf.ExcessShort = this.GRNCRNPdfItemData[i].ExcessShort;
              objdynamicPdf.TotalAmount = this.GRNCRNPdfItemData[i].TotalAmount;
              objdynamicPdf.IGST = this.GRNCRNPdfItemData[i].IGST;
              objdynamicPdf.IGSTRate = this.GRNCRNPdfItemData[i].IGSTRate;
              objdynamicPdf.CGST = this.GRNCRNPdfItemData[i].CGST;
              objdynamicPdf.CGSTRate = this.GRNCRNPdfItemData[i].CGSTRate;
              objdynamicPdf.TCS = this.GRNCRNPdfItemData[i].TCS;
              objdynamicPdf.TCSRate = this.GRNCRNPdfItemData[i].TCSRate;
              objdynamicPdf.SGSTRate = this.GRNCRNPdfItemData[i].SGSTRate;
              objdynamicPdf.SGST = this.GRNCRNPdfItemData[i].SGST;
              objdynamicPdf.FreightCharge = this.GRNCRNPdfItemData[i].FreightCharge;
              objdynamicPdf.TotalInvoiceValue = this.GRNCRNPdfItemData[i].TotalInvoiceValue;
              objdynamicPdf.TotalAmountWithFreightCharge = this.GRNCRNPdfItemData[i].TotalAmountWithFreightCharge;
              this.dynamicArrayForPdf.push(objdynamicPdf);
              //objdynamic.TotalAmount=parseFloat(ItemEditDataArr[i].TotalAmount).toFixed(2);
            }
            if (this.GRNPdfData.GRNById == 2 || this.GRNPdfData.GRNById == 3) {
              this.generateForJOBPDF('Open');
            } else {
              this.generatePDF('Open');
            }
          }
        });
      }
    } catch (Error) {
      var objWebErrorLogModel = new WebErrorLogModel();
      objWebErrorLogModel.ErrorBy = this.UserId;
      objWebErrorLogModel.ErrorMsg = Error.message;
      objWebErrorLogModel.ErrorFunction = "CreateGRNPdfData";
      objWebErrorLogModel.ErrorPage = "GRN";
      this._GlobalErrorHandlerService.handleError(objWebErrorLogModel);
    }
  }


  generatePDF(action: any) {
    let docDefinition = {
      pageOrientation: 'landscape',
      //pageMargins: [ 40, 60, 40, 60 ],
      content: [
        {
          margin: [-25, 0, 0, 0],
          border: [0, 0, 0, 0],
          table: {
            body: [
              [
                {
                  table: {
                    body: [
                      [
                        {
                          border: [0, 0, 0, 0],
                          columns: [
                            {
                              width: 144,
                              text: [
                              ]
                            },
                            {
                              margin: [160, 0, 0, 0],
                              width: 500,
                              text: [
                                { text: `${this.GRNPdfData.CompanyName}`, fontSize: 13, bold: true, },
                              ]
                            },
                            {
                              width: 144,
                              text: [
                              ]
                            },
                          ]
                        },
                      ],
                      [
                        {
                          border: [0, 0, 0, 0],
                          columns: [
                            {
                              image: `snow`, width: 80,
                            },

                            {
                              margin: [220, 0, 0, 0],
                              width: 400,
                              text: [
                                { text: 'Address: ', fontSize: 10, },
                                { text: `${this.GRNPdfData.CompanyAddress}`, fontSize: 10 },
                                '\n',
                                { text: `GOODS RECEIPT NOTE`, fontSize: 12, bold: true, alignment: 'center', },

                              ]
                            },

                            {
                              // alignment: 'right',
                              margin: [84, 0, 0, 0],
                              text: [
                                { text: `GRN No        ${this.GRNPdfData.GRNNo}`, fontSize: 10, width: 180 },
                                '\n',
                                { text: `Date               ${this.GRNPdfData.GRNDate}`, fontSize: 10, width: 180, },
                              ]
                            },
                          ]
                        },
                      ],
                      [
                        {
                          border: [0, 0, 0, 0],
                          columns: [
                            {
                              margin: [0, 0, 0, 0],
                              width: 290,
                              text: [
                                { text: `Supplier Code           ${this.GRNPdfData.SupplierCode}`, fontSize: 10 },
                              ]
                            },

                            {
                              margin: [40, 0, 0, 0],
                              width: 270,
                              text: [
                                { text: `Inv./Challan No.       ${this.GRNPdfData.InvChallanNo}`, fontSize: 10 },
                              ]
                            },

                            {
                              margin: [10, 0, 0, 0],
                              width: 180,
                              text: [
                                { text: ` Inv/Challan Date             ${this.GRNPdfData.InvChallanDate}`, fontSize: 10 },
                              ]
                            },
                          ]
                        },
                      ],

                      [
                        {
                          border: [0, 0, 0, 0],
                          columns: [
                            {
                              margin: [0, 0, 0, 0],
                              width: 290,
                              text: [
                                { text: `Supplier Name`, fontSize: 10 },
                                { text: `         ${this.GRNPdfData.SupplierName}`, fontSize: 10, bold: true },
                                // {text:`Supplier Name         ${this.GRNPdfData.SupplierName}`, fontSize:10},
                              ]
                            },

                            {
                              margin: [40, 0, 0, 0],
                              width: 270,
                              text: [
                                { text: `Gate Entry No           ${this.GRNPdfData.GateEntryNo}`, fontSize: 10 },
                              ]
                            },

                            {
                              margin: [10, 0, 0, 0],
                              width: 180,
                              text: [
                                { text: `Gate Entry Date               ${this.GRNPdfData.GateEntryDate}`, fontSize: 10 },
                              ]
                            },
                          ]
                        },
                      ],

                      [
                        {
                          border: [0, 0, 0, 0],
                          columns: [
                            {
                              width: 290,
                              margin: [0, 0, 0, 0],
                              text: [
                                //  { text:`Address                     ${this.GRNPdfData.SupplierAddress}`, fontSize:10},
                                { text: `Address`, fontSize: 10, bold: true, },
                                { text: `                     ${this.GRNPdfData.SupplierAddress}`, fontSize: 10 },
                              ]
                            },

                            {
                              margin: [40, 0, 0, 0],
                              width: 270,
                              text: [
                                { text: `P.O.No          ${this.GRNPdfData.PONo}`, fontSize: 10 },
                              ]
                            },

                            {
                              margin: [10, 0, 0, 0],
                              width: 180,
                              text: [
                                { text: `PO Date                             ${this.GRNPdfData.PoDate}`, fontSize: 10 },
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

        {
          style: 'ItemTableHeader',
          table: {
            headerRows: 1,
            widths: ['2%', '4%', '15.6%', '3%', '4%', '5%', '5%', '5%', '4%', '4%', '5%', '5%', '5%', '3%', '5%', '3%', '5%', '3%', '5%', '3%', '5%', '5%',],
            body: [
              ['SL No', 'Item Code', 'Material Description ', 'UOM', ' Challan Qty', 'Received Qty',
                'Accepted Qty', 'Rejected Qty', 'Excess/Short', 'Rate', 'Basic Value', 'Frieght Charge', 'Total Amount',
                'SGST (%)', 'SGST Value', 'CGST (%)', 'CGST Value', 'IGST (%)', 'IGST Value', 'TCS (%)', 'TCS Value', 'Total value'],
              // ...this.dynamicArray.map(p => ([p.RowId, p.ItemDescription+'\n\n' +p.SubDescription,p.ItemCode,p.POQty, p.Rate, p.UnitName,p.TotalAmount])),
              ...this.dynamicArrayForPdf.map(p => ([{ text: p.RowId }, p.ItemCode, { text: p.ItemDescription }, p.UnitName, { text: p.ChallanQty }, { text: p.ReceivedQty }, { text: p.AcceptedQty }, { text: p.RejectedQty },
              { text: p.ExcessShort }, { text: p.Rate }, { text: p.TotalAmount }, { text: p.FreightCharge }, { text: p.TotalAmountWithFreightCharge },
              { text: p.SGSTRate }, { text: p.SGST }, { text: p.CGSTRate }, { text: p.CGST }, { text: p.IGSTRate }, { text: p.IGST },
              { text: p.TCSRate }, { text: p.TCS }, { text: p.TotalInvoiceValue },])),

              [{}, { text: 'Total Amount', colSpan: 2, alignment: 'right', bold: true }, { text: '' }, { text: '' }, { text: '' }, { text: '' }, { text: '' }, { text: '' }, { text: '' }, { text: '' }, { text: '' }, { text: '' }, { text: '' }, { text: '' }, { text: '' }, { text: '' },
              { text: '' }, { text: '' }, { text: '' }, { text: '' }, { text: '' }, { text: this._Commonservices.thousands_separators(`${this.model.TotalSumAmount}`) + '₹', bold: true, alignment: 'center' }]
            ]
          }
        },

        {
          margin: [-25, 0, 0, 0],
          border: [0, 0, 0, 0],
          table: {
            body: [
              [
                {
                  table: {
                    body: [
                      [
                        {
                          border: [0, 0, 0, 0],
                          columns: [
                            {
                              margin: [0, 0, 0, 0],
                              width: 338,
                              text: [
                                { text: `Quality Inspection Report:`, fontSize: 10 },
                              ]
                            },

                            {
                              margin: [40, 0, 0, 0],
                              width: 270,
                              text: [
                              ]
                            },
                            {
                              margin: [10, 0, 0, 0],
                              width: 180,
                              text: [
                              ]
                            },
                          ]
                        },
                      ],

                      [
                        {
                          border: [0, 0, 0, 0],
                          columns: [
                            {
                              margin: [0, 0, 0, 0],
                              width: 300,
                              text: [
                                { text: `${this.model.labelBiltyNo}                    ${this.GRNPdfData.LRNo}`, fontSize: 10 },
                              ]
                            },
                            {
                              margin: [40, 0, 0, 0],
                              width: 250,
                              text: [
                                { text: `${this.model.labelBiltyDate}           ${this.GRNPdfData.LRDate}`, fontSize: 10 },
                              ]
                            },
                            {
                              margin: [10, 0, 0, 0],
                              width: 200,
                              text: [
                                { text: `Remarks:           ${this.GRNPdfData.Remarks}`, fontSize: 10 },
                              ]
                            },
                          ]
                        },
                      ],

                      [
                        {
                          border: [0, 0, 0, 0],
                          columns: [
                            {
                              width: 300,
                              margin: [0, 0, 0, 0],
                              text: [
                                //  { text:`Address                     ${this.GRNPdfData.SupplierAddress}`, fontSize:10},

                                { text: `${this.model.labelTransSender}           ${this.GRNPdfData.TranspoterName}`, fontSize: 10 },
                              ]
                            },

                            {
                              margin: [40, 0, 0, 0],
                              width: 250,
                              text: [
                                { text: `P.R Dept          ${this.GRNPdfData.PRDept}`, fontSize: 10 },
                              ]
                            },

                            {
                              margin: [10, 0, 0, 0],
                              width: 200,
                              text: [
                                // {text:`PO Date                             ${this.GRNPdfData.PoDate}`, fontSize:10},
                              ]
                            },
                          ]
                        },
                      ],
                      [
                        {
                          border: [0, 0, 0, 0],
                          columns: [
                            {
                              width: 300,
                              margin: [0, 0, 0, 0],
                              text: [
                                { text: `Vehicle No           ${this.GRNPdfData.VehicleNo}`, fontSize: 10 },
                              ]
                            },

                            {
                              margin: [40, 0, 0, 0],
                              width: 250,
                              text: [
                                { text: `Material received by     ${this.GRNPdfData.IndenterName}`, fontSize: 10 },
                              ]
                            },

                            {
                              margin: [10, 0, 0, 0],
                              width: 200,
                              text: [
                                // {text:`PO Date                             ${this.GRNPdfData.PoDate}`, fontSize:10},
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
                              width: 260,
                              margin: [0, 0, 0, 0],
                              text: [
                              ]
                            },

                            {
                              margin: [40, 0, 0, 0],
                              width: 250,
                              text: [
                              ]
                            },

                            {
                              margin: [10, 0, 0, 0],
                              width: 200,
                              text: [
                                { text: `Authorised by `, fontSize: 10, bold: true, alignment: 'right', },
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
      ],

      styles: {
        header: {
          fontSize: 10,
          bold: true,
          margin: [190, -40, 0, 0]
        },

        ItemTableHeader: {
          fontSize: 7,
          alignment: 'center',
          margin: [-25, 0, 0, 0],
          border: [0, 0, 0, 0],
        },
      },
      images: {
        snow: `${this.GRNPdfData.Logo}`,
        //snow: 'http://localhost:4200/assets/logo.jpg',
        //snow: 'http://scm.astnoc.com/assets/logo.jpg'
      },
    }
    if (action === 'download') {
      pdfMake.createPdf(docDefinition).download();
    } else if (action === 'print') {
      pdfMake.createPdf(docDefinition).print();
    } else {
      if (this.model.FlagValue == 2) {
        pdfMake.createPdf(docDefinition).open();
      } else {
        //pdfMake.createPdf(docDefinition).open();
        // pdfMake.createPdf(docDefinition).download();
        pdfMake.createPdf(docDefinition).getDataUrl(function (dataURL) {
          PDFdata = dataURL;
        });
        setTimeout(() => {
          this.SaveUpdateGRNPDF();
        }, 1200);
      }
    }
  }

  generateForJOBPDF(action: any) {
    let docDefinition = {
      pageOrientation: 'landscape',
      //pageMargins: [ 40, 60, 40, 60 ],
      content: [
        {
          margin: [-25, 0, 0, 0],
          border: [0, 0, 0, 0],
          table: {
            body: [
              [
                {
                  table: {
                    body: [
                      [
                        {
                          border: [0, 0, 0, 0],
                          columns: [
                            {
                              width: 144,
                              text: [
                              ]
                            },
                            {
                              margin: [160, 0, 0, 0],
                              width: 500,
                              text: [
                                { text: `${this.GRNPdfData.CompanyName}`, fontSize: 13, bold: true, },
                              ]
                            },
                            {
                              width: 144,
                              text: [
                              ]
                            },
                          ]
                        },
                      ],
                      [
                        {
                          border: [0, 0, 0, 0],
                          columns: [
                            {
                              image: `snow`, width: 80,
                            },

                            {
                              margin: [220, 0, 0, 0],
                              width: 400,
                              text: [
                                { text: 'Address: ', fontSize: 10, },
                                { text: `${this.GRNPdfData.CompanyAddress}`, fontSize: 10 },
                                '\n',
                                { text: `GOODS RECEIPT NOTE`, fontSize: 12, bold: true, alignment: 'center', },

                              ]
                            },

                            {
                              // alignment: 'right',
                              margin: [84, 0, 0, 0],
                              text: [
                                { text: `GRN No        ${this.GRNPdfData.GRNNo}`, fontSize: 10, width: 180 },
                                '\n',
                                { text: `Date               ${this.GRNPdfData.GRNDate}`, fontSize: 10, width: 180, },
                              ]
                            },
                          ]
                        },
                      ],
                      [
                        {
                          border: [0, 0, 0, 0],
                          columns: [
                            {
                              margin: [0, 0, 0, 0],
                              width: 290,
                              text: [
                                { text: `Supplier Code           ${this.GRNPdfData.SupplierCode}`, fontSize: 10 },
                              ]
                            },

                            {
                              margin: [40, 0, 0, 0],
                              width: 270,
                              text: [
                                { text: `Inv./Challan No.       ${this.GRNPdfData.InvChallanNo}`, fontSize: 10 },
                              ]
                            },

                            {
                              margin: [10, 0, 0, 0],
                              width: 180,
                              text: [
                                { text: ` Inv/Challan Date             ${this.GRNPdfData.InvChallanDate}`, fontSize: 10 },
                              ]
                            },
                          ]
                        },
                      ],

                      [
                        {
                          border: [0, 0, 0, 0],
                          columns: [
                            {
                              margin: [0, 0, 0, 0],
                              width: 290,
                              text: [
                                { text: `Supplier Name`, fontSize: 10 },
                                { text: `         ${this.GRNPdfData.SupplierName}`, fontSize: 10, bold: true },
                                // {text:`Supplier Name         ${this.GRNPdfData.SupplierName}`, fontSize:10},
                              ]
                            },

                            {
                              margin: [40, 0, 0, 0],
                              width: 270,
                              text: [
                                { text: `Gate Entry No           ${this.GRNPdfData.GateEntryNo}`, fontSize: 10 },
                              ]
                            },

                            {
                              margin: [10, 0, 0, 0],
                              width: 180,
                              text: [
                                { text: `Gate Entry Date               ${this.GRNPdfData.GateEntryDate}`, fontSize: 10 },
                              ]
                            },
                          ]
                        },
                      ],

                      [
                        {
                          border: [0, 0, 0, 0],
                          columns: [
                            {
                              width: 290,
                              margin: [0, 0, 0, 0],
                              text: [
                                //  { text:`Address                     ${this.GRNPdfData.SupplierAddress}`, fontSize:10},
                                { text: `Address`, fontSize: 10, bold: true, },
                                { text: `                     ${this.GRNPdfData.jobSupplierAddress}`, fontSize: 10 },
                              ]
                            },

                            {
                              margin: [40, 0, 0, 0],
                              width: 270,
                              text: [
                                { text: `${this.model.labelJobandInHouseNo}          ${this.GRNPdfData.DocumentNo}`, fontSize: 10 },
                              ]
                            },

                            {
                              margin: [10, 0, 0, 0],
                              width: 180,
                              text: [
                                { text: `${this.model.labelJobandInHouseDate}                 ${this.GRNPdfData.JobDate}`, fontSize: 10 },
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

        {
          style: 'ItemTableHeader',
          table: {
            headerRows: 1,
            widths: ['2%', '4%', '16.5%', '3%', '5%', '5%', '5%', '6%', '5%', '5%', '5%', '3%', '5%', '3%', '5%', '3%', '5%', '3%', '5%', '10%',],
            body: [
              ['SL No', 'Item Code', 'Material Description ', 'UOM', 'EQUP', ' JOB Qty',
                'Accepted Qty', 'Rate', 'Basic Value', 'Frieght Charge', 'Total Amount',
                'SGST (%)', 'SGST Value', 'CGST (%)', 'CGST Value', 'IGST (%)', 'IGST Value', 'TCS (%)', 'TCS Value', 'Total value'],
              // ...this.dynamicArray.map(p => ([p.RowId, p.ItemDescription+'\n\n' +p.SubDescription,p.ItemCode,p.POQty, p.Rate, p.UnitName,p.TotalAmount])),
              ...this.dynamicArrayForPdf.map(p => ([{ text: p.RowId }, p.ItemCode, { text: p.ItemDescription }, p.UnitName, { text: p.EqpType }, { text: p.ChallanQty }, { text: p.AcceptedQty },
              { text: p.Rate }, { text: p.TotalAmount }, { text: p.FreightCharge }, { text: p.TotalAmountWithFreightCharge },
              { text: p.SGSTRate }, { text: p.SGST }, { text: p.CGSTRate }, { text: p.CGST }, { text: p.IGSTRate }, { text: p.IGST },
              { text: p.TCSRate }, { text: p.TCS }, { text: p.TotalInvoiceValue },])),

              [{}, { text: 'Total Amount', colSpan: 2, alignment: 'right', bold: true }, { text: '' }, { text: '' }, { text: '' }, { text: '' }, { text: '' }, { text: '' }, { text: '' }, { text: '' }, { text: '' }, { text: '' }, { text: '' }, { text: '' },
              { text: '' }, { text: '' }, { text: '' }, { text: '' }, { text: '' }, { text: this._Commonservices.thousands_separators(`${this.model.TotalSumAmount}`) + '₹', bold: true, alignment: 'center' }]
            ]
          }
        },

        {
          margin: [-25, 0, 0, 0],
          border: [0, 0, 0, 0],
          table: {
            body: [
              [
                {
                  table: {
                    body: [
                      [
                        {
                          border: [0, 0, 0, 0],
                          columns: [
                            {
                              margin: [0, 0, 0, 0],
                              width: 338,
                              text: [
                                { text: `Quality Inspection Report:`, fontSize: 10 },
                              ]
                            },

                            {
                              margin: [40, 0, 0, 0],
                              width: 270,
                              text: [
                              ]
                            },
                            {
                              margin: [10, 0, 0, 0],
                              width: 180,
                              text: [
                              ]
                            },
                          ]
                        },
                      ],

                      [
                        {
                          border: [0, 0, 0, 0],
                          columns: [
                            {
                              margin: [0, 0, 0, 0],
                              width: 300,
                              text: [
                                { text: ` ${this.model.labelBiltyNo}                     ${this.GRNPdfData.LRNo}`, fontSize: 10 },
                              ]
                            },
                            {
                              margin: [40, 0, 0, 0],
                              width: 250,
                              text: [
                                { text: `${this.model.labelBiltyDate}            ${this.GRNPdfData.LRDate}`, fontSize: 10 },
                              ]
                            },
                            {
                              margin: [10, 0, 0, 0],
                              width: 200,
                              text: [
                                { text: `Remarks:           ${this.GRNPdfData.Remarks}`, fontSize: 10 },
                              ]
                            },
                          ]
                        },
                      ],

                      [
                        {
                          border: [0, 0, 0, 0],
                          columns: [
                            {
                              width: 300,
                              margin: [0, 0, 0, 0],
                              text: [
                                //  { text:`Address                     ${this.GRNPdfData.SupplierAddress}`, fontSize:10},

                                { text: `Transpoter           ${this.GRNPdfData.TranspoterName}`, fontSize: 10 },
                              ]
                            },

                            {
                              margin: [40, 0, 0, 0],
                              width: 250,
                              text: [
                                { text: `P.R Dept          ${this.GRNPdfData.PRDept}`, fontSize: 10 },
                              ]
                            },

                            {
                              margin: [10, 0, 0, 0],
                              width: 200,
                              text: [
                                // {text:`PO Date                             ${this.GRNPdfData.PoDate}`, fontSize:10},
                              ]
                            },
                          ]
                        },
                      ],
                      [
                        {
                          border: [0, 0, 0, 0],
                          columns: [
                            {
                              width: 300,
                              margin: [0, 0, 0, 0],
                              text: [
                                { text: `Vehicle No           ${this.GRNPdfData.VehicleNo}`, fontSize: 10 },
                              ]
                            },

                            {
                              margin: [40, 0, 0, 0],
                              width: 250,
                              text: [
                                { text: `Material received by     ${this.GRNPdfData.IndenterName}`, fontSize: 10 },
                              ]
                            },

                            {
                              margin: [10, 0, 0, 0],
                              width: 200,
                              text: [
                                // {text:`PO Date                             ${this.GRNPdfData.PoDate}`, fontSize:10},
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
                              width: 260,
                              margin: [0, 0, 0, 0],
                              text: [
                              ]
                            },

                            {
                              margin: [40, 0, 0, 0],
                              width: 250,
                              text: [
                              ]
                            },

                            {
                              margin: [10, 0, 0, 0],
                              width: 200,
                              text: [
                                { text: `Authorised by `, fontSize: 10, bold: true, alignment: 'right', },
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
      ],

      styles: {
        header: {
          fontSize: 10,
          bold: true,
          margin: [190, -40, 0, 0]
        },

        ItemTableHeader: {
          fontSize: 7,
          alignment: 'center',
          margin: [-25, 0, 0, 0],
          border: [0, 0, 0, 0],
        },
      },
      images: {
        snow: `${this.GRNPdfData.Logo}`,
        //snow: 'http://localhost:4200/assets/logo.jpg',
        //snow: 'http://scm.astnoc.com/assets/logo.jpg'
      },
    }
    if (action === 'download') {
      pdfMake.createPdf(docDefinition).download();
    } else if (action === 'print') {
      pdfMake.createPdf(docDefinition).print();
    } else {
      if (this.model.FlagValue == 2) {
        pdfMake.createPdf(docDefinition).open();
      } else {
        pdfMake.createPdf(docDefinition).open();
        // pdfMake.createPdf(docDefinition).download();
        pdfMake.createPdf(docDefinition).getDataUrl(function (dataURL) {
          PDFdata = dataURL;
        });
        setTimeout(() => {
          this.SaveUpdateGRNPDF();
        }, 1200);
      }
    }
  }

  SaveUpdateGRNPDF() {
    try {
      var objSaveGRNCRNModelDetail = new SaveGRNCRNModelDetail();
      objSaveGRNCRNModelDetail.GrnCrnId = this.GrnId;
      objSaveGRNCRNModelDetail.GRNDocumentFile = PDFdata;
      // objSaveGRNCRNModelDetail.Flag = "GRN";
      this._GrncrnService.SaveGRNDocumentPDF(objSaveGRNCRNModelDetail).pipe(first()).subscribe(data => {
        if (data.Status == 1) {
          alert('Document has been generated');
        } else if (data.Status == 2) {
          alert('Document does not generated');
        }
      }, error => {
        this._Commonservices.ErrorFunction("", error.message, "SaveGRNPdf", "GrnDetail");
      });
    } catch (Error) {
      this._Commonservices.ErrorFunction("", Error.message, "SaveGRNPdf", "GrnDetail");
    }
  }

  DownloadGRNPdf() {
    if (this.model.GRNDocumentFile != null && this.model.GRNDocumentFile != "") {
      window.open(this.model.GRNDocumentFile);
    } else {
      alert('please first Genrate GRN Document');
    }
  }
  //#endregion

  //#region  Download All GRN Document in Zip Folder
  DownloadAllPdfZip() {
    var objDownLoadZipFileDetial = new DownLoadZipFileDetial();
    var value = '';
    var formdata = new FormData();
    this.Downloadfile = [];
    if (this.GridrowData.length > 0) {
      for (let i = 0; i < this.GridrowData?.length; i++) {
        if (this.GridrowData[i].GRNDocumentFile != "" && this.GridrowData[i].GRNDocumentFile != null) {
          objDownLoadZipFileDetial.DownloadFileData.push(this.GridrowData[i].GRNDocumentFile) + ',';
          value += this.GridrowData[i].GRNDocumentFile + ',';
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
            FileSaver.saveAs(content, "GRNFile.zip");
          });
      });
    } else {
      alert('Please first search');
    }
  }

  GetFilename(url) {
    var m = url.substring(url.lastIndexOf('/') + 1);
    this.ReplaceUrl = m.split('.');
    for (let j = 0; j < this.GridrowData?.length; j++) {
      if (this.GridrowData[j].GRNDocumentFile != "" && this.GridrowData[j].GRNDocumentFile != null) {
        var v = this.GridrowData[j].GRNDocumentFile.substring(this.GridrowData[j].GRNDocumentFile.lastIndexOf('/') + 1)
        if (m == v) {
          var R = this.GridrowData[j].GRNNo + ('.') + this.ReplaceUrl[1];
          return R;
        }
      }
    }
  }
  //#endregion
  //#region default call function on page Load
  async BindCompanyStateVendorItem() {
    try {
      var objCSVTdata = new CompanyStateVendorItemModel();
      objCSVTdata.Company_Id = parseInt(this.CompanyId);
      this.apiCSVIData = await this._Commonservices.getCompanyStateVendorItem(objCSVTdata);
      if (this.apiCSVIData.Status == 1) {
        objCSVTdata.CompanyArray = this.apiCSVIData.CompanyArray;
        objCSVTdata.StateArray = this.apiCSVIData.StateArray;
        objCSVTdata.VendorArray = this.apiCSVIData.VendorArray;
        objCSVTdata.ItemArray = this.apiCSVIData.ItemArray;
        objCSVTdata.EquipmentArray = this.apiCSVIData.EquipmentArray;
        this.WareHouseId = this.apiCSVIData.WHId;
        this.CompanyData = objCSVTdata.CompanyArray;
        this.SearchStateList = objCSVTdata.StateArray;
        this.SearchVendorList = objCSVTdata.VendorArray;
        this.SearchItemNameList = objCSVTdata.ItemArray;
        this.ItemNameDetailData = objCSVTdata.ItemArray;
        this.EquipmentTypeList = objCSVTdata.EquipmentArray; // brahamjot kaur 20/6/2022
        // sessionStorage.setItem("CompStatVenItmSession", JSON.stringify(objCSVTdata));
      }
    } catch (Error) {
      var objWebErrorLogModel = new WebErrorLogModel();
      objWebErrorLogModel.ErrorBy = this.UserId;
      objWebErrorLogModel.ErrorMsg = Error.message;
      objWebErrorLogModel.ErrorFunction = "BindCompanyStateVendorItem";
      objWebErrorLogModel.ErrorPage = "GRN";
      this._GlobalErrorHandlerService.handleError(objWebErrorLogModel);
    }
  }

  BindVoucherType() {
    var objUserModel = JSON.parse(sessionStorage.getItem("UserSession"));
    var User_Id = objUserModel.User_Id;
    var objdropdownmodel = new DropdownModel();
    objdropdownmodel.User_Id = 0;
    objdropdownmodel.Parent_Id = "0";
    objdropdownmodel.Company_Id = this.CompanyId;
    objdropdownmodel.Flag = 'VoucherMaster';
    this.model.VoucherTypeId = "0";
    this._Commonservices.getdropdown(objdropdownmodel).subscribe(vouc => {
      this.VoucherTypeDetail = vouc.Data;
    });
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
  //#endregion

  SearchGRNHistoryCountList() {
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
      objPoSearchModel.Flag = "1";
      this._GrncrnService.GetGRNHistoryCountList(objPoSearchModel).subscribe(data => {
        if (data.Status == 1) {
          this.GRNHistoryData = data.Data;
          this.NewGRN = data.Data[0].CountNewGRN;
          this.UpdateGRN = data.Data[0].CountUpdateGRN;
        }
      });
    } catch (Error) {
      var objWebErrorLogModel = new WebErrorLogModel();
      objWebErrorLogModel.ErrorBy = this.UserId;
      objWebErrorLogModel.ErrorMsg = Error.message;
      objWebErrorLogModel.ErrorFunction = "SearchGRNHistoryCountList";
      objWebErrorLogModel.ErrorPage = "GRN";
      this._GlobalErrorHandlerService.handleError(objWebErrorLogModel);
    }

  }
  //#region Search WH Drop down function
  OnEditVenItemDeSelect(item: any) {
    this.selectedEditVendorItems = [];
  }
  onEditVenDeSelectAll(items: any) {
    this.selectedEditVendorItems = [];
    this.model.SupplierAddress = null;
  }
  onfiledownload(e) {
    window.open(e.rowData.GRNDocumentFile);
  };
  searchCleared() {
    this.AutoCompletePOList = [];
    this.SearchPanelPoId = null;
    this.model.POData = "";
    this.ClearGrnCrnDetail();
  }

  SearchPanelPo(item) {
    this.SearchPanelPoId = item.id;
  }

  selectEvent(item) {
    console.log(item.id);
  }

  onChangeSearch(val: string, FlagId: any) {
    this.ClearGrnCrnDetail();
    this.AutoCompletePOList = [];
    this.AutoCompleteGRNCRNPoList = [];
    var objdropdownmodel = new DropdownModel();
    objdropdownmodel.User_Id = this.UserId;
    objdropdownmodel.Parent_Id = val;
    objdropdownmodel.Company_Id = this.CompanyId;
    objdropdownmodel.Flag = FlagId;
    this._PurchaseOrderService.GetAutoCompletePurchaseOrder(objdropdownmodel).subscribe((data) => {
      if (data.Data != null) {
        this.AutoCompletePOList = data.Data;
        this.AutoCompleteGRNCRNPoList = data.Data;
      } else {
        this.AutoCompletePOList = null;
        this.AutoCompleteGRNCRNPoList = null;
      }

    })
  }

  onFocusedCu(e) {
    // do something when input is focused
  }
  //#endregion

  //#region  GRN CRN PO Autocomplete
  SearchAutoPoDetailPoId(item) {
    try {
      this.ClearGrnCrnDetail();
      this.ItemAddrowhideshow = false;
      this.GRNCRNPOId = item.id;
      this.GRNCRNPODetailList = [];

      var objPoSearchModel = new PoSearchModel();
      objPoSearchModel.PoId = this.GRNCRNPOId;

      if (this.model.GRNById == 1) {
        objPoSearchModel.Flag = "PoId";
        this.model.Pono = item.PoName;
        this.model.PoId = this.GRNCRNPOId;
      } else if (this.model.GRNById == 3) {
        objPoSearchModel.Flag = "SaleId";
        this.model.JobId = item.id;
        this.model.Document = item.DocumentNo;
      } else {
        objPoSearchModel.Flag = "JobId";
        this.model.JobId = item.id;
        this.model.Document = item.DocumentNo;
      }

      this._PurchaseOrderService.GetGrnCrnPODetialandItemListByPoId(objPoSearchModel).subscribe((data) => {
        this.GRNCRNPODetailList = data.Data;
        if (this.GRNCRNPOId != 0) {
          this.IsUnitDisabled = true;
        }

        this.model.SignedPofile = this.GRNCRNPODetailList[0].PdfSrc
        if (this.model.GRNById == "1") {
          this.Addrowhideandshow = false;
          this.model.GRNByNo = "PoNo";
          if (data.Data[0].Podate != null || data.Data[0].Podate != undefined) {
            var PODate = data.Data[0].Podate.split('/');
            this.model.Podate = { year: parseInt(PODate[2]), month: parseInt(PODate[1]), day: parseInt(PODate[0]) };
            this.model.PreviewPODate = data.Data[0].Podate;
          }
        } else {
          this.model.GRNByNo = "JobNo";
          this.model.Dispatchfile = data.Data[0].DocumentFile;
          var DoDate = data.Data[0].DocumentDate.split('/');
          this.model.JobDate = { year: parseInt(DoDate[2]), month: parseInt(DoDate[1]), day: parseInt(DoDate[0]) };
          this.model.PreviewDocumentDate = data.Data[0].DocumentDate;
        }

        this.selectedEditVendorItems = [];
        if (this.model.GRNById == "3") {
          this.model.VendorSupplierName = data.Data[0].CompanyName;
          this.model.Address = data.Data[0].WHLocation;
          this.model.SupplierAddress = data.Data[0].WHLocation;
        } else {
          if (data.Data[0].VendorMaster_Id == null || data.Data[0].VendorMaster_Id == 0) {
            this.selectedEditVendorItems = [];
          } else {
            this.selectedEditVendorItems = [{
              "id": '' + data.Data[0].VendorMaster_Id + '',
              "itemName": '' + data.Data[0].VendorName + ''
            }];
            this.model.SupplierName = this.selectedEditVendorItems[0].itemName;
          }
          this.model.Address = data.Data[0].VendorAddress;
          this.model.SupplierAddress = data.Data[0].VendorAddress;
        }

        //hemant Tyagi 22/06/2022

        if (data.WHData != null && data.WHData != "" && data.WHData.length > 0) {
          this.GRNCRNWHList = data.WHData;
          this.model.EditStateId = '' + data.Data[0].WHState_Id + ''
          this.model.SelectedGRNCRNWH = '' + data.Data[0].WH_Id + ''
          var EditStateName = this.SearchStateList.filter(m => m.id === parseInt(this.model.EditStateId));
          this.model.WHStateName = EditStateName[0].itemName;
          var EditWHName = this.GRNCRNWHList.filter(m => m.id === parseInt(this.model.SelectedGRNCRNWH));
          this.model.WHName = EditWHName[0].itemName;
          this.model.WHAddress = data.Data[0].WHAddress;
        } else {
          this.GRNCRNWHList = [];
          this.model.EditStateId = "0";
          this.model.SelectedGRNCRNWH = "0";
          this.model.WHStateName = "";
          this.model.WHName = "";
          this.model.WHAddress = "";
        }


        if (data.InvoiceNoData[0].InvoiceNo == 0) {
          this.InvoiceListData = [];
          this.InvoiceListEditData = this.InvoiceListData;
        } else {
          this.InvoiceListData = data.InvoiceNoData;
          this.InvoiceListEditData = this.InvoiceListData;
        }
      });
    } catch (Error) {
      var objWebErrorLogModel = new WebErrorLogModel();
      objWebErrorLogModel.ErrorBy = this.UserId;
      objWebErrorLogModel.ErrorMsg = Error.message;
      objWebErrorLogModel.ErrorFunction = "SearchAutoPoDetailPoId";
      objWebErrorLogModel.ErrorPage = "GRN";
      this._GlobalErrorHandlerService.handleError(objWebErrorLogModel);
    }
  }


  ChangeInvoice(InvoiceNo: any) {
    try {
      if (InvoiceNo == "0") {
        this.model.PreviewSelectInvoice = "Other invoice";
      } else {
        this.model.PreviewSelectInvoice = InvoiceNo;
      }
      this.dynamicArray = [];
      $("#txtChallanNo").css('border-color', '');
      if (InvoiceNo != "0" && InvoiceNo != "" && this.model.GRNById == "1") {
        var objdropdownmodel = new DropdownModel();
        objdropdownmodel.User_Id = 0;
        objdropdownmodel.Parent_Id = "0";
        objdropdownmodel.Company_Id = this.CompanyId;
        objdropdownmodel.Other_Id = InvoiceNo;
        objdropdownmodel.Flag = 'Invoice';
        this.model.ChallanNo = InvoiceNo;
        this._GrncrnService.GetAllInvoiceOtherDataById(objdropdownmodel).subscribe((data) => {
          var InvoiceItemData = data.Data;
          if (data.Data[0].InvoiceDate != null) {
            var invoicedate = data.Data[0].InvoiceDate.split('/');
            this.model.ChallanDate = { year: parseInt(invoicedate[2]), month: parseInt(invoicedate[1]), day: parseInt(invoicedate[0]) };
          }
          //this.model.InvoiceAmount = data.Data[0].InvoiceAmount;
          this.model.EwayBillNo = data.Data[0].EwayBillNo;
          if (data.Data[0].EwayBillDate != null) {
            var ewaybillDate = data.Data[0].EwayBillDate.split('/');
            this.model.EwayBillDate = { year: parseInt(ewaybillDate[2]), month: parseInt(ewaybillDate[1]), day: parseInt(ewaybillDate[0]) };
          }
          if (data.Data[0].DispatchDate != null) {
            var dispatchDate = data.Data[0].DispatchDate.split('/');
            this.model.DispatchDate = { year: parseInt(dispatchDate[2]), month: parseInt(dispatchDate[1]), day: parseInt(dispatchDate[0]) };
          }
          if (data.ItemData != null) {
            this.BindItemArray(data.ItemData);
          }
        });
      } else if (InvoiceNo == "0" && this.model.GRNById == "1" && checkUndefined(this.GRNCRNPOId) != '') {
        this.ClearInvoiceChange();
        var objdropdownmodel = new DropdownModel();
        objdropdownmodel.User_Id = 0;
        objdropdownmodel.Parent_Id = "0";
        objdropdownmodel.Company_Id = this.CompanyId;
        objdropdownmodel.Other_Id = this.GRNCRNPOId;
        objdropdownmodel.Flag = "PoIdBaseItem";
        this._GrncrnService.GetAllInvoiceOtherDataById(objdropdownmodel).subscribe((data) => {
          var InvoiceItemData = data.Data;
          if (data.ItemData != null) {
            this.BindItemArray(data.ItemData);
          } else {
            alert('In case of other Invoice if PO Item list is not showing then pls coordinate to PO maker and have PO list corrected then you will be able to make entry against PO item!');
          }
        });
      }
      else if (InvoiceNo == "0" && (this.model.GRNById == "2" || this.model.GRNById == "3" || this.model.GRNById == "4") && checkUndefined(this.GRNCRNPOId) != '') {
        this.ClearInvoiceChange();
        var objdropdownmodel = new DropdownModel();
        objdropdownmodel.User_Id = 0;
        objdropdownmodel.Parent_Id = "0";
        objdropdownmodel.Company_Id = this.CompanyId;
        objdropdownmodel.Other_Id = this.GRNCRNPOId;
        objdropdownmodel.Flag = "JobIdBaseItem";
        this._GrncrnService.GetAllInvoiceOtherDataById(objdropdownmodel).subscribe((data) => {
          var InvoiceItemData = data.Data;
          if (data.ItemData != null) {
            // this.ItemAddrowhideshow = true;
            this.EquipmentTypeHideShow = true;
            this.BindItemArray(data.ItemData);
          } else {
            alert('In case of other Invoice if Job Item list is not showing then pls coordinate to PO maker and have PO list corrected then you will be able to make entry against PO item!');
          }
        });
      } else {
        this.addRow();
      }
      // }
    } catch (Error) {
      var objWebErrorLogModel = new WebErrorLogModel();
      objWebErrorLogModel.ErrorBy = this.UserId;
      objWebErrorLogModel.ErrorMsg = Error.message;
      objWebErrorLogModel.ErrorFunction = "ChangeInvoice";
      objWebErrorLogModel.ErrorPage = "GRN";
      this._GlobalErrorHandlerService.handleError(objWebErrorLogModel);
    }

  }

  async BindItemArray(ItemEditDataArr: any) {
    try {
      this.dynamicArray = [];
      for (var i = 0, len = ItemEditDataArr.length; i < len; i++) {
        var objdynamic = new GRNDynamicItemGrid();
        objdynamic.Id = 0;
        objdynamic.PoItemListId = ItemEditDataArr[i].PoItemListId;
        objdynamic.ItemId = ItemEditDataArr[i].ItemId;
        objdynamic.ItemNameId = ItemEditDataArr[i].ItemNameId;
        objdynamic.ItemName = ItemEditDataArr[i].ItemName;
        objdynamic.UnitList = JSON.parse(ItemEditDataArr[i].UnitList);
        if (ItemEditDataArr[i].SerialNoList != null) {
          objdynamic.GSerialNumbers = JSON.parse(ItemEditDataArr[i].SerialNoList);
        } else {
          objdynamic.GSerialNumbers = [];
        }
        if (ItemEditDataArr[i].EqpType_Id != null && this.model.GRNById == "3") {
          objdynamic.EqTypeId = ItemEditDataArr[i].EqpType_Id;
        } else {
          objdynamic.EqTypeId = "0";
        }
        if (ItemEditDataArr[i].UnitMaster_Id != null) {
          objdynamic.UnitName = ItemEditDataArr[i].UnitMaster_Id;
        } else {
          objdynamic.UnitName = "0";
        }
        objdynamic.ItemDescription = ItemEditDataArr[i].ItemDescription;
        objdynamic.SubDescription = ItemEditDataArr[i].SubDescription;
        objdynamic.MakeName = ItemEditDataArr[i].MakeName;
        objdynamic.ItemCode = ItemEditDataArr[i].ItemCode;
        objdynamic.Unit = ItemEditDataArr[i].UnitName;
        objdynamic.EqpType = ItemEditDataArr[i].EqpType;
        if (ItemEditDataArr[i].IsConversion == 1) {
          objdynamic.HideShowConValue = true;
          objdynamic.HideConversionValue = ItemEditDataArr[i].ConversionValue;
          objdynamic.IsConversion = ItemEditDataArr[i].IsConversion;
          objdynamic.ConversionUnit = ItemEditDataArr[i].ConversionUnit;
        }
        else {
          objdynamic.HideShowConValue = false;
        }
        objdynamic.SubDescription = ItemEditDataArr[i].SubDescription;
        objdynamic.ChallanQty = ItemEditDataArr[i].Qty;
        objdynamic.AcceptedQty = ItemEditDataArr[i].Qty;
        objdynamic.POQty = ItemEditDataArr[i].POQty;
        if (this._Commonservices.checkUndefined(ItemEditDataArr[i].Rate) == '') {
          objdynamic.Rate = "0.00";
        } else {
          objdynamic.Rate = parseFloat(ItemEditDataArr[i].Rate).toFixed(2);
        }

        objdynamic.ItemMakeId = ItemEditDataArr[i].MakeMaster_Id;
        objdynamic.EditItemMake = JSON.parse(ItemEditDataArr[i].ItemMakeList);
        objdynamic.EditItemCode = JSON.parse(ItemEditDataArr[i].ItemCodeList);

        if (this._Commonservices.checkUndefined(ItemEditDataArr[i].SGSTRate) != '') {
          objdynamic.SGSTRate = ItemEditDataArr[i].SGSTRate;
        } else {
          objdynamic.SGSTRate = 0;
        }
        if (this._Commonservices.checkUndefined(ItemEditDataArr[i].SGST) != '') {
          objdynamic.SGST = ItemEditDataArr[i].SGST;
        } else {
          objdynamic.SGST = 0.00;
        }
        if (this._Commonservices.checkUndefined(ItemEditDataArr[i].CGSTRate) != '') {
          objdynamic.CGSTRate = ItemEditDataArr[i].CGSTRate;
        } else {
          objdynamic.CGSTRate = 0;
        }
        if (this._Commonservices.checkUndefined(ItemEditDataArr[i].CGST) != '') {
          objdynamic.CGST = ItemEditDataArr[i].CGST;
        } else {
          objdynamic.CGST = 0.00;
        }
        if (this._Commonservices.checkUndefined(ItemEditDataArr[i].TCSRate) != '') {
          objdynamic.TCSRate = ItemEditDataArr[i].TCSRate;
        } else {
          objdynamic.TCSRate = 0;
        }
        if (this._Commonservices.checkUndefined(ItemEditDataArr[i].TCS) != '') {
          objdynamic.TCS = ItemEditDataArr[i].TCS;
        } else {
          objdynamic.TCS = 0.00;
        }
        if (this._Commonservices.checkUndefined(ItemEditDataArr[i].IGSTRate) != '') {
          objdynamic.IGSTRate = ItemEditDataArr[i].IGSTRate;
        } else {
          objdynamic.IGSTRate = 0;
        }
        if (this._Commonservices.checkUndefined(ItemEditDataArr[i].IGST) != '') {
          objdynamic.IGST = ItemEditDataArr[i].IGST;
        } else {
          objdynamic.IGST = 0.00;
        }
        if (this._Commonservices.checkUndefined(ItemEditDataArr[i].TotalInvoiceValue) != '') {
          objdynamic.TotalInvoiceValue = ItemEditDataArr[i].TotalInvoiceValue;
        } else {
          objdynamic.TotalInvoiceValue = 0.00;
        }
        if (this._Commonservices.checkUndefined(ItemEditDataArr[i].FreightCharge) != '') {
          objdynamic.FreightCharge = ItemEditDataArr[i].FreightCharge;
        } else {
          objdynamic.FreightCharge = 0.00;
        }
        if (this._Commonservices.checkUndefined(ItemEditDataArr[i].TotalAmountWithFreightCharge) != '') {
          objdynamic.TotalAmountWithFreightCharge = ItemEditDataArr[i].TotalAmountWithFreightCharge;
        } else {
          objdynamic.TotalAmountWithFreightCharge = 0.00;
        }
        this.dynamicArray.push(objdynamic);
      }
      this.fnBindItemGrossToatl()
    } catch (Error) {
      var objWebErrorLogModel = new WebErrorLogModel();
      objWebErrorLogModel.ErrorBy = this.UserId;
      objWebErrorLogModel.ErrorMsg = Error.message;
      objWebErrorLogModel.ErrorFunction = "BindItemArray";
      objWebErrorLogModel.ErrorPage = "GRN";
      this._GlobalErrorHandlerService.handleError(objWebErrorLogModel);
    }
  }

  ClearInvoiceChange() {
    this.model.ChallanDate = "";
    this.model.DispatchDate = "";
    this.model.EwayBillDate = "";
    this.model.ChallanDate = "";
    this.model.ChallanNo = "";
  }

  BindEditWHList() {
    try {
      $('#txtStateEdit').attr('style', 'border-color: ');
      // var companyid=  this._Commonservices.checkUndefined(this.model.GrnCompanyId);
      var StateId = this._Commonservices.checkUndefined(this.model.EditStateId);
      var EditStateName = this.SearchStateList.filter(m => m.id === parseInt(this.model.EditStateId));
      this.model.WHStateName = EditStateName[0].itemName;
      var objdropdownmodel = new DropdownModel();
      objdropdownmodel.User_Id = 0;
      objdropdownmodel.Parent_Id = this.CompanyId;
      if (StateId != '') {
        objdropdownmodel.Other_Id = StateId;
      } else {
        objdropdownmodel.Other_Id = "0";
      }
      objdropdownmodel.Flag = 'WHMaster';
      this.model.SelectedGRNCRNWH = '0';
      this.model.WHAddress = '';
      this.GRNCRNWHList = [];
      this._Commonservices.getdropdown(objdropdownmodel).subscribe(wh => {
        this.GRNCRNWHList = wh.Data;

      });
    } catch (Error) {
      var objWebErrorLogModel = new WebErrorLogModel();
      objWebErrorLogModel.ErrorBy = this.UserId;
      objWebErrorLogModel.ErrorMsg = Error.message;
      objWebErrorLogModel.ErrorFunction = "BindEditWHList";
      objWebErrorLogModel.ErrorPage = "GRN";
      this._GlobalErrorHandlerService.handleError(objWebErrorLogModel);
    }
  }

  fnBindItemGrossToatl() {
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
    var GrandAllSumtotal = 0;
    this.GrandAllSumtotalInvoiceValue = 0.00;
    var taxWith;
    for (var i = 0, len = this.dynamicArray.length; i < len; i++) {
      _rowAmount = 0.0;
      if (this.dynamicArray[i].SGSTRate != 0) {
        this.dynamicArray[i].CGSTRate = this.dynamicArray[i].SGSTRate;
      }
      if (this.dynamicArray[i].CGSTRate != 0) {
        this.dynamicArray[i].SGSTRate = this.dynamicArray[i].CGSTRate;
      }
      if (this.dynamicArray[i].IGSTRate != 0) {
        this.dynamicArray[i].SGSTRate = 0;
        this.dynamicArray[i].CGSTRate = 0;
      }
      accqty = parseFloat(this.dynamicArray[i].AcceptedQty == "" ? 0.0 : this.dynamicArray[i].AcceptedQty);
      rate = parseFloat(this.dynamicArray[i].Rate == "" ? 0.0 : this.dynamicArray[i].Rate);
      cgstRate = parseFloat(this.dynamicArray[i].CGSTRate == "" ? 0.0 : this.dynamicArray[i].CGSTRate);
      sgstRate = parseFloat(this.dynamicArray[i].SGSTRate == "" ? 0.0 : this.dynamicArray[i].SGSTRate);
      tcsRate = parseFloat(this.dynamicArray[i].TCSRate == "" ? 0.0 : this.dynamicArray[i].TCSRate);
      igstrate = parseFloat(this.dynamicArray[i].IGSTRate == "" ? 0.0 : this.dynamicArray[i].IGSTRate);

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
        this.dynamicArray[i].TCS = (this.dynamicArray[i].TotalAmountWithFreightCharge * tcsRate) / 100
      } else {
        this.dynamicArray[i].TotalAmountWithFreightCharge = _rowAmount + parseFloat(this.dynamicArray[i].FreightCharge);
        this.dynamicArray[i].CGST = (_rowAmount * cgstRate) / 100;
        this.dynamicArray[i].SGST = (_rowAmount * sgstRate) / 100;
        this.dynamicArray[i].IGST = (_rowAmount * igstrate) / 100;
        this.dynamicArray[i].TCS = (_rowAmount * tcsRate) / 100;
      }

      if (this.dynamicArray[i].SGSTRate != 0 && this.dynamicArray[i].IGSTRate != 0) {
        this.ValidationerrorMessage = 'Invalid Tax Detail';
        jQuery('#Validationerror').modal('show');
        this.dynamicArray[i].SGSTRate = 0.00;
        this.dynamicArray[i].CGSTRate = 0.00;
        this.dynamicArray[i].IGSTRate = 0.00;
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
        this.dynamicArray[i].TotalInvoiceValue = (this.dynamicArray[i].TotalAmountWithFreightCharge + this.dynamicArray[i].IGST)
      }
      if (this.dynamicArray[i].TCSRate == '') {
        this.dynamicArray[i].TCSRate = 0;
      }
      if (this.dynamicArray[i].IGSTRate == '') {
        this.dynamicArray[i].IGSTRate = 0;
      }
      if (this.dynamicArray[i].CGSTRate == '') {
        this.dynamicArray[i].CGSTRate = 0;
      }
      if (this.dynamicArray[i].SGSTRate == '') {
        this.dynamicArray[i].SGSTRate = 0;
      }
      this.dynamicArray[i].TotalInvoiceValue = this.dynamicArray[i].TotalInvoiceValue.toFixed(2);
      GrandAllSumtotal += parseFloat(this.dynamicArray[i].TotalInvoiceValue);
      var chekValidation = (parseFloat(this.dynamicArray[i].SGSTRate) + parseFloat(this.dynamicArray[i].CGSTRate))
      var chekValidationIgst = (parseFloat(this.dynamicArray[i].IGSTRate))
      if (chekValidation > 28) {
        alert('Please enter tax detail less then 14');
        this.dynamicArray[i].SGSTRate = 0;
        this.dynamicArray[i].CGSTRate = 0;
      }
      if (chekValidationIgst > 28) {
        alert('Please enter tax detail less then 28');
        this.dynamicArray[i].IGSTRate = 0;
      }
    }
    this.totalSumAcceptedQty = AcceptedQty.toFixed(2);
    this.totalSumAmount = this._Commonservices.thousands_separators(this.totalAmount);
    this.GrandAllSumtotalInvoiceValue = GrandAllSumtotal.toFixed(2);//.this._Commonservices.thousands_separators(GrandAllSumtotal);
    //this.totalSumQuantity=parseFloat(this.totalQuantity).toFixed(2);
    // parseFloat(this.totalSumAmount).toFixed(2)
  }

  ItemRateOnblur() {
    this.fnBindItemGrossToatl();
  }
  searchGRNCRNCleared() {
    this.AutoCompleteGRNCRNPoList = [];
    this.GRNCRNPODetailList = [];
    this.InvoiceListData = [];

    this.ClearGrnCrnDetail();
    this.EquipmentTypeHideShow = true;
    // this.ItemAddrowhideshow = true;
    this.totalSumAmount = "";
    this.model.ddlChallanNo = "";
  }

  //#endregion

  SearchGRNCRNPO() {
    if (this.modelpdf == "" || this.modelpdf == null) {
      if (this._Commonservices.checkUndefined(this.model.SignedPofile) != '') {
        this.modelpdf = this.GRNCRNPODetailList[0].PdfSrc;
        window.open(this.modelpdf);
      } else {
        alert('Not uploaded Signed PO File');
      }
    } else if (this.modelpdf != "" || this.modelpdf != null) {
      this.modelpdf = this.modelpdf;
      window.open(this.modelpdf);
    }

  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.rowData = this.GridrowData;
  }
  onItemSelect(item: any) {
    console.log(item);

  }
  onSelectAll(items: any) {
    console.log(items);
  }
  OnGRNCRNStateDeSelect(items: any) {
    this.SelectedGRNCRNStateItem = [];
  }
  onGRNCRNStateDeSelectAll(items: any) {
    this.SelectedGRNCRNStateItem = [];
  }
  CreateNewGRNCRN() {
    this.Correctioncolumnhideandshow = false;
    this.IsSuccess = false;
    this.isEdit = false;
    this.isShownPOList = false;
    this.isShownPOEdit = true;
    this.isdisabledGrnDate = true;
    this.isShownGrnCompany = true;
    this.ItemAddrowhideshow = true;

    this.Addrowhideandshow = true;
    this.POBasedisabled = false;
    this.IsRateDesabled = false;
    this.IsGRNByPO = true;
    this.IsGRNByDispatch = false;
    this.ChallanNodisabled = false;
    this.IsAutoCompleteDesabled = false;
    this.IsChallanDateDesabled = false;
    this.IsDownloadPrintHideShow = false;
    this.IsSaveButtonDisable = false;
    this.IsReceivingFile = false;
    this.IsLRFile = false;
    this.IsGatefile = false;
    this.IsGrnSignedfile = false;
    this.IsHideShowCancelBtn = false;
    this.IsNewPreview = true;
    this.model.ddlChallanNo = "";
    this.InvoiceListData = [];
    this.model.POData = "";
    this.model.GRNById = 1;
    this.PoeditId = null;
    this.GrnId = 0;
    this.TableId = 0;
    this.ManueId = null;
    this.ApprovalList = null
    this.IsTransporter = true;
    var sfDate = new Date();
    var toDate = "";
    toDate = this.datePipe.transform(sfDate, "yyyy/MM/dd");
    this.model.GRNdate = { day: parseInt(toDate.split('/')[2]), month: parseInt(toDate.split('/')[1]), year: parseInt(toDate.split('/')[0]) };
    this.model.PreviewGRNdate = toDate;
    this.ClearGrnCrnDetail();
  }

  ClearAllUploadFile() {
    this.ChallanfilePickerVariable.nativeElement.value = '';
    this.GatefilePickerVariable.nativeElement.value = '';
    this.LRfilePickerFileVariable.nativeElement.value = '';
  }

  ChangeEditItemName(ItemNameId: any, index: any) {
    try {
      $('#tblOne > tbody  > tr').each(function () {
        var valueItem = $(this).find('.ItemName').val();
        if (valueItem != '0') {
          $(this).find('.ItemName').css('border-color', '');
        }
      });
      var FilterData = this.ItemNameDetailData.filter(m => m.id === parseInt(ItemNameId));
      this.dynamicArray[index].ItemName = FilterData[0].itemName;
      this.dynamicArray[index].EditItemMake = null;
      var objdropdownmodel = new DropdownModel();
      objdropdownmodel.User_Id = 0;
      objdropdownmodel.Parent_Id = ItemNameId;
      objdropdownmodel.Other_Id = "0";
      objdropdownmodel.Company_Id = this.CompanyId;
      objdropdownmodel.Flag = 'ItemMake';
      this._Commonservices.getdropdown(objdropdownmodel).subscribe(item => {
        this.dynamicArray[index].EditItemMake = item.Data
      });
    } catch (Error) {
      var objWebErrorLogModel = new WebErrorLogModel();
      objWebErrorLogModel.ErrorBy = this.UserId;
      objWebErrorLogModel.ErrorMsg = Error.message;
      objWebErrorLogModel.ErrorFunction = "ChangeEditItemName";
      objWebErrorLogModel.ErrorPage = "GRN";
      this._GlobalErrorHandlerService.handleError(objWebErrorLogModel);
    }

  }

  async ChangeEditItemMake(ItemMakeId: any, ItemNameId: any, index: any) {
    $('#tblOne > tbody  > tr').each(function () {
      var valueMake = $(this).find('.ItemMake').val();
      if (valueMake != '0') {
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
    this.dynamicArray[index].EditItemCode = null;
    this.ItemCodeGRNCRNData = null;
    this.ItemCodeGRNCRNData = await
      this._Commonservices.getdropdown2(objdropdownmodel);
    this.dynamicArray[index].EditItemCode = this.ItemCodeGRNCRNData.Data

  }

  ChangeEditItemCode(ItemId: any, index: any) {
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
    this._Commonservices.getVendorOrWh(objVendormodel).subscribe(data => {
      var UnitData = data.Data;
      if (data.Data[0].UnitList.length == 1) {
        this.dynamicArray[index].UnitList = data.Data[0].UnitList;
        this.dynamicArray[index].UnitName = this.dynamicArray[index].UnitList[0].Id;
        this.dynamicArray[index].Unit = this.dynamicArray[index].UnitList[0].UnitName;
      } else {
        this.dynamicArray[index].UnitName = "0";
        this.dynamicArray[index].UnitList = data.Data[0].UnitList;
      }
      this.dynamicArray[index].ItemDescription = data.Data[0].ItemDescription;
    });
  }


  ChangeEditVendor(event): void {
    $('#TxtVendorEdit .selected-list .c-btn').attr('style', 'border-color: ');
    var objVendormodel = new VendorOrWhModel();
    objVendormodel.Id = this.selectedEditVendorItems[0].id;
    objVendormodel.flag = 'vendor';
    this.model.SupplierName = this.selectedEditVendorItems[0].itemName;
    this._Commonservices.getVendorOrWh(objVendormodel).subscribe(data => {
      var EditvendorData = data.Data;
      this.model.SupplierAddress = data.Data[0].VenAddressList[0].VendorAddress;
    });

  }

  ClearGrnCrnDetail() {
    this.totalSumAcceptedQty = "0.0";
    this.totalSumAmount = "0.0";
    this.GrandAllSumtotalInvoiceValue = 0.00;
    this.model.Podate = "",
      this.model.Address = "";
    this.model.GRNCRNNo = "";
    this.AutoCompleteDocumentNoList = [];
    this.model.DocumentNoData = "";
    this.selectedEditVendorItems = [];
    this.model.VendorSupplierName = "";
    this.model.SupplierAddress = "";
    this.model.SelectedGRNCRNWH = "0";
    this.GRNCRNWHList = [];
    this.model.WHAddress = "";
    this.model.EditStateId = "0";
    this.model.EwayBillNo = "";
    this.model.EwayBillDate = "";
    this.model.ChallanNo = "";
    this.model.InvoiceAmount = 0.00;
    this.model.ChallanDate = "";
    this.model.ddlChallanNo = "";
    this.model.GateEntryNo = "";
    this.model.GateEntryDate = "";
    this.model.TransporterName = "";
    this.model.TransporterGSTNo = "";
    this.model.VehicleNo = "";
    this.model.IndentorName = "";
    this.model.TransporterId = "";
    this.model.LRNo = "";
    this.model.LRdate = "";
    this.model.Remarks = "";
    this.model.ddlDespatchby = "2";
    this.model.DispatchDate = "";
    this.model.CourierCompanyName = "";
    this.model.CourierPhoneNo = "";
    this.model.SenderAddress = "";
    this.model.SenderNo = "";
    this.model.SenderName = "";
    this.ChangeDespatchby(2);
    this.model.JobDate = "";
    this.model.JobId = 0;
    this.model.PoId = 0;
    this.dynamicArray = [];
    this.FaultyFileArray = [];
    this.addRow();
  }

  BackPreviewPage() {
    this.isShownPOList = false;
    this.isShownPOEdit = true;
    this.isPdfPreview = false;
    this.model.DocumentNoData = this.model.Document;
    this.model.POData = this.model.Pono;
    // if (this.model.GRNById == "1" || this.model.GRNById == "0") {
    //   this.model.POData =this.model.POData;
    // }else{
    //   this.model.DocumentNoData =this.model.DocumentNoData;
    // }
  }

  SearchPdfPreview() {
    this.isPdfPreview = true;
    this.isShownPOList = false;
    this.isShownPOEdit = false;
    this.model.PreviewEwayBillDate = this._Commonservices.ConvertDateFormat(this.model.EwayBillDate);
    this.model.PreviewInvoiceDate = this._Commonservices.ConvertDateFormat(this.model.ChallanDate);
    this.model.PreviewGateDate = this._Commonservices.ConvertDateFormat(this.model.GateEntryDate);
    this.model.PreviewDispatchDate = this._Commonservices.ConvertDateFormat(this.model.DispatchDate);
    this.model.PreviewLRDate = this._Commonservices.ConvertDateFormat(this.model.LRdate);
    if (this.model.ddlDespatchby == 1) {
      this.model.PreviewDespatchby = "By Transport";
    } else if (this.model.ddlDespatchby == 2) {
      this.model.PreviewDespatchby = "By Hand";
    } else {
      this.model.PreviewDespatchby = "By Courier";
    }
  }

  //#region  Grn Edit Detail
  onEditBtnClick(e) {
    try {
      if (e.rowData.Pageflag == 4) {
        this.IsPageActive = true;
        this.isShownPOEdit = false;
        this.isShownPOList = false;
        localStorage.removeItem("Id");
        localStorage.setItem("Id", e.rowData.Id);
        return false;
      } else {
        this.GrnId = e.rowData.Id;
        this.GetUserPageRight(this.GrnId);
        this.isShownPOList = false;
        this.isShownPOEdit = true;
        this.IsPageActive = false;
      }

      this.isEdit = true;
      this.Loader.show();
      this.isShownGrnCompany = true;
      this.isdisabledGrnDate = true;
      this.IsNewPreview = false;
      this.POBasedisabled = false;
      this.IsRateDesabled = true;
      this.ChallanNodisabled = true;
      this.IsAutoCompleteDesabled = true;
      this.IsChallanDateDesabled = true;
      this.IsDownloadPrintHideShow = true;
      this.model.ddlChallanNo = "";

      this.GRNCRNRowData = [];
      var objPoSearchModel = new PoSearchModel();
      objPoSearchModel.PoId = this.GrnId;
      objPoSearchModel.Flag = "GRNListByGrnId";
      this._PurchaseOrderService.GetPoListandOtherDetailByPoId(objPoSearchModel).subscribe((data) => {
        this.Loader.hide();
        this.GRNCRNRowData = data.Data;
        this.model.InCaseReason = "0";
        this.InvChallanEditFile = 0;
        if (this._Commonservices.checkUndefined(this.GRNCRNRowData[0].ChallanPdffile) != '' && this.GRNCRNRowData[0].ChallanPdffile != null) {
          this.InvChallanFile = this.GRNCRNRowData[0].ChallanPdffileUrl;
        } else {
          this.InvChallanFile = "";
        }
        this.GateEditFile = 0;
        if (this._Commonservices.checkUndefined(this.GRNCRNRowData[0].GatePdffile) != '' && this.GRNCRNRowData[0].GatePdffile != null) {
          this.GatePdfFile = this.GRNCRNRowData[0].GatePdffileUrl;
        } else {
          this.GatePdfFile = "";
        }
        this.LREditFile = 0;
        if (this._Commonservices.checkUndefined(this.GRNCRNRowData[0].CLRPdfile) != '' && this.GRNCRNRowData[0].CLRPdfile != null) {
          this.LRFile = this.GRNCRNRowData[0].CLRPdfileUrl;
        } else {
          this.LRFile = "";
        }
        if (this.GRNCRNRowData[0].GRNDocumentFile != null && this.GRNCRNRowData[0].GRNDocumentFile != "") {
          this.model.GRNDocumentFile = this.GRNCRNRowData[0].GRNDocumentFile;
          this.IsDownloadButtonDisable = false;
        } else {
          this.IsDownloadButtonDisable = true;;
        }
        if (this.GRNCRNRowData[0].JobId != null) {
          this.model.JobId = this.GRNCRNRowData[0].JobId;
        }
        if (this.GRNCRNRowData[0].GRNById == null) {
          this.model.GRNById = 1;
        } else {
          this.model.GRNById = this.GRNCRNRowData[0].GRNById;
        }
        if (this.GRNCRNRowData[0].GRNById == 0 || this.GRNCRNRowData[0].GRNById == 1 || this.GRNCRNRowData[0].GRNById == null) {
          this.modelpdf = this.GRNCRNRowData[0].POPdfile;
          this.model.POData = this.GRNCRNRowData[0].PONo;
        } else {
          this.model.Dispatchfile = this.GRNCRNRowData[0].JobFile;
          this.model.DocumentNoData = this.GRNCRNRowData[0].DocumentNo;
        }
        if (this.GRNCRNRowData[0].GRNSignedDocumentFile != "" && this.GRNCRNRowData[0].GRNSignedDocumentFile != null) {
          this.IsGrnSignedfile = true;
          this.model.GRNSignedfile = this.GRNCRNRowData[0].GRNSignedDocumentFile;
        } else {
          this.IsGrnSignedfile = false;
        }

        this.EditChangeGRNBy(this.GRNCRNRowData[0].GRNById);
        this.PoeditId = this.GRNCRNRowData[0].PoId;
        if (this._Commonservices.checkUndefined(this.PoeditId) != "") {
          this.IsUnitDisabled = true;
          this.model.PoId = this.GRNCRNRowData[0].PoId;
        }

        this.TableId = this.GRNCRNRowData[0].Id;
        this.ManueId = this.PageMenuId;
        this.CreateName = data.Data[0].CreateName;
        this.CreatedDate = data.Data[0].CreatedDate;
        this.ModifiedName = data.Data[0].ModifiedName;
        this.ModifiedDate = data.Data[0].ModifiedDate;
        this.model.DateDiffHour = data.Data[0].DateDiffHour;
        if (this.model.DateDiffHour > CommonStaticClass.DifferenceDay) {
          if (this.UserRoleId == UserRole.Admin || this.UserRoleId == UserRole.SCMLead) {
            this.IsHideShowCancelBtn = true;
            this.IsSaveButtonDisable = true;
            this.IsCancelButtonDisable = false;
          } else {
            this.IsHideShowCancelBtn = false;
            this.IsSaveButtonDisable = true;
          }
        } else {
          this.IsHideShowCancelBtn = true;
          this.IsSaveButtonDisable = false;
        }
        this.Addrowhideandshow = true;
        this.Correctioncolumnhideandshow = false;
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

        if (this.GRNCRNRowData[0].JobDate != null) {
          var jDate = this.GRNCRNRowData[0].JobDate.split('/');
          this.model.JobDate = { year: parseInt(jDate[2]), month: parseInt(jDate[1]), day: parseInt(jDate[0]) };
        }
        if (this.GRNCRNRowData[0].PoDate != null) {
          var PODate = this.GRNCRNRowData[0].PoDate.split('/');
          this.model.Podate = { year: parseInt(PODate[2]), month: parseInt(PODate[1]), day: parseInt(PODate[0]) };
        }
        if (this.GRNCRNRowData[0].IsActive == 0) {
          this.IsSaveButtonDisable = true;
        }


        // hemant tyagi 22/06/2022
        // this.model.Address = this.GRNCRNRowData[0].VendorAddress;
        // this.selectedEditVendorItems = [];

        // if (this.GRNCRNRowData[0].Vendor_Id == null || this.GRNCRNRowData[0].Vendor_Id == 0) {
        //   this.selectedEditVendorItems = [];
        // } else {
        //   //brahamjot kaur 22/6/2022
        //   if (this.model.GRNById == 1 || this.model.GRNById == 2 || this.model.GRNById == 4) {
        //     this.selectedEditVendorItems = [{
        //       "id": '' + this.GRNCRNRowData[0].Vendor_Id + '',
        //       "itemName": '' + this.GRNCRNRowData[0].VendorName + ''
        //     }];
        //     this.model.SupplierAddress = this.GRNCRNRowData[0].VendorAddress;
        //   } else {
        //     this.model.VendorSupplierName = this.GRNCRNRowData[0].CompanyName;
        //     //this.model.SupplierAddress = this.GRNCRNRowData[0].Destination;
        //     this.selectedEditVendorItems = [];
        //   }
        // }


        this.selectedEditVendorItems = [];
        if (this.model.GRNById == "3") {
          this.model.VendorSupplierName = this.GRNCRNRowData[0].CompanyName;
          this.model.Address = this.GRNCRNRowData[0].WHLocation;
          this.model.SupplierAddress = this.GRNCRNRowData[0].WHLocation;
        } else {
          if (data.Data[0].Vendor_Id == null || data.Data[0].Vendor_Id == 0) {
            this.selectedEditVendorItems = [];
            this.model.Address = "";
            this.model.SupplierAddress = "";
          } else {
            this.selectedEditVendorItems = [{
              "id": '' + data.Data[0].Vendor_Id + '',
              "itemName": '' + data.Data[0].VendorName + ''
            }];
            this.model.SupplierName = this.selectedEditVendorItems[0].itemName;
            this.model.Address = data.Data[0].VendorAddress;
            this.model.SupplierAddress = data.Data[0].VendorAddress;
          }
        }




        if (data.WHData != null && data.WHData != "" && data.WHData.length > 0) {
          this.model.EditStateId = '' + this.GRNCRNRowData[0].WHState_Id + ''
          this.GRNCRNWHList = data.WHData;
          this.model.SelectedGRNCRNWH = '' + this.GRNCRNRowData[0].WH_Id + ''
          this.model.WHAddress = this.GRNCRNRowData[0].WHAddress;
        } else {
          this.model.EditStateId = "0";
          this.GRNCRNWHList = [];
          this.model.SelectedGRNCRNWH = "0";
          this.model.WHAddress = "";
        }

        if (this.model.GRNById == 1 || this.model.GRNById == 2) {
          this.ValidationHideShow = true;
        } else {
          this.ValidationHideShow = false;
        }

        this.model.ActivityTypeId = this.GRNCRNRowData[0].Flag;
        if (this.GRNCRNRowData[0].GRNDate != null) {
          var GrnDate = this.GRNCRNRowData[0].GRNDate.split('/');
          this.model.GRNdate = { year: parseInt(GrnDate[2]), month: parseInt(GrnDate[1]), day: parseInt(GrnDate[0]) };
        }
        this.model.GRNCRNNo = this.GRNCRNRowData[0].GRNNo;
        this.InvoiceListData = data.InvoiceNoData;
        this.model.ChallanNo = this.GRNCRNRowData[0].InvChallanNo;
        this.model.HideChallanNo = this.GRNCRNRowData[0].InvChallanNo;
        var InvChallanNoDate = this.GRNCRNRowData[0].InvChallanDate.split('/');
        this.model.ChallanDate = { year: parseInt(InvChallanNoDate[2]), month: parseInt(InvChallanNoDate[1]), day: parseInt(InvChallanNoDate[0]) };
        this.model.InvoiceAmount = this.GRNCRNRowData[0].InvoiceAmount;
        this.model.EwayBillNo = this.GRNCRNRowData[0].EwayBillNo;
        if (this.GRNCRNRowData[0].ChallanPdffile != "" && this.GRNCRNRowData[0].ChallanPdffile != null) {
          this.IsReceivingFile = true;
          this.ViewChallanPdffile = this.GRNCRNRowData[0].ChallanPdffile;
        } else {
          this.IsReceivingFile = false;
        }
        if (this.GRNCRNRowData[0].GatePdffile != "" && this.GRNCRNRowData[0].GatePdffile != null) {
          this.IsGatefile = true;
          this.ViewGatePdffile = this.GRNCRNRowData[0].GatePdffile;
        } else {
          this.IsGatefile = false;
        }
        if (this.GRNCRNRowData[0].CLRPdfile != "" && this.GRNCRNRowData[0].CLRPdfile != null) {
          this.IsLRFile = true;
          this.ViewCLRPdfile = this.GRNCRNRowData[0].CLRPdfile;
        } else {
          this.IsLRFile = false;
        }
        if (this.GRNCRNRowData[0].EwayBillDate != null) {
          var ewaybillDate = this.GRNCRNRowData[0].EwayBillDate.split('/');
          this.model.EwayBillDate = { year: parseInt(ewaybillDate[2]), month: parseInt(ewaybillDate[1]), day: parseInt(ewaybillDate[0]) };
        }
        if (this.GRNCRNRowData[0].EwayBillfile != "" && this.GRNCRNRowData[0].EwayBillfile != null) {
          this.IsEwayBillfile = true;
          this.model.EwayBillfile = this.GRNCRNRowData[0].EwayBillfile;
        } else {
          this.IsEwayBillfile = false;
        }
        if (this.GRNCRNRowData[0].DispatchDate != null) {
          var dispatchDate = this.GRNCRNRowData[0].DispatchDate.split('/');
          this.model.DispatchDate = { year: parseInt(dispatchDate[2]), month: parseInt(dispatchDate[1]), day: parseInt(dispatchDate[0]) };
        }
        this.model.GateEntryNo = this.GRNCRNRowData[0].GateEntryNo;
        if (this.GRNCRNRowData[0].GateEntryDate != null) {
          var GateEntryDate = this.GRNCRNRowData[0].GateEntryDate.split('/');
          this.model.GateEntryDate = { year: parseInt(GateEntryDate[2]), month: parseInt(GateEntryDate[1]), day: parseInt(GateEntryDate[0]) };
        }
        this.model.ddlDespatchby = '' + this.GRNCRNRowData[0].IsDespatch + '';
        this.ChangeDespatchby(this.model.ddlDespatchby);
        if (this.model.ddlDespatchby == 1) {
          this.model.TransporterName = data.Data[0].TranspoterName;;
          this.model.TransporterGSTNo = data.Data[0].TransporterGSTNO;
        } else if (this.model.ddlDespatchby == 2) {
          this.model.SenderName = data.Data[0].TranspoterName;;
          this.model.SenderNo = data.Data[0].TransporterGSTNO;
          this.model.SenderAddress = data.Data[0].SenderAddress;
        } else {
          this.model.CourierCompanyName = data.Data[0].TranspoterName;;
          this.model.CourierPhoneNo = data.Data[0].TransporterGSTNO;
          this.model.DocketNo = data.Data[0].DocketNo;
        }
        this.model.VehicleNo = this.GRNCRNRowData[0].VehicleNo;
        this.model.IndentorName = this.GRNCRNRowData[0].IndenterName;
        this.model.LRNo = this.GRNCRNRowData[0].LRNo;
        if (this.GRNCRNRowData[0].LRDate != null) {
          var LrDate = this.GRNCRNRowData[0].LRDate.split('/');
          this.model.LRdate = { year: parseInt(LrDate[2]), month: parseInt(LrDate[1]), day: parseInt(LrDate[0]) };
        }
        this.model.Remarks = this.GRNCRNRowData[0].Remarks;
        this.CorrectionItemCodeList = JSON.parse(this.GRNCRNRowData[0].CorrectionItemCodeList);
        this.BindGrnCrnItemListArray(data.ItemData);
      });
    } catch (Error) {
      var objWebErrorLogModel = new WebErrorLogModel();
      objWebErrorLogModel.ErrorBy = this.UserId;
      objWebErrorLogModel.ErrorMsg = Error.message;
      objWebErrorLogModel.ErrorFunction = "onEditBtnClick";
      objWebErrorLogModel.ErrorPage = "GRN";
      this._GlobalErrorHandlerService.handleError(objWebErrorLogModel);
    }

  }

  editFromReport(id) {
    try {
      //this.IsApprovalstatusbtnhideShow = true;
      this.EditFlag = "report";
      // if (id != null) {
      //   this.IsPageActive = true;
      //   this.isShownPOEdit = false;
      //   this.isShownPOList = false;
      //   localStorage.removeItem("Id");
      //   localStorage.setItem("Id", id);
      //   this.GrnId = id;
      //   //return false;
      // } else {
      //   this.GrnId =id;// e.rowData.Id;
      // }
      this.GrnId = id;// e.rowData.Id;
      this.isEdit = true;
      this.Loader.show();
      this.isShownPOList = false;
      this.isShownPOEdit = true;
      this.isShownGrnCompany = true;
      this.isdisabledGrnDate = true;

      this.POBasedisabled = false;
      this.IsRateDesabled = true;
      this.ChallanNodisabled = true;
      this.IsAutoCompleteDesabled = true;
      this.IsChallanDateDesabled = true;
      this.IsDownloadPrintHideShow = true;
      this.model.ddlChallanNo = "";

      this.GRNCRNRowData = [];
      var objPoSearchModel = new PoSearchModel();
      objPoSearchModel.PoId = this.GrnId;
      objPoSearchModel.Flag = "GRNListByGrnId";
      this._PurchaseOrderService.GetPoListandOtherDetailByPoId(objPoSearchModel).subscribe((data) => {
        this.Loader.hide();
        this.GRNCRNRowData = data.Data;
        //debugger
        // if(this.GRNCRNRowData[0].IsDespatch == 1)
        // {
        //   this.IsPageActive=true; 
        //   this.isShownPOEdit=false;
        //   this.GrnId=this.GrnId;
        //   return false;
        // }
        this.model.InCaseReason = "0";

        if (this.GRNCRNRowData[0].GRNDocumentFile != null && this.GRNCRNRowData[0].GRNDocumentFile != "") {
          this.model.GRNDocumentFile = this.GRNCRNRowData[0].GRNDocumentFile;
          this.IsDownloadButtonDisable = false;
        } else {
          this.IsDownloadButtonDisable = true;;
        }
        if (this.GRNCRNRowData[0].JobId != null) {
          this.model.JobId = this.GRNCRNRowData[0].JobId;
        }
        if (this.GRNCRNRowData[0].GRNById == null) {
          this.model.GRNById = 1;
        } else {
          this.model.GRNById = this.GRNCRNRowData[0].GRNById;
        }

        // if (this.GRNCRNRowData[0].GRNById == 0 || this.GRNCRNRowData[0].GRNById == 1
        //   || this.GRNCRNRowData[0].GRNById == null) {
        //   this.modelpdf = this.GRNCRNRowData[0].POPdfile;
        //   this.model.POData = this.GRNCRNRowData[0].PONo;
        // } else {
        //   this.model.Dispatchfile = this.GRNCRNRowData[0].JobFile;
        //   this.model.DocumentNoData = this.GRNCRNRowData[0].DocumentNo;
        // }

        if (this.GRNCRNRowData[0].GRNById == 0 || this.GRNCRNRowData[0].GRNById == 1) {
          this.modelpdf = this.GRNCRNRowData[0].POPdfile;
          this.model.POData = this.GRNCRNRowData[0].PONo;
        } else {
          this.model.Dispatchfile = this.GRNCRNRowData[0].JobFile;
          this.model.DocumentNoData = this.GRNCRNRowData[0].DocumentNo;
        }


        if (this.GRNCRNRowData[0].GRNSignedDocumentFile != "" && this.GRNCRNRowData[0].GRNSignedDocumentFile != null) {
          this.IsGrnSignedfile = true;
          this.model.GRNSignedfile = this.GRNCRNRowData[0].GRNSignedDocumentFile;
        } else {
          this.IsGrnSignedfile = false;
        }
        if (this.GRNCRNRowData[0].EwayBillfile != "" && this.GRNCRNRowData[0].EwayBillfile != null) {
          this.IsEwayBillfile = true;
          this.model.EwayBillfile = this.GRNCRNRowData[0].EwayBillfile;
        } else {
          this.IsEwayBillfile = false;
        }

        if (this.GRNCRNRowData[0].Transporter_Id == 1) {
          this.IsTransporter = true;
          this.IsTransporterReadonly = false;
          this.model.TransporterId = 1;
          this.model.TransporterName = data.Data[0].TranspoterName;;
          this.model.TransporterGSTNo = data.Data[0].TransporterGSTNO;
        } else if (this.GRNCRNRowData[0].Transporter_Id == 0) {
          this.IsTransporter = true;
          this.IsTransporterReadonly = false;
          this.model.TransporterId = '';
          this.model.TransporterName = data.Data[0].TranspoterName;;
          this.model.TransporterGSTNo = data.Data[0].TransporterGSTNO;
        }
        else {
          this.IsTransporter = false;
          this.IsTransporterReadonly = true;
          this.model.TransporterId = data.Data[0].Transporter_Id;
          this.model.TransporterName = data.Data[0].TranspoterName;;
          this.model.TransporterGSTNo = data.Data[0].TransporterGSTNO;
        }
        this.EditChangeGRNBy(this.GRNCRNRowData[0].GRNById);
        this.InvChallanEditFile = 0;
        this.InvChallanFile = this.GRNCRNRowData[0].ChallanPdffile;
        this.GateEditFile = 0;
        this.GatePdfFile = this.GRNCRNRowData[0].GatePdffile;
        this.LREditFile = 0;
        this.LRFile = this.GRNCRNRowData[0].CLRPdfile;
        this.PoeditId = this.GRNCRNRowData[0].PoId;
        if (this._Commonservices.checkUndefined(this.PoeditId) != "") {
          this.IsUnitDisabled = true;
        }
        this.model.POData = this.GRNCRNRowData[0].PONo;
        this.TableId = this.GRNCRNRowData[0].Id;
        this.ManueId = this.PageMenuId;
        this.CreateName = data.Data[0].CreateName;
        this.CreatedDate = data.Data[0].CreatedDate;
        this.ModifiedName = data.Data[0].ModifiedName;
        this.ModifiedDate = data.Data[0].ModifiedDate;
        this.model.DateDiffHour = data.Data[0].DateDiffHour;
        if (this.model.DateDiffHour > CommonStaticClass.DifferenceDay) {
          if (this.UserRoleId == UserRole.UserRoleId) {
            this.IsHideShowCancelBtn = true;
            this.IsSaveButtonDisable = true;
            this.IsCancelButtonDisable = false;
          } else {
            this.IsHideShowCancelBtn = false;
            this.IsSaveButtonDisable = true;
          }
        } else {
          this.IsHideShowCancelBtn = true;
          this.ItemAddrowhideshow = false;
          this.IsSaveButtonDisable = false;
        }
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

        if (this.GRNCRNRowData[0].PoDate != null) {
          var PODate = this.GRNCRNRowData[0].PoDate.split('/');
          this.model.Podate = { year: parseInt(PODate[2]), month: parseInt(PODate[1]), day: parseInt(PODate[0]) };
        }
        this.model.Address = this.GRNCRNRowData[0].VendorAddress;
        this.selectedEditVendorItems = [];
        if (this.GRNCRNRowData[0].Vendor_Id == null || this.GRNCRNRowData[0].Vendor_Id == 0) {
          this.selectedEditVendorItems = [];
        } else {
          this.selectedEditVendorItems = [
            { "id": '' + this.GRNCRNRowData[0].Vendor_Id + '', "itemName": '' + this.GRNCRNRowData[0].VendorName + '' }];
        }
        this.model.SupplierAddress = this.GRNCRNRowData[0].VendorAddress;
        this.model.EditStateId = '' + this.GRNCRNRowData[0].WHState_Id + ''
        if (data.WHData.length > 0) {
          this.GRNCRNWHList = data.WHData;
        }
        this.model.SelectedGRNCRNWH = '' + this.GRNCRNRowData[0].WH_Id + ''
        this.model.WHAddress = this.GRNCRNRowData[0].WHAddress;
        this.model.ActivityTypeId = this.GRNCRNRowData[0].Flag;
        //this.model.Address = this.GRNCRNRowData[0].VendorAddress;
        if (this.GRNCRNRowData[0].GRNDate != null) {
          var GrnDate = this.GRNCRNRowData[0].GRNDate.split('/');
          this.model.GRNdate = { year: parseInt(GrnDate[2]), month: parseInt(GrnDate[1]), day: parseInt(GrnDate[0]) };
        }
        this.model.GRNCRNNo = this.GRNCRNRowData[0].GRNNo;
        this.InvoiceListData = data.InvoiceNoData;
        this.model.ChallanNo = this.GRNCRNRowData[0].InvChallanNo;
        this.model.HideChallanNo = this.GRNCRNRowData[0].InvChallanNo;
        var InvChallanNoDate = this.GRNCRNRowData[0].InvChallanDate.split('/');
        this.model.ChallanDate = { year: parseInt(InvChallanNoDate[2]), month: parseInt(InvChallanNoDate[1]), day: parseInt(InvChallanNoDate[0]) };
        this.model.InvoiceAmount = this.GRNCRNRowData[0].InvoiceAmount;
        this.model.EwayBillNo = this.GRNCRNRowData[0].EwayBillNo;
        if (this.GRNCRNRowData[0].ChallanPdffile != "" && this.GRNCRNRowData[0].ChallanPdffile != null) {
          this.IsReceivingFile = true;
          this.ViewChallanPdffile = this.GRNCRNRowData[0].ChallanPdffile;
        } else {
          this.IsReceivingFile = false;
        }
        if (this.GRNCRNRowData[0].GatePdffile != "" && this.GRNCRNRowData[0].GatePdffile != null) {
          this.IsGatefile = true;
          this.ViewGatePdffile = this.GRNCRNRowData[0].GatePdffile;
        } else {
          this.IsGatefile = false;
        }
        if (this.GRNCRNRowData[0].CLRPdfile != "" && this.GRNCRNRowData[0].CLRPdfile != null) {
          this.IsLRFile = true;
          this.ViewCLRPdfile = this.GRNCRNRowData[0].CLRPdfile;
        } else {
          this.IsLRFile = false;
        }
        if (this.GRNCRNRowData[0].EwayBillDate != null) {
          var ewaybillDate = this.GRNCRNRowData[0].EwayBillDate.split('/');
          this.model.EwayBillDate = { year: parseInt(ewaybillDate[2]), month: parseInt(ewaybillDate[1]), day: parseInt(ewaybillDate[0]) };
        }

        if (this.GRNCRNRowData[0].DispatchDate != null) {
          var dispatchDate = this.GRNCRNRowData[0].DispatchDate.split('/');
          this.model.DispatchDate = { year: parseInt(dispatchDate[2]), month: parseInt(dispatchDate[1]), day: parseInt(dispatchDate[0]) };
        }

        this.model.GateEntryNo = this.GRNCRNRowData[0].GateEntryNo;
        if (this.GRNCRNRowData[0].GateEntryDate != null) {
          var GateEntryDate = this.GRNCRNRowData[0].GateEntryDate.split('/');
          this.model.GateEntryDate = { year: parseInt(GateEntryDate[2]), month: parseInt(GateEntryDate[1]), day: parseInt(GateEntryDate[0]) };
        }
        this.model.ddlDespatchby = '' + this.GRNCRNRowData[0].IsDespatch + ''
        this.model.Transporter = this.GRNCRNRowData[0].TranspoterName;
        this.model.VehicleNo = this.GRNCRNRowData[0].VehicleNo;
        this.model.IndentorName = this.GRNCRNRowData[0].IndenterName;
        this.model.LRNo = this.GRNCRNRowData[0].LRNo;
        if (this.GRNCRNRowData[0].LRDate != null) {
          var LrDate = this.GRNCRNRowData[0].LRDate.split('/');
          this.model.LRdate = { year: parseInt(LrDate[2]), month: parseInt(LrDate[1]), day: parseInt(LrDate[0]) };
        }
        this.model.Remarks = this.GRNCRNRowData[0].Remarks;
        this.BindGrnCrnItemListArray(data.ItemData);
      });
    } catch (Error) {
      var objWebErrorLogModel = new WebErrorLogModel();
      objWebErrorLogModel.ErrorBy = this.UserId;
      objWebErrorLogModel.ErrorMsg = Error.message;
      objWebErrorLogModel.ErrorFunction = "onEditBtnClick";
      objWebErrorLogModel.ErrorPage = "GRN";
      this._GlobalErrorHandlerService.handleError(objWebErrorLogModel);
    }
  }

  BindGrnCrnItemListArray(GRNCRNRowData: any) {
    try {
      this.dynamicArray = [];
      for (var i = 0, len = GRNCRNRowData.length; i < len; i++) {
        var objdynamic = new GRNDynamicItemGrid();
        objdynamic.IsCorrection = false;
        objdynamic.Id = GRNCRNRowData[i].Id;
        objdynamic.ItemNameId = GRNCRNRowData[i].ItemNameId;
        objdynamic.PoItemListId = GRNCRNRowData[i].PoItemListId;
        objdynamic.ItemDescription = GRNCRNRowData[i].ItemDescription;
        objdynamic.SubDescription = GRNCRNRowData[i].SubDescription;
        // objdynamic.UnitName = GRNCRNRowData[i].UnitName;
        objdynamic.Rate = parseFloat(GRNCRNRowData[i].ItemRate).toFixed(2);
        objdynamic.POQty = GRNCRNRowData[i].POQty;
        objdynamic.ChallanQty = GRNCRNRowData[i].ChallanQty;
        objdynamic.AcceptedQty = GRNCRNRowData[i].AcceptedQty;
        objdynamic.ReceivedQty = GRNCRNRowData[i].ReceivedQty;
        objdynamic.RejectedQty = GRNCRNRowData[i].RejectedQty;
        objdynamic.ExcessShort = GRNCRNRowData[i].ExcessShort;
        objdynamic.TotalAmount = GRNCRNRowData[i].TotalAmount;
        if (GRNCRNRowData[i].TaxWith == 0 || GRNCRNRowData[i].TaxWith == 1) {
          objdynamic.TaxWith = "1";
        } else {
          objdynamic.TaxWith = "2";
        }
        objdynamic.CGSTRate = GRNCRNRowData[i].CGSTRate;
        objdynamic.CGST = GRNCRNRowData[i].CGST;
        objdynamic.SGSTRate = GRNCRNRowData[i].SGSTRate;
        objdynamic.SGST = GRNCRNRowData[i].SGST;
        objdynamic.TCSRate = GRNCRNRowData[i].TCSRate;
        objdynamic.TCS = GRNCRNRowData[i].TCS;
        objdynamic.IGSTRate = GRNCRNRowData[i].IGSTRate;
        objdynamic.IGST = GRNCRNRowData[i].IGST;
        objdynamic.TotalInvoiceValue = GRNCRNRowData[i].TotalInvoiceValue;
        objdynamic.FreightCharge = GRNCRNRowData[i].FreightCharge;
        objdynamic.TotalAmountWithFreightCharge = GRNCRNRowData[i].TotalAmountWithFreightCharge;

        objdynamic.ItemId = GRNCRNRowData[i].ItemId;
        objdynamic.ItemMakeId = GRNCRNRowData[i].MakeMaster_Id;
        objdynamic.EditItemCode = JSON.parse(GRNCRNRowData[i].ItemCodeList)
        objdynamic.EditItemMake = JSON.parse(GRNCRNRowData[i].ItemMakeList);
        if (GRNCRNRowData[i].SerialNoList === null) {
          objdynamic.GSerialNumbers = [];
        } else {
          objdynamic.GSerialNumbers = JSON.parse(GRNCRNRowData[i].SerialNoList);
        }
        if (GRNCRNRowData[i].IsCorrectionEntryReason != 0) {
          objdynamic.IsCorrectionEntryReason = GRNCRNRowData[i].IsCorrectionEntryReason;
        } else {
          objdynamic.IsCorrectionEntryReason = "0";
        }
        objdynamic.CorrectionEntryRemarks = GRNCRNRowData[i].CorrectionEntryRemarks;
        objdynamic.UnitList = JSON.parse(GRNCRNRowData[i].UnitList);
        if (GRNCRNRowData[i].UnitMaster_Id != null && GRNCRNRowData[i].UnitMaster_Id != "") {
          objdynamic.UnitName = GRNCRNRowData[i].UnitMaster_Id;
        } else {
          objdynamic.UnitName = "0";
        }
        if (GRNCRNRowData[i].EqTypeId != null && GRNCRNRowData[i].EqTypeId != "") {
          objdynamic.EqTypeId = GRNCRNRowData[i].EqTypeId;
        } else {
          objdynamic.EqTypeId = "0";
        }
        objdynamic.ValueSiteName = GRNCRNRowData[i].SiteName;
        objdynamic.ValueCustomerSite = GRNCRNRowData[i].CustomerSiteId;
        if (GRNCRNRowData[i].IsConversion == 1) {
          objdynamic.HideShowConValue = true;
          objdynamic.ConversionValue = GRNCRNRowData[i].SetQty;
          objdynamic.HideConversionValue = GRNCRNRowData[i].ConversionValue;
          objdynamic.ConversionUnit = GRNCRNRowData[i].ConversionUnit;
        } else {
          objdynamic.HideShowConValue = false;
        }
        objdynamic.SiteId = GRNCRNRowData[i].SiteId;
        objdynamic.SiteName = GRNCRNRowData[i].SiteName;
        objdynamic.CustomerSiteId = GRNCRNRowData[i].CustomerSiteId;
        objdynamic.ReasonCode = GRNCRNRowData[i].ReasonCode;
        objdynamic.CustomerId = GRNCRNRowData[i].CustomerId;
        objdynamic.CustomerCode = GRNCRNRowData[i].CustomerCode;

        this.dynamicArray.push(objdynamic);
        //objdynamic.TotalAmount=parseFloat(ItemEditDataArr[i].TotalAmount).toFixed(2);
        this.fnBindItemGrossToatl();
      }
    } catch (Error) {
      var objWebErrorLogModel = new WebErrorLogModel();
      objWebErrorLogModel.ErrorBy = this.UserId;
      objWebErrorLogModel.ErrorMsg = Error.message;
      objWebErrorLogModel.ErrorFunction = "BindGrnCrnItemListArray";
      objWebErrorLogModel.ErrorPage = "GRN";
      this._GlobalErrorHandlerService.handleError(objWebErrorLogModel);
    }
  }

  GatePdfViewfileClick() {
    window.open(this.ViewGatePdffile);
  }

  ReceivingViewfileClick() {
    window.open(this.ViewChallanPdffile);
  }

  LRPdfViewfileClick() {
    window.open(this.ViewCLRPdfile);
  }
  GrnSignedfileClick() {
    window.open(this.model.GRNSignedfile);
  }
  EwayBillfileClick() {
    window.open(this.model.EwayBillfile);
  }
  GRNCRNDetailBack() {
    this.ClearGrnCrnDetail();
    this.isShownPOList = true;
    this.isShownPOEdit = false;
    this.model.POData = "";
    this.AutoCompleteGRNCRNPoList = [];
    this.totalSumAmount = 0;
  }

  //#endregion

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
    var CorrectionAcceptqty = this.CorrectionItemCodeList.filter(m => m.GrnListId === parseInt(id));
    this.dynamicArray[index].ChallanQty = CorrectionAcceptqty[0].AcceptedQty;
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
      var objSaveGRNCRNModelDetail = new SaveGRNCRNModelDetail();
      objSaveGRNCRNModelDetail.UserId = this.UserId;
      objSaveGRNCRNModelDetail.GrnCrnId = this.GrnId;
      if (this.model.POData != null) {
        if (checkUndefined(this.model.PoId) != '') {
          objSaveGRNCRNModelDetail.PoId = this.model.PoId;
        } else {
          objSaveGRNCRNModelDetail.PoId = this.PoeditId;
        }
      }
      objSaveGRNCRNModelDetail.CompanyId = this.CompanyId;
      objSaveGRNCRNModelDetail.JobId = this.model.JobId;
      this.GrndynamicItemArray = [];
      for (var i = 0, len = this.dynamicArray.length; i < len; i++) {
        if (this.dynamicArray[i] == this.dynamicArray[this.model.arrayId]) {
          var objGRNDynamicItemGrid = new GRNDynamicItemModel();
          objGRNDynamicItemGrid.RowId = i;
          objGRNDynamicItemGrid.Id = this.dynamicArray[i].IsCorrectionCodeId;
          objGRNDynamicItemGrid.PoItemListId = this.dynamicArray[i].PoItemListId;
          objGRNDynamicItemGrid.ItemId = this.dynamicArray[i].ItemId;
          objGRNDynamicItemGrid.ChallanQty = this.dynamicArray[i].ChallanQty;
          objGRNDynamicItemGrid.ReceivedQty = this.dynamicArray[i].ReceivedQty;
          objGRNDynamicItemGrid.AcceptedQty = this.dynamicArray[i].AcceptedQty;
          objGRNDynamicItemGrid.Rate = this.dynamicArray[i].Rate;
          objGRNDynamicItemGrid.EqTypeId = this.dynamicArray[i].EqTypeId;
          objGRNDynamicItemGrid.CorrectionEntryRemarks = this.dynamicArray[i].CorrectionEntryRemarks;
          objGRNDynamicItemGrid.IsCorrectionEntryReason = this.dynamicArray[i].IsCorrectionEntryReason;
          objGRNDynamicItemGrid.IsCorrectionCodeId = this.dynamicArray[i].IsCorrectionCodeId;
          objGRNDynamicItemGrid.CGSTRate = this.dynamicArray[i].CGSTRate;
          objGRNDynamicItemGrid.CGST = this.dynamicArray[i].CGST;
          objGRNDynamicItemGrid.SGSTRate = this.dynamicArray[i].SGSTRate;
          objGRNDynamicItemGrid.SGST = this.dynamicArray[i].SGST;
          objGRNDynamicItemGrid.TCSRate = this.dynamicArray[i].TCSRate;
          objGRNDynamicItemGrid.TCS = this.dynamicArray[i].TCS;
          objGRNDynamicItemGrid.IGSTRate = this.dynamicArray[i].IGSTRate;
          objGRNDynamicItemGrid.IGST = this.dynamicArray[i].IGST;
          objGRNDynamicItemGrid.TotalInvoiceValue = this.dynamicArray[i].TotalInvoiceValue;
          if (this.dynamicArray[i].FreightCharge != "" || this.dynamicArray[i].FreightCharge != null) {
            objGRNDynamicItemGrid.FreightCharge = this.dynamicArray[i].FreightCharge;
          } else {
            objGRNDynamicItemGrid.FreightCharge = 0.00;
          }
          objGRNDynamicItemGrid.TotalAmountWithFreightCharge = this.dynamicArray[i].TotalAmountWithFreightCharge;
          this.srnlst = [];
          if (this.dynamicArray[i].GSerialNumbers.length > 0) {
            if (this.dynamicArray[i].ItemNameId == "4" && this.dynamicArray[i].UnitName == "8") {
              for (var j = 0; j < this.dynamicArray[i].GSerialNumbers.length; j++) {
                for (var k = 0; k < this.dynamicArray[i].GSerialNumbers[j].CellNos.length; k++) {
                  var srnData = new GSerialNumber();
                  srnData.InitialSrno = this.dynamicArray[i].GSerialNumbers[j].CellNos[k].CellValue;
                  srnData.Sequance = j.toString();
                  this.srnlst.push(srnData)
                }
              }
              objGRNDynamicItemGrid.GSerialNumbers = this.srnlst;
            } else {
              objGRNDynamicItemGrid.GSerialNumbers = this.dynamicArray[i].GSerialNumbers;
            }
          }
          var cov = this._Commonservices.checkUndefined(this.dynamicArray[i].ConversionValue);
          if (cov != "") {
            objGRNDynamicItemGrid.ConversionValue = this.dynamicArray[i].ConversionValue;
          } else {
            objGRNDynamicItemGrid.ConversionValue = 0;
          }
          if (this.model.GRNById != 2 && this.model.GRNById != 4) {
            if (this.dynamicArray[i].ExcessShort == "" || this.dynamicArray[i].ExcessShort == null) {
              objGRNDynamicItemGrid.ExcessShort = "0";
            } else {
              objGRNDynamicItemGrid.ExcessShort = this.dynamicArray[i].ExcessShort;
            }
            if (this.dynamicArray[i].RejectedQty == "" || this.dynamicArray[i].RejectedQty == null) {
              objGRNDynamicItemGrid.RejectedQty = "0";
            } else {
              objGRNDynamicItemGrid.RejectedQty = this.dynamicArray[i].RejectedQty;
            }
          } else {
            objGRNDynamicItemGrid.RejectedQty = "0";
            objGRNDynamicItemGrid.ExcessShort = "0";
          }
          objGRNDynamicItemGrid.SubDescription = this.dynamicArray[i].SubDescription;
          objGRNDynamicItemGrid.ReasonCode = this.dynamicArray[i].ReasonCode;
          objGRNDynamicItemGrid.UnitId = this.dynamicArray[i].UnitName;
          objGRNDynamicItemGrid.TaxWith = this.dynamicArray[i].TaxWith;
          var SiteData = this.dynamicArray[i].SiteId;
          if (SiteData == 0) {
            objGRNDynamicItemGrid.SiteId = this.dynamicArray[i].SiteId;
            objGRNDynamicItemGrid.SiteName = this.dynamicArray[i].SiteName;
            objGRNDynamicItemGrid.CustomerSiteId = this.dynamicArray[i].CustomerSiteId;
            objGRNDynamicItemGrid.CustomerCode = this.dynamicArray[i].CustomerCode;
            objGRNDynamicItemGrid.CustomerId = this.dynamicArray[i].CustomerId;
          }
          else if (SiteData != 0 && this.dynamicArray[i].CustomerSiteId != null && this.dynamicArray[i].CustomerSiteId != "") {
            objGRNDynamicItemGrid.SiteId = this.dynamicArray[i].SiteId;
            objGRNDynamicItemGrid.SiteName = this.dynamicArray[i].SiteName;
            objGRNDynamicItemGrid.CustomerSiteId = this.dynamicArray[i].CustomerSiteId;
            objGRNDynamicItemGrid.CustomerCode = this.dynamicArray[i].CustomerCode;
            objGRNDynamicItemGrid.CustomerId = this.dynamicArray[i].CustomerId;
          }
          this.GrndynamicItemArray.push(objGRNDynamicItemGrid)
        }
      }
      objSaveGRNCRNModelDetail.GRNItemDetailList = this.GrndynamicItemArray;
      var formdata = new FormData();
      var CurrentDate = this.datePipe.transform(Date(), "dd/MM/yyyy");
      for (var i = 0; i < this.FaultyFileArray.length; i++) {
        for (var j = 0; j < this.FaultyFileArray[i].FaultyFile.length; j++) {
          formdata.append("FaultyfileUpload", this.FaultyFileArray[i].FaultyFile[j], 'FaultyImage_' + this.dynamicArray[i].ItemId + '_' + this.FaultyFileArray[i].RowId + CurrentDate);
        }
      }
      formdata.append('jsonDetail', JSON.stringify(objSaveGRNCRNModelDetail));
      this._GrncrnService.UpdateCorrectionEntryGRNDetail(formdata).subscribe(data => {
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


  BindVendorOrWhAddess(para: string, val: string): void {
    try {
      //$('#TxtVendorEdit .selected-list .c-btn').attr('style', 'border-color: ');
      $("#txtWH").css('border-color', '');
      if (val == "Dell") {
        this.selectedEditVendorItems = [];
      }
      var VendorId = '0'
      if (this.selectedEditVendorItems.length > 0) {
        VendorId = this.selectedEditVendorItems[0].id;
      }
      var objVendormodel = new VendorOrWhModel();
      objVendormodel.flag = para;
      if (para == "vendor") {
        objVendormodel.Id = VendorId;
      } else if (para == "WHMaster") {
        objVendormodel.Id = val;
        var EditWHName = this.GRNCRNWHList.filter(m => m.id === parseInt(val));
        this.model.WHName = EditWHName[0].itemName;
      }
      this._Commonservices.getVendorOrWh(objVendormodel).subscribe(data => {
        if (data.Status == 1) {
          if (para == "vendor") {
            this.model.VendorAddress = data.Data[0].VendorAddress;
          } else if (para == "WHMaster") {
            this.model.WHAddress = data.Data[0].WHAddress;
          }
        } else {
          if (para == "vendor") {
            this.model.VendorAddress = "";
          } else if (para == "WHMaster") {
            this.model.WHAddress = "";
          }
        }
      });
    } catch (Error) {
      var objWebErrorLogModel = new WebErrorLogModel();
      objWebErrorLogModel.ErrorBy = this.UserId;
      objWebErrorLogModel.ErrorMsg = Error.message;
      objWebErrorLogModel.ErrorFunction = "BindVendorOrWhAddess";
      objWebErrorLogModel.ErrorPage = "GRN";
      this._GlobalErrorHandlerService.handleError(objWebErrorLogModel);
    }
  }
  conformCancelPopup() {
    this.IsError = false;
    if (this.CancelValidation() == 1) {
      return false;
    }
    jQuery('#Cancleconfirm').modal('show');
  }

  UpadateCancelGRN() {
    try {
      var objApprovelStatusModel = new ApprovelStatusModel();
      objApprovelStatusModel.User_Id = this.UserId;
      objApprovelStatusModel.ApprovalStatus_Id = this.GrnId;
      objApprovelStatusModel.Table_Id = this.model.InCaseReason;
      objApprovelStatusModel.Flag = "GRN";
      this._MaterialMovementService.UpadateCancelDispatch(objApprovelStatusModel).subscribe(data => {
        if (data.Status == 1) {
          this.IsHideShowCancelBtn = false;
          jQuery('#Cancleconfirm').modal('hide');
          setTimeout(() => {
            alert('Your GRN SuccessFully Cancel')
          }, 300);
        }

      });
    } catch (Error) {
      this._Commonservices.ErrorFunction(this.UserName, Error.message, "UpadateCancelDispatch", "GRN");
    }
  }

  conformPopup() {
    this.loading = false;
    this.IsError = false;
    if (this.ValidationGRNCRN() == 1) {
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

  ChangeEqupmnet(Id: any, index: any) {
    var FilterData = this.EquipmentTypeList.filter(m => m.id === parseInt(Id));
    this.dynamicArray[index].EqpType = FilterData[0].itemName;
    try {
      $('#tblOne > tbody  > tr').each(function () {
        var valueItem = $(this).find('.EqType').val();
        if (valueItem != '0') {
          $(this).find('.EqType').css('border-color', '');
        }
      });
    } catch (Error) {
      console.log(Error.message)
    }
  }

  PageLoadEquipmentType() {
    var objItemEquipmentModel = new ItemEquipmentDetail();
    objItemEquipmentModel.ItemMasterId = 0;
    objItemEquipmentModel.Flag = "GRNEqupmentType";
    this.EquipmentTypeList = null;
    this._MasterService.ChangeItemGetUnitNameList(objItemEquipmentModel).subscribe(data => {
      if (data.Status == 1) {
        if (data.Data != null) {
          //brahamjot kaur 20/6/2022
          // this.EquipmentTypeList = data.Data;
          // console.log(this.EquipmentTypeList);
        }
      };
    });
  }
  //#region GRN By PO No or Dispatch NO
  // Brahamjot kaur 20/6/2022
  ChangeGRNBy(Id: any) {
    this.ValidationHideShow = true;
    this.ItemAddrowhideshow = false;
    this.SupplierNametextBox = false;
    this.EquipmentTypeHideShow = false;
    //console.log(this.ItemAddrowhideshow);
    if (Id == "1" || Id == "0") {
      this.IsGRNByPO = true;
      this.IsGRNByDispatch = false;
      this.PoQtyLabel = "POQty";
      this.DATEType = "Po Date";
      this.ChangeLabelQty = "Transit Qty";
      this.ChangeLabelSupplierAddress = "Supplier Address";
      this.IsHideQty = true;
      this.IsChallanQtyJobQty = false;
      this.model.ddlChallanNo = "";
      this.model.JobId = 0;
      this.ClearGrnCrnDetail()
    } else if (Id == "2") {
      this.IsGRNByPO = false;
      this.IsGRNByDispatch = true;
      this.PoQtyLabel = "JObQty";
      //console.log(this.PoQtyLabel);
      this.ChangeLabelSupplierAddress = "Supplier Address";
      this.DATEType = "Job Date";
      this.ChangeLabelQty = "Challan Qty";
      this.model.ddlChallanNo = "";
      this.IsHideQty = true;
      this.IsChallanQtyJobQty = false;
      this.ClearGrnCrnDetail();
    } else if (Id == "3") {
      this.IsGRNByPO = false;
      this.IsGRNByDispatch = true;
      this.DATEType = "Job Date";
      this.ChangeLabelQty = "Job Qty";
      this.ChangeLabelSupplierAddress = "From WH";
      this.model.ddlChallanNo = "";
      this.IsHideQty = false;
      this.ItemAddrowhideshow = true;
      //console.log(this.ItemAddrowhideshow);
      this.IsChallanQtyJobQty = true;
      this.ValidationHideShow = false;
      this.SupplierNametextBox = true;
      this.EquipmentTypeHideShow = true;
      this.ClearGrnCrnDetail();
    }
    else if (Id == "4") {
      //console.log(Id);
      this.ValidationHideShow = false;
      this.IsGRNByPO = false;
      this.IsGRNByDispatch = true;
      this.PoQtyLabel = "JObQty";
      //console.log(this.PoQtyLabel);
      this.ChangeLabelSupplierAddress = "Supplier Address";
      this.DATEType = "Job Date";
      this.ChangeLabelQty = "Challan Qty";
      this.model.ddlChallanNo = "";
      this.IsHideQty = true;
      this.IsChallanQtyJobQty = false;
      this.ClearGrnCrnDetail();
    }
    else {
      //console.log(Id);
      this.IsGRNByPO = false;
      this.IsGRNByDispatch = true;
      this.DATEType = "Job Date";
      this.ChangeLabelQty = "Job Qty";
      this.model.ddlChallanNo = "";
      this.IsHideQty = false;
      this.ItemAddrowhideshow = false;
      this.IsChallanQtyJobQty = true;
      this.ClearGrnCrnDetail();
    }
  }

  // Brahamjot kaur 20/6/2022
  EditChangeGRNBy(Id: any) {
    this.ValidationHideShow = true;
    this.SupplierNametextBox = false;
    this.EquipmentTypeHideShow = false;
    if (Id == "1" || Id == "0" || Id == null) {
      this.IsGRNByPO = true;
      this.IsGRNByDispatch = false;
      this.PoQtyLabel = "POQty";
      this.DATEType = "Po Date";
      this.ChangeLabelQty = "Transit Qty";
      this.ChangeLabelSupplierAddress = "Supplier Address";
      this.IsHideQty = true;
      this.IsChallanQtyJobQty = false;
      this.ItemAddrowhideshow = false;
    } else if (Id == "2") {
      this.IsGRNByPO = false;
      this.IsGRNByDispatch = true;
      this.PoQtyLabel = "JObQty";
      this.DATEType = "Job Date";
      this.ChangeLabelQty = "Challan Qty";
      this.ChangeLabelSupplierAddress = "Supplier Address";
      this.IsHideQty = true;
      this.ItemAddrowhideshow = false;
      this.IsChallanQtyJobQty = false;
    } else if (Id == "3") {
      this.IsGRNByPO = false;
      this.IsGRNByDispatch = true;
      this.DATEType = "Job Date";
      this.ChangeLabelQty = "Job Qty";
      this.ChangeLabelSupplierAddress = "From WH";
      this.IsHideQty = false;
      this.ItemAddrowhideshow = true;
      this.ValidationHideShow = false;
      this.IsChallanQtyJobQty = true;
      this.SupplierNametextBox = true;
      this.EquipmentTypeHideShow = true;
    }
    else if (Id == "4") {
      this.ValidationHideShow = false;
      this.IsGRNByPO = false;
      this.IsGRNByDispatch = true;
      this.PoQtyLabel = "JObQty";
      this.DATEType = "Job Date";
      this.ChangeLabelSupplierAddress = "Supplier Address";
      this.ChangeLabelQty = "Challan Qty";
      this.IsHideQty = true;
      this.ItemAddrowhideshow = false;
      this.IsChallanQtyJobQty = false;
    }
    else {
      this.IsGRNByPO = false;
      this.IsGRNByDispatch = true;
      this.DATEType = "Job Date";
      this.ChangeLabelQty = "Job Qty";
      this.IsHideQty = false;
      this.ItemAddrowhideshow = true;
      this.IsChallanQtyJobQty = true;
    }
  }

  SearchDispatchCleared() {
    this.ClearGrnCrnDetail();
  };

  onChangeDispatchSearch(val: string) {
    this.AutoCompleteDocumentNoList = [];
    var objdropdownmodel = new DropdownModel();
    objdropdownmodel.User_Id = this.UserId;
    objdropdownmodel.Parent_Id = val;
    objdropdownmodel.Company_Id = this.CompanyId;
    if (this.model.GRNById == 2) {
      objdropdownmodel.Flag = 'RepairedVendor';
    } else if (this.model.GRNById == 3) {
      objdropdownmodel.Flag = 'VendorSale';

    } else if (this.model.GRNById == 4) {
      objdropdownmodel.Flag = 'RepairedAST';
    }
    this._GrncrnService.GetAutoCompleteDocumentNo(objdropdownmodel).subscribe((data) => {
      if (data.Data != null) {
        this.AutoCompleteDocumentNoList = data.Data;
      }
    })
  }


  SearchDispatchfile() {
    window.open(this.model.Dispatchfile);
  }



  //#endregion
  //#region  GRN  Detail Save 
  SaveGRNCRNDetail() {
    debugger
    if (this.dynamicArray.length < 1) {
      alert('Please select at least one Item');
      return false;
    } else if (this.model.PoId == 0 && this.totalAmount > 5000 && this.model.JobId == 0) {
      alert("Please select PO your total amount grather than 5000");
      this.Loader.hide();
      return false;
    }
    try {      
      this.loading = true;
      this.Loader.show();
      // hemant tyagi POData
      if (this.ValidationGRNCRN() == 0) {
        var objSaveGRNCRNModelDetail = new SaveGRNCRNModelDetail();
        objSaveGRNCRNModelDetail.UserId = this.UserId;
        if (checkUndefined(this.GrnId) != '') {
          objSaveGRNCRNModelDetail.GrnCrnId = this.GrnId;
        } else {
          if (this.model.ddlChallanNo == "") {
            alert('plese select Inv/Challan No');
            this.Loader.hide();
            return false;
          } else {
            objSaveGRNCRNModelDetail.GrnCrnId = 0;
          }
        }
        if (this.model.POData != null) {
          if (checkUndefined(this.model.PoId) != '') {
            objSaveGRNCRNModelDetail.PoId = this.model.PoId;
          } else {
            objSaveGRNCRNModelDetail.PoId = this.PoeditId;
          }
        }
        var SDate = checkUndefined(this.model.Podate);
        objSaveGRNCRNModelDetail.Podate = SDate.day + '/' + SDate.month + '/' + SDate.year;
        objSaveGRNCRNModelDetail.CompanyId = this.CompanyId;
        objSaveGRNCRNModelDetail.EditFlag = this.EditFlag;
        objSaveGRNCRNModelDetail.JobId = this.model.JobId;
        objSaveGRNCRNModelDetail.GRNById = this.model.GRNById;

        objSaveGRNCRNModelDetail.GRNNo = this.model.GRNCRNNo;
        var GrnSrnDate = checkUndefined(this.model.GRNdate);
        if (GrnSrnDate != '') {
          objSaveGRNCRNModelDetail.GRNDate = GrnSrnDate.day + '/' + GrnSrnDate.month + '/' + GrnSrnDate.year;
        } else {
          objSaveGRNCRNModelDetail.GRNDate = '';
        }

        if (this.model.GRNById == 1 || this.model.GRNById == 2) {
          objSaveGRNCRNModelDetail.VendorId = this.selectedEditVendorItems[0].id;
        } else if (this.model.GRNById == 3 || this.model.GRNById == 4) {
          objSaveGRNCRNModelDetail.VendorId = null;
        } else {
          objSaveGRNCRNModelDetail.VendorId = null;
        }

        //console.log(objSaveGRNCRNModelDetail.VendorId);
        objSaveGRNCRNModelDetail.WHId = this.model.SelectedGRNCRNWH;
        objSaveGRNCRNModelDetail.InvChallanNo = this.model.ChallanNo;
        this.model.HideChallanNo = this.model.ChallanNo;
        var GrnSrnChallanDate = checkUndefined(this.model.ChallanDate);
        if (GrnSrnChallanDate != '') {
          objSaveGRNCRNModelDetail.InvChallanDate = GrnSrnChallanDate.day + '/' + GrnSrnChallanDate.month + '/' + GrnSrnChallanDate.year;
        } else {
          objSaveGRNCRNModelDetail.InvChallanDate = '';
        }
        objSaveGRNCRNModelDetail.GateEntryNo = this.model.GateEntryNo;
        var GrnSrnEntryDate = checkUndefined(this.model.GateEntryDate);
        if (GrnSrnEntryDate != '') {
          objSaveGRNCRNModelDetail.GateEntryDate = GrnSrnEntryDate.day + '/' + GrnSrnEntryDate.month + '/' + GrnSrnEntryDate.year;
        } else {
          objSaveGRNCRNModelDetail.GateEntryDate = null;
        }
        objSaveGRNCRNModelDetail.IsDespatch = this.model.ddlDespatchby;
        if (this.model.ddlDespatchby == 1) {
          objSaveGRNCRNModelDetail.TransporterGSTNO = this.model.TransporterGSTNo;
          objSaveGRNCRNModelDetail.TranspoterName = this.model.TransporterName;
        } else if (this.model.ddlDespatchby == 2) {
          objSaveGRNCRNModelDetail.TransporterGSTNO = this.model.SenderNo;
          objSaveGRNCRNModelDetail.TranspoterName = this.model.SenderName;
          objSaveGRNCRNModelDetail.SenderAddress = this.model.SenderAddress;
        } else {
          objSaveGRNCRNModelDetail.TransporterGSTNO = this.model.CourierPhoneNo;
          objSaveGRNCRNModelDetail.TranspoterName = this.model.CourierCompanyName;
          objSaveGRNCRNModelDetail.DocketNo = this.model.DocketNo;
        }
        objSaveGRNCRNModelDetail.VehicleNo = this.model.VehicleNo;
        objSaveGRNCRNModelDetail.IndentorName = this.model.IndentorName;
        objSaveGRNCRNModelDetail.LRNo = this.model.LRNo;
        var GrnSrnLrDate = checkUndefined(this.model.LRdate);
        if (GrnSrnLrDate != "") {
          objSaveGRNCRNModelDetail.LRDate = GrnSrnLrDate.day + '/' + GrnSrnLrDate.month + '/' + GrnSrnLrDate.year;
        } else {
          objSaveGRNCRNModelDetail.LRDate = null;
        }
        objSaveGRNCRNModelDetail.EwayBillNo = this.model.EwayBillNo;
        objSaveGRNCRNModelDetail.InvoiceAmount = 0.00;
        var GrnSrnEwayBillDate = checkUndefined(this.model.EwayBillDate);
        if (GrnSrnEwayBillDate != "") {
          objSaveGRNCRNModelDetail.EwayBillDate = GrnSrnEwayBillDate.day + '/' + GrnSrnEwayBillDate.month + '/' + GrnSrnEwayBillDate.year;
        } else {
          objSaveGRNCRNModelDetail.EwayBillDate = null;
        }
        var GrnSrnDispatchDate = checkUndefined(this.model.DispatchDate);
        if (GrnSrnDispatchDate != "") {
          objSaveGRNCRNModelDetail.DispatchDate = GrnSrnDispatchDate.day + '/' + GrnSrnDispatchDate.month + '/' + GrnSrnDispatchDate.year;
        } else {
          objSaveGRNCRNModelDetail.DispatchDate = null;
        }
        objSaveGRNCRNModelDetail.Remarks = this.model.Remarks;
        if (this.model.GRNById == 1) {
          objSaveGRNCRNModelDetail.Flag = "1";
        } else if (this.model.GRNById == 2) {
          objSaveGRNCRNModelDetail.Flag = "18";
        } else if (this.model.GRNById == 3) {
          objSaveGRNCRNModelDetail.Flag = "19";
        } else {
          objSaveGRNCRNModelDetail.Flag = "20";
        }
        
        this.GrndynamicItemArray = [];
        for (var i = 0, len = this.dynamicArray.length; i < len; i++) {
          var objGRNDynamicItemGrid = new GRNDynamicItemModel();
          objGRNDynamicItemGrid.RowId = i;
          objGRNDynamicItemGrid.Id = this.dynamicArray[i].Id;
          objGRNDynamicItemGrid.PoItemListId = this.dynamicArray[i].PoItemListId;
          objGRNDynamicItemGrid.ItemId = this.dynamicArray[i].ItemId;
          objGRNDynamicItemGrid.ChallanQty = this.dynamicArray[i].ChallanQty;
          objGRNDynamicItemGrid.ReceivedQty = this.dynamicArray[i].ReceivedQty;
          objGRNDynamicItemGrid.AcceptedQty = this.dynamicArray[i].AcceptedQty;
          objGRNDynamicItemGrid.Rate = this.dynamicArray[i].Rate;
          // objGRNDynamicItemGrid.EqTypeId = this.dynamicArray[i].EqTypeId;
          //Change By Umesh Tax Details
          objGRNDynamicItemGrid.CGSTRate = this.dynamicArray[i].CGSTRate;
          objGRNDynamicItemGrid.CGST = this.dynamicArray[i].CGST;
          objGRNDynamicItemGrid.SGSTRate = this.dynamicArray[i].SGSTRate;
          objGRNDynamicItemGrid.SGST = this.dynamicArray[i].SGST;
          objGRNDynamicItemGrid.TCSRate = this.dynamicArray[i].TCSRate;
          objGRNDynamicItemGrid.TCS = this.dynamicArray[i].TCS;
          objGRNDynamicItemGrid.IGSTRate = this.dynamicArray[i].IGSTRate;
          objGRNDynamicItemGrid.IGST = this.dynamicArray[i].IGST;
          objGRNDynamicItemGrid.TotalInvoiceValue = this.dynamicArray[i].TotalInvoiceValue;
          if (this.dynamicArray[i].FreightCharge != "" || this.dynamicArray[i].FreightCharge != null) {
            objGRNDynamicItemGrid.FreightCharge = this.dynamicArray[i].FreightCharge;
          } else {
            objGRNDynamicItemGrid.FreightCharge = 0.00;
          }
          objGRNDynamicItemGrid.TotalAmountWithFreightCharge = this.dynamicArray[i].TotalAmountWithFreightCharge;
          this.srnlst = [];
          if (this.dynamicArray[i].GSerialNumbers.length > 0) {
            //var _mode = this.ReceiveddynamicArray[i].GSerialNumbers[i].Mode;            
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
              objGRNDynamicItemGrid.GSerialNumbers = this.srnlst;
            } else {
              objGRNDynamicItemGrid.GSerialNumbers = this.dynamicArray[i].GSerialNumbers;
            }
          }          

          var cov = this._Commonservices.checkUndefined(this.dynamicArray[i].ConversionValue);
          if (cov != "") {
            objGRNDynamicItemGrid.ConversionValue = this.dynamicArray[i].ConversionValue;
          } else {
            objGRNDynamicItemGrid.ConversionValue = 0;
          }
          //if (this.model.GRNById != 2 && this.model.GRNById != 4) {
          // brahamjot Kaur 20/6/2022
          if (this.model.GRNById == 1 || this.model.GRNById == 2 || this.model.GRNById == 4) {
            objGRNDynamicItemGrid.EqTypeId = null;

            console.log(this.model.GRNById);
            if (this.dynamicArray[i].ExcessShort == "" || this.dynamicArray[i].ExcessShort == null) {
              console.log(this.dynamicArray[i].ExcessShort);
              objGRNDynamicItemGrid.ExcessShort = "0";
            } else {
              console.log(this.dynamicArray[i].ExcessShort);
              objGRNDynamicItemGrid.ExcessShort = this.dynamicArray[i].ExcessShort;
            }
            if (this.dynamicArray[i].RejectedQty == "" || this.dynamicArray[i].RejectedQty == null) {
              console.log(this.dynamicArray[i].RejectedQty);
              objGRNDynamicItemGrid.RejectedQty = "0";
            } else {
              console.log(this.dynamicArray[i].RejectedQty);
              objGRNDynamicItemGrid.RejectedQty = this.dynamicArray[i].RejectedQty;
            }
          } else {
            objGRNDynamicItemGrid.EqTypeId = this.dynamicArray[i].EqTypeId;
            console.log(objGRNDynamicItemGrid.ExcessShort);
            console.log(this.dynamicArray[i].RejectedQty);
            objGRNDynamicItemGrid.RejectedQty = "0";
            objGRNDynamicItemGrid.ExcessShort = "0";
          }
          objGRNDynamicItemGrid.SubDescription = this.dynamicArray[i].SubDescription;
          objGRNDynamicItemGrid.ReasonCode = this.dynamicArray[i].ReasonCode;
          objGRNDynamicItemGrid.UnitId = this.dynamicArray[i].UnitName;
          objGRNDynamicItemGrid.TaxWith = this.dynamicArray[i].TaxWith;
          var SiteData = this.dynamicArray[i].SiteId;
          if (SiteData == 0) {
            objGRNDynamicItemGrid.SiteId = this.dynamicArray[i].SiteId;
            objGRNDynamicItemGrid.SiteName = this.dynamicArray[i].SiteName;
            objGRNDynamicItemGrid.CustomerSiteId = this.dynamicArray[i].CustomerSiteId;
            objGRNDynamicItemGrid.CustomerCode = this.dynamicArray[i].CustomerCode;
            objGRNDynamicItemGrid.CustomerId = this.dynamicArray[i].CustomerId;
          }
          else if (SiteData != 0 && this.dynamicArray[i].CustomerSiteId != null && this.dynamicArray[i].CustomerSiteId != "") {
            objGRNDynamicItemGrid.SiteId = this.dynamicArray[i].SiteId;
            objGRNDynamicItemGrid.SiteName = this.dynamicArray[i].SiteName;
            objGRNDynamicItemGrid.CustomerSiteId = this.dynamicArray[i].CustomerSiteId;
            objGRNDynamicItemGrid.CustomerCode = this.dynamicArray[i].CustomerCode;
            objGRNDynamicItemGrid.CustomerId = this.dynamicArray[i].CustomerId;
          }
          this.GrndynamicItemArray.push(objGRNDynamicItemGrid)
        }
        objSaveGRNCRNModelDetail.GRNItemDetailList = this.GrndynamicItemArray;
        var CurrentDate = this.datePipe.transform(Date(), "yyyyMMddhhmmss");
        var formdata = new FormData();
        if (this.InvChallanEditFile == 1) {
          formdata.append('Challanfile', this.ChallanUploadFile, 'GRNInvoice' + this.model.ChallanNo + CurrentDate + this.ChallanUploadFile.name);
        } else if (this.InvChallanEditFile == 0) {
          formdata.append('ChallanEditfile', this.InvChallanFile);
        }
        if (this.GateEditFile == 1) {
          formdata.append('GatePdffile', this.GatePdfUploadFile, 'GRNGateEntry' + CurrentDate + this.GatePdfUploadFile.name);
        } else if (this.GateEditFile == 0) {
          formdata.append('GateEditfile', this.GatePdfFile);
        }
        if (this.LREditFile == 1) {
          formdata.append('LRPdfFile', this.LRPdfUploadFile, 'GRNLR' + CurrentDate + this.LRPdfUploadFile.name);
        } else if (this.LREditFile == 0) {
          formdata.append('LREditfile', this.LRFile);
        }
        if (this.GRNSignedDocumentfile == null) {
          formdata.append('GRNSignedDocument', this.GRNSignedDocumentfile);
        } else {
          formdata.append('GRNSignedDocument', this.GRNSignedDocumentfile, this.GRNSignedDocumentfile.name);
        }
        if (this.EwayBillfile == null) {
          formdata.append('EwayBillfile', this.EwayBillfile);
        } else {
          formdata.append('EwayBillfile', this.EwayBillfile, this.EwayBillfile.name);
        }
        for (var i = 0; i < this.FaultyFileArray.length; i++) {
          for (var j = 0; j < this.FaultyFileArray[i].FaultyFile.length; j++) {
            formdata.append("FaultyfileUpload", this.FaultyFileArray[i].FaultyFile[j], 'FaultyImage_' + this.dynamicArray[i].ItemId + '_' + this.FaultyFileArray[i].RowId + CurrentDate);
          }
        }        
        formdata.append('jsonDetail', JSON.stringify(objSaveGRNCRNModelDetail));
        this._GrncrnService.PostGRNCRNDetail(formdata).subscribe(data => {
          this.Loader.hide();
          if (data.Status == 1) {
            jQuery("#confirm").modal('hide');
            //thissuccesMessage
            this.succesMessage = "Your data has been save successfully with GRN No-" + data.Remarks + "";
            this.IsSuccess = true;
            setTimeout(() => {
              this.IsSuccess = false;
            }, 5000);
            this.ClearGrnCrnDetail();
            this.model.POData = "";
            this.model.ddlChallanNo = "";
            this.ClearAllUploadFile();
          } else {
            setTimeout(() => {
              this.IsSuccess = false;
            }, 3000);
            this.loading = false;
            jQuery("#confirm").modal('hide');
            this.succesMessage = data.Remarks;
            this.IsSuccess = true;
            // alert(data.Remarks)
          }
        });
      }

      setTimeout(() => {
        this.Loader.hide();
      }, 1000);
    } catch (Error) {
      console.log(Error.message)
    }


  }
  onChallanFileChange(event) {
    this.InvChallanEditFile = 1;
    if (event.target.files && event.target.files.length > 0) {
      this.ChallanUploadFile = event.target.files[0];
    }
  }
  onGatePdfFileChange(event) {
    this.GateEditFile = 1;
    if (event.target.files && event.target.files.length > 0) {
      this.GatePdfUploadFile = event.target.files[0];
    }
  }
  onLRPdfFileChange(event) {
    this.LREditFile = 1;
    if (event.target.files && event.target.files.length > 0) {
      this.LRPdfUploadFile = event.target.files[0];
    }
  }

  onGRNSignedDocumentfile(event) {
    if (event.target.files && event.target.files.length > 0) {
      this.GRNSignedDocumentfile = event.target.files[0];
    }
  }
  onEwayBillfile(event) {
    if (event.target.files && event.target.files.length > 0) {
      this.EwayBillfile = event.target.files[0];
    }
  }
  FaultyImageFileChange(event, rowId: string) {
    var objFaultyImageModel = new FaultyImageModel();
    objFaultyImageModel.RowId = rowId;
    objFaultyImageModel.FaultyFile = [];
    for (var i = 0, len = event.target.files.length; i < len; i++) {
      objFaultyImageModel.FaultyFile.push(event.target.files[i])
    }
    this.FaultyFileArray.push(objFaultyImageModel);
  }

  OnblurReceivedQty(index: any) {
    var trqty = 0.0;
    var recqty = 0.0;
    var accepqty = 0.0;
    var execssqty = 0.0;
    if (this.model.GRNById == 1 || this.model.GRNById == 2 || this.model.GRNById == 4) {
      for (var i = 0, len = this.dynamicArray.length; i < len; i++) {
        trqty = parseFloat(this.dynamicArray[index].ChallanQty == undefined ? 0.0 : this.dynamicArray[index].ChallanQty);
        recqty = parseFloat(this.dynamicArray[index].ReceivedQty == undefined ? 0.0 : this.dynamicArray[index].ReceivedQty);
        //this.dynamicArray[i].ExcessShort = (trqty - recqty) Change Ravinder 30/04/2021
        this.dynamicArray[index].ExcessShort = (recqty - trqty)
        // execssqty=parseFloat(this.dynamicArray[i].ExcessShort==undefined?0.0:this.dynamicArray[i].ExcessShort); 
        //  if(recqty > trqty)
        //  {
        //    alert("received qty should not be greater than transit qty ");
        //    this.dynamicArray[i].ReceivedQty="0.00";
        //    //this.fnBindItemGrossToatl();
        //  }else if(recqty <= trqty)
        //  {
        //   this.dynamicArray[i].ExcessShort=(trqty-recqty)
        //  }

      }
    }
  }

  AcceptedQtyOnblur(index: any) {
    $('#tblOne > tbody  > tr').each(function () {
      var valueAcceptedQty = $(this).find('.AcceptedQty').val();
      if (valueAcceptedQty != '0') {
        $(this).find('.AcceptedQty').css('border-color', '');
      }
    });
    var trqty = 0.0;
    var acqty = 0.0;
    var faqty = 0.0;
    var recqty = 0.0;
    var execssqty = 0.0;
    if (this.model.GRNById == 1 || this.model.GRNById == 2 || this.model.GRNById == 4) {
      for (var i = 0, len = this.dynamicArray.length; i < len; i++) {
        trqty = parseFloat(this.dynamicArray[index].ChallanQty == undefined ? 0.0 : this.dynamicArray[index].ChallanQty);
        acqty = parseFloat(this.dynamicArray[index].AcceptedQty == undefined ? 0.0 : this.dynamicArray[index].AcceptedQty);
        faqty = parseFloat(this.dynamicArray[index].RejectedQty == undefined ? 0.0 : this.dynamicArray[index].RejectedQty);
        recqty = parseFloat(this.dynamicArray[index].ReceivedQty == undefined ? 0.0 : this.dynamicArray[index].ReceivedQty);

        // if (acqty > trqty) {
        //   alert("accepted qty should not be greater than transit qty  ");
        //   this.dynamicArray[i].AcceptedQty = "0.00";
        //   // this.fnBindItemGrossToatl();
        // } else {
        //   this.dynamicArray[i].RejectedQty = (trqty - acqty); 
        //   this.fnBindItemGrossToatl();
        // }

        // Change Ravinder 30/04/2021
        if (acqty > recqty) {
          alert("accepted qty should not be greater than  received qty   ");
          this.dynamicArray[index].AcceptedQty = "0.00";
          this.dynamicArray[index].RejectedQty = "";
          // this.fnBindItemGrossToatl();
        } else {
          //this.dynamicArray[i].RejectedQty = (trqty - acqty); 
          this.dynamicArray[index].RejectedQty = (recqty - acqty);
          this.fnBindItemGrossToatl();
        }
      }
    } else {
      for (var i = 0, len = this.dynamicArray.length; i < len; i++) {
        trqty = parseFloat(this.dynamicArray[index].ChallanQty == undefined ? 0.0 : this.dynamicArray[index].ChallanQty);
        acqty = parseFloat(this.dynamicArray[index].AcceptedQty == undefined ? 0.0 : this.dynamicArray[index].AcceptedQty);
        faqty = parseFloat(this.dynamicArray[index].RejectedQty == undefined ? 0.0 : this.dynamicArray[index].RejectedQty);
        recqty = parseFloat(this.dynamicArray[index].ReceivedQty == undefined ? 0.0 : this.dynamicArray[index].ReceivedQty);

        // if (acqty > trqty) {
        //   alert("accepted qty should not be greater than transit qty  ");
        //   this.dynamicArray[i].AcceptedQty = "0.00";
        //   // this.fnBindItemGrossToatl();
        // } else {
        //   this.dynamicArray[i].RejectedQty = (trqty - acqty); 
        //   this.fnBindItemGrossToatl();
        // }

        // Change Ravinder 30/04/2021
        if (acqty > trqty) {
          alert("accepted qty should not be greater than  Job qty   ");
          this.dynamicArray[index].AcceptedQty = "0.00";
          this.dynamicArray[index].RejectedQty = "0";
          // this.fnBindItemGrossToatl();
        } else {
          //this.dynamicArray[i].RejectedQty = (trqty - acqty); 
          this.dynamicArray[index].RejectedQty = (trqty - acqty);
          this.fnBindItemGrossToatl();
        }
      }
    }


  }
  //#endregion
  //#region  search Grn Crn
  SearchGRNList() {
    this.gridApi.showLoadingOverlay();
    try {
      var objSearchGRNCRNPoModel = new SearchGRNCRNPoModel();
      objSearchGRNCRNPoModel.CompanyId = this.CompanyId;
      objSearchGRNCRNPoModel.VendorId = this.CommonSearchPanelData.VendorId;
      if (this.CommonSearchPanelData.WHId != "") {
        objSearchGRNCRNPoModel.WHId = this.CommonSearchPanelData.WHId;
      } else {
        if (this.WareHouseId == "0") {
          objSearchGRNCRNPoModel.WHId = "";
        } else {
          objSearchGRNCRNPoModel.WHId = this.WareHouseId;
        }
      }
      objSearchGRNCRNPoModel.ItemClassId = this.CommonSearchPanelData.ItemClassId;
      objSearchGRNCRNPoModel.ItemId = this.CommonSearchPanelData.ItemId;
      objSearchGRNCRNPoModel.Startdate = this.CommonSearchPanelData.Startdate;
      objSearchGRNCRNPoModel.Enddate = this.CommonSearchPanelData.Enddate;
      var PoId = this._Commonservices.checkUndefined(this.SearchPanelPoId);
      if (PoId != '') {
        objSearchGRNCRNPoModel.PoId = PoId;
      } else {
        objSearchGRNCRNPoModel.PoId = 0;
      }
      objSearchGRNCRNPoModel.State_Id = this.CommonSearchPanelData.State_Id;
      objSearchGRNCRNPoModel.PoStatusId = 1;
      objSearchGRNCRNPoModel.MakeId = this.CommonSearchPanelData.MakeId;
      objSearchGRNCRNPoModel.ItemCodeId = this.CommonSearchPanelData.ItemCodeId;
      objSearchGRNCRNPoModel.CapacityId = this.CommonSearchPanelData.CapacityId;
      objSearchGRNCRNPoModel.DescriptionId = this.CommonSearchPanelData.DescriptionId;
      objSearchGRNCRNPoModel.GRNCRNSRNSTNNo = this._Commonservices.checkUndefined(this.model.GRNNo);
      objSearchGRNCRNPoModel.InvoiceNo = this._Commonservices.checkUndefined(this.model.InvoiceNo);
      var TypeId = this._Commonservices.checkUndefined(this.model.GRNSTNId);
      if (TypeId != '') {
        objSearchGRNCRNPoModel.VoucherTypeId = TypeId;
      } else {
        objSearchGRNCRNPoModel.VoucherTypeId = 0;
      }
      objSearchGRNCRNPoModel.ActiveId = this.model.ddlActive;
      objSearchGRNCRNPoModel.Flag = 'all';
      this._GrncrnService.GetGrncrnSearchList(objSearchGRNCRNPoModel).subscribe(data => {
        this.gridApi.hideOverlay();
        if (data.Status == 1) {
          this.GridrowData = data.Data;
          this.Loader.hide();
        } else if (data.Status == 2) {
          this.Loader.hide();
          this.GridrowData = [];
        }
      });
    } catch (Error) {
      var objWebErrorLogModel = new WebErrorLogModel();
      objWebErrorLogModel.ErrorBy = this.UserId;
      objWebErrorLogModel.ErrorMsg = Error.message;
      objWebErrorLogModel.ErrorFunction = "SearchGRNCRNList";
      objWebErrorLogModel.ErrorPage = "Grn";
      this._GlobalErrorHandlerService.handleError(objWebErrorLogModel);
    }
  }

  GRNExcelExport() {
    try {
      this.ExcelrowData = [];
      var objSearchGRNCRNPoModel = new SearchGRNCRNPoModel();
      objSearchGRNCRNPoModel.CompanyId = this.CompanyId;
      objSearchGRNCRNPoModel.VendorId = this.CommonSearchPanelData.VendorId;
      if (this.CommonSearchPanelData.WHId != "") {
        objSearchGRNCRNPoModel.WHId = this.CommonSearchPanelData.WHId;
      } else {
        if (this.WareHouseId == "0") {
          objSearchGRNCRNPoModel.WHId = "";
        } else {
          objSearchGRNCRNPoModel.WHId = this.WareHouseId;
        }
      }
      objSearchGRNCRNPoModel.ItemClassId = this.CommonSearchPanelData.ItemClassId;
      objSearchGRNCRNPoModel.ItemId = this.CommonSearchPanelData.ItemId;
      objSearchGRNCRNPoModel.Startdate = this.CommonSearchPanelData.Startdate;
      objSearchGRNCRNPoModel.Enddate = this.CommonSearchPanelData.Enddate;
      var PoId = this._Commonservices.checkUndefined(this.SearchPanelPoId);
      if (PoId != '') {
        objSearchGRNCRNPoModel.PoId = PoId;
      } else {
        objSearchGRNCRNPoModel.PoId = 0;
      }
      objSearchGRNCRNPoModel.State_Id = this.CommonSearchPanelData.State_Id;
      objSearchGRNCRNPoModel.PoStatusId = 1;
      objSearchGRNCRNPoModel.MakeId = this.CommonSearchPanelData.MakeMaster_Id;
      objSearchGRNCRNPoModel.ItemCodeId = this.CommonSearchPanelData.ItemCodeId;
      objSearchGRNCRNPoModel.CapacityId = this.CommonSearchPanelData.CapacityId;
      objSearchGRNCRNPoModel.GRNCRNSRNSTNNo = this._Commonservices.checkUndefined(this.model.GRNNo);
      objSearchGRNCRNPoModel.InvoiceNo = this._Commonservices.checkUndefined(this.model.InvoiceNo);
      var TypeId = this._Commonservices.checkUndefined(this.model.GRNSTNId);
      if (TypeId != '') {
        objSearchGRNCRNPoModel.VoucherTypeId = TypeId;
      } else {
        objSearchGRNCRNPoModel.VoucherTypeId = 0;
      }
      objSearchGRNCRNPoModel.ActiveId = this.model.ddlActive;
      objSearchGRNCRNPoModel.Flag = 'ExcelExport';
      this.Exportloading = true;
      this._GrncrnService.GetGrncrnSearchList(objSearchGRNCRNPoModel).subscribe(data => {
        this.Exportloading = false;
        if (data.Status == 1) {
          if (data.Data != null && data.Data != "") {
            this.ExcelrowData = data.Data;
            var CurrentDate = this.datePipe.transform(Date(), "dd/MM/yyyy");
            this._PurchaseOrderService.exportAsExcelFile(this.ExcelrowData, 'GRNDetail' + CurrentDate);
          } else {
            alert('Data not Found');
          }
        }
      });
    } catch (Error) {
      var objWebErrorLogModel = new WebErrorLogModel();
      objWebErrorLogModel.ErrorBy = this.UserId;
      objWebErrorLogModel.ErrorMsg = Error.message;
      objWebErrorLogModel.ErrorFunction = "GRNExcelExport";
      objWebErrorLogModel.ErrorPage = "Grn";
      this._GlobalErrorHandlerService.handleError(objWebErrorLogModel);
    }
  }
  //#endregion


  //#region auto complete Site Name and Customer Site ID
  onChangeSiteNameSearch(val: string, index: any) {
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
  }



  searchClearedSiteCustomer(index: any) {
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
  //  STNDetail()
  //  {
  // this.IsPageActive=true;
  // this.isShownPOEdit=false;
  //  }
  addRow() {
    var objNewItemGrid = new GRNDynamicItemGrid();
    objNewItemGrid.Id = 0;
    objNewItemGrid.ItemNameId = "0";
    objNewItemGrid.ItemId = "0";
    objNewItemGrid.ItemMakeId = "0";
    objNewItemGrid.Rate = "0.00";
    objNewItemGrid.TotalAmount = "0.00";
    objNewItemGrid.ChallanQty = "0";
    objNewItemGrid.AcceptedQty = "0";
    objNewItemGrid.ReceivedQty = "0";
    objNewItemGrid.RejectedQty = '';
    objNewItemGrid.ExcessShort = '';
    objNewItemGrid.SiteName = "";
    objNewItemGrid.CustomerSiteId = "";
    objNewItemGrid.ReasonCode = "";
    objNewItemGrid.CustomerCode = "";
    objNewItemGrid.CustomerId = 0;
    objNewItemGrid.UnitName = "0";
    objNewItemGrid.EqTypeId = "0";
    objNewItemGrid.TaxWith = "1";
    objNewItemGrid.IsCorrectionEntryReason = "0";
    objNewItemGrid.IsCorrectionCodeId = "0";
    if (checkUndefined(this.GrnId) != '' && this.RoleCorrectionEntry == true) {
      objNewItemGrid.IsCorrection = true;
      this.Correctioncolumnhideandshow = true;
      objNewItemGrid.IsCorrectionDisabled;
    } else {
      objNewItemGrid.IsCorrection = false;
      this.ItemAddrowhideshow = false;
      this.Correctioncolumnhideandshow = false;
    }
    if (this.model.JobId != 0) {
      this.IsChallanQtyJobQty = false;
    }
    this.dynamicArray.push(objNewItemGrid);
    return true;
  }

  deleteRow(index) {
    if (this.dynamicArray.length == 1) {
      return false;
    } else {
      this.dynamicArray.splice(index, 1);
      this.fnBindItemGrossToatl();
      return true;
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

  //#region  Validation GRN CRN Part
  TrasporationKeyPress() {
    $("#txtTrasporationMode").css('border-color', '');
  }
  TransporterNameKeyPress() {
    $("#txtTransporterName").css('border-color', '');
  }
  TransporteGSTNoKeyPress() {
    $("#txtTransporterGSTNo").css('border-color', '');
  }
  SenderNameKeyPress() {
    $("#txtSenderName").css('border-color', '');
  }
  senderNoKeyPress() {
    $("#txtSenderNo").css('border-color', '');
  }
  SenderAddressKeyPress() {
    $("#txtSenderAddress").css('border-color', '');
  }
  ValidationGRNCRN() {
    console.log(this.model.GRNById);
    var flag = 0;
    if (this.model.GRNById == 0 || this.model.GRNById == 1 || this.model.GRNById == 2) {
      if (this.selectedEditVendorItems.length == 0) {
        $('#TxtVendorEdit .selected-list .c-btn').attr('style', 'border-color: red');
        $('#TxtVendorEdit').focus();
        flag = 1;
      } else {
        $('#TxtVendorEdit .selected-list .c-btn').attr('style', 'border-color: ');
      }
    } else {

      $('#TxtVendorEdit .selected-list .c-btn').attr('style', 'border-color: ');
    }
    if (this.model.GRNdate == "" || this.model.GRNdate == null) {
      $('#txtGRNdate').css('border-color', 'red');
      $('#txtGRNdate').focus();
      flag = 1;
    } else {
      $("#txtGRNdate").css('border-color', '');
    }
    if (this.model.EditStateId == "0" || this.model.EditStateId == undefined) {
      $('#txtStateEdit').attr('style', 'border-color: red');
      $('#txtStateEdit').focus();
      flag = 1;
    } else {
      $('#txtStateEdit').attr('style', 'border-color: ');
    }
    if ($('#txtWH').val() == "0" || $('#txtWH').val() == undefined) {
      $('#txtWH').css('border-color', 'red');
      $('#txtWH').focus();
      flag = 1;
    } else {
      $("#txtWH").css('border-color', '');
    }
    if ($('#txtChallanNo').val() == "" || $('#txtChallanNo').val() == undefined) {
      $('#txtChallanNo').css('border-color', 'red');
      $('#txtChallanNo').focus();
      flag = 1;
    } else {
      $("#txtChallanNo").css('border-color', '');
    }

    // if ($('#txtChallanNo').val() != "" || $('#txtChallanNo').val() != undefined) {
    //   if (this.model.InvoiceAmount == "" || this.model.InvoiceAmount == 0) {
    //     $('#txtInvoiceamt').css('border-color', 'red');
    //     $('#txtInvoiceamt').focus();
    //     flag = 1;
    //   } else {
    //     $("#txtInvoiceamt").css('border-color', '');
    //   }
    // }

    if (this.model.ChallanDate == "" || this.model.ChallanDate == null) {
      $('#txtChallanDate').css('border-color', 'red');
      $('#txtChallanDate').focus();
      flag = 1;
    } else {
      $("#txtChallanDate").css('border-color', '');
    }
    if ($('#txtGateEntryNo').val() == "" || $('#txtGateEntryNo').val() == undefined) {
      $('#txtGateEntryNo').css('border-color', 'red');
      $('#txtGateEntryNo').focus();
      flag = 1;
    } else {
      $("#txtGateEntryNo").css('border-color', '');
    }
    if (this.model.GateEntryDate == "" || this.model.GateEntryDate == null) {
      $('#txtGateEntryDate').css('border-color', 'red');
      $('#txtGateEntryDate').focus();
      flag = 1;
    } else {
      $("#txtGateEntryDate").css('border-color', '');
    }
    // if ($('#txtTransporter').val() == "" || $('#txtTransporter').val() == undefined) {
    //   $('#txtTransporter').css('border-color', 'red');
    //   $('#txtTransporter').focus();
    //   flag = 1;
    // } else {
    //   $("#txtTransporter").css('border-color', '');
    // }
    if (this.model.ddlDespatchby == "1") {
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
      if ($('#txtLRNo').val() == "" || $('#txtLRNo').val() == undefined) {
        $('#txtLRNo').css('border-color', 'red');
        $('#txtLRNo').focus();
        flag = 1;
      } else {
        $("#txtLRNo").css('border-color', '');
      }
      if (this.model.LRdate == "" || this.model.LRdate == null) {
        $('#txtLRdate').css('border-color', 'red');
        flag = 1;
      } else {
        $("#txtLRdate").css('border-color', '');
      }
      if ($('#txtVehicleNo').val() == "" || $('#txtVehicleNo').val() == undefined) {
        $('#txtVehicleNo').css('border-color', 'red');
        $('#txtVehicleNo').focus();
        flag = 1;
      } else {
        $("#txtVehicleNo").css('border-color', '');
      }
    }
    // else {
    //   if (this.model.SenderName == "" || this.model.SenderName == null) {
    //     $('#txtSenderName').css('border-color', 'red');
    //     $('#txtSenderName').focus();
    //     flag = 1;
    //   } else {
    //     $("#txtSenderName").css('border-color', '');
    //   }
    //   if (this.model.SenderAddress == "" || this.model.SenderAddress == null) {
    //     $('#txtSenderAddress').css('border-color', 'red');
    //     $('#txtSenderAddress').focus();
    //     flag = 1;
    //   } else {
    //     $("#txtSenderAddress").css('border-color', '');
    //   }
    //   if (this.model.SenderNo == "" || this.model.SenderNo == null) {
    //     $('#txtSenderNo').css('border-color', 'red');
    //     $('#txtSenderNo').focus();
    //     flag = 1;
    //   } else {
    //     $("#txtSenderNo").css('border-color', '');
    //   }
    // }


    if ($('#txtIndentorName').val() == "" || $('#txtIndentorName').val() == undefined) {
      $('#txtIndentorName').css('border-color', 'red');
      $('#txtIndentorName').focus();
      flag = 1;
    } else {
      $("#txtIndentorName").css('border-color', '');
    }

    if (this._Commonservices.checkUndefined(this.GrnId) == "" || this._Commonservices.checkUndefined(this.GrnId) == 0) {
      var GateFile = this._Commonservices.checkUndefined(this.GatePdfUploadFile);
      if (GateFile == "" || GateFile == null) {
        flag = 1;
        alert('Please Select Gate Entery File');
      }
      if ($('#txtChallanNo').val() != "") {
        var ChallanFile = this._Commonservices.checkUndefined(this.ChallanUploadFile);
        if (ChallanFile == "" || ChallanFile == null) {
          flag = 1;
          alert('Please Select Incoice Challan Upload File');
        }
      }

      if ($('#txtEwayBillNo').val() != "") {
        var ewayFile = this._Commonservices.checkUndefined(this.EwayBillfile);
        if (ewayFile == "" || ewayFile == null) {
          flag = 1;
          alert('Please Select EwayBill File');
        }
      }
      if (this.model.ddlDespatchby == "1") {
        var LRFile = this._Commonservices.checkUndefined(this.LRPdfUploadFile);
        if (LRFile == "" || LRFile == null) {
          flag = 1;
          alert('Please Select Bilty  File');
        }
      }
    }


    //item Validation

    $('#tblOne > tbody >tr').each(function () {
      var valueName = $(this).find('.ItemName').val();
      if (valueName == '0') {
        flag = 1;
        $(this).find('.ItemName').css('border-color', 'red');
      }
      var valueMake = $(this).find('.ItemMake').val();
      if (valueMake == '0') {
        flag = 1;
        $(this).find('.ItemMake').css('border-color', 'red');
      }
      var valueItem = $(this).find('.ItemCode').val();
      if (valueItem == '0') {
        flag = 1;
        $(this).find('.ItemCode').css('border-color', 'red');
      }
      var valueUnitName = $(this).find('.UnitName').val();
      if (valueUnitName == '0' || valueUnitName == '') {
        flag = 1;
        $(this).find('.UnitName').css('border-color', 'red');
      }
      var value = $(this).find('.itmsRate').val();
      if (value == '') {
        flag = 1;
        $(this).find('.itmsRate').css('border-color', 'red');
      }
      var valueChallanQty = $(this).find('.ChallanQty').val();
      if (valueChallanQty == '0' || valueChallanQty == '') {
        flag = 1;
        $(this).find('.ChallanQty').css('border-color', 'red');
      }
      var valueReceivedQty = $(this).find('.ReceivedQty').val();
      if (valueReceivedQty == '0' || valueReceivedQty == '') {
        flag = 1;
        $(this).find('.ReceivedQty').css('border-color', 'red');
      }
      var valueAcceptedQty = $(this).find('.AcceptedQty').val();
      if (valueAcceptedQty == '0' || valueAcceptedQty == '' || valueAcceptedQty == '0.00') {
        flag = 1;
        $(this).find('.AcceptedQty').css('border-color', 'red');
      }

      var valuehideIsConversion = $(this).find('.hideIsConversion').val();
      if (valuehideIsConversion == "1") {
        var valueConversionValue = $(this).find('.ConversionValue').val();
        if (valueConversionValue == '') {
          flag = 1;
          $(this).find('.ConversionValue').css('border-color', 'red');
        }

      }
      // if (this.model.JobId != 0) {
      //   var valueEqType = $(this).find('.EqType').val();
      //   if (valueEqType == '0') {
      //     flag = 1;
      //     $(this).find('.EqType').css('border-color', 'red');
      //   }
      // }


      //  var valueamt=$(this).find('.itmsTotalAmount').val();
      //  if(valueamt=='0.00'){
      //   $(this).find('.itmsTotalAmount').css('border-color', 'red');
      //  }
    });
    return flag;
  }

  CorrectionValidationGRN(index) {
    var flag = 0;
    if (this.dynamicArray[index].ItemNameId == "" || this.dynamicArray[index].ItemNameId == "null" || this.dynamicArray[index].ItemNameId == "0") {
      $('#txtItemNameId_' + index).css('border-color', 'red');
      $('#txtItemNameId_' + index).focus();
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
    // brahamjot kaur 20/6/2022
    //   if(this.model.GRNById == 3){
    //   if (this.dynamicArray[index].EqTypeId == "" || this.dynamicArray[index].EqTypeId == "null" || this.dynamicArray[index].EqTypeId == "0") {
    //     $('#ddlEqTypeId_' + index).css('border-color', 'red');
    //     $('#ddlEqTypeId_' + index).focus();
    //     flag = 1;
    //   } else {
    //     $("#ddlEqTypeId_" + index).css('border-color', '');
    //   }
    // }else{
    //   $("#ddlEqTypeId_" + index).css('border-color', '');
    // }

    // if (this.dynamicArray[index].UnitName == "" || this.dynamicArray[index].UnitName == "0") {
    //   $('#ddlUnitName_' + index).css('border-color', 'red');
    //   $('#ddlUnitName_' + index).focus();
    //   flag = 1;
    // } else {
    //   $("#ddlUnitName_" + index).css('border-color', '');
    // }
    if (this.dynamicArray[index].Rate == "" || this.dynamicArray[index].Rate == "0") {
      $('#txtRate_' + index).css('border-color', 'red');
      $('#txtRate_' + index).focus();
      flag = 1;
    } else {
      $("#txtRate_" + index).css('border-color', '');
    }

    if (this.dynamicArray[index].AcceptedQty == "" || this.dynamicArray[index].AcceptedQty == "0") {
      $('#ddlAcceptedQty_' + index).css('border-color', 'red');
      $('#ddlAcceptedQty_' + index).focus();
      flag = 1;
    } else {
      $("#ddlAcceptedQty_" + index).css('border-color', '');
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

  ChallanQtyKeyPress(index: any) {
    $('#tblOne > tbody  > tr').each(function () {
      var valueChallanQty = $(this).find('.ChallanQty').val();
      if (valueChallanQty != '0') {
        $(this).find('.ChallanQty').css('border-color', '');
      }
    });
    for (var i = 0, len = this.dynamicArray.length; i < len; i++) {
      //this.dynamicArray[index].ChallanQty ==
      this.dynamicArray[index].AcceptedQty = 0.00;
      this.dynamicArray[index].ExcessShort = 0;
      this.dynamicArray[index].ReceivedQty = 0;
    }

  }

  OnblurConversionValue() {
    $('#tblOne > tbody  > tr').each(function () {
      var valueReceivedQty = $(this).find('.ConversionValue').val();
      if (valueReceivedQty != '') {
        $(this).find('.ConversionValue').css('border-color', '');
      }
    });
  }

  ReceivedQtyKeyPress(RecivedQty: any, index) {
    $('#tblOne > tbody  > tr').each(function () {
      var valueReceivedQty = $(this).find('.ReceivedQty').val();
      if (valueReceivedQty != '0') {
        $(this).find('.ReceivedQty').css('border-color', '');
      }
    });
    var HideConValue = 0.0;
    for (var i = 0, len = this.dynamicArray.length; i < len; i++) {
      //this.dynamicArray[index].ChallanQty ==
      this.dynamicArray[index].AcceptedQty = 0.00;
      this.dynamicArray[index].RejectedQty = 0;

      if (this._Commonservices.checkUndefined(this.dynamicArray[index].HideConversionValue) != "") {
        HideConValue = parseFloat(this.dynamicArray[index].HideConversionValue == "" ? 0.0 : this.dynamicArray[index].HideConversionValue);
        this.dynamicArray[index].ConversionValue = (RecivedQty * HideConValue)
      }
    }
  }


  RateKeyPress() {
    $('#tblOne > tbody  > tr').each(function () {
      var value = $(this).find('.itmsRate').val();
      if (value != '') {
        $(this).find('.itmsRate').css('border-color', '');
      }
    });
  }
  ExcessShortKeyPress() {
    $('#tblOne > tbody  > tr').each(function () {
      var valueExcessShort = $(this).find('.ExcessShort').val();
      if (valueExcessShort != "") {
        $(this).find('.ExcessShort').css('border-color', '');
      }
    });
  }
  RejectedQtyKeyPress() {
    $('#tblOne > tbody  > tr').each(function () {
      var valueRejectedQty = $(this).find('.RejectedQty').val();
      if (valueRejectedQty != "") {
        $(this).find('.RejectedQty').css('border-color', '');
      }
    });
  }

  onKeypressPoDate(event: any) {
    $("#txtPodate").css('border-color', '');
  }
  onKeypressGRNdate(event: any) {
    $("#txtGRNdate").css('border-color', '');
  }
  onKeypressChallanDate(event: any) {
    $("#txtChallanDate").css('border-color', '');
  }
  AddressKeyPress() {
    $("#txtAddress").css('border-color', '');
  }

  keyPressGateEntry() {
    $("#txtGateEntryNo").css('border-color', '');
  }
  onKeypressGateEntryDate(event: any) {
    $("#txtGateEntryDate").css('border-color', '');
  }
  keyPressTransporter() {
    $("#txtTransporter").css('border-color', '');
  }
  keyPressVehicleNo() {
    $("#txtVehicleNo").css('border-color', '');
  }
  keyPressIndentorName() {
    $("#txtIndentorName").css('border-color', '');
  }
  keyPressLRNo() {
    $("#txtLRNo").css('border-color', '');
  }
  onKeypressLRdate(event: any) {
    $("#txtLRdate").css('border-color', '');
  }
  keyPressChallan() {
    $("#txtChallanNo").css('border-color', '');
  }
  keyPressChallanAmt() {
    $("#txtInvoiceamt").css('border-color', '');
  }

  //#endregion
  stripText(event) {
    const seperator = '^([0-9])';
    const maskSeperator = new RegExp(seperator, 'g');
    let result = maskSeperator.test(event.key);
    return result;
  }

}


function checkUndefined(x) {
  var x;
  if (typeof x === "undefined") {
    x = '';
  }
  return x;
}



