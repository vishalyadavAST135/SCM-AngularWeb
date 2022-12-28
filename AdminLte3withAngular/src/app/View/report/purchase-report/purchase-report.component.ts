import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { CommonService } from 'src/app/Service/common.service';
import { GlobalErrorHandlerServiceService } from 'src/app/Service/global-error-handler-service.service';
import { MaterialMovementService } from 'src/app/Service/material-movement.service';
import { PurchaseOrderService } from 'src/app/Service/purchase-order.service';
import { SearchpanelService } from 'src/app/Service/searchpanel.service';
import { CompanyStateVendorItemModel, DropdownModel, MenuName, WebErrorLogModel } from 'src/app/_Model/commonModel';
import { SearchGRNCRNPoModel } from 'src/app/_Model/grncrnModel';
import { CompanyModel } from 'src/app/_Model/userModel';
import { UserPageRight } from 'src/app/_Model/UserRoleButtonModel';

@Component({
  selector: 'app-purchase-report',
  templateUrl: './purchase-report.component.html',
  styleUrls: ['./purchase-report.component.sass'],
  providers: [DatePipe]
})
export class PurchaseReportComponent implements OnInit {
  model: any = {};
  apiCSVIData: any = {};
  apiItemCodeAndDescriptionData: any = {};
  showLoading = false;

  public isShownPOList: boolean; // Grid List
  public isShownPOEdit: boolean; // Form Edit
  ValidationerrorMessage:string;
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
  GrnId: any;
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
  InvoiceData: any;
  InvoiceListData = [];
  UserId: any;
  InvoiceListEditData: any[];
  IsReceivingFile: boolean;
  IsLRFile: boolean;
  IsGatefile: boolean;

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
  arry: any;
  Pdfurl:any;
  path1:any;
  ObjUserPageRight = new UserPageRight();
  Save: any;
  constructor(private router: Router, private _Commonservices: CommonService, private _objSearchpanelService: SearchpanelService,
    private _PurchaseOrderService: PurchaseOrderService, private datePipe: DatePipe, private sanitizer: DomSanitizer,
    private Loader: NgxSpinnerService,
    private _MaterialMovementService: MaterialMovementService,
    private _GlobalErrorHandlerService: GlobalErrorHandlerServiceService,) {
    this.tooltipShowDelay = 0;
    this._objSearchpanelService.SearchPanelSubject.subscribe(data => {
      this.CommonSearchPanelData = data;
    });
  }

  ngOnInit(): void {
    var objCompanyModel = new CompanyModel();
    objCompanyModel = JSON.parse(sessionStorage.getItem("CompanyIdSession"));
    this.CompanyId = objCompanyModel.Company_Id;
    this.BindCompanyStateVendorItem();
    this.bindReport();
      //brahamjot kaur 31/10/2022
      var objUserModel = JSON.parse(sessionStorage.getItem("UserSession"));
      this.UserId = objUserModel.User_Id;
      this.GetUserPageRight();
    }
  
    //brahamjot kaur 31/10/2022
    async GetUserPageRight() {
      this._Commonservices.GetUserPageRight(this.UserId, MenuName.PurchaseReport).subscribe(data => {
        if (data.Status == 1) {
          console.log(data);
          this.ObjUserPageRight.IsSearch = data.Data[0].IsSearch;
        }
      })
    }
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
        //this.SearchItemNameList=objCSVTdata.ItemArray;
        this.ItemNameDetailData = objCSVTdata.ItemArray;
        this.EquipmentTypeList = objCSVTdata.EquipmentArray;
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
  SearchGRNList(e) {
    try {
      //this.GridrowData=[];
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
      objSearchGRNCRNPoModel.GRNCRNSRNSTNNo = this._Commonservices.checkUndefined(this.model.GRNNo);
      objSearchGRNCRNPoModel.InvoiceNo = this._Commonservices.checkUndefined(this.model.InvoiceNo);
     

      var TypeId = this._Commonservices.checkUndefined(this.model.GRNSTNId);
      if (TypeId != '') {
        objSearchGRNCRNPoModel.VoucherTypeId = TypeId;
      } else {
        objSearchGRNCRNPoModel.VoucherTypeId = 0;
      }
      objSearchGRNCRNPoModel.Flag = 'all';
     this.path1 = "https://apiuat.astnoc.com/FinanceWebAPI/Report.aspx?state="+objSearchGRNCRNPoModel.State_Id+
     //this.path1 = "https://localhost:44351/Report.aspx?state="+objSearchGRNCRNPoModel.State_Id+
     "&WH=" + objSearchGRNCRNPoModel.WHId +"&Item=" 
     +objSearchGRNCRNPoModel.ItemId
     +"&Capacity=" +  objSearchGRNCRNPoModel.CapacityId+
     "&Code="+objSearchGRNCRNPoModel.InvoiceNo
     +"&Class=&PONo="+objSearchGRNCRNPoModel.PoId+"&GRN0="+
     objSearchGRNCRNPoModel.GRNCRNSRNSTNNo+"&vendor="+
     objSearchGRNCRNPoModel.VendorId+"&startDate="+
     objSearchGRNCRNPoModel.Startdate+"&endDate="+
     objSearchGRNCRNPoModel.Enddate+
     "&from=scm&status="+this.model.status+"";
     this.showLoading = true;
    this.Pdfurl = this.sanitizer.bypassSecurityTrustResourceUrl(this.path1);


    } catch (Error) {
      var objWebErrorLogModel = new WebErrorLogModel();
      objWebErrorLogModel.ErrorBy = this.UserId;
      objWebErrorLogModel.ErrorMsg = Error.message;
      objWebErrorLogModel.ErrorFunction = "SearchGRNCRNList";
      objWebErrorLogModel.ErrorPage = "Grn";
      this._GlobalErrorHandlerService.handleError(objWebErrorLogModel);
    }
  }
  onLoad() {
    this.showLoading = false;
  }
  onFocused(e) {
  }
  onChangeSearch(val: string, FlagId: any) {
    // this.Loader.show();
    this.AutoCompletePOList = [];
    this.AutoCompleteGRNCRNPoList = [];
    var objdropdownmodel = new DropdownModel();
    objdropdownmodel.User_Id = this.UserId;
    objdropdownmodel.Parent_Id = val;
    objdropdownmodel.Company_Id = this.CompanyId;
    objdropdownmodel.Flag = FlagId;
    this._PurchaseOrderService.GetAutoCompletePurchaseOrder(objdropdownmodel).subscribe((data) => {
      //this.Loader.hide();
      this.AutoCompletePOList = data.Data;
      this.AutoCompleteGRNCRNPoList = data.Data;
    })
  }
  SearchPanelPo(item) {
    this.SearchPanelPoId = item.id;

  }
  searchCleared() {
    this.AutoCompletePOList = [];
    this.SearchPanelPoId = null;
    this.model.POData = "";
    
  }
  bindReport()
  {
  
    // var stDate=this._commonUtilService.format(this.model.InvoiceDt);
    // var edate=this._commonUtilService.format(this.model.PODT);
    
    // var objpara = new CommonSearchPanelModel();
    // this.path1 = "https://apiuat.astnoc.com/FinanceWebAPI/Report.aspx?state="+this.ConvertToId(this.SelectedSearchStateList)+
    // "&WH=" + this.ConvertToId(this.SelectedSearchWHList) +"&Item=" + this.ConvertToId(this.SelectedSearchItemNameList) +"&Capacity=" +  this.ConvertToId(this.SelectedSearchItemCapacityList)+
    // "&Code="+this._commonUtilService.checkUndefined(this.invoiceNo)+"&Class="+this.ConvertToId(this.SelectedItemClassList)+"&PONo="+this._commonUtilService.checkUndefined(this.poNo)+"&GRN0="+this._commonUtilService.checkUndefined(this.GRNo)+"&vendor="+this.ConvertToId(this.SelectedSearchVendorList)+"&startDate="+this._commonUtilService.checkUndefined(stDate)+"&endDate="+this._commonUtilService.checkUndefined(edate);
     this.path1="https://localhost:44351/Report.aspx?state=13,30,&WH=&Item=&Capacity=&Code=&Class=&PONo=undefined&GRN0=undefined";
    //this.Pdfurl = this.sanitizer.bypassSecurityTrustResourceUrl(this.path1);
  }

}



