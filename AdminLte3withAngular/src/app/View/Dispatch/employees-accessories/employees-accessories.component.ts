// import { DatePipe } from '@angular/common';
import { DatePipe } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { first } from 'rxjs/internal/operators/first';
import { approvalTooltipComponent } from 'src/app/renderer/Approvaltooltip.component';
import { ButtonRendererComponent } from 'src/app/renderer/button-renderer.component';
import { CustomTooltipComponent } from 'src/app/renderer/customtooltip.component';
import { FileRendererComponent } from 'src/app/renderer/file-renderer.component';
import { CommonService } from 'src/app/Service/common.service';
import { DispatchPdfServiceService } from 'src/app/Service/dispatch-pdf-service.service';
import { EmployeeAccessoriesService } from 'src/app/Service/employee-accessories.service';
import { GlobalErrorHandlerServiceService } from 'src/app/Service/global-error-handler-service.service';
import { MasterservicesService } from 'src/app/Service/masterservices.service';
import { MaterialMovementService } from 'src/app/Service/material-movement.service';
import { PurchaseOrderService } from 'src/app/Service/purchase-order.service';
import { TimePeriodService } from 'src/app/Service/time-period.service';
import { CommonStaticClass, CompanyStateVendorItemModel, DropdownModel, WebErrorLogModel } from 'src/app/_Model/commonModel';
import { SearchDispatchTrackerModel } from 'src/app/_Model/DispatchModel';
import { SearchEmployeeAccessoriesModel, ToolkitAccessoriesItemDet } from 'src/app/_Model/employeeAccessoriesModel';
import { EmpToolkitModel, ItemEquipmentDetail } from 'src/app/_Model/MastersModel';
import { CellNo, DynamicItemGrid, GSerialNumber, VendorOrWhModel } from 'src/app/_Model/purchaseOrderModel';
import { CompanyModel } from 'src/app/_Model/userModel';
import * as XLSX from 'xlsx';
import * as $ from 'jquery';
import { identifierName } from '@angular/compiler';
import { async } from 'rxjs/internal/scheduler/async';
import { Observable, Subscription } from 'rxjs';
import { promise } from 'protractor';
import { promises } from 'dns';
declare var jQuery: any;

@Component({
  selector: 'app-employees-accessories',
  templateUrl: './employees-accessories.component.html',
  styleUrls: ['./employees-accessories.component.sass'],
  providers: [DatePipe]
})
export class EmployeesAccessoriesComponent implements OnInit {

  commonSearchPanelData: any;
  public isShownList: boolean; // Grid List
  public isShownEdit: boolean; // Form Edit
  public columnDefs = [];
  public multiSortKey: string;
  public SingledropdownSettings = {};
  //public loadingTemplate;
  //public loadingTemplate1;
  frameworkComponents: any;
  tooltipShowDelay: any;
  IsEditDisabled: boolean;

  apiCSVIData: any = {};

  CompanyId: any;
  WareHouseId: string;
  //CompanyData = [];
  //SiteStateList = [];
  //SearchVendorList = [];

  SearchStateList = [];
  SearchItemNameList = [];
  WHStateList = [];

  //VendorStateList = [];
  //ClientList: any;
  UserId: any;
  StateCodeWhAd = [];
  model: any = {};
  EditWHList = [];
  UserName: any;
  minDate: { year: number; month: number; day: number; };
  MaxDate: { year: number; month: number; day: number; };
  min: { year: number; month: number; day: number; };
  DateFormate: any;
  ItemAddrowhideshow: boolean;
  dynamicArray: Array<DynamicItemGrid> = [];
  IsItemListDisabled: boolean = false;
  EquipmentTypeList: any;
  ValidationerrorMessage: string;
  indexv: any;
  //BBChangeValue: string;
  //headerItemName: string;
  //srnlst: Array<GSerialNumber> = [];
  //strcount: any;
  //celllst: Array<CellNo> = [];
  //firstValue: any;
  //lastValue: any;
  @ViewChild('inputFile') myInputVariable: ElementRef;
  //@ViewChild('inputExcelOther', { static: false })
  //inputExcelOther: ElementRef;
  //@ViewChild('inputExcelBB', { static: false })
  //inputExcelBB: ElementRef;
  IsError: boolean = false;
  IsDisabledPreviewGenratebutton: boolean;
  rowData: any[] = [];
  Toolkitdata: any[] = [];
  objEmpToolkitModel: SearchEmployeeAccessoriesModel = {
    Id: 0, CompanyId: 0, UserId: 0, WHStateId: 0, WHId: 0, EmpId: 0,
    ToolkitId: 0, Startdate: "", Enddate: "", EmpCode: "", EmpName: "",
    Flag: "", ToolkitItemList: [], SWHId: "0", SWHStateId: "0"
  };

  TechDataList: any[] = [];
  UniqueItemkeyword = 'UserName';
  UniqueItemkeywordID = 'EmployeeID';
  ItemEditDataArr: any[] = [];
  public MultidropdownSettings = {};
  SelectedSearchStateList = [];
  SelectedSearchWHList = [];
  SearchWHList = [];
  State_Id: string;
  WH_Id: string;
  EmpCodeList: any[] = []; //vishal
  IsReceivedHideShow: boolean = false;
  IsHideShowCancelBtn: boolean = false;

  constructor(private _objSearchpanelService: TimePeriodService,
    private _Commonservices: CommonService,
    private _MaterialMovementService: MaterialMovementService,
    private _MasterService: MasterservicesService, private modalService: NgbModal,
    private _PurchaseOrderService: PurchaseOrderService,
    private datePipe: DatePipe, private _DispatchPdfServiceService: DispatchPdfServiceService,
    private _EmployeeAccessoriesService: EmployeeAccessoriesService,
    private _GlobalErrorHandlerService: GlobalErrorHandlerServiceService,
  ) {

    this._objSearchpanelService.SearchTimePeriodPanelSubject.subscribe(data => {
      this.commonSearchPanelData = data;
    });
    this.tooltipShowDelay = 0;
    this.frameworkComponents = {
      buttonRenderer: ButtonRendererComponent,
      fileRenderer: FileRendererComponent,
      customtooltip: CustomTooltipComponent,
      approvalTooltip: approvalTooltipComponent
    }
  }


  ngOnInit(): void {
    this.isShownList = false;
    this.isShownEdit = true;

    this.columnDefs = [
      {
        headerName: 'Edit',
        cellRenderer: 'buttonRenderer',
        cellRendererParams: {
          onClick: this.showToolkitEditDetail.bind(this),
          label: 'edit'
        }, pinned: 'left',
        width: 75,
        filter: false
      },
      { headerName: 'Document No', field: 'DocNo', width: 150 },
      { headerName: 'Date', field: 'CreatedOn', width: 110, sortable: true },
      { headerName: 'State Name', field: 'StateName', width: 100, resizable: true },
      { headerName: 'WH Name', field: 'WHName', width: 100, resizable: true },
      { headerName: 'Emoloyee Name', field: 'AgnEmpName', width: 100, resizable: true },
      { headerName: 'Employee Code', field: 'EmpCode', width: 150, resizable: true },
      { headerName: 'Tookit', field: 'ToolkitId', width: 150, resizable: true },
      { headerName: 'Item Name', field: 'ItemName', width: 100, resizable: true },
      { headerName: 'CreatedBy', field: 'CreatedBy', width: 100, resizable: true }
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

    // this.loadingTemplate =
    //   `<span class="ag-overlay-loading-center">loading...</span>`;
    // this.loadingTemplate1 =
    //   `<span class="ag-overlay-loading-center">loading...</span>`;

    var objUserModel = JSON.parse(sessionStorage.getItem("UserSession"));
    this.UserId = objUserModel.User_Id;
    this.UserName = objUserModel.User_Id;
     this.objEmpToolkitModel.UserId=this.UserId;

    var objCompanyModel = new CompanyModel();
    objCompanyModel = JSON.parse(sessionStorage.getItem("CompanyIdSession"));
    this.CompanyId = objCompanyModel.Company_Id;
    this.objEmpToolkitModel.CompanyId=this.CompanyId;
    this.bindCompanyStateVendorItem();


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

  }
  gridOptions = {
    animateRows: false,
    enableCellChangeFlash: false,
  };

  //by:vishal, 03/11/2022, desc: for create new 
  createNew() {
    this.isShownList = true;
    this.isShownEdit = false;
    this.IsEditDisabled = false;
    this.IsHideShowCancelBtn = false;
    this.objEmpToolkitModel.Id = 0;
    this.clearEditForm();
    var toDate = "";
    toDate = this.datePipe.transform(Date(), "yyyy/MM/dd");
    this.model.DocumentDate = { day: parseInt(toDate.split('/')[2]), month: parseInt(toDate.split('/')[1]), year: parseInt(toDate.split('/')[0]) };
    //this.clearEditForm();
    const current1 = new Date();
    this.ItemAddrowhideshow = true;
    this.IsItemListDisabled = false;
    this.IsDisabledPreviewGenratebutton = true;
    this.IsReceivedHideShow = false;
  }
  //#endregion

  backPage() {
    this.isShownList = false;
    this.isShownEdit = true;
  }
  //by:vishal, 03/11/2022, 

  async bindCompanyStateVendorItem() {
    var objCSVTdata = new CompanyStateVendorItemModel();
    objCSVTdata.Company_Id = parseInt(this.CompanyId);
    this.apiCSVIData = await this._Commonservices.getCompanyStateVendorItem(objCSVTdata);
    if (this.apiCSVIData.Status == 1) {
      objCSVTdata.StateArray = this.apiCSVIData.StateArray;
      objCSVTdata.ItemArray = this.apiCSVIData.ItemArray;
      objCSVTdata.EquipmentArray = this.apiCSVIData.EquipmentArray;
      this.WareHouseId = this.apiCSVIData.WHId;
      this.SearchStateList = objCSVTdata.StateArray;
      this.SearchItemNameList = objCSVTdata.ItemArray;
      this.EquipmentTypeList = objCSVTdata.EquipmentArray
    }
  }

  clearEditForm() {
    this.clearedAutoEmpName("all");
    //#region WH Details 
    this.model.ddlStateId = '0';
    this.model.StateCode = "";
    this.model.RegdOffice = "";
    this.StateCodeWhAd = [];
    this.model.GSTINNo = "";
    this.model.CIN = "";
    //#endregion

    //#region Ship From 
    this.model.WHState = "";
    this.EditWHList = [];
    this.model.ShippedfromWHId = "0";
    this.model.ShippedWHAddress = "";
    this.model.ToolkitId = '0';
    //#endregion

    //#region Assign To 
    this.model.DocumentNo = "";
    this.model.EmpAddress = "";
    //#endregion
    this.dynamicArray = [];
  }

  //by:vishal, 03/11/2022, desc: for bind satecode

  async bindStateCodeWHAdd(StateId: any) {
    $("#txtddlStateId").css('border-color', '');
    try {
      this.EditWHList = [];
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

      await this._EmployeeAccessoriesService.GetWHAddressAndWHListByStId(objdropdownmodel).then(
        async (data) => {
          this.StateCodeWhAd = data.Data;
          if (data.Status == 1 && data.Data != null && data.Data != '') {
            this.model.StateCode = this.StateCodeWhAd[0].StateCode;
            this.model.RegdOffice = this.StateCodeWhAd[0].OfficeAddress;
            this.model.GSTINNo = this.StateCodeWhAd[0].GSTIN_UIN;
            this.model.CIN = this.StateCodeWhAd[0].CIN;
            this.model.WHState = this.StateCodeWhAd[0].StateName;
            await this.bindToolkitList('List');
            await this.GetAllTechCOHbySiteId(0);
          }
          if (data.Status == 1 && data.WHData != null && data.WHData != '') {
            if (data.WHData.length == 1) {

              this.EditWHList = data.WHData;
              await this.bindShippedWhAddess(data.WHData[0].Id);
              this.model.ShippedfromWHId = data.WHData[0].Id;
            } else {

              this.EditWHList = data.WHData;
              this.model.ShippedWHAddress = "";
            }
          }
        }, error => {
          this._Commonservices.ErrorFunction(this.UserName, error.message, "bindStateCodeWHAdd", "EmployeeAccessories");
        }
      );
    } catch (Error) {
      this._Commonservices.ErrorFunction(this.UserName, Error.message, "bindStateCodeWHAdd", "EmployeeAccessories");
    }
  }

  //by:vishal, 04/11/2022, desc:for bind warehouse shiping address
  async bindShippedWhAddess(whId: any) {
    this.model.ShippedWHAddress = null;
    $("#txtShippedfromWHId").css('border-color', '');
    var ShippedWhAddess = this.EditWHList.filter(
      m => m.Id === parseInt(whId));
    this.model.ShippedWHAddress = ShippedWhAddess[0].WHAddress;
    this.model.PreviewWHName = ShippedWhAddess[0].WHName;
  }

  //#region  this are all function used for make, code,item etc change by id

  changeEditItemName(ItemNameId: any, index: any) {
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
        this._Commonservices.ErrorFunction(this.UserName, error.message, "changeEditItemName", "EmpLoyeeAccessories");
      });
    } catch (Error) {
      this._Commonservices.ErrorFunction(this.UserName, Error.message, "changeEditItemName", "EmpLoyeeAccessories");
    }
  }

  //by:vishal, 05/11/2022, desc for change itemmake

  changeEditItemMake(ItemMakeId: any, ItemNameId: any, index: any) {
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
        this._Commonservices.ErrorFunction(this.UserName, error.message, "changeEditItemMake", "WHTOSite");
      });
    } catch (Error) {
      this._Commonservices.ErrorFunction(this.UserName, Error.message, "changeEditItemMake", "WHTOSite");
    }
  }

  //by:vishal, 05/11/2022, desc: for change item code
  changeEditItemCode(ItemId: any, index: any) {
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

      }, error => {
        this._Commonservices.ErrorFunction(this.UserName, error.message, "changeEditItemCode", "EmployeeAccessories");
      });
    } catch (Error) {
      this._Commonservices.ErrorFunction(this.UserName, Error.message, "changeEditItemCode", "EmployeeAccessories");
    }

  }

  //by:vishal, 05/11/2022, desc: for equipment type
  changeEqupmnet(ItemId: any, index: any) {
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

    } catch (Error) {
      console.log(Error.message)
    }
  }

  changeEditEquipment(Id: any) {
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

  //by:vishal, 05/11/2022
  changeUnit(Id: any, index: any) {
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

  //by:vishal, 04/11/2022, desc: for clear form on create new event
  addRow() {
    var objNewItemGrid = new DynamicItemGrid();
    objNewItemGrid.Id = 0;
    objNewItemGrid.ItemNameId = "0";
    objNewItemGrid.ItemMakeId = "0";
    objNewItemGrid.ItemId = "0";
    objNewItemGrid.EqTypeId = "0";
    objNewItemGrid.ItemDescription = "";
    objNewItemGrid.UnitName = "0";
    objNewItemGrid.Qty = "";
    this.dynamicArray.push(objNewItemGrid);
    return true;
  }

  deleteRow(index) {
    if (this.dynamicArray.length == 1) {
      return false;
    } else {
      this.dynamicArray.splice(index, 1);
      return true;
    }
  }

  //by:vishal

  //#region  Create Dispatch  Pdf
  async bindToolkitList(para: string) {
    try {
      var objPara = new EmpToolkitModel();
      objPara.CompanyId = this.CompanyId;
      objPara.ToolkitName = "";
      objPara.Startdate = "";
      objPara.Enddate = "";
      objPara.Flag = para;
      await this._EmployeeAccessoriesService.GetToolkitItemList(objPara).then(data => {
        if (data.Status == 1) {
          if (para == "List") {
            if (data.Data != null) {
              this.Toolkitdata = data.Data;
            } else {
              this.Toolkitdata = [];
            }
          }
        }
      }, error => {
        this._Commonservices.ErrorFunction(this.UserName, error.message, "searchGetToolkitList", "EmployeesAccessories");
      });
    } catch (Error) {
      this._Commonservices.ErrorFunction(this.UserName, Error.message, "searchGetToolkitList", "EmployeesAccessories");
    }
  }

  bindToolkitDetailById(Id: any) {
    try {
      let objModel = new EmpToolkitModel();
      objModel.Id = Id;  
      this._MasterService.EditToolkitDetail(objModel).pipe(first()).subscribe(data => {
        if (data.Status == 1) {
          this.dynamicArray = [];
          this.ItemEditDataArr = data.ItemData;
          for (var i = 0, len = this.ItemEditDataArr.length; i < len; i++) {
            var objdynamic = new DynamicItemGrid();
            objdynamic.Id = this.ItemEditDataArr[i].Id;
            objdynamic.ItemNameId = this.ItemEditDataArr[i].ItemNameId;
            objdynamic.EditItemMake = JSON.parse(this.ItemEditDataArr[i].ItemMakeList);
            objdynamic.ItemMakeId = this.ItemEditDataArr[i].MakeMaster_Id;
            objdynamic.EditItemCode = JSON.parse(this.ItemEditDataArr[i].ItemCodeList);
            objdynamic.ItemId = this.ItemEditDataArr[i].ItemId;
            objdynamic.ItemDescription = this.ItemEditDataArr[i].ItemDescription;
            objdynamic.UnitList = JSON.parse(this.ItemEditDataArr[i].UnitList);
            objdynamic.UnitName = this.ItemEditDataArr[i].Unit_Id;
            objdynamic.Qty = this.ItemEditDataArr[i].Qty;
            this.dynamicArray.push(objdynamic);
          }
        }
      }, error => {
        this._Commonservices.ErrorFunction(this.UserName, error.message, "SearchDispatchTrackerEditListByDispatchId", "SRN");
      });
    } catch (Error) {
      this._Commonservices.ErrorFunction(this.UserName, Error.message, "SearchDispatchTrackerEditListByDispatchId", "SRN");
    }
  }

 
  async GetAllTechCOHbySiteId(SiteId: any) {
    // debugger
    try {
      this.clearedAutoEmpName("");
      var objdropdownmodel = new DropdownModel();
      objdropdownmodel.Other_Id = SiteId;
      objdropdownmodel.Company_Id = this.CompanyId;
      await this._EmployeeAccessoriesService.GetAllEmployeeNameListBySiteId(objdropdownmodel).then(Emp => {
        // debugger
        if (Emp.AllTechData != '') {
          this.TechDataList = Emp.AllTechData;
          // this.EmpCodeList1 = Emp.AllTechData;
          // console.log('this.TechDataList: ', this.TechDataList);
         
          this.EmpCodeList = this.TechDataList.filter((itm)=> {
            return itm.EmployeeID !== null;
          })
          // console.log('this.EmpCodeList1: ', this.EmpCodeList);
      }
        
      })
    } catch (Error) {
      this._Commonservices.ErrorFunction(this.UserName, Error.message, "GetAllTechCOHbySiteId", "WHTOSite");
    }
  }

  clearedAutoEmpName(para: string) {
    if (para == "all") {
      this.model.AutoEmpName="";
      ///this.SelectedSearchEmpNameList = [];
    }
    this.model.EmpId = '0';
    this.model.EmpCode = "";
    this.model.Designation = "";
    this.model.MobileNo = "";
    this.model.EmpAddress = "";
  }

  onSelectEmpName(items: any) {
    // debugger
    
    this.model.AutoEmpName=items.UserName;
    //this.SelectedSearchEmpNameList = items;
    //console.log(JSON.stringify(this.SelectedSearchEmpNameList));

    this.model.EmpId = items.Id;
    this.model.EmpCode = items.EmployeeID;
    this.model.Designation = items.Designation;
    this.model.MobileNo = items.Mobile;
  }

  //by: vishal, 26/12/2022, 
  onSelectEmpID(items: any) {
    // console.log('onSelectEmpID: ',items);
    this.model.EmpCode = items.EmployeeID;
    this.model.AutoEmpName = items.UserName;
    this.model.EmpId = items.Id;
    this.model.EmpCode = items.EmployeeID;
    this.model.Designation = items.Designation;
    this.model.MobileNo = items.Mobile;
    
  }
//end-vishal

  onChangeEmpName(para: string) {
    this.clearedAutoEmpName("");
  }

  conformPopup() {
    jQuery('#confirm').modal('show');
    this.SaveUpDateEmployeeAccessories()
    //this.IsError = false;
    // if (this.Validation() == 1) {
    //   return false;
    // } else if (this.dynamicArray.length < 1) {
    //   alert('please fill atleast one item');
    //   return false;
    // }
    // else {
    //   jQuery('#confirm').modal('show');
    // }
  }

  SaveUpDateEmployeeAccessories() {
    jQuery('#confirm').modal('hide');
    try {
      let objToolkitAccessModel = new SearchEmployeeAccessoriesModel();
      objToolkitAccessModel.Id = this.objEmpToolkitModel.Id;
      objToolkitAccessModel.CompanyId = this.CompanyId;
      objToolkitAccessModel.UserId = this.UserId;
      objToolkitAccessModel.WHStateId = this.model.ddlStateId;
      objToolkitAccessModel.WHId = this.model.ShippedfromWHId;
      objToolkitAccessModel.EmpId = this.model.EmpId;
      objToolkitAccessModel.ToolkitId = this.model.ToolkitId;
      let ToolkitItemList = [];
      for (let i = 0, len = this.dynamicArray.length; i < len; i++) {
        let objToolkitItemList = new ToolkitAccessoriesItemDet();
        objToolkitItemList.Id = this.dynamicArray[i].Id;
        objToolkitItemList.ItemCodeId = parseInt(this.dynamicArray[i].ItemId);
        objToolkitItemList.EqpTypeId = parseInt(this.dynamicArray[i].EqTypeId);
        objToolkitItemList.Unit_Id = parseInt(this.dynamicArray[i].UnitName);
        objToolkitItemList.Qty = this.dynamicArray[i].Qty;
        ToolkitItemList.push(objToolkitItemList)
      }

      objToolkitAccessModel.ToolkitItemList = ToolkitItemList;
      // console.log(JSON.stringify(objToolkitAccessModel))

      this._EmployeeAccessoriesService.SaveToolKitAccessories(objToolkitAccessModel).subscribe(data => {
        alert(data.Remarks);
        this.createNew();
      });
    } catch (Error) {
      let objWebErrorLogModel = new WebErrorLogModel();
      objWebErrorLogModel.ErrorBy = this.UserId;
      objWebErrorLogModel.ErrorMsg = Error.message;
      objWebErrorLogModel.ErrorFunction = "SaveUpDateEmployeeAccessories";
      objWebErrorLogModel.ErrorPage = "EmployeesAccessories";
      this._GlobalErrorHandlerService.handleError(objWebErrorLogModel);
      console.log(Error.message)
    }
  }

  searchEmpAccessoriesList(para: string) {
    try {
      if (this.model.EmpCode != "") {
        this.objEmpToolkitModel.EmpCode = this.model.EmpCode
      } else {
        this.objEmpToolkitModel.EmpCode = "";
      }
      if (this.model.EmpName != "") {
        this.objEmpToolkitModel.EmpName = this.model.EmpName
      } else {
        this.objEmpToolkitModel.EmpName = "";
      }
      if (this.objEmpToolkitModel.SWHId == "0") {
        this.objEmpToolkitModel.SWHId == this.WareHouseId;
      }
      this.objEmpToolkitModel.Startdate = this.commonSearchPanelData.Startdate;
      this.objEmpToolkitModel.Enddate = this.commonSearchPanelData.Enddate;
      this.objEmpToolkitModel.Flag = para;

      this._EmployeeAccessoriesService.SearchEmployeeAccessoriesList(this.objEmpToolkitModel).subscribe(data => {

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
              this._PurchaseOrderService.exportAsExcelFile(data.Data, 'EmployeeAccessoriesList' + CurrentDate);
            } else {
              alert('Please first Search Data');
            }
          }
        }
      })
    } catch (Error) {
      this._Commonservices.ErrorFunction(this.UserName, Error.message, "SearchEmployeeAccessoriesList", "EmployeesAccessories");
    }
  }

  showToolkitEditDetail(e) {
    this.isShownList = true;
    this.isShownEdit = false; 
    this.IsReceivedHideShow = true;
    this.callToolkitDetailById(e.rowData.Id);
  }

  callToolkitDetailById(Id: any) {
    try {
      this.createNew();
      this.IsReceivedHideShow = true;
      this.IsEditDisabled = true;
      this.IsHideShowCancelBtn = true;
      let objModel = new SearchEmployeeAccessoriesModel();
      objModel.Id = Id;
      this.objEmpToolkitModel.Id = Id;
      this._EmployeeAccessoriesService.GetEditToolKitAccessories(objModel).pipe(first()).subscribe(data => {
        if (data.Status == 1) {


          this.model.ddlStateId = data.Data[0].WHStateId;
          var promise = new Promise(async (resolve, reject) => {
            await this.bindStateCodeWHAdd(this.model.ddlStateId)
            resolve("done");
          });

          promise.then(async () => {
            this.model.ShippedfromWHId = data.Data[0].WHId;
            await this.bindShippedWhAddess(this.model.ShippedfromWHId);
            let EmpId = data.Data[0].EmpId;
            let resultEmp:any[] = this.TechDataList.filter(xx => {
              return xx.Id === parseInt(EmpId)
            });
            this.onSelectEmpName(resultEmp[0]);
            
            this.model.ToolkitId = data.Data[0].ToolkitId;
            this.model.DocNo=data.Data[0].DocNo;
            this.dynamicArray = [];
            this.ItemEditDataArr = data.ItemData;
            for (var i = 0, len = this.ItemEditDataArr.length; i < len; i++) {
              var objdynamic = new DynamicItemGrid();
              objdynamic.Id = this.ItemEditDataArr[i].Id;
              objdynamic.ItemNameId = this.ItemEditDataArr[i].ItemNameId;
              objdynamic.EditItemMake = JSON.parse(this.ItemEditDataArr[i].ItemMakeList);
              objdynamic.ItemMakeId = this.ItemEditDataArr[i].MakeMaster_Id;
              objdynamic.EditItemCode = JSON.parse(this.ItemEditDataArr[i].ItemCodeList);
              objdynamic.ItemId = this.ItemEditDataArr[i].ItemId;
              objdynamic.ItemDescription = this.ItemEditDataArr[i].ItemDescription;
              objdynamic.EqTypeId = this.ItemEditDataArr[i].EqpTypeId;
              objdynamic.UnitList = JSON.parse(this.ItemEditDataArr[i].UnitList);
              objdynamic.UnitName = this.ItemEditDataArr[i].Unit_Id;
              objdynamic.Qty = this.ItemEditDataArr[i].Qty;
              this.dynamicArray.push(objdynamic);
            }
          });
        }
      }, error => {
        this._Commonservices.ErrorFunction(this.UserName, error.message, "SearchDispatchTrackerEditListByDispatchId", "SRN");
      });
    } catch (Error) {
      this._Commonservices.ErrorFunction(this.UserName, Error.message, "SearchDispatchTrackerEditListByDispatchId", "SRN");
    }
  }

  generateEmpAccessoriesPdf() {
    try {
      let objModel = new SearchEmployeeAccessoriesModel();
      objModel.Id = this.objEmpToolkitModel.Id;
      this._EmployeeAccessoriesService.GetEditToolKitAccessories(objModel)
        .pipe(first()).subscribe(
          data => {
            if (data.Status == 1) {
              this._EmployeeAccessoriesService.generateEmpAccessoriesPdf(data,'open');
            }
          });
    } catch (Error) {
      this._Commonservices.ErrorFunction(this.UserName, Error.message, "DispatchPdfbyDispatchId", "EmployeeAccessories");
    }
  }

  BindSearchWHList(para: string) {
    this.objEmpToolkitModel.SWHStateId = "0";
    this.objEmpToolkitModel.SWHId = "0";
    this.SelectedSearchWHList = [];
    this.SearchWHList = [];
    if (para == "DelAll") {
      this.SelectedSearchStateList = [];
    } else if (this.SelectedSearchStateList.length > 0) {
      //console.log(this.SelectedSearchStateList);
      this.objEmpToolkitModel.SWHStateId = this.SelectedSearchStateList.map(xx => xx.id).join(',');
      var objdropdownmodel = new DropdownModel();
      objdropdownmodel.User_Id = 0;
      objdropdownmodel.Other_Id = this.objEmpToolkitModel.SWHStateId;
      objdropdownmodel.Parent_Id = this.CompanyId;
      objdropdownmodel.Flag = 'WHMaster';
      this._Commonservices.getdropdown(objdropdownmodel).subscribe(wh => {
        this.SearchWHList = wh.Data;
      });
    }
  }

  onClickWH(para: string) {
    // this.objCommonSearchPanelModel.WHId = '';
    this.objEmpToolkitModel.SWHId = "0";
    if (para == "DelAll") {
      this.SelectedSearchWHList = [];
    } else if (this.SelectedSearchWHList.length > 0) {
      this.objEmpToolkitModel.SWHId = this.SelectedSearchWHList.map(xx => xx.id).join(',');
    }
  }
}
