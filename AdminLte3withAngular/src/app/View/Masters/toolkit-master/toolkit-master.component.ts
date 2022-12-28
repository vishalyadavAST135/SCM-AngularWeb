import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';
import { approvalTooltipComponent } from 'src/app/renderer/Approvaltooltip.component';
import { ButtonRendererComponent } from 'src/app/renderer/button-renderer.component';
import { CustomTooltipComponent } from 'src/app/renderer/customtooltip.component';
import { FileRendererComponent } from 'src/app/renderer/file-renderer.component';
import { CommonService } from 'src/app/Service/common.service';
import { GlobalErrorHandlerServiceService } from 'src/app/Service/global-error-handler-service.service';
import { MasterservicesService } from 'src/app/Service/masterservices.service';
import { PurchaseOrderService } from 'src/app/Service/purchase-order.service';
import { SearchpanelService } from 'src/app/Service/searchpanel.service';
import { TimePeriodService } from 'src/app/Service/time-period.service';
import { CommonStaticClass, CompanyStateVendorItemModel, DropdownModel, WebErrorLogModel } from 'src/app/_Model/commonModel';
import { EmpToolkitItemModel, EmpToolkitModel } from 'src/app/_Model/MastersModel';
import { DynamicItemGrid, VendorOrWhModel } from 'src/app/_Model/purchaseOrderModel';
import { CompanyModel } from 'src/app/_Model/userModel';
declare var jQuery: any;

@Component({
  selector: 'app-toolkit-master',
  templateUrl: './toolkit-master.component.html',
  styleUrls: ['./toolkit-master.component.sass'],
  providers: [DatePipe]
})

export class ToolkitMasterComponent implements OnInit {

  public isShownList: boolean; // Grid List
  public isShownEdit: boolean; // Form Edit
  public isEditable: boolean;
  IsEditDisabled: boolean;
  model: any = {};
  ItemAddrowhideshow: boolean;
  IsItemListDisabled: boolean = false;
  public loadingTemplate;
  public loadingTemplate1;
  public multiSortKey: string;
  public SingledropdownSettings = {};
  frameworkComponents: any;
  tooltipShowDelay: any;
  public columnDefs = [];
  dynamicArray: Array<DynamicItemGrid> = [];
  SearchItemNameList = [];
  CompanyId: any;
  apiCSVIData: any = {};
  WareHouseId: string;
  CompanyData = [];
  SearchVendorList = [];
  SearchStateList = [];
  UserName: any;
  UserId: any;
  objEmpToolkitModel: EmpToolkitModel = { CompanyId: 0, 
    Id: 0, UserId: 0, ToolkitName: "", ToolkitItemList: [], 
    Startdate: "", Enddate: "", Flag: 0 };
  CommonSearchPanelData: any;
  loading: boolean = false;
  gridApi: any;
  public rowData = [];   //  grid data
  ItemEditDataArr: any = [];
  IsSaveDisabled: boolean;
  Save: any;
  submitted: boolean = false;

  constructor(
    private _Commonservices: CommonService, private _MasterService: MasterservicesService,
    private _GlobalErrorHandlerService: GlobalErrorHandlerServiceService,
    private _PurchaseOrderService: PurchaseOrderService,
    private _objSearchpanelService: TimePeriodService, private datePipe: DatePipe,
  ) {
    this.tooltipShowDelay = 0;
    this.frameworkComponents = {
      buttonRenderer: ButtonRendererComponent,
      fileRenderer: FileRendererComponent,
      customtooltip: CustomTooltipComponent,
      approvalTooltip: approvalTooltipComponent,
    }
    this._objSearchpanelService.SearchTimePeriodPanelSubject.subscribe(data => {
      this.CommonSearchPanelData = data;

    });
  }

  ngOnInit(): void {

    this.isShownList = false;
    this.isShownEdit = true;
    this.columnDefs = [
      {
        headerName: 'Edit',
        cellRenderer: 'buttonRenderer',
        cellRendererParams: {
          onClick: this.editToolkitList.bind(this),
          label: 'edit'
        }, pinned: 'left',
        width: 75,
        filter: false
      },

      { headerName: 'Toolkit Name', field: 'ToolKitName', width: 250 },
      { headerName: 'Item Name', field: 'ItemName', width: 250, sortable: true },
      { headerName: 'Created On', field: 'CreatedOn', width: 180, resizable: true },
      { headerName: 'Created By', field: 'CreatedBy', width: 180, resizable: true },

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
    let objUserModel = JSON.parse(sessionStorage.getItem("UserSession"));
    this.UserId = objUserModel.User_Id;
    this.UserName = objUserModel.User_Id;

    let objCompanyModel = new CompanyModel();
    objCompanyModel = JSON.parse(sessionStorage.getItem("CompanyIdSession"));
    this.CompanyId = objCompanyModel.Company_Id;

    this.bindCompanyStateVendorItem();
  }
  gridOptions = {
    animateRows: false,
    enableCellChangeFlash: false,
  };
  //by:vishal, 11/11/2022, desc: for create new 
  createNew() {
    this.isShownList = true;
    this.isShownEdit = false;
    this.IsEditDisabled = false;
    this.IsSaveDisabled = false;
    this.clearEditForm();
    this.ItemAddrowhideshow = true;
    this.IsItemListDisabled = false;
    this.submitted = false;
    this.IsSaveDisabled = false;
    this.isEditable = false;

  }
  backPage() {
    this.isShownList = false;
    this.isShownEdit = true;

  }
  //#endregion
  //by:vishal, 11/11/2022, desc: for clear form on create new event
  clearEditForm() {
    this.objEmpToolkitModel.Id = 0;
    this.objEmpToolkitModel.ToolkitName = '';
    this.dynamicArray = [];

  }
  //by:vishal, 11/11/2022, desc: for add item row

  addRow() {
    let objNewItemGrid = new DynamicItemGrid();
    objNewItemGrid.Id = 0;
    objNewItemGrid.ItemNameId = "0";
    objNewItemGrid.ItemMakeId = "0";
    objNewItemGrid.ItemId = "0";
    objNewItemGrid.Qty = "";
    objNewItemGrid.ItemDescription = "";
    objNewItemGrid.UnitName = "0";
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
  onGridReady(params) {
    this.gridApi = params.api;
  }

  //by:vishal, 11/11/2022, 

  async bindCompanyStateVendorItem() {
    let objCSVTdata = new CompanyStateVendorItemModel();
    objCSVTdata.Company_Id = parseInt(this.CompanyId);
    this.apiCSVIData = await this._Commonservices.getCompanyStateVendorItem(objCSVTdata);
    if (this.apiCSVIData.Status == 1) {
      objCSVTdata.CompanyArray = this.apiCSVIData.CompanyArray;
      objCSVTdata.StateArray = this.apiCSVIData.StateArray;
      objCSVTdata.ItemArray = this.apiCSVIData.ItemArray;
      objCSVTdata.EquipmentArray = this.apiCSVIData.EquipmentArray;
      this.WareHouseId = this.apiCSVIData.WHId;
      this.CompanyData = objCSVTdata.CompanyArray;
      this.SearchStateList = objCSVTdata.StateArray;
      // this.SiteStateList = objCSVTdata.StateArray;
      this.SearchItemNameList = objCSVTdata.ItemArray;

    }
  }

  changeEditItemName(ItemNameId: any, index: any) {
    try {
      $('#tblOne > tbody  > tr').each(function () {
        let valueItem = $(this).find('.ItemName').val();
        if (valueItem != '0') {
          $(this).find('.ItemName').css('border-color', '');
        }
      });
      let FilterData = this.SearchItemNameList.filter(
        m => m.id === parseInt(ItemNameId));
      this.dynamicArray[index].ItemName = FilterData[0].itemName;
      this.dynamicArray[index].EditItemMake = [];
      this.dynamicArray[index].EditItemCode = [];
      let objdropdownmodel = new DropdownModel();
      objdropdownmodel.User_Id = 0;
      objdropdownmodel.Parent_Id = ItemNameId;
      objdropdownmodel.Company_Id = this.CompanyId;
      objdropdownmodel.Other_Id = "0";
      objdropdownmodel.Flag = 'ItemMake';
      this._Commonservices.getdropdown(objdropdownmodel).pipe(first()).subscribe(item => {
        this.dynamicArray[index].EditItemMake = item.Data
        this.dynamicArray[index].ItemMakeId = "0"
      }, error => {
        this._Commonservices.ErrorFunction(this.UserName, error.message, "changeEditItemName", "ToolkitMaster");
      });
    } catch (Error) {
      this._Commonservices.ErrorFunction(this.UserName, Error.message, "changeEditItemName", "ToolkitMaster");
    }
  }

  //by:vishal, 11/11/2022, desc for change itemmake

  changeEditItemMake(ItemMakeId: any, ItemNameId: any, index: any) {
    try {
      $('#tblOne > tbody  > tr').each(function () {
        let valueItem = $(this).find('.ItemMake').val();
        if (valueItem != '0') {
          $(this).find('.ItemMake').css('border-color', '');
        }
      });

      let FilterData = this.dynamicArray[index].EditItemMake.filter(
        m => m.id === parseInt(ItemMakeId));
      this.dynamicArray[index].MakeName = FilterData[0].itemName;
      let objdropdownmodel = new DropdownModel();
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
        this._Commonservices.ErrorFunction(this.UserName, error.message, "changeEditItemMake", "ToolkitMaster");
      });
    } catch (Error) {
      this._Commonservices.ErrorFunction(this.UserName, Error.message, "changeEditItemMake", "ToolkitMaster");
    }
  }

  //by:vishal, 11/11/2022, desc: for change item code
  changeEditItemCode(ItemId: any, index: any) {
    try {

      $('#tblOne > tbody  > tr').each(function () {
        let valueItem = $(this).find('.ItemCode').val();
        if (valueItem != '0') {
          $(this).find('.ItemCode').css('border-color', '');
        }
      });

      let FilterData = this.dynamicArray[index].EditItemCode.filter(
        m => m.id === parseInt(ItemId));
      this.dynamicArray[index].ItemCode = FilterData[0].itemName;
      let objVendormodel = new VendorOrWhModel();
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
        this._Commonservices.ErrorFunction(this.UserName, error.message, "changeEditItemCode", "ToolkitMaster");
      });
    } catch (Error) {
      this._Commonservices.ErrorFunction(this.UserName, Error.message, "changeEditItemCode", "ToolkitMaster");
    }

  }

  //by:vishal, 14/11/2022
  changeUnit(Id: any, index: any) {
    $('#tblOne > tbody  > tr').each(function () {
      let valueItem = $(this).find('.UnitName').val();
      if (valueItem != "0") {
        $(this).find('.UnitName').css('border-color', '');
      }
    });
    let FilterData = this.dynamicArray[index].UnitList.filter(
      m => m.Id === parseInt(Id));
    this.dynamicArray[index].Unit = FilterData[0].UnitName;
  }


  //by:vishal, 14/11/2022, desc: save Toolkit Name and Item details
  addUpdateToolkitDetial() {
    try {
      let objToolkitNameModel = new EmpToolkitModel();
      objToolkitNameModel.Id = this.objEmpToolkitModel.Id;
      objToolkitNameModel.CompanyId = this.CompanyId;
      objToolkitNameModel.UserId = this.UserId;
      objToolkitNameModel.ToolkitName = this.objEmpToolkitModel.ToolkitName;
      
      let ToolkitItemList = [];
      for (let i = 0, len = this.dynamicArray.length; i < len; i++) {
        let objToolkitItemList = new EmpToolkitItemModel();
        objToolkitItemList.Id = this.dynamicArray[i].Id;
        objToolkitItemList.ItemCodeId = parseInt(this.dynamicArray[i].ItemId);
        objToolkitItemList.Unit_Id = parseInt(this.dynamicArray[i].UnitName);
        objToolkitItemList.Qty = this.dynamicArray[i].Qty;
        ToolkitItemList.push(objToolkitItemList)
      }
      objToolkitNameModel.ToolkitItemList = ToolkitItemList;
      
      this._MasterService.SaveEmployeeToolKit(objToolkitNameModel).subscribe(data => {
        if (data.Status == 1) {
          jQuery('#confirm').modal('hide');
          alert(data.Remarks);
          this.createNew();
        }
      });
    } catch (Error) {
      let objWebErrorLogModel = new WebErrorLogModel();
      objWebErrorLogModel.ErrorBy = this.UserId;
      objWebErrorLogModel.ErrorMsg = Error.message;
      objWebErrorLogModel.ErrorFunction = "addUpdateToolkitDetial";
      objWebErrorLogModel.ErrorPage = "ToolkitMaster";
      this._GlobalErrorHandlerService.handleError(objWebErrorLogModel);
      console.log(Error.message)
    }
  }

  //by:vishal, 15/11/2022, desc: for search 
  searchGetToolkitList(para: string) {
    try {
      var objPara = new EmpToolkitModel();
      objPara.CompanyId = this.CompanyId;
      objPara.ToolkitName = this.model.ToolkitName;
      objPara.Startdate = this.CommonSearchPanelData.Startdate;
      objPara.Enddate = this.CommonSearchPanelData.Enddate;
      objPara.Flag = para;
      if (para == "Export") {
        this.loading = true;
      }
      this._MasterService.GetToolkitItemList(objPara).pipe(first()).subscribe(data => {
        // this.gridApi.hideOverlay();
        // this.loading = false;
        if (data.Status == 1) {
          if (para == "Search") {
            if (data.Data != null) {
              this.rowData = data.Data;
            } else {
              this.rowData = null;
            }
          } else if (para == "Export") {
            if (data.Data != null) {
              this.loading = false;
              var CurrentDate = this.datePipe.transform(Date(), "dd/MM/yyyy");
              this._PurchaseOrderService.exportAsExcelFile(data.Data, 'CustomerToCustomerList' + CurrentDate);
            } else {
              alert('Please first Search Data');
            }
          }
        }
      }, error => {
        this._Commonservices.ErrorFunction(this.UserName, error.message, "searchGetToolkitList", "ToolkitMaster");
      });
    } catch (Error) {
      this._Commonservices.ErrorFunction(this.UserName, Error.message, "searchGetToolkitList", "ToolkitMaster");
    }
  }

  editToolkitList(e) {
    this.isShownList = true;
    this.isShownEdit = false;
    this.isEditable = true;

    this.editToolkitDetailById(e.rowData.Id);
  }

  editToolkitDetailById(Id: any) {
    try {

      let objModel = new EmpToolkitModel();
      objModel.Id = Id;
      this.objEmpToolkitModel.Id = Id;
      this._MasterService.EditToolkitDetail(objModel).pipe(first()).subscribe(data => {
        if (data.Status == 1) {
          this.objEmpToolkitModel.ToolkitName = data.Data[0].ToolKitName;
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

  conformPopup() {
    //this.IsError = false;
    if (this.Validation() == 1) {
      return false;
    } else if (this.dynamicArray.length < 1) {
      alert('please fill atleast one item');
      return false;
    }
    else {
      jQuery('#confirm').modal('show');
    }
  }

  Validation() {
    let flag = 0;

    if ($('#toolKitName_').val() == "" || $('#toolKitName_').val() == '0') {
      $('#toolKitName_').css('border-color', 'red');
      $('#toolKitName_').focus();
      flag = 1;
    } else {
      $("#toolKitName_").css('border-color', '');
    }

    for (var icount = 0, len = this.dynamicArray.length; icount < len; icount++) {
      if (this.dynamicArray[icount].ItemNameId == "" || this.dynamicArray[icount].ItemNameId == "null" || this.dynamicArray[icount].ItemNameId == "0") {
        $('#ddlItemNameId_' + icount).css('border-color', 'red');
        $('#ddlItemNameId_' + icount).focus();
        flag = 1;

      }
      else {
        $("#ddlItemNameId_" + icount).css('border-color', '');
      }

      if (this.dynamicArray[icount].ItemMakeId == "" || this.dynamicArray[icount].ItemMakeId == "null" || this.dynamicArray[icount].ItemMakeId == "0") {
        $('#ddlItemMake_' + icount).css('border-color', 'red');
        $('#ddlItemMake_' + icount).focus();
        flag = 1;

      }
      else {
        $("#ddlItemMake_" + icount).css('border-color', '');
      }

      if (this.dynamicArray[icount].ItemId == "" || this.dynamicArray[icount].ItemId == "null" || this.dynamicArray[icount].ItemId == "0") {
        $('#ddlItemId_' + icount).css('border-color', 'red');
        $('#ddlItemId_' + icount).focus();
        flag = 1;
      }
      else {
        $("#ddlItemId_" + icount).css('border-color', '');
      }


      if (this.dynamicArray[icount].Qty == "" || this.dynamicArray[icount].Qty == "0") {
        $('#txtQty_' + icount).css('border-color', 'red');
        $('#txtQty_' + icount).focus();
        flag = 1;

      }
      else {
        $("#txtQty_" + icount).css('border-color', '');
      }

      if (this.dynamicArray[icount].UnitName == "" || this.dynamicArray[icount].UnitName == "null" || this.dynamicArray[icount].UnitName == "0") {
        $('#ddlUnitName_' + icount).css('border-color', 'red');
        $('#ddlUnitName_' + icount).focus();
        flag = 1;

      }
      else {
        $("#ddlUnitName_" + icount).css('border-color', '');
      }


    }

    return flag;
  }
}
