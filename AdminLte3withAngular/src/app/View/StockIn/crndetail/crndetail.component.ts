import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { GRNDynamicItemGrid, VendorOrWhModel, PoSearchModel, DynamicItemGrid, GSerialNumber, CellNo } from 'src/app/_Model/purchaseOrderModel';
import { ButtonRendererComponent } from 'src/app/renderer/button-renderer.component';
import { FileRendererComponent } from 'src/app/renderer/file-renderer.component';
import { AgGridAngular, AgGridColumn } from 'ag-grid-angular';
import { NgbDateStruct, NgbDateAdapter, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { CommonService } from 'src/app/Service/common.service';
import { PurchaseOrderService } from 'src/app/Service/purchase-order.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import * as moment from 'moment';
import * as $ from 'jquery';
import { ApprovelStatusModel, CommonStaticClass, CompanyStateVendorItemModel, DropdownModel, MenuName, WebErrorLogModel } from 'src/app/_Model/commonModel';
import { DatePipe, formatDate } from '@angular/common';
import { GrncrnService } from 'src/app/Service/grncrn.service';
import { SearchGRNCRNPoModel, SaveGRNCRNModelDetail, GRNDynamicItemModel, FaultyImageModel, SiteCustomerAutoModel } from 'src/app/_Model/grncrnModel';
import { CustomTooltipComponent } from 'src/app/renderer/customtooltip.component';
import { DomSanitizer } from '@angular/platform-browser';
import { CompanyModel } from 'src/app/_Model/userModel';
import { SearchpanelService } from 'src/app/Service/searchpanel.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { first } from 'rxjs/operators';
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { ApprovalrendererComponent } from 'src/app/renderer/approvalrenderer/approvalrenderer.component';
import { approvalTooltipComponent } from 'src/app/renderer/Approvaltooltip.component';
import { MaterialMovementService } from 'src/app/Service/material-movement.service';
import { inArray } from 'jquery';
declare var jQuery: any;
pdfMake.vfs = pdfFonts.pdfMake.vfs;
import * as XLSX from 'xlsx';
import { UserPageRight } from 'src/app/_Model/UserRoleButtonModel';


@Component({
  selector: 'app-crndetail',
  templateUrl: './crndetail.component.html',
  styleUrls: ['./crndetail.component.sass'],
  providers: [DatePipe]
})

export class CrndetailComponent implements OnInit {
  model: any = {};
  apiCSVIData: any = {};
  apiItemCodeAndDescriptionData: any = {};
  dynamicArray: Array<GRNDynamicItemGrid> = [];
  FaultyFileArray: Array<FaultyImageModel> = [];

  public isShownPOList: boolean; // Grid List
  public isShownPOEdit: boolean; // Form Edit

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
  public rowData = [];   //  grid data

  public multiSortKey: string;
  frameworkComponents: any;

  GRNCRN_Name: string;
  CompanyCustomer_Name: string;

  //--------------------------------------------------
  keyword = 'PoName';
  AutoCompletePOList = [];
  //---------------------------
  gridApi: any;
  gridColumnApi: any;
  tooltipShowDelay: any;
  GRNCRNkeyword = 'PoName';
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
  isdisabled: boolean;
  VendorEditList: any;
  public selectedEditVendorItems = [];
  // ChallanUploadFile:File=null;
  GrndynamicItemArray: any = [];
  GRNCRNRowData: any[];
  totalSumAcceptedQty: any;
  totalSumAmount: any;
  totalAmount: any;
  public FaultyFile = [];
  CRNId: any=0;
  PoeditId: any;
  InvChallanFile: any;
  GatePdfFile: any;
  LRFile: any;
  InvChallanEditFile: any;
  GateEditFile: any;
  LREditFile: any;
  POBasedisabled: boolean;
  isShownGrnCompany: boolean;
  isShownCrnCoustmer: boolean;
  isdisabledGrnDate: boolean;
  CompanyId: any;
  loading = false;
  Exportloading: boolean = false;
  CommonSearchPanelData: any;
  ExcelrowData: any;
  AutoCompleteSiteCustomerList: any;
  WareHouseId: any;
  EquipmentTypeList: any;
  UserId: any;
  UserName: any;
  TransporterTypeDetail: any;
  indexv: any;

  BBChangeValue: any;
  strcount: number;
  isEdit: boolean;
  headerItemName: any;
  IsError: boolean;
  errorMessage: string;
  firstValue: any;
  lastValue: any;
  srnlst: Array<GSerialNumber> = [];

  IsSuccess: boolean = false;
  succesMessage: string;

  ViewChallanPdffile: any;
  ViewGatePdffile: any;
  ViewCLRPdfile: any;
  IsReceivingFile: boolean;
  IsLRFile: boolean;
  IsGatefile: boolean;

  public loadingTemplate;
  CreateName: any;
  CreatedDate: any;
  ModifiedName: any;
  ModifiedDate: any;
  ApprovalList: any;
  ApproveStatusDataList: any;
  PageMenuId: any = 27;
  TableId: any;
  ManueId: number;
  ArrayRoleId: any;
  IsApprovalstatusbtnhideShow: boolean;
  UserRoleId: any;
  dynamicArrayForPdf: any;
  CRNPdfData: any;
  GRNCRNPdfItemData: any;
  IsDownloadPrintHideShow: boolean;
  IsHideShowCancelBtn: boolean;
  ItemReasonData: any;
  CancelReasonData: any;
  arry: any;
  IsHiddenvendor: boolean = false;
  IsHiddenSearchCustomer: boolean = false;
  SearchCustomerData: any;
  IsSaveButtonDisable: boolean;
  ValidationerrorMessage: string;
  @ViewChild('inputExcelOther', { static: false })
  inputExcelOther: ElementRef;
  @ViewChild('inputExcelBB', { static: false })
  inputExcelBB: ElementRef;
  IsCRNPreview: boolean;
  IsPreviewDisable: boolean;
  @ViewChild('inputLRPDF', { static: false })
  inputLRPDF: ElementRef;
  @ViewChild('inputGatePDF', { static: false })
  inputGatePDF: ElementRef;
  @ViewChild('inputChallanPDF', { static: false })
  inputChallanPDF: ElementRef;
  CustomerAddressData: any;
  ObjUserPageRight = new UserPageRight();
  Save: any;
  constructor(private router: Router, private _Commonservices: CommonService, private _objSearchpanelService: SearchpanelService,
    private _PurchaseOrderService: PurchaseOrderService, private datePipe: DatePipe, private sanitizer: DomSanitizer,
    private _GrncrnService: GrncrnService, private Loader: NgxSpinnerService, private _MaterialMovementService: MaterialMovementService,) {
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
  }

  ngOnInit(): void {
    jQuery('#Ven').hide();
    this.model.TransporterId = "";
    this.model.InCaseReason = "0";
    this.IsApprovalstatusbtnhideShow = false;
    var objCompanyModel = new CompanyModel();
    objCompanyModel = JSON.parse(sessionStorage.getItem("CompanyIdSession"));
    this.CompanyId = objCompanyModel.Company_Id;

    var objUserModel = JSON.parse(sessionStorage.getItem("UserSession"));
    this.UserId = objUserModel.User_Id;
    this.UserName = objUserModel.User_Id;
    if (objUserModel == null || objUserModel == "null") {
      this.router.navigate(['']);
    }

    this.ArrayRoleId = objUserModel.Role_Id.split(',');
    for (var i = 0, len = this.ArrayRoleId.length; i < len; i++) {
      if (this.ArrayRoleId[i] == "11") {
        this.UserRoleId = this.ArrayRoleId[i];
      }
    }
    this.isShownPOList = false;
    this.isShownPOEdit = true;
    this.IsCRNPreview = true;
    this.BindCompanyStateVendorItem();

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
        width: 110,
        filter: false,
        resizable: true,
        field: 'CRNId',
        tooltipField: 'CRNId', tooltipComponent: 'approvalTooltip',
      },
      // {headerName: 'PO No', field:'PONo',pinned:'left',width:150,resizable:true ,filter:false},
      // {headerName: 'PO Date', field:'PoDate',pinned:'left',width:100,resizable:true ,filter:false},
      { headerName: 'CRN No', field: 'CRNNo', pinned: 'left', width: 150, resizable: true, filter: false, },
      { headerName: 'CRN Date', field: 'CRNDate', pinned: 'left', width: 100, resizable: true, filter: false, },
      {
        headerName: 'Item Name', field: 'ItemName',
        width: 130, filter: false, resizable: true
      },
      {
        headerName: 'Item Description', field: 'ItemDescription', tooltipField: 'ItemDescription',
        tooltipComponent: 'customtooltip', width: 130, filter: false, resizable: true
      },
      { headerName: 'Challan Qty', field: 'ChallanQty', width: 110, filter: false, resizable: true },
      { headerName: 'Received Qty', field: 'ReceivedQty', width: 110, filter: false, resizable: true },
      { headerName: 'Accepted Qty', field: 'AcceptedQty', width: 120, filter: false, resizable: true },
      { headerName: 'Rejected Qty', field: 'RejectedQty', width: 110, filter: false, resizable: true },
      { headerName: 'Inv. Challan No', field: 'InvChallanNo', width: 150, filter: false, resizable: true },
      { headerName: 'Inv. Challan Date', field: 'InvChallanDate', width: 150, filter: false, resizable: true },
      { headerName: 'Total Amount', field: 'TotalAmount', width: 150, filter: false, resizable: true },
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
    this.SingledropdownSettings = {
      singleSelection: true,
      text: "Select",
      unSelectAllText: 'UnSelect All',
      enableSearchFilter: true,
      badgeShowLimit: 1,
    };
    var sfDate = new Date();
    var toDate = "";
    toDate = this.datePipe.transform(sfDate, "yyyy/MM/dd");
    this.model.GRNdate = { day: parseInt(toDate.split('/')[2]), month: parseInt(toDate.split('/')[1]), year: parseInt(toDate.split('/')[0]) };
    this.BindTransporterTypeDetail();
    this.ItemReason();
  //brahamjot kaur 31/10/2022
  this.GetUserPageRight(this.CRNId);
}

//brahamjot kaur 31/10/2022
async GetUserPageRight(id:number) {
  this._Commonservices.GetUserPageRight(this.UserId, MenuName.CRN).subscribe(data => {
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
        this._Commonservices.ErrorFunction(this.UserName, error.message, "CRNItemReason", "CRN");
      });
    } catch (Error) {
      this._Commonservices.ErrorFunction(this.UserName, Error.message, "CRNItemReason", "CRN");
    }
  }
  //#region default call function on page Load
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
      this.ItemNameDetailData = objCSVTdata.ItemArray;
      this.SearchItemNameList = objCSVTdata.ItemArray;
      this.EquipmentTypeList = objCSVTdata.EquipmentArray;
    }
  }

  //#endregion


  //#region Code By Umesh
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

  PreviewCRN() {
    this.IsCRNPreview = false;
    this.isShownPOList = true;
    this.isShownPOEdit = true;
    this.model.PreviewChallanDate = this._Commonservices.ConvertDateFormat(this.model.ChallanDate);
    this.model.PreviewGRNdate = this._Commonservices.ConvertDateFormat(this.model.GRNdate);
    this.model.PreviewGateEntryDate = this._Commonservices.ConvertDateFormat(this.model.GateEntryDate);
    //this.model.PreviewDispatchDate = this._Commonservices.ConvertDateFormat(this.model.DispatchDate);
    this.model.PreviewLRDate = this._Commonservices.ConvertDateFormat(this.model.LRdate);
  }
  BackPreviewDispatch() {
    this.IsCRNPreview = true;
    this.isShownPOList = true;
    this.isShownPOEdit = false;
  }

  GetCustomerName() {
    var objSiteCustomerAutoModel = new SiteCustomerAutoModel();
    objSiteCustomerAutoModel.SCNo = "";
    objSiteCustomerAutoModel.CompanyId = this.CompanyId;
    objSiteCustomerAutoModel.flag = "Customer";
    this._GrncrnService.GetAutoCompleteSiteAndCustomer(objSiteCustomerAutoModel).subscribe((AutoCom) => {
      this.AutoCompleteSiteCustomerList = AutoCom.Data;
      this.SearchCustomerData = AutoCom.Data;
    })
  }

  BindEditWHList() {
    $('#txtStateEdit').attr('style', 'border-color: ');
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
    this.model.SelectedGRNCRNWH = '0'
    this.model.WHAddress = '';
    this.GRNCRNWHList = null;
    this._Commonservices.getdropdown(objdropdownmodel).subscribe(wh => {
      this.GRNCRNWHList = wh.Data;
    });
  }



  fnBindItemGrossToatl() {
    this.totalAmount = 0;
    this.totalSumAcceptedQty = 0;
    for (var i = 0, len = this.dynamicArray.length; i < len; i++) {
      this.totalSumAcceptedQty += parseInt(this.dynamicArray[i].AcceptedQty);
      this.dynamicArray[i].TotalAmount = parseInt(this.dynamicArray[i].AcceptedQty) * parseFloat(this.dynamicArray[i].Rate)
      this.totalAmount += parseFloat(this.dynamicArray[i].TotalAmount);
    }
    this.totalSumAmount = thousands_separators(this.totalAmount);
    //this.totalSumQuantity=parseFloat(this.totalQuantity).toFixed(2);
    // parseFloat(this.totalSumAmount).toFixed(2)
  }


  // AcceptedQtyOnblur() {
  //   $('#tblOne > tbody  > tr').each(function () {
  //     var valueAcceptedQty = $(this).find('.AcceptedQty').val();
  //     if (valueAcceptedQty != '0') {
  //       $(this).find('.AcceptedQty').css('border-color', '');
  //     }
  //   });
  //   this.fnBindItemGrossToatl();
  // }
  ItemRateOnblur() {
    this.fnBindItemGrossToatl();
  }

  //#endregion



  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.rowData = this.rowData;
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
    this.CRNId = 0;
    this.totalAmount = 0;
    this.totalSumAcceptedQty = 0;
    this.IsSaveButtonDisable = false;
    this.isShownPOList = true;
    this.isShownPOEdit = false;
    this.isdisabled = false;
    this.IsPreviewDisable = true;
    this.isdisabledGrnDate = true;
    this.isShownGrnCompany = true;
    this.IsHideShowCancelBtn = false;
    this.IsDownloadPrintHideShow = false;
    this.model.CustomerId = "0";
    this.isEdit = false;
    this.IsReceivingFile = false;
    this.IsGatefile = false;
    this.IsLRFile = false;
    this.GRNCRNWHList = [];
    //this.model.GrnCompanyId=this.CompanyId
    var sfDate = new Date();
    var toDate = "";
    toDate = this.datePipe.transform(sfDate, "yyyy/MM/dd");
    this.model.GRNdate = { day: parseInt(toDate.split('/')[2]), month: parseInt(toDate.split('/')[1]), year: parseInt(toDate.split('/')[0]) };
    this.GetCustomerName();
    this.ClearGrnCrnDetail();
  }

 //#region  Change Item table  make, Code, vendor value
  ChangeEditItemName(ItemNameId: any, index: any) {
    $('#tblOne > tbody  > tr').each(function () {
      var valueItem = $(this).find('.ItemName').val();
      if (valueItem != '0') {
        $(this).find('.ItemName').css('border-color', '');
      }
    });
    var ItemNameHSNCode = this.SearchItemNameList.filter(
      m => m.id === parseInt(ItemNameId));
    this.dynamicArray[index].ItemName = ItemNameHSNCode[0].itemName;
    if (ItemNameHSNCode.length > 0) {
      this.dynamicArray[index].HSN = ItemNameHSNCode[0].HSNCode;
    } else {
      this.dynamicArray[index].HSN = "";
    }
    this.dynamicArray[index].EditItemMake = null;
    this.dynamicArray[index].EditItemCode = [];
    var objdropdownmodel = new DropdownModel();
    objdropdownmodel.User_Id = 0;
    objdropdownmodel.Parent_Id = ItemNameId;
    objdropdownmodel.Other_Id = "0";
    objdropdownmodel.Company_Id = this.CompanyId;
    objdropdownmodel.Flag = 'ItemMake';
    this._Commonservices.getdropdown(objdropdownmodel).subscribe(item => {
      this.dynamicArray[index].EditItemMake = item.Data;
      this.dynamicArray[index].ItemMakeId = "0";
    });

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
    this._Commonservices.getVendorOrWh(objVendormodel).subscribe(data => {
      var UnitData = data.Data;
      //this.dynamicArray[index].UnitName=data.Data[0].UnitName;
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

    });
  }

  ChangeEditVendor(event): void {
    $('#TxtVendorEdit .selected-list .c-btn').attr('style', 'border-color: ');
    var objVendormodel = new VendorOrWhModel();
    objVendormodel.Id = this.selectedEditVendorItems[0].id;
    objVendormodel.flag = 'vendor';
    this._Commonservices.getVendorOrWh(objVendormodel).subscribe(data => {
      var EditvendorData = data.Data;
      this.model.SupplierAddress = data.Data[0].VendorAddress;
    });

  }
//#endregion
  ClearGrnCrnDetail() {
    this.model.SelectedGRNCRNWH = "0";
    this.model.WHAddress = "";
    this.model.EditStateId = "0";
    this.model.CustomerId = "0";

    // this.model.GRNdate="";
    this.model.GRNCRNNo = "";
    this.model.ChallanNo = "";
    this.model.ChallanDate = "";
    this.model.GateEntryNo = "";
    this.model.GateEntryDate = "";
    this.model.VehicleNo = "";
    this.model.IndentorName = "";
    this.model.LRNo = "";
    this.model.LRdate = "";
    this.model.Remarks = "";
    this.model.CustomerAddress = "";
    this.model.GrnCompanyId = this.CompanyId;
    this.dynamicArray = [];
    this.totalSumAmount = 0;
    this.model.TransporterId = "";
    this.model.TransporterName = "";
    this.model.TransporterGSTNo = "";

    this.addRow();

  }

  //#region  Crn Edit Detail
  onEditBtnClick(e) {
    this.isShownPOList = true;
    this.isShownPOEdit = false;
    this.isdisabled = true;
    this.IsHideShowCancelBtn = true;
    this.isShownGrnCompany = true;
    this.IsPreviewDisable = false;
    this.IsDownloadPrintHideShow = true;
    this.CRNId = e.rowData.CRNId;
    this.GetUserPageRight(this.CRNId);
    this.GRNCRNRowData = [];
    var objPoSearchModel = new SaveGRNCRNModelDetail();
    objPoSearchModel.GrnCrnId = this.CRNId;
    this._GrncrnService.GetCRNEditListById(objPoSearchModel).subscribe((data) => {
      // this.Loader.hide();
      this.isEdit = true;
      this.GRNCRNRowData = data.Data;
      this.InvChallanEditFile = 0;
      this.InvChallanFile = this.GRNCRNRowData[0].ChallanPdffile;
      this.GateEditFile = 0;
      this.GatePdfFile = this.GRNCRNRowData[0].GatePdffile;
      this.LREditFile = 0;
      this.LRFile = this.GRNCRNRowData[0].CLRPdfile;
      this.model.EditChallanPdffile = this.GRNCRNRowData[0].EditChallanPdffile;;
      this.model.EditGatePdffile = this.GRNCRNRowData[0].EditGatePdffile;
      this.model.EditCLRPdfile = this.GRNCRNRowData[0].EditCLRPdfile;

      this.TableId = this.GRNCRNRowData[0].CRNId;
      this.ManueId = this.PageMenuId
      this.CreateName = data.Data[0].CreateName;
      this.CreatedDate = data.Data[0].CreatedDate;
      this.ModifiedName = data.Data[0].ModifiedName;
      this.ModifiedDate = data.Data[0].ModifiedDate;

      // this.ŚŚŚŚŚŚ=this.sanitizer.bypassSecurityTrustResourceUrl(this.GRNCRNRowData[0].ChallanPdffile);
      // this.GatePdfFile=this.sanitizer.bypassSecurityTrustResourceUrl(this.GRNCRNRowData[0].GatePdffile);
      // this.LRFile=this.sanitizer.bypassSecurityTrustResourceUrl(this.GRNCRNRowData[0].CLRPdfile);
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
      this.GetCustomerName();
      this.model.CustomerId = '' + this.GRNCRNRowData[0].CustomerId + '';
      this.model.CustomerAddress = this.GRNCRNRowData[0].CustomerAddress;

      this.model.EditStateId = '' + this.GRNCRNRowData[0].WHState_Id + ''
      if (data.WHData.length > 0) {
        this.GRNCRNWHList = data.WHData;
      }
      this.model.SelectedGRNCRNWH = '' + this.GRNCRNRowData[0].WH_Id + ''
      this.model.WHAddress = data.WHData[0].WHAddress;
      this.model.ActivityTypeId = this.GRNCRNRowData[0].Flag;
      if (this.GRNCRNRowData[0].GRNDate != null) {
        var GrnDate = this.GRNCRNRowData[0].GRNDate.split('/');
        this.model.Podate = { year: parseInt(GrnDate[2]), month: parseInt(GrnDate[1]), day: parseInt(GrnDate[0]) };
      }
      this.model.GRNCRNNo = this.GRNCRNRowData[0].CRNNo;
      this.model.ChallanNo = this.GRNCRNRowData[0].InvChallanNo;
      var InvChallanNoDate = this.GRNCRNRowData[0].InvChallanDate.split('/');
      this.model.ChallanDate = { year: parseInt(InvChallanNoDate[2]), month: parseInt(InvChallanNoDate[1]), day: parseInt(InvChallanNoDate[0]) };
      this.model.GateEntryNo = this.GRNCRNRowData[0].GateEntryNo;
      if (this.GRNCRNRowData[0].GateEntryDate != null) {
        var GateEntryDate = this.GRNCRNRowData[0].GateEntryDate.split('/');
        this.model.GateEntryDate = { year: parseInt(GateEntryDate[2]), month: parseInt(GateEntryDate[1]), day: parseInt(GateEntryDate[0]) };
      }

      if (this.GRNCRNRowData[0].IsActive == 0) {
        this.IsSaveButtonDisable = true;
      } else {
        this.IsSaveButtonDisable = false;
      }
      this.model.TransporterId = this.GRNCRNRowData[0].TransportId;
      this.model.TransporterName = this.GRNCRNRowData[0].TranspoterName;
      this.model.TransporterGSTNo = this.GRNCRNRowData[0].TrasporationGSTNO;
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
  }

  BindGrnCrnItemListArray(GRNCRNRowData: any) {
    this.dynamicArray = [];
    for (var i = 0, len = GRNCRNRowData.length; i < len; i++) {
      var objdynamic = new GRNDynamicItemGrid();
      objdynamic.ItemNameId = GRNCRNRowData[i].ItemNameId;
      objdynamic.Id = GRNCRNRowData[i].Id;
      objdynamic.EditItemCode = JSON.parse(GRNCRNRowData[i].ItemCodeList)
      objdynamic.EditItemMake = JSON.parse(GRNCRNRowData[i].ItemMakeList);
      objdynamic.UnitList = JSON.parse(GRNCRNRowData[i].UnitList);
      objdynamic.ItemDescription = GRNCRNRowData[i].ItemDescription;
      objdynamic.SubDescription = GRNCRNRowData[i].SubDescription;
      objdynamic.UnitName = GRNCRNRowData[i].UnitMaster_Id;
      objdynamic.EqTypeId = GRNCRNRowData[i].EquipmentType_Id;
      /// Hemant Tyagi
      //objdynamic.GSerialNumbers = JSON.parse(GRNCRNRowData[i].GSerialNumbers);
      if (GRNCRNRowData[i].SerialNoList === null) {
        objdynamic.GSerialNumbers = [];
      } else {
        objdynamic.GSerialNumbers = JSON.parse(GRNCRNRowData[i].SerialNoList);
      }

      objdynamic.Rate = parseFloat(GRNCRNRowData[i].ItemRate).toFixed(2);
      objdynamic.ChallanQty = GRNCRNRowData[i].ChallanQty;
      objdynamic.AcceptedQty = GRNCRNRowData[i].AcceptedQty;
      objdynamic.ReceivedQty = GRNCRNRowData[i].ReceivedQty;
      objdynamic.RejectedQty = GRNCRNRowData[i].RejectedQty;
      objdynamic.ExcessShort = GRNCRNRowData[i].ExcessShort;
      objdynamic.TotalAmount = GRNCRNRowData[i].TotalAmount;
      objdynamic.HSN = GRNCRNRowData[i].HSNCode;
      objdynamic.ItemId = GRNCRNRowData[i].ItemId;
      objdynamic.ItemMakeId = GRNCRNRowData[i].MakeMaster_Id;

      this.dynamicArray.push(objdynamic);
      //objdynamic.TotalAmount=parseFloat(ItemEditDataArr[i].TotalAmount).toFixed(2);
      this.fnBindItemGrossToatl();
    }




    //this.fnBindItemGrossToatl();
  }
//#endregion
  GatePdfViewfileClick() {
    window.open(this.ViewGatePdffile);
  }

  ReceivingViewfileClick() {
    window.open(this.ViewChallanPdffile);
  }

  LRPdfViewfileClick() {
    window.open(this.ViewCLRPdfile);
  }

  GRNCRNDetailBack() {
    this.ClearGrnCrnDetail();
    this.isShownPOList = false;
    this.isShownPOEdit = true;
    this.IsLRFile = false;
    this.IsReceivingFile = false;
    this.IsGatefile = false;
    this.totalSumAmount = 0;
  }

  //#endregion
  BindVendorOrWhAddess(para: string, val: string): void {
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
  }

  BindTransporterTypeDetail() {
    ////
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

  ChangeEqupment(Id: any, index: any) {
    var FilterData = this.EquipmentTypeList.filter(
      m => m.id === parseInt(Id));
    this.dynamicArray[index].EqpType = FilterData[0].itemName;
    $('#tblOne > tbody >tr').each(function () {
      var valueName = $(this).find('.EqType').val();
      if (valueName != '0') {
        $(this).find('.EqType').css('border-color', '');
      }
    });
  }

  ChangeUnit(Id: any, index: any) {
    $('#tblOne > tbody >tr').each(function () {
      var valueName = $(this).find('.UnitName').val();
      if (valueName != '0') {
        $(this).find('.UnitName').css('border-color', '');
      }
    });
    var FilterData = this.dynamicArray[index].UnitList.filter(
      m => m.Id === parseInt(Id));
    this.dynamicArray[index].Unit = FilterData[0].UnitName;
  }
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
      objApprovelStatusModel.ApprovalStatus_Id = this.CRNId;
      objApprovelStatusModel.Table_Id = this.model.InCaseReason;
      objApprovelStatusModel.Flag = "CRN";
      this._MaterialMovementService.UpadateCancelDispatch(objApprovelStatusModel).subscribe(data => {
        if (data.Status == 1) {
          this.IsHideShowCancelBtn = false;
          jQuery('#Cancleconfirm').modal('hide');
          setTimeout(() => {
            alert('Your CRN SuccessFully Cancel')
          }, 300);
        }

      });
    } catch (Error) {
      this._Commonservices.ErrorFunction(this.UserName, Error.message, "UpadateCancelDispatch", "WHTOSite");
    }
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
  TransporteGSTNoKeyPress() {
    $("#txtTransporterGSTNo").css('border-color', '');
  }
  // ChangeUnit() {

  // }
  TransporterNameKeyPress() {
    $("#txtTransporterName").css('border-color', '');
  }

  ChangeTransporter(Id: any) {
    $("#txtTransporterId").css('border-color', '');
    $("#txtTransporterName").css('border-color', '');
    $("#txtTransporterGSTNo").css('border-color', '');
    var result = this.TransporterTypeDetail.filter(element => {
      return element.id === parseInt(Id);
    });
    this.model.PreviewSelectTransporter = result[0].TransporterName;
    if (Id == 1 || Id == "0") {
      this.model.TransporterName = "";
      this.model.TransporterGSTNo = "";
    } else {
      var TransPorterGst = this.TransporterTypeDetail.filter(
        m => m.id === parseInt(Id));
      this.model.TransporterGSTNo = TransPorterGst[0].GSTIN;
      this.model.TransporterName = TransPorterGst[0].TransporterName;
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


  //#region  CRN Detail Save 
  SaveGRNCRNDetail() {
    //this.Loader.show();
    if (this.ValidationGRNCRN() == 1) {
      return false;
    }
    var objSaveGRNCRNModelDetail = new SaveGRNCRNModelDetail();
    if (checkUndefined(this.CRNId) != '') {
      objSaveGRNCRNModelDetail.GrnCrnId = this.CRNId;
    }
    objSaveGRNCRNModelDetail.UserId = this.UserId;
    objSaveGRNCRNModelDetail.CustomerId = this.model.CustomerId;
    objSaveGRNCRNModelDetail.CustomerAddress = this.model.CustomerAddress;
    objSaveGRNCRNModelDetail.CompanyId = this.CompanyId;
    objSaveGRNCRNModelDetail.GRNNo = this.model.GRNCRNNo;
    var GrnSrnDate = checkUndefined(this.model.GRNdate);
    if (GrnSrnDate != '') {
      objSaveGRNCRNModelDetail.GRNDate = GrnSrnDate.day + '/' + GrnSrnDate.month + '/' + GrnSrnDate.year;
    } else {
      objSaveGRNCRNModelDetail.GRNDate = '';
    }

    objSaveGRNCRNModelDetail.WHId = this.model.SelectedGRNCRNWH;
    objSaveGRNCRNModelDetail.InvChallanNo = this.model.ChallanNo;
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
      objSaveGRNCRNModelDetail.GateEntryDate = '';
    }
    objSaveGRNCRNModelDetail.TransportId = this.model.TransporterId;
    objSaveGRNCRNModelDetail.TrasporationGSTNO = this.model.TransporterGSTNo;
    objSaveGRNCRNModelDetail.TranspoterName = this.model.TransporterName;
    objSaveGRNCRNModelDetail.VehicleNo = this.model.VehicleNo;
    objSaveGRNCRNModelDetail.IndentorName = this.model.IndentorName;
    objSaveGRNCRNModelDetail.LRNo = this.model.LRNo;

    var GrnSrnLrDate = checkUndefined(this.model.LRdate);
    if (GrnSrnLrDate != '') {
      objSaveGRNCRNModelDetail.LRDate = GrnSrnLrDate.day + '/' + GrnSrnLrDate.month + '/' + GrnSrnLrDate.year;
    } else {
      objSaveGRNCRNModelDetail.LRDate = '';
    }
    objSaveGRNCRNModelDetail.Remarks = this.model.Remarks;
    objSaveGRNCRNModelDetail.Flag = "9";
    this.GrndynamicItemArray = [];
    for (var i = 0, len = this.dynamicArray.length; i < len; i++) {
      var objGRNDynamicItemGrid = new GRNDynamicItemModel();
      objGRNDynamicItemGrid.RowId = i;
      objGRNDynamicItemGrid.Id = this.dynamicArray[i].Id;
      objGRNDynamicItemGrid.ItemId = this.dynamicArray[i].ItemId;
      objGRNDynamicItemGrid.ChallanQty = this.dynamicArray[i].ChallanQty;
      objGRNDynamicItemGrid.ReceivedQty = this.dynamicArray[i].ReceivedQty;
      objGRNDynamicItemGrid.AcceptedQty = this.dynamicArray[i].AcceptedQty;
      objGRNDynamicItemGrid.Rate = this.dynamicArray[i].Rate;
      objGRNDynamicItemGrid.EqTypeId = this.dynamicArray[i].EqTypeId;
      objGRNDynamicItemGrid.UnitId = this.dynamicArray[i].UnitName;
      objGRNDynamicItemGrid.HSN = this.dynamicArray[i].HSN;
      //objGRNDynamicItemGrid.GSerialNumbers = this.dynamicArray[i].GSerialNumbers;
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
      objGRNDynamicItemGrid.SubDescription = this.dynamicArray[i].SubDescription;
      this.GrndynamicItemArray.push(objGRNDynamicItemGrid)
    }
    objSaveGRNCRNModelDetail.GRNItemDetailList = this.GrndynamicItemArray;
    var CurrentDate = this.datePipe.transform(Date(), "yyyyMMddhhmmss");
    var formdata = new FormData();
    if (this.InvChallanEditFile == 1) {
      formdata.append('Challanfile', this.ChallanUploadFile, 'CRNInvoice' + this.model.ChallanNo + CurrentDate + this.ChallanUploadFile.name);
    } else if (this.InvChallanEditFile == 0) {
      formdata.append('ChallanEditfile', this.model.EditChallanPdffile);
    }

    if (this.GateEditFile == 1) {
      formdata.append('GatePdffile', this.GatePdfUploadFile, 'CRNGateEntry' + CurrentDate + this.GatePdfUploadFile.name);
    } else if (this.GateEditFile == 0) {
      formdata.append('GateEditfile', this.model.EditGatePdffile);
    }
    if (this.LREditFile == 1) {
      formdata.append('LRPdfFile', this.LRPdfUploadFile, 'CRNLR' + CurrentDate + this.LRPdfUploadFile.name);
    } else if (this.LREditFile == 0) {
      formdata.append('LREditfile', this.model.EditCLRPdfile);
    }
    for (var i = 0; i < this.FaultyFileArray.length; i++) {
      for (var j = 0; j < this.FaultyFileArray[i].FaultyFile.length; j++) {
        formdata.append("FaultyfileUpload", this.FaultyFileArray[i].FaultyFile[j], 'FaultyImage_' + this.dynamicArray[i].ItemId + '_' + this.FaultyFileArray[i].RowId + CurrentDate);
      }

    }
    formdata.append('jsonDetail', JSON.stringify(objSaveGRNCRNModelDetail));
    this._GrncrnService.AddUpdateCRNDetail(formdata).subscribe(data => {
      if (data.Status == 1) {
        jQuery("#confirm").modal('hide');
        this.succesMessage = "Your data has been save successfully with CRN No-" + data.Remarks + "";
        this.IsSuccess = true;
        setTimeout(() => {
          this.IsSuccess = false;
        }, 5000);
        this.ClearGrnCrnDetail();
        this.ClearPdfPath();
      } else if (data.Status == 2) {
        jQuery("#confirm").modal('hide');
        this.succesMessage = data.Remarks;
        this.IsSuccess = true;
        setTimeout(() => {
          this.IsSuccess = false;
        }, 5000);
        //this.GRNCRNDetailBack();
      } else if (data.Status == 3) {
        jQuery("#confirm").modal('hide');
        this.succesMessage = data.Remarks;
        this.IsSuccess = true;
        setTimeout(() => {
          this.IsSuccess = false;
        }, 5000);
        //this.GRNCRNDetailBack();
      }
    });

    setTimeout(() => {
      this.Loader.hide();
    }, 1500);


  }

  ClearPdfPath() {
    this.inputLRPDF.nativeElement.value = "";
    this.inputGatePDF.nativeElement.value = "";
    this.inputChallanPDF.nativeElement.value = "";
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
    var execssqty = 0.0;
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

  ChallanQtyOnblur(index: any) {
    for (var i = 0, len = this.dynamicArray.length; i < len; i++) {
      this.dynamicArray[index].AcceptedQty = "0.00";
      this.dynamicArray[index].ReceivedQty = "0";
      this.dynamicArray[index].RejectedQty = "0";
      this.dynamicArray[index].ExcessShort = "0";
      this.dynamicArray[index].Rate = "0.00";
    }
    this.fnBindItemGrossToatl();
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

  }
  //#endregion
  //#region  search CRN List and Export
  SearchCRNList(para: any) {
    var objSearchGRNCRNPoModel = new SearchGRNCRNPoModel();
    objSearchGRNCRNPoModel.CompanyId = this.CompanyId;
    objSearchGRNCRNPoModel.VendorId = this.CommonSearchPanelData.VendorId;
    objSearchGRNCRNPoModel.WHId = this.CommonSearchPanelData.WHId;
    objSearchGRNCRNPoModel.ItemId = this.CommonSearchPanelData.ItemId;
    objSearchGRNCRNPoModel.Startdate = this.CommonSearchPanelData.Startdate;
    objSearchGRNCRNPoModel.Enddate = this.CommonSearchPanelData.Enddate;
    objSearchGRNCRNPoModel.State_Id = this.CommonSearchPanelData.State_Id;
    objSearchGRNCRNPoModel.PoStatusId = 2;
    objSearchGRNCRNPoModel.MakeId = this.CommonSearchPanelData.MakeId;
    objSearchGRNCRNPoModel.ItemCodeId = this.CommonSearchPanelData.ItemCodeId;
    objSearchGRNCRNPoModel.CapacityId = this.CommonSearchPanelData.CapacityId;
    objSearchGRNCRNPoModel.DescriptionId = this.CommonSearchPanelData.DescriptionId;
    objSearchGRNCRNPoModel.GRNCRNSRNSTNNo = this.model.CRNNo;
    objSearchGRNCRNPoModel.InvoiceNo = this.model.InvoiceNo;
    objSearchGRNCRNPoModel.Flag = para;
    if (para == "Export") {
      this.Exportloading = true;
    }
    this._GrncrnService.GetCRNList(objSearchGRNCRNPoModel).subscribe(data => {
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
            this._PurchaseOrderService.exportAsExcelFile(data.Data, 'CRNDetail' + CurrentDate);
          } else {
            alert('Please first Search Data');
          }
        }
      }
    });
  }
  //#endregion

  addRow() {
    var objNewItemGrid = new GRNDynamicItemGrid();
    objNewItemGrid.ItemNameId = "0";
    objNewItemGrid.ItemId = "0";
    objNewItemGrid.ItemMakeId = "0";
    objNewItemGrid.Rate = "0.00";
    objNewItemGrid.TotalAmount = "0.00";
    objNewItemGrid.ChallanQty = "0";
    objNewItemGrid.AcceptedQty = "0";
    objNewItemGrid.ReceivedQty = "0";
    objNewItemGrid.RejectedQty = '0';
    objNewItemGrid.ExcessShort = '0';
    objNewItemGrid.EqTypeId = "0";
    objNewItemGrid.UnitName = "0";
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
      return true;
    }
  }

  //#region  Create GRN PDf
  CreateCRNPdf(FlagValue: any) {
    try {
      this.CRNPdfData = null;
      this.GRNCRNPdfItemData = null;
      var ChallanNovalue = this._Commonservices.checkUndefined(this.CRNId);
      if (ChallanNovalue == '') {
        alert('Please Create New CRN');
        return false;
      } else {
        var objdropdownmodel = new DropdownModel();
        objdropdownmodel.User_Id = 0;
        objdropdownmodel.Parent_Id = this.CRNId;
        objdropdownmodel.Company_Id = this.CompanyId;
        objdropdownmodel.Flag = "CRN";
        this._GrncrnService.GetCRNPdfDetailByCRNId(objdropdownmodel).subscribe((data) => {
          if (data.Status == 1) {
            this.CRNPdfData = data.Data[0];
            this.GRNCRNPdfItemData = data.ItemData;
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
              objdynamicPdf.HSN = this.GRNCRNPdfItemData[i].HSNCode;
              this.dynamicArrayForPdf.push(objdynamicPdf);
              //objdynamic.TotalAmount=parseFloat(ItemEditDataArr[i].TotalAmount).toFixed(2);
            }
            if (FlagValue == 1) {
              this.generatePDF('download');
            } else {
              this.generatePDF('print');
            }
          }
        });
      }
    } catch (Error) {
      var objWebErrorLogModel = new WebErrorLogModel();
      objWebErrorLogModel.ErrorBy = this.UserId;
      objWebErrorLogModel.ErrorMsg = Error.message;
      objWebErrorLogModel.ErrorFunction = "CreateCRNPdfData";
      objWebErrorLogModel.ErrorPage = "CRN";
      // this._GlobalErrorHandlerService.handleError(objWebErrorLogModel);
    }
  }

  generatePDF(action: any) {
    let docDefinition = {
      pageOrientation: 'landscape',
      //pageMargins: [ 40, 60, 40, 60 ],
      content: [
        {
          margin: [-15, 30, 0, 0],
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
                              text: [
                              ]
                            },
                            {
                              margin: [160, 0, 0, 0],
                              width: 500,
                              text: [
                                { text: `${this.CRNPdfData.CompanyName}`, fontSize: 13, bold: true, },
                              ]
                            },
                            {
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
                              image: `snow`, width: 76,
                            },

                            {
                              margin: [180, 0, 0, 0],
                              width: 380,
                              text: [
                                { text: 'Address: ', fontSize: 10, },
                                { text: `${this.CRNPdfData.CompanyAddress}`, fontSize: 10 },
                                '\n',
                                { text: `Customer GOODS RECEIPT NOTE`, fontSize: 12, bold: true, alignment: 'center', },

                              ]
                            },

                            {
                              // alignment: 'right',
                              margin: [84, 0, 0, 0],
                              text: [
                                { text: `CRN No     ${this.CRNPdfData.CRNNo}`, fontSize: 10, width: 180 },
                                '\n',
                                { text: `Date               ${this.CRNPdfData.CRNDate}`, fontSize: 10, width: 180, },
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
                              width: 260,
                              text: [
                                { text: `Customer GSTIN            ${this.CRNPdfData.CustomerGST}`, fontSize: 10 },
                              ]
                            },

                            {
                              margin: [40, 0, 0, 0],
                              width: 270,
                              text: [
                                { text: `Inv./Challan No.       ${this.CRNPdfData.InvChallanNo}`, fontSize: 10 },
                              ]
                            },

                            {
                              margin: [10, 0, 0, 0],
                              width: 180,
                              text: [
                                { text: ` Inv/Challan Date             ${this.CRNPdfData.InvChallanDate}`, fontSize: 10 },
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
                              width: 260,
                              text: [
                                { text: `Customer Name`, fontSize: 10 },
                                { text: `         ${this.CRNPdfData.CustomerName}`, fontSize: 10, bold: true },
                                // {text:`Supplier Name         ${this.CRNPdfData.SupplierName}`, fontSize:10},
                              ]
                            },

                            {
                              margin: [40, 0, 0, 0],
                              width: 270,
                              text: [
                                { text: `Gate Entry No           ${this.CRNPdfData.GateEntryNo}`, fontSize: 10 },
                              ]
                            },

                            {
                              margin: [10, 0, 0, 0],
                              width: 180,
                              text: [
                                { text: `Gate Entry Date               ${this.CRNPdfData.GateEntryDate}`, fontSize: 10 },
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
                              width: 260,
                              margin: [0, 0, 0, 0],
                              text: [
                                //  { text:`Address                     ${this.CRNPdfData.SupplierAddress}`, fontSize:10},
                                { text: `Address`, fontSize: 10, bold: true, },
                                { text: `                     ${this.CRNPdfData.CustomerAddress}`, fontSize: 10 },
                              ]
                            },

                            {
                              margin: [40, 0, 0, 0],
                              width: 270,
                              text: [
                                { text: '', fontSize: 10 },
                              ]
                            },

                            {
                              margin: [10, 0, 0, 0],
                              width: 180,
                              text: [
                                { text: '', fontSize: 10 },
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
            widths: ['3%', '7%', '26.1%', '6%', '4%', '6%', '6%', '6%', '6%', '7%', '7%', '9%',],
            body: [
              ['SL. No', 'Item Code', 'Material Description ', 'HSN', 'UOM', ' Challan Qty', 'Received Qty', 'Accepted Qty', 'Rejected Qty', 'Excess/Short', 'Rate', 'Value'],
              ...this.dynamicArrayForPdf.map(p => ([{ text: p.RowId }, p.ItemCode, { text: p.ItemDescription }, { text: p.HSN }, { text: p.UnitName }, { text: p.ChallanQty }, { text: p.ReceivedQty }, { text: p.AcceptedQty }, { text: p.RejectedQty }, { text: p.ExcessShort }, { text: p.Rate }, { text: p.TotalAmount }])),
              // [{}, { text: '\n', colSpan: 1, alignment: 'left', },{ text: '' }, { text: '' }, { text: '' }, { text: '' }, { text: '' }, { text: '' }, { text: '' }, { text: '' }, { text: '' }, { text: '' }],
              [{}, { text: 'Total Amount', colSpan: 2, alignment: 'center', bold: true }, { text: '' }, { text: '' }, { text: '' }, { text: '' }, { text: '' }, { text: '', }, { text: '' }, { text: '' }, { text: '' }, { text: this._Commonservices.thousands_separators(`${this.CRNPdfData.TotalSumAmount.toFixed(2)}`) + '₹', bold: true }]
            ]
          }
        },

        {
          margin: [-15, 0, 0, 0],
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
                              width: 260,
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
                              width: 260,
                              text: [
                                { text: `LR No                    ${this.CRNPdfData.LRNo}`, fontSize: 10 },
                              ]
                            },
                            {
                              margin: [40, 0, 0, 0],
                              width: 250,
                              text: [
                                { text: `LR Date            ${this.CRNPdfData.LRDate}`, fontSize: 10 },
                              ]
                            },
                            {
                              margin: [10, 0, 0, 0],
                              width: 200,
                              text: [
                                { text: `Remarks:           ${this.CRNPdfData.Remarks}`, fontSize: 10 },
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
                              width: 260,
                              margin: [0, 0, 0, 0],
                              text: [
                                //  { text:`Address                     ${this.CRNPdfData.SupplierAddress}`, fontSize:10},

                                { text: `Transpoter           ${this.CRNPdfData.TranspoterName}`, fontSize: 10 },
                              ]
                            },

                            {
                              margin: [40, 0, 0, 0],
                              width: 250,
                              text: [
                                { text: `P.R Dept          ${this.CRNPdfData.PRDept}`, fontSize: 10 },
                              ]
                            },

                            {
                              margin: [10, 0, 0, 0],
                              width: 200,
                              text: [
                                // {text:`PO Date                             ${this.CRNPdfData.PoDate}`, fontSize:10},
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
                              width: 260,
                              margin: [0, 0, 0, 0],
                              text: [
                                { text: `Vehicle No           ${this.CRNPdfData.VehicleNo}`, fontSize: 10 },
                              ]
                            },

                            {
                              margin: [40, 0, 0, 0],
                              width: 250,
                              text: [
                                { text: `Material received by     ${this.CRNPdfData.IndenterName}`, fontSize: 10 },
                              ]
                            },

                            {
                              margin: [10, 0, 0, 0],
                              width: 200,
                              text: [
                                // {text:`PO Date                             ${this.CRNPdfData.PoDate}`, fontSize:10},
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
        {
          columns: [
            { text: 'This is a Computer Generated Document', alignment: 'center', fontSize: 9, }
          ]
        }
      ],

      styles: {
        header: {
          fontSize: 10,
          bold: true,
          margin: [190, -40, 0, 0]
        },

        ItemTableHeader: {
          fontSize: 10,
          alignment: 'center',
          margin: [-15, 0, 0, 0],
          border: [0, 0, 0, 0],
        },
      },
      images: {
        snow: `${this.CRNPdfData.Logo}`,
        // snow: 'http://localhost:4200/assets/logo.jpg',
        //snow: 'http://scm.astnoc.com/assets/logo.jpg'
      },
    }
    if (action === 'download') {
      pdfMake.createPdf(docDefinition).download();
    } else if (action === 'print') {
      pdfMake.createPdf(docDefinition).print();
    } else {
      pdfMake.createPdf(docDefinition).open();
    }
  }

  //#endregion

  //#region  Validation GRN CRN Part
  HSNKeyPress() {
    $('#tblOne > tbody  > tr').each(function () {
      var valueItem = $(this).find('.HSN').val();
      if (valueItem != '0') {
        $(this).find('.HSN').css('border-color', '');
      }
    });
  }

  ValidationGRNCRN() {
    var flag = 0;
    if ($('#txtCustomerName').val() == "0" || $('#txtCustomerName').val() == undefined) {
      $('#txtCustomerName').css('border-color', 'red');
      $('#txtCustomerName').focus();
      flag = 1;
    } else {
      $("#txtCustomerName").css('border-color', '');
    }
    if ($('#txtCustomerAddress').val() == "" || $('#txtCustomerAddress').val() == undefined) {
      $('#txtCustomerAddress').css('border-color', 'red');
      $('#txtCustomerAddress').focus();
      flag = 1;
    } else {
      $("#txtCustomerAddress").css('border-color', '');
    }
    // if ($('#txtGRNCRNNo').val() == "" || $('#txtGRNCRNNo').val() == undefined) {
    //   $('#txtGRNCRNNo').css('border-color', 'red');
    //   $('#txtGRNCRNNo').focus();
    //   flag = 1;
    // } else {
    //   $("#txtGRNCRNNo").css('border-color', '');
    // }


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
    if ($('#txtTransporterId').val() == "" || $('#txtTransporter').val() == "0") {
      $('#txtTransporterId').css('border-color', 'red');
      $('#txtTransporterId').focus();
      flag = 1;
    } else {
      $("#txtTransporterId").css('border-color', '');
    }
    if ($('#txtTransporterName').val() == "" || $('#txtTransporterName').val() == "0") {
      $('#txtTransporterName').css('border-color', 'red');
      $('#txtTransporterName').focus();
      flag = 1;
    } else {
      $("#txtTransporterName").css('border-color', '');
    }
    if ($('#txtTransporterGSTNo').val() == "" || $('#txtTransporterGSTNo').val() == "0") {
      $('#txtTransporterGSTNo').css('border-color', 'red');
      $('#txtTransporterGSTNo').focus();
      flag = 1;
    } else {
      $("#txtTransporterGSTNo").css('border-color', '');
    }
    if ($('#txtVehicleNo').val() == "" || $('#txtVehicleNo').val() == undefined) {
      $('#txtVehicleNo').css('border-color', 'red');
      $('#txtVehicleNo').focus();
      flag = 1;
    } else {
      $("#txtVehicleNo").css('border-color', '');
    }
    if ($('#txtIndentorName').val() == "" || $('#txtIndentorName').val() == undefined) {
      $('#txtIndentorName').css('border-color', 'red');
      $('#txtIndentorName').focus();
      flag = 1;
    } else {
      $("#txtIndentorName").css('border-color', '');
    }
    if ($('#txtLRNo').val() == "" || $('#txtLRNo').val() == undefined) {
      $('#txtLRNo').css('border-color', 'red');
      $('#txtLRNo').focus();
      flag = 1;
    } else {
      $("#txtLRNo").css('border-color', '');
    }

    if (this._Commonservices.checkUndefined(this.CRNId) == "" || this._Commonservices.checkUndefined(this.CRNId) == 0) {
      var LRFile = this._Commonservices.checkUndefined(this.LRPdfUploadFile);
      if (LRFile == "" || LRFile == null) {
        flag = 1;
        alert('Please Select  LR File');
      }

      var GateFile = this._Commonservices.checkUndefined(this.GatePdfUploadFile);
      if (GateFile == "" || GateFile == null) {
        flag = 1;
        alert('Please Select  Gate Entery File');
      }
      var ChallanFile = this._Commonservices.checkUndefined(this.ChallanUploadFile);
      if (ChallanFile == "" || ChallanFile == null) {
        flag = 1;
        alert('Please Select Incoice Challan Upload File');
      }
    }


    if (this.model.LRdate == "" || this.model.LRdate == null || this.model.LRdate == undefined) {
      $('#txtLRdate').css('border-color', 'red');
      flag = 1;
    } else {
      $("#txtLRdate").css('border-color', '');
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
      var value = $(this).find('.itmsRate').val();
      if (value == '0.00' || value == '0') {
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
      if (valueAcceptedQty == '0' || valueAcceptedQty == '') {
        flag = 1;
        $(this).find('.AcceptedQty').css('border-color', 'red');
      }
      var valueUnitName = $(this).find('.UnitName').val();
      if (valueUnitName == '0') {
        flag = 1;
        $(this).find('.UnitName').css('border-color', 'red');
      }
      var valueEqType = $(this).find('.EqType').val();
      if (valueEqType == '0') {
        flag = 1;
        $(this).find('.EqType').css('border-color', 'red');
      }
      var valueHSN = $(this).find('.HSN').val();
      if (valueHSN == '0' || valueHSN == '') {
        flag = 1;
        $(this).find('.HSN').css('border-color', 'red');
      }

      //  var valueRejectedQty=$(this).find('.RejectedQty').val();
      //  if(valueRejectedQty==''){
      //   flag=1;
      //   $(this).find('.RejectedQty').css('border-color', 'red');
      //  }
      //  var valueExcessShort=$(this).find('.ExcessShort').val();
      //  if(valueExcessShort==''){
      //   flag=1;
      //   $(this).find('.ExcessShort').css('border-color', 'red');
      //  }

      //  var valueamt=$(this).find('.itmsTotalAmount').val();
      //  if(valueamt=='0.00'){
      //   $(this).find('.itmsTotalAmount').css('border-color', 'red');
      //  }
    });

    //if (flag == 1) {
    //return flag;
    //}
    return flag;
  }




  ChallanQtyKeyPress() {
    $('#tblOne > tbody  > tr').each(function () {
      var valueChallanQty = $(this).find('.ChallanQty').val();
      if (valueChallanQty != '0') {
        $(this).find('.ChallanQty').css('border-color', '');
      }
    });
  }

  // ReceivedQtyKeyPress()
  // {
  //   $('#tblOne > tbody  > tr').each(function() {
  //     var valueReceivedQty=$(this).find('.ReceivedQty').val();
  //  if(valueReceivedQty!=''){
  //   $(this).find('.ReceivedQty').css('border-color', '');
  //  }
  //   });
  // }

  ReceivedQtyKeyPress() {
    $('#tblOne > tbody  > tr').each(function () {
      var valueReceivedQty = $(this).find('.ReceivedQty').val();
      if (valueReceivedQty != '0') {
        $(this).find('.ReceivedQty').css('border-color', '');
      }
    });
  }

  ChangeCustomerName(CustomerId: string) {
    $("#txtCustomerName").css('border-color', '');
    // var FilterData = this.AutoCompleteSiteCustomerList.filter(
    //   m => m.id === parseInt(CustomerId));
    // this.model.CustomerAddress = FilterData[0].Address;
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
          this.CustomerAddressData = item.Data,
            this.model.CustomerAddress = item.Data[0].Address;
        }else{
          this.model.CustomerAddress = "";
        }
      }, error => {
        this._Commonservices.ErrorFunction(this.UserName, error.message, "ChangeCustomerName", "CRN");
      });
    } catch (Error) {
      this._Commonservices.ErrorFunction(this.UserName, Error.message, "ChangeCustomerName", "CRN");
    }
    var FilterData = this.AutoCompleteSiteCustomerList.filter(
      m => m.id === parseInt(CustomerId));
    this.model.CustomerAddress = FilterData[0].Address;
    this.model.CustomerName = FilterData[0].ClientName;
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
    $("#txtCustomerAddress").css('border-color', '');
  }


  // ChangeWH()
  // {
  //   $("#txtWH").css('border-color', '');
  // }
  ChallanNoKeyPress() {
    $("#txtChallanNo").css('border-color', '');
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


  //#endregion


}


function checkUndefined(x) {
  var x;
  if (typeof x === "undefined") {
    x = '';
  }
  return x;
}
function thousands_separators(num) {
  return num.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
  // var num_parts = num.toString().split(".");
  // num_parts[0] = num_parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  // return num_parts.join(".");
}